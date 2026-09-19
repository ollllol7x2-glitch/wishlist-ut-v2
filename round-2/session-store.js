'use strict';

(function(){
  const STORAGE_KEY='wishlist-ut-round2-0918';
  const VERSION=3;

  function emptyState(){
    return {version:VERSION,participant:'',sessions:{}};
  }

  function read(){
    try{
      const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
      if(!parsed||parsed.version!==VERSION)return emptyState();
      let changed=false;
      for(const session of Object.values(parsed.sessions||{})){
        for(const run of Object.values(session.runs||{})){
          if(run.status==='running'&&new Date(run.startedAt).toDateString()!==new Date().toDateString()){
            run.status='expired';run.outcome='session-expired';run.durationMs=null;changed=true;
          }
        }
      }
      if(changed)localStorage.setItem(STORAGE_KEY,JSON.stringify(parsed));
      return parsed;
    }catch(error){
      console.warn('UT 기록을 읽지 못했습니다.',error);
      return emptyState();
    }
  }

  function write(state){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('wishlist-ut-update',{detail:state}));
    return state;
  }

  function runKey(task,condition){ return `${task}:${condition}`; }

  function ensureParticipant(state,participant){
    if(!state.sessions[participant])state.sessions[participant]={runs:{}};
    if(!state.sessions[participant].runs)state.sessions[participant].runs={};
    return state.sessions[participant];
  }

  function setParticipant(participant){
    const state=read();
    state.participant=participant;
    ensureParticipant(state,participant);
    write(state);
    return participant;
  }

  function getParticipant(){ return read().participant||''; }

  function getRun(participant,task,condition){
    const session=read().sessions[participant];
    return session?.runs?.[runKey(task,condition)]||null;
  }

  function startRun({participant,task,condition,measurementMethod}){
    const state=read();
    const session=ensureParticipant(state,participant);
    const now=Date.now();
    const run={
      participant,task,condition,round:2,priorExposure:'1차',
      selectionSource:'',selectedProductId:'',selectedProductName:'',homeAreaSeen:false,revisitOpened:false,archiveEntryFound:false,proposalUsed:false,cleanupPath:'',areaRecallAnswer:'',areaMeaningAnswer:'',shownAfter:false,shownMeaningAnswer:'',archiveNameAnswer:'',postChangedAnswer:'',postClarityAnswer:'',postIntentAnswer:'',postIntentReason:'',
      measurementMethod:measurementMethod||'web-auto',
      status:'running',startedAt:now,startedAtISO:new Date(now).toISOString(),
      endedAt:null,endedAtISO:'',durationMs:null,outcome:'',seq:null,relevance:null,
      manualTapCount:null,manualScrollCount:null,helpRequested:false,note:'',participantNote:'',
      organizedCount:null,candidateRuleAnswer:'',resultUnderstandingAnswer:'',restoreAnswer:'',understandingLevel:'',restorationLocationAnswer:'',expiryAnswer:'',restoreUnderstandingLevel:'',
      viewport:`${window.innerWidth}x${window.innerHeight}`,
      dpr:window.devicePixelRatio||1,
      orientation:screen.orientation?.type||'',
      visibilityChanges:0,tapCount:0,scrollGestureCount:0,maxScrollDepth:0,
      events:[]
    };
    session.runs[runKey(task,condition)]=run;
    state.participant=participant;
    write(state);
    return run;
  }

  function updateRun(participant,task,condition,patch){
    const state=read();
    const session=ensureParticipant(state,participant);
    const key=runKey(task,condition);
    if(!session.runs[key])session.runs[key]={participant,task,condition,events:[]};
    Object.assign(session.runs[key],patch);
    write(state);
    return session.runs[key];
  }

  function addEvent(participant,task,condition,event){
    const state=read();
    const session=ensureParticipant(state,participant);
    const run=session.runs[runKey(task,condition)];
    if(!run||run.status!=='running')return null;
    if(!Array.isArray(run.events))run.events=[];
    run.events.push({at:Date.now(),elapsedMs:Math.max(0,Date.now()-run.startedAt),...event});
    if(event.type==='tap')run.tapCount=(run.tapCount||0)+1;
    if(event.type==='scroll')run.scrollGestureCount=(run.scrollGestureCount||0)+1;
    if(Number.isFinite(event.maxDepth))run.maxScrollDepth=Math.max(run.maxScrollDepth||0,event.maxDepth);
    write(state);
    return run;
  }

  function finishRun(participant,task,condition,patch={}){
    const run=getRun(participant,task,condition);
    if(!run)return null;
    const endedAt=run.endedAt||Date.now();
    return updateRun(participant,task,condition,{
      endedAt,endedAtISO:new Date(endedAt).toISOString(),
      durationMs:Math.max(0,endedAt-run.startedAt),
      status:'awaiting-response',...patch
    });
  }

  function completeRun(participant,task,condition,patch={}){
    return updateRun(participant,task,condition,{status:'complete',...patch});
  }

  function resetParticipant(participant){
    const state=read();
    delete state.sessions[participant];
    ensureParticipant(state,participant);
    write(state);
  }

  function csvCell(value){
    const string=value===null||value===undefined?'':String(value);
    return `"${string.replaceAll('"','""')}"`;
  }

  function formatDuration(ms){
    if(!Number.isFinite(ms))return '';
    return (ms/1000).toFixed(1);
  }

  function exportCSV(){
    const state=read();
    const headers=[
      'participant','task','condition','measurement_method','status','outcome',
      'started_at','ended_at','duration_sec','seq_1_7','relevance_1_7','help_requested',
      'tap_count','scroll_gesture_count','max_scroll_depth_pct','manual_tap_count','manual_scroll_count',
      'organized_count','candidate_rule_answer','result_understanding_answer','restore_answer','understanding_level','restoration_location_answer','expiry_answer','restore_understanding_level',
      'participant_note','facilitator_note','viewport','dpr','orientation','visibility_changes','event_log',
      'round','prior_exposure','selection_source','selected_product_id','selected_product_name','home_area_seen','revisit_opened','archive_entry_found','proposal_used','cleanup_path','area_recall_answer','area_meaning_answer','shown_after','shown_meaning_answer','archive_name_answer','post_changed_answer','post_clarity_answer','post_intent_answer','post_intent_reason'
    ];
    const rows=[];
    Object.keys(state.sessions).filter(participant=>/^P[1-5]$/.test(participant)).sort().forEach(participant=>{
      const runs=state.sessions[participant]?.runs||{};
      Object.values(runs).sort((a,b)=>(a.startedAt||0)-(b.startedAt||0)).forEach(run=>{
        rows.push([
          run.participant,run.task,run.condition,run.measurementMethod,run.status,run.outcome,
          run.startedAtISO,run.endedAtISO,formatDuration(run.durationMs),run.seq,run.relevance,run.helpRequested,
          run.tapCount,run.scrollGestureCount,Math.round((run.maxScrollDepth||0)*100),run.manualTapCount,run.manualScrollCount,
          run.organizedCount,run.candidateRuleAnswer,run.resultUnderstandingAnswer,run.restoreAnswer,run.understandingLevel,run.restorationLocationAnswer,run.expiryAnswer,run.restoreUnderstandingLevel,
          run.participantNote,run.note,run.viewport,run.dpr,run.orientation,run.visibilityChanges,
          JSON.stringify(run.events||[]),
          run.round,run.priorExposure,run.selectionSource,run.selectedProductId,run.selectedProductName,run.homeAreaSeen,run.revisitOpened,run.archiveEntryFound,run.proposalUsed,run.cleanupPath,run.areaRecallAnswer,run.areaMeaningAnswer,run.shownAfter,run.shownMeaningAnswer,run.archiveNameAnswer,run.postChangedAnswer,run.postClarityAnswer,run.postIntentAnswer,run.postIntentReason
        ]);
      });
    });
    const csv='\ufeff'+[headers,...rows].map(row=>row.map(csvCell).join(',')).join('\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;
    link.download=`wishlist-ut-round2-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  window.UTStore={read,write,setParticipant,getParticipant,getRun,startRun,updateRun,addEvent,finishRun,completeRun,resetParticipant,exportCSV,formatDuration};
})();
