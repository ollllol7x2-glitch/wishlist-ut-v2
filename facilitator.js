'use strict';

document.addEventListener('DOMContentLoaded',()=>{
  const buttons=[...document.querySelectorAll('[data-participant]')];
  const status=document.querySelector('#participant-status');
  const orderNote=document.querySelector('#order-note');
  const exportButton=document.querySelector('#export-csv');
  const resetButton=document.querySelector('#reset-participant');
  const fromQuery=new URLSearchParams(location.search).get('participant');
  let participant=fromQuery||window.UTStore.getParticipant()||'';

  function conditionOrder(id){
    const number=Number(id.replace(/\D/g,''))||1;
    return number%2===0
      ? ['after-prototype','before-live']
      : ['before-live','after-prototype'];
  }

  function conditionName(condition){
    return condition==='before-live'?'기존 지그재그':'개선안';
  }

  function formatStatus(run){
    if(!run)return {text:'미진행',className:''};
    if(run.status==='running')return {text:'진행 중',className:'is-running'};
    if(run.status==='awaiting-response')return {text:'응답 기록 필요',className:'is-running'};
    if(run.status==='complete'){
      const duration=window.UTStore.formatDuration(run.durationMs);
      return {text:`완료 · ${run.outcome||'-'} · ${duration}s · SEQ ${run.seq||'-'}`,className:'is-complete'};
    }
    return {text:run.status||'미진행',className:''};
  }

  function linkLabel(run){
    if(!run)return '시작';
    if(run.status==='running')return '계속';
    if(run.status==='awaiting-response')return '응답';
    return '다시';
  }

  function render(){
    buttons.forEach(button=>button.classList.toggle('is-selected',button.dataset.participant===participant));
    if(!participant){
      status.textContent='선택 전';
      orderNote.textContent='참여자를 선택하면 과업 순서와 기록이 연결됩니다.';
    }else{
      if(window.UTStore.getParticipant()!==participant)window.UTStore.setParticipant(participant);
      status.textContent=participant;
      const order=conditionOrder(participant);
      orderNote.textContent=`${participant}의 조건 순서는 ${conditionName(order[0])} → ${conditionName(order[1])}입니다.`;
    }

    document.querySelectorAll('.task-card.is-ready[data-task-card]').forEach(card=>{
      const taskId=card.dataset.taskCard;
      const available=[...card.querySelectorAll('[data-condition-row]')].map(row=>row.dataset.conditionRow);
      const order=participant?conditionOrder(participant).filter(condition=>available.includes(condition)):[];
      const strip=card.querySelector('[data-order-strip]');
      strip.textContent=participant
        ? order.length===1?`실행 조건: ${conditionName(order[0])} 전용`:`권장 순서: ① ${conditionName(order[0])} → ② ${conditionName(order[1])}`
        : available.length===1?'개선안 전용 과업':'권장 순서: 참여자 선택 후 표시';
      card.querySelectorAll('[data-condition-row]').forEach(row=>{
        const condition=row.dataset.conditionRow;
        const link=row.querySelector('[data-condition-link]');
        const badge=row.querySelector('[data-status]');
        if(!participant){
          link.setAttribute('aria-disabled','true');
          link.removeAttribute('href');
          link.textContent='시작';
          badge.textContent='미진행';
          badge.className='';
          return;
        }
        const run=window.UTStore.getRun(participant,taskId,condition);
        const runStatus=formatStatus(run);
        badge.textContent=runStatus.text;
        badge.className=runStatus.className;
        link.removeAttribute('aria-disabled');
        link.href=`index.html?task=${taskId}&condition=${condition}&participant=${encodeURIComponent(participant)}`;
        link.textContent=linkLabel(run);
      });
    });
  }

  buttons.forEach(button=>button.addEventListener('click',()=>{
    participant=button.dataset.participant;
    const url=new URL(location.href);
    url.searchParams.set('participant',participant);
    history.replaceState(null,'',url);
    render();
  }));

  exportButton.addEventListener('click',()=>window.UTStore.exportCSV());
  resetButton.addEventListener('click',()=>{
    if(!participant){alert('먼저 참여자를 선택해 주세요.');return;}
    if(confirm(`${participant}의 모든 기록을 초기화할까요?`)){
      window.UTStore.resetParticipant(participant);
      render();
    }
  });
  window.addEventListener('wishlist-ut-update',()=>render());
  window.addEventListener('pageshow',render);
  render();
});
