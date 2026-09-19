'use strict';

document.addEventListener('DOMContentLoaded',()=>{
  const root=document.querySelector('#runner');
  const query=new URLSearchParams(location.search);
  if(!query.has('task')){
    location.replace(`facilitator.html${query.get('participant')?`?participant=${encodeURIComponent(query.get('participant'))}`:''}`);
    return;
  }
  const taskId=(query.get('task')||'t1').toLowerCase();
  const condition='after-prototype';
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
  let lastRouteAt=0;let exposureTimer=0;let homeVisibleSince=0;let limitTimer=0;

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
        <h1>진행자가 과업을 읽고 시작합니다.</h1>
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
      <div class="prototype-controls">
        <button class="prototype-rec" type="button" data-toggle-prototype-controls aria-expanded="false">기록 중</button>
        <button class="prototype-stop" type="button" data-stop-prototype hidden>과업 중단</button>
      </div>
      <iframe title="${escapeText(task.id)} 개선안 프로토타입" allow="clipboard-write"></iframe>
    </section>`;
    const controls=root.querySelector('.prototype-controls');
    controls.insertAdjacentHTML('beforeend',`${task.manualEnd?'<button class="prototype-stop" data-manual-finish hidden>선택 완료</button>':''}<button class="prototype-stop" data-prototype-error hidden>프로토타입 오류</button><span class="prototype-stop" data-limit hidden>${task.maxSeconds}초 제한</span>`);
    controls.querySelector('[data-manual-finish]')?.addEventListener('click',()=>endManually('success'));
    controls.querySelector('[data-prototype-error]').addEventListener('click',()=>endManually('prototype-error'));
    const toggle=root.querySelector('[data-toggle-prototype-controls]');
    const stop=root.querySelector('[data-stop-prototype]');
    toggle.addEventListener('click',()=>{
      const expanded=toggle.getAttribute('aria-expanded')==='true';
      toggle.setAttribute('aria-expanded',String(!expanded));
      stop.hidden=expanded;controls.querySelectorAll('[data-manual-finish],[data-prototype-error],[data-limit]').forEach(node=>node.hidden=expanded);
    });
    root.querySelector('[data-stop-prototype]').addEventListener('click',stopPrototype);
    iframe=root.querySelector('iframe');
    const prototypeQuery=new URLSearchParams({ut:'1',task:taskId,condition,participant,build:'round2-1'});
    const conditionKey=condition==='before-live'?'before':'after';
    const start=task.conditions?.[conditionKey]?.start||'wishlist';
    const startHash={home:'C1',wishlist:'A1','cleanup-complete':'G3c','wishlist-after-cleanup':'A1C'}[start]||'A1';
    iframe.src=`prototype.html?${prototypeQuery.toString()}#${startHash}`;
    iframe.addEventListener('load',attachPrototypeTracking);
    clearInterval(limitTimer);
    limitTimer=setInterval(()=>{const run=currentRun();if(!run||run.status!=='running'){clearInterval(limitTimer);return;}if(Date.now()-run.startedAt>=task.maxSeconds*1000)endManually('interrupted','time-limit');},500);
  }

  function endManually(outcome,reason='facilitator-end'){
    const run=currentRun();if(!run||run.status!=='running')return;
    window.UTStore.addEvent(participant,taskId,condition,{type:'end',outcome,reason,route:routeLabel()});
    window.UTStore.finishRun(participant,taskId,condition,{outcome});renderResult();
  }

  function stopPrototype(){
    const run=currentRun();
    if(!run||run.endedAt)return;
    clearTimeout(scrollTimer);
    scrollTimer=0;
    window.UTStore.addEvent(participant,taskId,condition,{
      type:'interrupted',route:routeLabel(),reason:'participant-abandoned'
    });
    window.UTStore.finishRun(participant,taskId,condition,{outcome:'interrupted'});
    renderResult();
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
      clearInterval(exposureTimer);
      if(taskId==='t1')exposureTimer=setInterval(()=>{
        const run=currentRun();if(!run||run.status!=='running'){clearInterval(exposureTimer);return;}
        const area=trackedDocument.querySelector('.v24-home-revisit');const rect=area?.getBoundingClientRect();const view=scrollElement.getBoundingClientRect();
        const visible=rect&&document.visibilityState==='visible'&&Math.min(rect.bottom,view.bottom)>Math.max(rect.top,view.top)+50;
        if(!visible){homeVisibleSince=0;return;}
        if(!homeVisibleSince)homeVisibleSince=Date.now();
        if(Date.now()-homeVisibleSince>=2000&&!run.homeAreaSeen){window.UTStore.addEvent(participant,taskId,condition,{type:'home-area-exposure',visibleMs:2000});window.UTStore.updateRun(participant,taskId,condition,{homeAreaSeen:true});}
      },250);
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
    if(currentRun()?.status!=='running')return;
    if(taskId==='t1'&&event.target.closest?.('.v24-home-revisit'))window.UTStore.updateRun(participant,taskId,condition,{homeAreaSeen:true});
    const target=event.target.closest?.('button,a,[data-action],[data-route]')||event.target;
    const rect=trackedDocument.documentElement.getBoundingClientRect();
    const productId=target.dataset?.productId||target.closest?.('[data-product-id]')?.dataset?.productId||'';
    let choicePatch={};
    if(target.dataset?.action==='open-detail'&&productId){
      const currentRoute=routeLabel();
      const selectionSource=target.closest?.('.v24-home-revisit')?'home-area'
        :target.closest?.('.revisit-list')?'revisit-sheet'
        :currentRoute.startsWith('A3')?'search'
        :currentRoute.startsWith('A1')?'wishlist-list'
        :currentRoute.startsWith('C1')?'home-other':'other';
      const selectedProductName=target.querySelector?.('img[alt]')?.getAttribute('alt')?.trim()||productId;
      choicePatch={selectedProductId:productId,selectedProductName,selectionSource};
      if(selectionSource==='home-area')choicePatch.homeAreaSeen=true;
      window.UTStore.updateRun(participant,taskId,condition,choicePatch);
    }
    window.UTStore.addEvent(participant,taskId,condition,{
      type:'tap',
      label:visibleLabel(target),
      action:target.dataset?.action||'',
      targetRoute:target.dataset?.route||'',
      productId,
      ...choicePatch,
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
    if(taskId==='t3'){completion.organizedCount=Number(message.itemCount||config.targetCount||0);completion.cleanupPath=message.cleanupPath||'';completion.proposalUsed=!!message.proposalUsed;}
    window.UTStore.finishRun(participant,taskId,condition,completion);
    const indicator=root.querySelector('.prototype-rec');
    if(indicator)indicator.textContent='완료 · 질문으로 이동';
    root.querySelectorAll('.prototype-controls button').forEach(button=>button.disabled=true);
    setTimeout(renderResult,2200);
  }

  function scale(name,value){
    return `<div class="scale">${[1,2,3,4,5,6,7].map(number=>`<input id="${name}-${number}" type="radio" name="${name}" value="${number}" ${Number(value)===number?'checked':''}><label for="${name}-${number}">${number}</label>`).join('')}</div>`;
  }

  function renderResult(){
    clearInterval(timerId);clearInterval(exposureTimer);clearInterval(limitTimer);clearTimeout(scrollTimer);
    const run=currentRun();
    const lastProductTap=[...(run.events||[])].reverse().find(event=>event.type==='tap'&&event.action==='open-detail'&&event.productId);
    const selectedProductValue=run.selectedProductName||run.selectedProductId||lastProductTap?.selectedProductName||lastProductTap?.productId||'';
    const selectedProductSource=run.selectionSource||lastProductTap?.selectionSource||'';
    const taps=isBefore?(run.manualTapCount??'-'):(run.tapCount||0);
    const scrolls=isBefore?(run.manualScrollCount??'-'):(run.scrollGestureCount||0);
    const relevanceTitle=taskId==='t3'?'이번에 정리한 상품은 과업 상황과 얼마나 연관성이 있었나요?':'확인한 상품은 과업 상황과 얼마나 연관성이 있었나요?';
    const needsRelevance=false;
    const t3Understanding=taskId==='t3'&&!isBefore?`<section class="form-card">
      <h2>정리 결과를 어떻게 이해했나요?</h2>
      <p>아래 질문을 참여자에게 순서대로 묻고 답변을 기록해 주세요.</p>
      <label class="field"><span>1. 어떤 상품들이 정리 대상으로 묶였다고 생각하나요?</span><textarea name="candidateRuleAnswer" placeholder="참여자의 표현을 그대로 기록해 주세요.">${escapeText(run.candidateRuleAnswer||'')}</textarea></label>
      <label class="field"><span>2. 정리하기를 누르면 해당 상품은 어떻게 된다고 생각하나요?</span><textarea name="resultUnderstandingAnswer" placeholder="숨김·즉시 삭제 여부·30일 후 삭제에 대한 답변을 기록해 주세요.">${escapeText(run.resultUnderstandingAnswer||'')}</textarea></label>
      <label class="field"><span>3. 정리한 상품을 다시 보고 싶다면 어떻게 해야 할 것 같나요?</span><textarea name="restoreAnswer" placeholder="정리한 상품 진입·30일 안 복원에 대한 답변을 기록해 주세요.">${escapeText(run.restoreAnswer||'')}</textarea></label>
      <label class="field"><span>추가. ‘정리한 상품’이라는 이름을 보고 무엇이 들어 있을 것 같았나요?</span><textarea name="archiveNameAnswer">${escapeText(run.archiveNameAnswer||'')}</textarea></label>
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
    const select=(name,title,options,value,required=false)=>`<label class="field"><span>${title}</span><select name="${name}" ${required?'required':''}>${options.map(([key,text])=>`<option value="${key}" ${String(value??'')===key?'selected':''}>${text}</option>`).join('')}</select></label>`;
    const text=(name,title,value)=>`<label class="field"><span>${title}</span><textarea name="${name}">${escapeText(value||'')}</textarea></label>`;
    const exploration=task.manualEnd?`<section class="form-card"><h2>탐색·선택 기록</h2><p>상세 화면을 연 마지막 상품이 자동 입력됩니다. 상품 카드를 열지 않고 말로만 선택했거나 다른 상품을 최종 선택했다면 수정해 주세요.</p><label class="field"><span>선택 상품명 또는 ID</span><input name="selectedProductName" value="${escapeText(selectedProductValue)}"></label>${select('selectionSource','최종 선택 상품의 출처',[['','선택해 주세요'],['home-area','홈 찜 영역'],['home-other','홈의 다른 영역'],['revisit-sheet','다시 살펴볼 상품 시트'],['wishlist-list','찜 목록'],['search','검색'],['other','기타'],['none','선택하지 않음']],selectedProductSource,true)}${taskId==='t1'?select('homeAreaSeen','홈 찜 영역: 2초 이상 노출 또는 영역 내 탭',[['true','해당'],['false','해당하지 않음']],String(!!run.homeAreaSeen)):select('revisitOpened','다시 살펴볼 상품 시트를 열었는가',[['true','열었음'],['false','열지 않음']],String(!!run.revisitOpened))}${text('areaRecallAnswer',taskId==='t1'?'홈에서 어떤 상품 영역을 보셨나요?':'찜 화면에서 어떤 영역을 보셨나요?',run.areaRecallAnswer)}${text('areaMeaningAnswer',taskId==='t1'?'그 영역은 어떤 상품을 모아 보여주는 곳이라고 생각했나요?':'맨 위에 있던 묶음은 어떤 상품을 모아 둔 곳이라고 생각했나요?',run.areaMeaningAnswer)}<p>영역을 보지 않았거나 시트를 열지 않은 경우: 지금까지의 답변을 먼저 기록한 뒤 보여주고 이해를 확인합니다.</p><button type="button" class="secondary" data-show-area>영역 제시 후 이해 확인</button>${select('shownAfter','영역을 제시한 뒤 이해를 확인했는가',[['false','아니요'],['true','예']],String(!!run.shownAfter))}${text('shownMeaningAnswer','제시 후 이해 답변',run.shownMeaningAnswer)}</section>`:'';
    const post=taskId==='t4'?`<section class="form-card"><h2>네 과업 후 사후 질문</h2>${text('postChangedAnswer','지난번과 달라 보인 곳이 있었나요? 어디였나요?',run.postChangedAnswer)}${text('postClarityAnswer','정리한 상품이 어디로 갔는지 이번엔 분명했나요?',run.postClarityAnswer)}${select('postIntentAnswer','실제 계정이라면 정리 제안이 떴을 때 어떻게 할 것 같나요?',[['','선택해 주세요'],['clean','정리'],['later','다음에'],['close','닫음']],run.postIntentAnswer)}${text('postIntentReason','그렇게 선택한 이유',run.postIntentReason)}</section>`:'';
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
        ${exploration}
        ${t3Understanding}
        ${t4Understanding}
        ${post}
        <section class="form-card">
          <h2>진행자 기록</h2>
          ${taskId==='t3'?`<p>제안 이용: ${run.proposalUsed?'예':'아니요'} · 경로: ${{'automatic-sheet':'자동 시트','edit-banner':'편집 상단 제안','archive-banner':'정리한 상품 내 제안','edit-delete':'편집 삭제'}[run.cleanupPath]||'완료 경로 없음'}</p>`:''}
          ${taskId==='t3'?`<label class="field"><span>정리 행동에 포함된 상품 수</span><input name="organizedCount" type="number" min="0" inputmode="numeric" value="${run.organizedCount??''}"></label>`:''}
          <label class="field"><span>과업 결과</span><select name="outcome" required>
            <option value="">선택해 주세요</option>
            <option value="success" ${run.outcome==='success'?'selected':''}>도움 없는 완료</option>
            <option value="helped" ${run.outcome==='helped'?'selected':''}>도움 후 완료</option>
            <option value="partial" ${run.outcome==='partial'?'selected':''}>부분 완료</option>
            <option value="interrupted" ${run.outcome==='interrupted'?'selected':''}>중단</option>
            <option value="prototype-error" ${run.outcome==='prototype-error'?'selected':''}>프로토타입 오류</option>
          </select></label>
          ${isBefore?`<div class="field-row"><label class="field"><span>관찰 탭 수</span><input name="manualTapCount" type="number" min="0" inputmode="numeric" value="${run.manualTapCount??''}"></label><label class="field"><span>관찰 스크롤 수</span><input name="manualScrollCount" type="number" min="0" inputmode="numeric" value="${run.manualScrollCount??''}"></label></div>`:''}
          <label class="check-field"><input name="helpRequested" type="checkbox" ${run.helpRequested?'checked':''}>진행자의 도움을 받음</label>
          <label class="field"><span>관찰 메모</span><textarea name="note" placeholder="오클릭, 망설임, 주요 발화를 기록해 주세요.">${escapeText(run.note||'')}</textarea></label>
        </section>
        <div class="save-actions"><button class="primary" type="submit">기록 저장하고 세션 홈으로</button><button class="secondary" type="button" data-retry>이 과업 다시 시작</button></div>
      </form>
    </section>`;
    root.querySelector('[data-show-area]')?.addEventListener('click',()=>{
      let dialog=document.querySelector('#shown-area-dialog');if(dialog)dialog.remove();
      dialog=document.createElement('dialog');dialog.id='shown-area-dialog';dialog.style.cssText='width:min(430px,100vw);height:90dvh;padding:0;border:0;border-radius:12px';
      dialog.innerHTML=`<button type="button" style="height:44px;width:100%">닫기</button><iframe title="제시 후 영역 확인" style="width:100%;height:calc(100% - 44px);border:0" src="prototype.html?ut=1&task=shown&condition=after-prototype&participant=${encodeURIComponent(participant)}#${taskId==='t1'?'C1':'D1'}"></iframe>`;
      dialog.querySelector('button').textContent='닫기';dialog.querySelector('button').onclick=()=>{dialog.close();dialog.remove();};document.body.append(dialog);dialog.showModal();root.querySelector('[name="shownAfter"]').value='true';
    });
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
      if(task.manualEnd){
        for(const key of ['selectionSource','areaRecallAnswer','areaMeaningAnswer','shownMeaningAnswer','selectedProductName'])patch[key]=data.get(key)||'';
        const bool=taskId==='t1'?'homeAreaSeen':'revisitOpened';patch[bool]=data.get(bool)==='true';patch.shownAfter=data.get('shownAfter')==='true';
      }
      if(patch.helpRequested&&patch.outcome==='success')patch.outcome='helped';
      if(taskId==='t3'){
        patch.archiveNameAnswer=data.get('archiveNameAnswer')||'';
        patch.organizedCount=data.get('organizedCount')===''?null:Number(data.get('organizedCount'));
        if(!isBefore){
          patch.candidateRuleAnswer=data.get('candidateRuleAnswer')||'';
          patch.resultUnderstandingAnswer=data.get('resultUnderstandingAnswer')||'';
          patch.restoreAnswer=data.get('restoreAnswer')||'';
          patch.understandingLevel=data.get('understandingLevel')||'';
        }
      }
      if(taskId==='t4'){
        for(const key of ['postChangedAnswer','postClarityAnswer','postIntentAnswer','postIntentReason'])patch[key]=data.get(key)||'';
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
      if(confirm('이 과업을 다시 수행하면 이전 기록을 덮어씁니다. 다시 시작할까요?'))renderIntro();
    });
  }

  window.addEventListener('message',event=>{
    if(!iframe||event.source!==iframe.contentWindow||event.origin!==location.origin)return;
    const data=event.data||{};
    if(data.task!==taskId||data.participant!==participant||data.condition!==condition)return;
    if(data.type==='wishlist-ut-observation'&&currentRun()?.status==='running'){
      const patch={};for(const key of ['selectedProductId','selectedProductName','selectionSource','homeAreaSeen','revisitOpened','archiveEntryFound'])if(data[key]!==undefined)patch[key]=data[key];
      window.UTStore.addEvent(participant,taskId,condition,{type:data.eventType,...patch});window.UTStore.updateRun(participant,taskId,condition,patch);
    }
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
  }else if(existing?.endedAt){
    renderResult();
  }else{
    renderIntro();
  }
});
