'use strict';

document.addEventListener('DOMContentLoaded',()=>{
  const root=document.querySelector('#runner');
  const query=new URLSearchParams(location.search);
  if(!query.has('task')){
    location.replace(`facilitator.html${query.get('participant')?`?participant=${encodeURIComponent(query.get('participant'))}`:''}`);
    return;
  }
  const taskId=(query.get('task')||'t1').toLowerCase();
  const condition=query.get('condition')||'after-prototype';
  const participant=query.get('participant')||window.UTStore.getParticipant();
  const task=window.UT_TASKS?.[taskId];
  const isBefore=condition==='before-live';
  const config=task?.conditions?.[isBefore?'before':'after'];
  let timerId=0;
  let iframe=null;
  let trackedDocument=null;
  let scrollElement=null;
  let scrollTimer=0;
  let scrollStart=0;
  let scrollLast=0;
  let scrollMax=0;
  let ignoreScrollUntil=0;
  let lastRouteSignature='';
  let lastRouteAt=0;

  if(!task||!config||!participant){
    root.innerHTML=`<section class="runner-shell"><div class="error-card"><h1>과업을 열 수 없어요</h1><p>세션 홈에서 참여자를 선택한 뒤 다시 시작해 주세요.</p><a class="tiny-link" href="facilitator.html">세션 홈으로 돌아가기</a></div></section>`;
    return;
  }

  window.UTStore.setParticipant(participant);
  const existing=window.UTStore.getRun(participant,taskId,condition);

  function escapeText(value=''){
    return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  }

  function formatPrompt(){
    const prompt=escapeText(task.prompt);
    const highlight=escapeText(task.highlight||'');
    return highlight
      ? prompt.replace(highlight,`<mark class="task-highlight">${highlight}</mark>`)
      : prompt;
  }

  function formatClock(ms){
    const total=Math.max(0,Math.floor(ms/1000));
    return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;
  }

  function currentRun(){ return window.UTStore.getRun(participant,taskId,condition); }

  function beginTimer(){
    clearInterval(timerId);
    const update=()=>{
      const node=document.querySelector('[data-elapsed]');
      const run=currentRun();
      if(node&&run)node.textContent=formatClock((run.endedAt||Date.now())-run.startedAt);
    };
    update();
    timerId=setInterval(update,500);
  }

  function renderIntro(){
    clearInterval(timerId);
    root.innerHTML=`<section class="runner-shell">
      <header class="runner-top"><b>${escapeText(task.id)} · ${escapeText(task.title)}</b><span>${escapeText(participant)}</span></header>
      <div class="task-intro">
        <p class="task-kicker">${isBefore?'기존 지그재그':'개선안'}</p>
        <h1>과업을 읽고 준비가 되면 시작해 주세요.</h1>
        <p class="task-copy">${formatPrompt()}</p>
        <div class="task-end"><b>종료 시점</b>${escapeText(task.end)}</div>
      </div>
      <div class="intro-actions">
        <button class="primary" type="button" data-start>과업 시작</button>
        <a class="tiny-link" href="facilitator.html">세션 홈으로 돌아가기</a>
      </div>
    </section>`;
    root.querySelector('[data-start]').addEventListener('click',startRun,{once:true});
  }

  function startRun(){
    window.UTStore.startRun({
      participant,task:taskId,condition,
      measurementMethod:isBefore?'native-app-observed':'web-prototype-auto'
    });
    if(isBefore)renderBeforeActive(); else renderPrototype();
  }

  function renderBeforeActive(){
    root.innerHTML=`<section class="runner-shell is-active">
      <header class="runner-top"><b>${escapeText(task.id)} · 기존 지그재그</b><span>${escapeText(participant)}</span></header>
      <div class="active-card">
        <div class="running-dot" aria-hidden="true"></div>
        <h1>과업 진행 중</h1>
        <div class="elapsed" data-elapsed>00:00</div>
        <p>지그재그 앱으로 전환해 과업을 수행해 주세요.</p>
        <div class="active-reminder">${formatPrompt()}<br><br><b>종료:</b> ${escapeText(task.end)}</div>
        <div class="active-actions">
          <button class="primary" type="button" data-finish="done">과업 완료</button>
          <button class="secondary" type="button" data-finish="stopped">과업 중단</button>
        </div>
      </div>
      <p class="notice">앱 안의 탭과 스크롤은 자동 수집되지 않습니다. 진행자가 결과 화면에 관찰값을 입력합니다.</p>
    </section>`;
    beginTimer();
    root.querySelectorAll('[data-finish]').forEach(button=>button.addEventListener('click',()=>{
      clearInterval(timerId);
      window.UTStore.finishRun(participant,taskId,condition,{outcome:button.dataset.finish==='done'?'':'interrupted'});
      renderResult();
    }));
  }

  function renderPrototype(){
    root.innerHTML=`<section class="prototype-stage">
      <span class="prototype-rec">기록 중</span>
      <iframe title="${escapeText(task.id)} 개선안 프로토타입" allow="clipboard-write"></iframe>
    </section>`;
    iframe=root.querySelector('iframe');
    const prototypeQuery=new URLSearchParams({ut:'1',task:taskId,condition,participant,build:'20'});
    const conditionKey=condition==='before-live'?'before':'after';
    const start=task.conditions?.[conditionKey]?.start||'wishlist';
    const startHash={home:'C1',wishlist:'A1','cleanup-complete':'G3c','wishlist-after-cleanup':'A1C'}[start]||'A1';
    iframe.src=`prototype.html?${prototypeQuery.toString()}#${startHash}`;
    iframe.addEventListener('load',attachPrototypeTracking);
  }

  function visibleLabel(target){
    const explicit=target.getAttribute?.('aria-label');
    const text=(explicit||target.textContent||'').replace(/\s+/g,' ').trim();
    return text.slice(0,100)||target.tagName?.toLowerCase()||'unknown';
  }

  function routeLabel(){
    return trackedDocument?.querySelector('.review-label')?.textContent?.trim()||'';
  }

  function attachPrototypeTracking(){
    try{
      trackedDocument=iframe.contentDocument;
      scrollElement=trackedDocument.querySelector('.content')||trackedDocument.scrollingElement;
      trackedDocument.addEventListener('click',trackTap,true);
      scrollElement?.addEventListener('scroll',trackScroll,{passive:true});
      recordRoute(routeLabel(),iframe.contentWindow.location.hash);
    }catch(error){
      console.warn('프로토타입 자동 기록을 연결하지 못했습니다.',error);
    }
  }

  function recordRoute(route,path){
    const signature=`${route}|${path}`;
    const now=Date.now();
    if(signature===lastRouteSignature&&now-lastRouteAt<500)return;
    lastRouteSignature=signature;
    lastRouteAt=now;
    window.UTStore.addEvent(participant,taskId,condition,{type:'route',route,path});
  }

  function trackTap(event){
    const target=event.target.closest?.('button,a,[data-action],[data-route]')||event.target;
    const rect=trackedDocument.documentElement.getBoundingClientRect();
    window.UTStore.addEvent(participant,taskId,condition,{
      type:'tap',
      label:visibleLabel(target),
      action:target.dataset?.action||'',
      targetRoute:target.dataset?.route||'',
      productId:target.dataset?.productId||target.closest?.('[data-product-id]')?.dataset?.productId||'',
      route:routeLabel(),
      x:Math.round(event.clientX),
      y:Math.round(event.clientY),
      xPct:rect.width?Number((event.clientX/rect.width).toFixed(3)):null,
      yPct:rect.height?Number((event.clientY/rect.height).toFixed(3)):null,
      pointerType:event.pointerType||'touch'
    });
  }

  function depth(){
    if(!scrollElement)return 0;
    const max=Math.max(0,scrollElement.scrollHeight-scrollElement.clientHeight);
    return max?Math.min(1,scrollElement.scrollTop/max):0;
  }

  function trackScroll(){
    if(Date.now()<ignoreScrollUntil)return;
    const top=scrollElement.scrollTop;
    if(!scrollTimer)scrollStart=top;
    scrollLast=top;
    scrollMax=Math.max(scrollMax,depth());
    clearTimeout(scrollTimer);
    scrollTimer=setTimeout(()=>{
      if(Math.abs(scrollLast-scrollStart)<8){
        scrollTimer=0;
        return;
      }
      window.UTStore.addEvent(participant,taskId,condition,{
        type:'scroll',route:routeLabel(),startTop:Math.round(scrollStart),endTop:Math.round(scrollLast),
        direction:scrollLast>=scrollStart?'down':'up',maxDepth:Number(scrollMax.toFixed(3))
      });
      scrollTimer=0;
    },180);
  }

  function completePrototype(message){
    const run=currentRun();
    if(!run||run.endedAt)return;
    window.UTStore.addEvent(participant,taskId,condition,{
      type:'success',route:message.route||routeLabel(),productId:message.productId||'',screen:message.screen||''
    });
    const completion={outcome:'success'};
    if(taskId==='t3')completion.organizedCount=Number(message.itemCount||config.targetCount||0);
    window.UTStore.finishRun(participant,taskId,condition,completion);
    setTimeout(renderResult,180);
  }

  function scale(name,value){
    return `<div class="scale">${[1,2,3,4,5,6,7].map(number=>`<input id="${name}-${number}" type="radio" name="${name}" value="${number}" ${Number(value)===number?'checked':''}><label for="${name}-${number}">${number}</label>`).join('')}</div>`;
  }

  function renderResult(){
    clearInterval(timerId);
    const run=currentRun();
    const taps=isBefore?(run.manualTapCount??'-'):(run.tapCount||0);
    const scrolls=isBefore?(run.manualScrollCount??'-'):(run.scrollGestureCount||0);
    const relevanceTitle=taskId==='t3'?'이번에 정리한 상품은 과업 상황과 얼마나 연관성이 있었나요?':'확인한 상품은 과업 상황과 얼마나 연관성이 있었나요?';
    const needsRelevance=taskId!=='t4';
    const t3Understanding=taskId==='t3'&&!isBefore?`<section class="form-card">
      <h2>정리 결과를 어떻게 이해했나요?</h2>
      <p>아래 질문을 참여자에게 순서대로 묻고 답변을 기록해 주세요.</p>
      <label class="field"><span>1. 어떤 상품들이 정리 대상으로 묶였다고 생각하나요?</span><textarea name="candidateRuleAnswer" placeholder="참여자의 표현을 그대로 기록해 주세요.">${escapeText(run.candidateRuleAnswer||'')}</textarea></label>
      <label class="field"><span>2. 정리하기를 누르면 해당 상품은 어떻게 된다고 생각하나요?</span><textarea name="resultUnderstandingAnswer" placeholder="숨김·즉시 삭제 여부·30일 후 삭제에 대한 답변을 기록해 주세요.">${escapeText(run.resultUnderstandingAnswer||'')}</textarea></label>
      <label class="field"><span>3. 정리한 상품을 다시 보고 싶다면 어떻게 해야 할 것 같나요?</span><textarea name="restoreAnswer" placeholder="숨긴 상품 진입·30일 안 복원에 대한 답변을 기록해 주세요.">${escapeText(run.restoreAnswer||'')}</textarea></label>
      <label class="field"><span>정리 결과 이해 판정</span><select name="understandingLevel" required>
        <option value="">선택해 주세요</option>
        <option value="full" ${run.understandingLevel==='full'?'selected':''}>전체 이해</option>
        <option value="partial" ${run.understandingLevel==='partial'?'selected':''}>부분 이해</option>
        <option value="misunderstood" ${run.understandingLevel==='misunderstood'?'selected':''}>오해</option>
      </select></label>
    </section>`:'';
    const t4Understanding=taskId==='t4'?`<section class="form-card">
      <h2>복원 결과를 어떻게 이해했나요?</h2>
      <p>아래 질문을 참여자에게 순서대로 묻고 답변을 기록해 주세요.</p>
      <label class="field"><span>1. 복원한 상품은 어디에서 다시 볼 수 있을 것 같나요?</span><textarea name="restorationLocationAnswer" placeholder="원래 찜 폴더·찜 목록 등에 대한 답변을 기록해 주세요.">${escapeText(run.restorationLocationAnswer||'')}</textarea></label>
      <label class="field"><span>2. 정리한 상품을 복원하지 않고 30일이 지나면 어떻게 된다고 이해했나요?</span><textarea name="expiryAnswer" placeholder="30일 후 자동 삭제에 대한 답변을 기록해 주세요.">${escapeText(run.expiryAnswer||'')}</textarea></label>
      <label class="field"><span>복원 구조 이해 판정</span><select name="restoreUnderstandingLevel" required>
        <option value="">선택해 주세요</option>
        <option value="full" ${run.restoreUnderstandingLevel==='full'?'selected':''}>전체 이해</option>
        <option value="partial" ${run.restoreUnderstandingLevel==='partial'?'selected':''}>부분 이해</option>
        <option value="misunderstood" ${run.restoreUnderstandingLevel==='misunderstood'?'selected':''}>오해</option>
      </select></label>
    </section>`:'';
    root.innerHTML=`<section class="result-shell">
      <header><small>${escapeText(participant)} · ${escapeText(task.id)} · ${isBefore?'기존 지그재그':'개선안'}</small><h1>과업 결과를 기록해 주세요.</h1></header>
      <div class="result-summary"><span>소요 시간<b>${formatClock(run.durationMs||0)}</b></span><span>${isBefore?'관찰 탭':'자동 탭'}<b>${taps}</b></span><span>${isBefore?'관찰 스크롤':'스크롤 제스처'}<b>${scrolls}</b></span></div>
      <form id="result-form">
        <section class="form-card">
          <h2>과업은 얼마나 쉬웠나요?</h2>
          <p>SEQ 기준: 1점 매우 어려움, 7점 매우 쉬움</p>
          ${scale('seq',run.seq)}
          <div class="scale-ends"><span>매우 어려움</span><span>매우 쉬움</span></div>
          <label class="field"><span>선택 이유 또는 어려웠던 점</span><textarea name="participantNote" placeholder="참여자의 답변을 짧게 기록해 주세요.">${escapeText(run.participantNote||'')}</textarea></label>
        </section>
        ${needsRelevance?`<section class="form-card">
          <h2>${relevanceTitle}</h2>
          <p>1점 전혀 연관 없음, 7점 매우 연관 있음</p>
          ${scale('relevance',run.relevance)}
          <div class="scale-ends"><span>전혀 연관 없음</span><span>매우 연관 있음</span></div>
        </section>`:''}
        ${t3Understanding}
        ${t4Understanding}
        <section class="form-card">
          <h2>진행자 기록</h2>
          ${taskId==='t3'?`<label class="field"><span>정리 행동에 포함된 상품 수</span><input name="organizedCount" type="number" min="0" inputmode="numeric" value="${run.organizedCount??(isBefore?'':28)}"></label>`:''}
          <label class="field"><span>과업 결과</span><select name="outcome" required>
            <option value="">선택해 주세요</option>
            <option value="success" ${run.outcome==='success'?'selected':''}>성공</option>
            <option value="detour-success" ${run.outcome==='detour-success'?'selected':''}>우회 후 성공</option>
            <option value="partial" ${run.outcome==='partial'?'selected':''}>부분 성공</option>
            <option value="failure" ${run.outcome==='failure'?'selected':''}>실패</option>
            <option value="interrupted" ${run.outcome==='interrupted'?'selected':''}>중단</option>
          </select></label>
          ${isBefore?`<div class="field-row"><label class="field"><span>관찰 탭 수</span><input name="manualTapCount" type="number" min="0" inputmode="numeric" value="${run.manualTapCount??''}"></label><label class="field"><span>관찰 스크롤 수</span><input name="manualScrollCount" type="number" min="0" inputmode="numeric" value="${run.manualScrollCount??''}"></label></div>`:''}
          <label class="check-field"><input name="helpRequested" type="checkbox" ${run.helpRequested?'checked':''}>진행자의 도움을 받음</label>
          <label class="field"><span>관찰 메모</span><textarea name="note" placeholder="오클릭, 망설임, 주요 발화를 기록해 주세요.">${escapeText(run.note||'')}</textarea></label>
        </section>
        <div class="save-actions"><button class="primary" type="submit">기록 저장하고 세션 홈으로</button><button class="secondary" type="button" data-retry>이 조건 다시 시작</button></div>
      </form>
    </section>`;
    const form=root.querySelector('#result-form');
    form.addEventListener('submit',event=>{
      event.preventDefault();
      const data=new FormData(form);
      const seq=Number(data.get('seq'));
      const relevance=needsRelevance?Number(data.get('relevance')):null;
      if(!seq||(needsRelevance&&!relevance)){alert(needsRelevance?'SEQ와 연관성 점수를 모두 선택해 주세요.':'SEQ 점수를 선택해 주세요.');return;}
      const patch={
        seq,relevance,outcome:data.get('outcome'),participantNote:data.get('participantNote')||'',
        helpRequested:data.get('helpRequested')==='on',note:data.get('note')||''
      };
      if(taskId==='t3'){
        patch.organizedCount=data.get('organizedCount')===''?null:Number(data.get('organizedCount'));
        if(!isBefore){
          patch.candidateRuleAnswer=data.get('candidateRuleAnswer')||'';
          patch.resultUnderstandingAnswer=data.get('resultUnderstandingAnswer')||'';
          patch.restoreAnswer=data.get('restoreAnswer')||'';
          patch.understandingLevel=data.get('understandingLevel')||'';
        }
      }
      if(taskId==='t4'){
        patch.restorationLocationAnswer=data.get('restorationLocationAnswer')||'';
        patch.expiryAnswer=data.get('expiryAnswer')||'';
        patch.restoreUnderstandingLevel=data.get('restoreUnderstandingLevel')||'';
      }
      if(isBefore){
        patch.manualTapCount=data.get('manualTapCount')===''?null:Number(data.get('manualTapCount'));
        patch.manualScrollCount=data.get('manualScrollCount')===''?null:Number(data.get('manualScrollCount'));
      }
      window.UTStore.completeRun(participant,taskId,condition,patch);
      location.href=`facilitator.html?participant=${encodeURIComponent(participant)}`;
    });
    root.querySelector('[data-retry]').addEventListener('click',()=>{
      if(confirm('현재 조건의 기록을 새로 시작할까요?'))renderIntro();
    });
  }

  window.addEventListener('message',event=>{
    const data=event.data||{};
    if(data.type==='wishlist-ut-route'){
      ignoreScrollUntil=Date.now()+300;
      clearTimeout(scrollTimer);
      scrollTimer=0;
      scrollStart=scrollElement?.scrollTop||0;
      scrollLast=scrollStart;
      recordRoute(data.route||'',data.path||'');
    }
    if(data.type==='wishlist-ut-complete'&&data.task===taskId)completePrototype(data);
  });

  document.addEventListener('visibilitychange',()=>{
    const run=currentRun();
    if(!run||run.status!=='running')return;
    window.UTStore.updateRun(participant,taskId,condition,{visibilityChanges:(run.visibilityChanges||0)+1});
  });

  if(existing?.status==='running'){
    if(isBefore)renderBeforeActive(); else renderPrototype();
  }else if(existing?.endedAt&&existing.status!=='complete'){
    renderResult();
  }else{
    renderIntro();
  }
});
