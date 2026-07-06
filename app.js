
const STORE_KEY='chillout-pirates-trips-v1';
const OLD_KEY='dirk60pirates-pwa';
const baseData={giftMode:'Nur-Schenker',giftAmount:100,surplusReduces:'Ja',dirkBoardCash:'Ja',depositPerBoat:750,boats:2,people:[['Bender Giftman','Giftman'],['Ehrenberg Udo','Nur-Schenker'],['Götz Gordon','Mitreisend'],['Herrmann Grische','Mitreisend'],['Huschka Peter','Mitreisend'],['Jürgen','Nur-Schenker'],['Kiesel Armin','Nur-Schenker'],['Kilian Joachim','Mitreisend'],['Kühnle Markus','Mitreisend'],['Kux Ralf','Mitreisend'],['Raisch Marc','Mitreisend'],['Rocky','Nur-Schenker'],['Scheifele David','Mitreisend'],['Spachmann Kai','Nur-Schenker'],['Stockinger Schorsch','Mitreisend'],['Tropschuh Andreas','Mitreisend'],['Tropschuh Ralf','Nur-Schenker'],['Widmann Micha','Mitreisend'],['Widmann Heiko','Nur-Schenker']],costs:[{area:'Fixkosten Boot',name:'Chartermiete',factor:2,amount:2000,calcType:'pauschal'},{area:'Fixkosten Boot',name:'Charter-Nebenkosten / Bettwäsche',factor:2,amount:240,calcType:'pauschal'},{area:'Fixkosten Boot',name:'Betriebskosten / Diesel',factor:2,amount:180,calcType:'pauschal'},{area:'Fixkosten Boot',name:'Marrekritte Gebühr',factor:2,amount:20,calcType:'pauschal'},{area:'Fixkosten Boot',name:'Endreinigung',factor:2,amount:100,calcType:'pauschal'},{area:'Fixkosten Boot',name:'Hafen- und Liegegebühr',factor:2,amount:30,calcType:'pauschal'},{area:'Mannschaftskasse',name:'Essen',factor:1,amount:60,calcType:'period-person'},{area:'Mannschaftskasse',name:'Getränke',factor:1,amount:60,calcType:'period-person'},{area:'Mannschaftskasse',name:'1x Essen gehen',factor:1,amount:50,calcType:'period-person'},{area:'Mannschaftskasse',name:'Unvorhergesehenes',factor:1,amount:30,calcType:'period-person'}]};
function clone(o){return JSON.parse(JSON.stringify(o))}
function uid(){return 'trip-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)}
function nowIso(){return new Date().toISOString()}
function niceDate(s){try{return new Date(s).toLocaleString('de-DE',{dateStyle:'medium',timeStyle:'short'})}catch(e){return '–'}}
function tripPeriod(t){if(!t)return 'kein Zeitraum';const a=t.startDate||'',b=t.endDate||'';if(a&&b)return `${a} bis ${b}`;if(a)return `ab ${a}`;if(b)return `bis ${b}`;return 'kein Zeitraum'}
function tripDays(t){if(!t||!t.startDate||!t.endDate)return 1;const a=new Date(t.startDate+'T00:00:00'),b=new Date(t.endDate+'T00:00:00');if(Number.isNaN(+a)||Number.isNaN(+b)||b<a)return 1;return Math.max(1,Math.round((b-a)/86400000)+1)}
function migrateTrip(t){if(!t)return t;t.notes=t.notes||'';t.pageNotes=t.pageNotes||{};if(t.data&&!t.data.participantInfo)t.data.participantInfo={};t.startDate=t.startDate||'';t.endDate=t.endDate||'';if(t.data&&Array.isArray(t.data.people)){t.data.people.forEach(p=>{if(p[1]==='Dirk'||p[1]==='Gift')p[1]='Giftman';if(typeof p[0]==='string')p[0]=p[0].replaceAll('Dirk','Giftman')})}if(t.data&&Array.isArray(t.data.costs)){t.data.costs.forEach(c=>{if(!c.calcType)c.calcType=c.area==='Mannschaftskasse'?'period-person':'pauschal';if(c.factor===undefined||c.factor===null||c.factor==='')c.factor=1})}return t}
function encodeState(obj){const json=JSON.stringify(obj);try{const bytes=new TextEncoder().encode(json);let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}catch(e){return btoa(unescape(encodeURIComponent(json))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}}
function decodeState(str){const b64=str.replace(/-/g,'+').replace(/_/g,'/')+'==='.slice((str.length+3)%4);const bin=atob(b64);try{const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));return JSON.parse(new TextDecoder().decode(bytes))}catch(e){return JSON.parse(decodeURIComponent(escape(bin)))}}
function newTrip(name,dataObj){const t=nowIso();return{id:uid(),name:name||'Neuer Törn',notes:'',pageNotes:{},startDate:'',endDate:'',createdAt:t,updatedAt:t,data:clone(dataObj||baseData)}}
function loadAppState(){
  try{const params=new URLSearchParams(location.search);const shared=params.get('stand')||params.get('data');if(shared){window.__loadedFromShare=true;const trip=newTrip('Geteilter Törn',decodeState(shared));return{activeTripId:trip.id,trips:[trip]}}}catch(e){}
  try{const s=localStorage.getItem(STORE_KEY);if(s){const st=JSON.parse(s);if(st&&Array.isArray(st.trips)&&st.trips.length){st.trips.forEach(migrateTrip);return st}}}catch(e){}
  try{const old=localStorage.getItem(OLD_KEY);if(old){const trip=newTrip('Friesland 2027',JSON.parse(old));const st={activeTripId:trip.id,trips:[migrateTrip(trip)]};localStorage.setItem(STORE_KEY,JSON.stringify(st));return st}}catch(e){}
  const trip=newTrip('Friesland 2027',baseData);return{activeTripId:trip.id,trips:[migrateTrip(trip)]}
}
let appState=loadAppState();
let data=getActiveTrip()?.data||clone(baseData);
const roles=['Giftman','Mitreisend','Nur-Schenker','Nicht beteiligt'];
function normalizeRole(role){
  const r=String(role||'').trim();
  if(r==='Dirk'||r==='Gift'||r==='Giftman')return 'Giftman';
  if(r==='Mitreisend')return 'Mitreisend';
  if(r==='Nur-Schenker')return 'Nur-Schenker';
  if(r==='Nicht beteiligt')return 'Nicht beteiligt';
  return r;
}
function isGiftmanRole(role){return normalizeRole(role)==='Giftman'}

const eur=n=>(Math.round((n+Number.EPSILON)*100)/100).toLocaleString('de-DE',{style:'currency',currency:'EUR'});
const val=id=>document.getElementById(id).value;
function getActiveTrip(){return appState.trips.find(t=>t.id===appState.activeTripId)||appState.trips[0]}
function setActiveData(){const t=getActiveTrip();if(t){data=t.data}}
function persistState(){localStorage.setItem(STORE_KEY,JSON.stringify(appState))}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)}
function syncInputs(){['giftMode','surplusReduces','dirkBoardCash'].forEach(id=>document.getElementById(id).value=data[id]);['giftAmount','depositPerBoat','boats'].forEach(id=>document.getElementById(id).value=data[id])}
function readInputs(){data.giftMode=val('giftMode');data.surplusReduces=val('surplusReduces');data.dirkBoardCash=val('dirkBoardCash');data.giftAmount=+val('giftAmount')||0;data.depositPerBoat=+val('depositPerBoat')||0;data.boats=+val('boats')||0;(data.costs||[]).forEach(c=>{if(c.area==='Fixkosten Boot')c.factor=data.boats})}
function save(silent=true){try{readInputs();const t=getActiveTrip();if(t){t.data=clone(data);t.updatedAt=nowIso()}persistState();if(!silent)toast('Gespeichert – '+(t?t.name:'Törn'))}catch(e){if(!silent)toast('Speichern im Browser nicht möglich')}}
function updatePageNote(page,value){const t=getActiveTrip();if(!t)return;t.pageNotes=t.pageNotes||{};t.pageNotes[page]=value;t.updatedAt=nowIso();persistState();updateStatus()}
function renderPageNotes(){const t=getActiveTrip();const notes=(t&&t.pageNotes)||{};['trips','overview','people','settings','admin','results'].forEach(k=>{const el=document.getElementById('note-'+k);if(el&&el.value!==(notes[k]||''))el.value=notes[k]||''})}
function renderTripHome(){const box=document.getElementById('tripList');if(!box)return;box.innerHTML='';appState.trips.forEach(migrateTrip);appState.trips.slice().sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt))).forEach(t=>{const c=quickCalc(t.data);const days=tripDays(t);const div=document.createElement('div');div.className='trip-card';div.innerHTML=`<h3>${escapeHtml(t.name)}</h3><div class="trip-meta">Zeitraum: ${escapeHtml(tripPeriod(t))} · ${days} Tag${days===1?'':'e'}<br>Geändert: ${niceDate(t.updatedAt)}<br>Mitreisende: ${c.payingTravelers} · 1. Überweisung: ${eur(c.transferPer)}</div><label class="small">Zeitraum von</label><input type="date" value="${escapeHtml(t.startDate||'')}" onchange="updateTripField('${t.id}','startDate',this.value)"><label class="small">Zeitraum bis</label><input type="date" value="${escapeHtml(t.endDate||'')}" onchange="updateTripField('${t.id}','endDate',this.value)"><label class="small">Bemerkung</label><textarea rows="3" placeholder="Bemerkungen zum Törn, Zeitraum, Treffpunkt ..." onchange="updateTripField('${t.id}','notes',this.value)">${escapeHtml(t.notes||'')}</textarea><div class="trip-actions"><button class="primary" onclick="openTrip('${t.id}')">${t.id===appState.activeTripId?'Geöffnet':'Öffnen'}</button><button class="secondary" onclick="renameTrip('${t.id}')">Umbenennen</button><button class="secondary" onclick="duplicateTrip('${t.id}')">Duplizieren</button><button class="danger" onclick="deleteTrip('${t.id}')">Löschen</button></div>`;box.appendChild(div)})}
function updateTripField(id,field,value){const t=appState.trips.find(x=>x.id===id);if(!t)return;t[field]=value;t.updatedAt=nowIso();persistState();if(id===appState.activeTripId)update();else renderTripHome()}
function createTrip(){const name=prompt('Name für den neuen Törn:','Neuer Törn');if(name===null)return;const trip=newTrip(name.trim()||'Neuer Törn',baseData);appState.trips.push(trip);appState.activeTripId=trip.id;data=trip.data;persistState();syncInputs();update();activateTab(1);toast('Neuer Törn angelegt')}
function openTrip(id){appState.activeTripId=id;setActiveData();persistState();syncInputs();update();activateTab(1)}
function renameTrip(id){const t=appState.trips.find(x=>x.id===id);if(!t)return;const name=prompt('Törn umbenennen:',t.name);if(name===null)return;t.name=name.trim()||t.name;t.updatedAt=nowIso();persistState();renderTripHome();updateStatus()}
function duplicateTrip(id){const t=appState.trips.find(x=>x.id===id);if(!t)return;const copy=newTrip(t.name+' – Kopie',t.data);copy.notes=t.notes||'';copy.pageNotes=clone(t.pageNotes||{});copy.startDate=t.startDate||'';copy.endDate=t.endDate||'';appState.trips.push(copy);appState.activeTripId=copy.id;data=copy.data;persistState();syncInputs();update();toast('Törn dupliziert')}
function deleteTrip(id){const t=appState.trips.find(x=>x.id===id);if(!t)return;if(appState.trips.length===1){toast('Mindestens ein Törn bleibt bestehen');return}if(!confirm(`Törn „${t.name}“ wirklich löschen?`))return;appState.trips=appState.trips.filter(x=>x.id!==id);if(appState.activeTripId===id)appState.activeTripId=appState.trips[0].id;setActiveData();persistState();syncInputs();update();toast('Törn gelöscht')}
function quickCalc(d){const old=data;data=d;const c=calc(false);data=old;return c}
function calcTypeLabel(type){return type==='period-person'?'Zeitraum × Personen':type==='once-person'?'Einmalig × Personen':'Pauschal'}
function costFactorInfo(cost,c,days){
  const amount=+cost.amount||0,qty=Math.max(0,+cost.factor||0),area=cost.area||'Mannschaftskasse',type=cost.calcType||(area==='Mannschaftskasse'?'period-person':'pauschal');
  if(type==='period-person')return{factor:qty*c.boardPersons*days,total:qty*c.boardPersons*days*amount,label:`${qty} × ${c.boardPersons} Pers. × ${days} Tag${days===1?'':'e'} = ${qty*c.boardPersons*days}`,title:'Einzelbetrag × Anzahl × Personen × Zeitraum-Tage'};
  if(type==='once-person')return{factor:qty*c.boardPersons,total:qty*c.boardPersons*amount,label:`${qty} × ${c.boardPersons} Pers. = ${qty*c.boardPersons}`,title:'Einzelbetrag × Anzahl × Personen, ohne Tagesfaktor'};
  return{factor:qty,total:qty*amount,label:`${qty}× pauschal`,title:'Einzelbetrag × Anzahl, ohne Personenmultiplikation'};
}
function calc(doRead=true){
  if(doRead)readInputs();

  const activeTrip=getActiveTrip();
  const dayFactor=tripDays(activeTrip);

  const people=(data.people||[]).filter(p=>p&&p[0]).map(p=>[p[0],normalizeRole(p[1])]);
  const payingTravelers=people.filter(p=>p[1]==='Mitreisend').length;
  const hasGiftman=people.some(p=>p[1]==='Giftman');
  const aboard=payingTravelers+(hasGiftman?1:0);
  const boardPersons=data.dirkBoardCash==='Ja'?aboard:payingTravelers;
  const onlyGift=people.filter(p=>p[1]==='Nur-Schenker').length;
  const none=people.filter(p=>p[1]==='Nicht beteiligt').length;
  const allGift=people.filter(p=>p[1]==='Mitreisend'||p[1]==='Nur-Schenker').length;
  const eligibleGift=data.giftMode==='Nur-Schenker'?onlyGift:allGift;

  let fixedTotal=0,boardTotal=0;
  (data.costs||[]).forEach(cost=>{
    const info=costFactorInfo(cost,{boardPersons},dayFactor);
    if(cost.area==='Fixkosten Boot')fixedTotal+=info.total;
    else boardTotal+=info.total;
  });

  const totalNoDeposit=fixedTotal+boardTotal;
  const depositTotal=(+data.depositPerBoat||0)*(+data.boats||0);
  const fixedPer=aboard?fixedTotal/aboard:0;
  const boardPer=boardPersons?boardTotal/boardPersons:0;

  // Giftman zahlt selbst nichts. Sein rechnerischer Anteil wird durch Geschenkzahlungen
  // und den verbleibenden Rest durch Mitreisende getragen.
  const dirkShare=hasGiftman?fixedPer+(data.dirkBoardCash==='Ja'?boardPer:0):0;
  const giftPayments=eligibleGift*(+data.giftAmount||0);
  const restGiftman=Math.max(0,dirkShare-giftPayments);
  const rawSurplus=Math.max(0,giftPayments-dirkShare);
  const surplus=data.surplusReduces==='Ja'?rawSurplus:0;
  const retainedSurplus=data.surplusReduces==='Nein'?rawSurplus:0;
  const surplusPer=payingTravelers?surplus/payingTravelers:0;

  const tripPer=payingTravelers?fixedPer+boardPer+restGiftman/payingTravelers-surplusPer:0;
  const depositPer=payingTravelers?depositTotal/payingTravelers:0;
  const transferPer=tripPer+depositPer;

  const giftmanBoardPart=data.dirkBoardCash==='Ja'?boardPer:0;
  const giftmanBoardRatio=dirkShare?giftmanBoardPart/dirkShare:0;
  const giftmanCharterRatio=dirkShare?fixedPer/dirkShare:0;
  const restGiftmanBoard=restGiftman*giftmanBoardRatio;
  const restGiftmanCharter=restGiftman*giftmanCharterRatio;
  const surplusBoard=surplus*giftmanBoardRatio;
  const surplusCharter=surplus*giftmanCharterRatio;

  const travelerCharterDue=payingTravelers?fixedPer+depositPer+restGiftmanCharter/payingTravelers-surplusCharter/payingTravelers:0;
  const travelerBoardDue=payingTravelers?boardPer+restGiftmanBoard/payingTravelers-surplusBoard/payingTravelers:0;

  const rows=people.map(p=>{
    const role=p[1];
    const isGiftman=role==='Giftman';
    const gift=(isGiftman||role==='Nicht beteiligt')?0:(data.giftMode==='Alle Schenker'?(role==='Mitreisend'||role==='Nur-Schenker'?(+data.giftAmount||0):0):(role==='Nur-Schenker'?(+data.giftAmount||0):0));
    const travel=role==='Mitreisend'?tripPer:0;
    const deposit=role==='Mitreisend'?depositPer:0;
    const charterDue=role==='Mitreisend'?travelerCharterDue:0;
    const boardDue=role==='Mitreisend'?travelerBoardDue:0;
    const giftDue=role==='Nur-Schenker'?gift:0;
    const adminDue=charterDue+boardDue+giftDue;
    const type=isGiftman?'Giftman':role==='Mitreisend'?'Mitreisender Zahler':role==='Nur-Schenker'?'Nur-Schenker':'Nicht beteiligt';
    const hint=isGiftman?'zahlt nichts; Anteil wird von Mitreisenden/Schenkern gedeckt':role==='Mitreisend'?'Charter/Kaution + Mannschaftskasse':role==='Nur-Schenker'?'nur Geschenkbeitrag':'nicht in Kalkulation';
    return{name:p[0],role,type,gift,travel,deposit,transfer:gift+travel+deposit,charterDue,boardDue,giftDue,adminDue,hint}
  });

  const sumNoDeposit=rows.reduce((s,r)=>s+r.gift+r.travel,0);
  const sumDeposit=rows.reduce((s,r)=>s+r.deposit,0);
  return{payingTravelers,onlyGift,none,aboard,boardPersons,totalNoDeposit,depositTotal,fixedTotal,boardTotal,fixedPer,boardPer,dirkShare,giftPayments,restGiftman,rawSurplus,surplus,retainedSurplus,tripPer,depositPer,transferPer,sumNoDeposit,sumDeposit,diffNoDeposit:sumNoDeposit-totalNoDeposit-retainedSurplus,diffDeposit:sumDeposit-depositTotal,rows}
}

function participantKey(name){return String(name||'').trim()||'__unbenannt__'}
function ensureParticipantInfo(){
  if(!data.participantInfo||typeof data.participantInfo!=='object'||Array.isArray(data.participantInfo))data.participantInfo={};
  (data.people||[]).forEach(p=>{
    const key=participantKey(p[0]);
    if(!data.participantInfo[key])data.participantInfo[key]={email:'',paypal:'',requestSent:false,requestDate:'',moneyReceived:false,receivedDate:'',receivedAmount:0,reminderDate:'',note:''};
    const info=data.participantInfo[key];
    ['email','paypal','requestDate','receivedDate','reminderDate','note'].forEach(k=>{if(info[k]===undefined||info[k]===null)info[k]=''});
    if(info.requestSent===undefined)info.requestSent=false;
    if(info.moneyReceived===undefined)info.moneyReceived=false;
    if(info.receivedAmount===undefined||info.receivedAmount===null||info.receivedAmount==='')info.receivedAmount=0;
    ['charter','board','gift'].forEach(prefix=>{
      if(info[prefix+'RequestSent']===undefined)info[prefix+'RequestSent']=prefix==='gift'?!!info.requestSent:false;
      if(info[prefix+'RequestDate']===undefined)info[prefix+'RequestDate']=prefix==='gift'?(info.requestDate||''):'';
      if(info[prefix+'MoneyReceived']===undefined)info[prefix+'MoneyReceived']=prefix==='gift'?!!info.moneyReceived:false;
      if(info[prefix+'ReceivedDate']===undefined)info[prefix+'ReceivedDate']=prefix==='gift'?(info.receivedDate||''):'';
      if(info[prefix+'ReceivedAmount']===undefined||info[prefix+'ReceivedAmount']===null||info[prefix+'ReceivedAmount']==='')info[prefix+'ReceivedAmount']=prefix==='gift'?(+info.receivedAmount||0):0;
      if(info[prefix+'Note']===undefined||info[prefix+'Note']===null)info[prefix+'Note']='';
    });
  });
}
function setParticipantInfo(name,field,value){
  ensureParticipantInfo();
  const key=participantKey(name);
  if(!data.participantInfo[key])data.participantInfo[key]={email:'',paypal:'',requestSent:false,requestDate:'',moneyReceived:false,receivedDate:'',receivedAmount:0,reminderDate:'',note:''};
  data.participantInfo[key][field]=value;
  update();
}
function renderParticipantManagement(c){
  const body=document.getElementById('adminBody');if(!body)return;
  ensureParticipantInfo();
  body.innerHTML='';
  const roleOrder=['Giftman','Mitreisend','Nur-Schenker','Nicht beteiligt'];
  const rowByName={};
  (c.rows||[]).forEach(r=>rowByName[r.name]=r);
  const people=(data.people||[]).filter(p=>p[0]).slice().sort((a,b)=>{
    const ra=roleOrder.indexOf(normalizeRole(a[1])); const rb=roleOrder.indexOf(normalizeRole(b[1]));
    return (ra<0?99:ra)-(rb<0?99:rb) || String(a[0]).localeCompare(String(b[0]),'de');
  });
  const paymentRow=(name,role,area,prefix,due,extraClass='',showName=true)=>{
    const info=data.participantInfo[participantKey(name)]||{};
    const received=+info[prefix+'ReceivedAmount']||0;
    const open=Math.max(0,(+due||0)-received);
    const tr=document.createElement('tr');
    tr.className=roleClass(role)+' '+extraClass;
    tr.innerHTML=`<td>${showName?`<b>${escapeHtml(name)}</b>`:''}</td><td>${escapeHtml(role)}</td><td><b>${escapeHtml(area)}</b></td><td><input type="email" value="${escapeHtml(info.email||'')}" placeholder="name@mail.de" onchange="setParticipantInfo('${escapeJs(name)}','email',this.value)"></td><td><input type="text" value="${escapeHtml(info.paypal||'')}" placeholder="PayPal / IBAN" onchange="setParticipantInfo('${escapeJs(name)}','paypal',this.value)"></td><td class="money">${eur(due)}</td><td class="center"><input type="checkbox" ${info[prefix+'RequestSent']?'checked':''} onchange="setParticipantInfo('${escapeJs(name)}','${prefix}RequestSent',this.checked)"></td><td><input type="date" value="${escapeHtml(info[prefix+'RequestDate']||'')}" onchange="setParticipantInfo('${escapeJs(name)}','${prefix}RequestDate',this.value)"></td><td class="center"><input type="checkbox" ${info[prefix+'MoneyReceived']?'checked':''} onchange="setParticipantInfo('${escapeJs(name)}','${prefix}MoneyReceived',this.checked)"></td><td><input type="date" value="${escapeHtml(info[prefix+'ReceivedDate']||'')}" onchange="setParticipantInfo('${escapeJs(name)}','${prefix}ReceivedDate',this.value)"></td><td><input type="number" min="0" step="0.01" value="${received}" onchange="setParticipantInfo('${escapeJs(name)}','${prefix}ReceivedAmount',+this.value||0)"></td><td class="money"><b>${eur(open)}</b></td><td><input type="text" value="${escapeHtml(info[prefix+'Note']||info.note||'')}" placeholder="Notiz / Erinnerung" onchange="setParticipantInfo('${escapeJs(name)}','${prefix}Note',this.value)"></td>`;
    body.appendChild(tr);
  };
  let currentRole=null;
  people.forEach(p=>{
    const name=p[0], role=normalizeRole(p[1]);
    if(role!==currentRole){
      currentRole=role;
      const sep=document.createElement('tr');
      sep.className='role-separator';
      sep.innerHTML=`<td colspan="13">${escapeHtml(role==='Mitreisend'?'Mitreisende':role==='Giftman'?'Giftman':role==='Nur-Schenker'?'Nur-Schenker':'Nicht beteiligt')}</td>`;
      body.appendChild(sep);
    }
    const calcRow=rowByName[name]||{charterDue:0,boardDue:0,giftDue:0};
    if(role==='Mitreisend'||role==='Giftman'){
      const charterAmount=role==='Giftman'?0:(+calcRow.charterDue||0);
      const boardAmount=role==='Giftman'?0:(+calcRow.boardDue||0);
      paymentRow(name,role,'Bootscharter / Kaution','charter',charterAmount,'person-start',true);
      paymentRow(name,role,'Mannschaftskasse / sonstige Bereiche','board',boardAmount,'sub-payment-row person-end',false);
    }else if(role==='Nur-Schenker'){
      paymentRow(name,role,'Geschenkbeitrag Giftman','gift',+calcRow.giftDue||0);
    }else{
      paymentRow(name,role,'Nicht beteiligt','gift',0);
    }
  });
}
function escapeJs(s){return String(s??'').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,'')}

function roleClass(role){role=normalizeRole(role);return 'role-'+(role==='Giftman'?'dirk':role==='Mitreisend'?'mit':role==='Nur-Schenker'?'gift':'none')}
function renderPeople(){const body=document.getElementById('peopleBody'),prev=document.getElementById('peoplePreview');body.innerHTML='';prev.innerHTML='';data.people.forEach((p,i)=>{const opts=roles.map(r=>`<option ${p[1]===r?'selected':''}>${r}</option>`).join('');const tr=document.createElement('tr');tr.className=roleClass(p[1]);tr.innerHTML=`<td><input type="text" value="${escapeHtml(p[0])}" onchange="data.people[${i}][0]=this.value; update()"></td><td><select onchange="data.people[${i}][1]=this.value; update()">${opts}</select></td><td><button class="danger" onclick="data.people.splice(${i},1); update()">Entfernen</button></td>`;body.appendChild(tr);const pr=document.createElement('tr');pr.className=roleClass(p[1]);pr.innerHTML=`<td>${escapeHtml(p[0])}</td><td>${p[1]}</td>`;prev.appendChild(pr)})}
function costAreas(){
  const names=['Fixkosten Boot','Mannschaftskasse'];
  (data.costs||[]).forEach(x=>{const a=(x.area||'').trim();if(a&&!names.includes(a))names.push(a)});
  return names;
}
function changeAmount(i,delta){
  const current=+data.costs[i].amount||0;
  data.costs[i].amount=Math.max(0,current+delta);
  update();
}
function renderCostOverview(c){
  const box=document.getElementById('costOverview');if(!box)return;
  const activeTrip=getActiveTrip();const days=tripDays(activeTrip);
  const sums={};
  (data.costs||[]).forEach(cost=>{const info=costFactorInfo(cost,c,days);const area=cost.area||'Sonstige';sums[area]=(sums[area]||0)+info.total});
  const parts=Object.keys(sums).map(area=>`<div class="cost-sum"><span>${escapeHtml(area)}</span><b>${eur(sums[area])}</b></div>`).join('');
  box.innerHTML=parts+`<div class="cost-sum"><span>Gesamtsumme</span><b>${eur(c.totalNoDeposit)}</b></div>`;
}
function renderCosts(c){const body=document.getElementById('costBody');body.innerHTML='';const activeTrip=getActiveTrip();const days=tripDays(activeTrip);const period=tripPeriod(activeTrip);const areas=costAreas();data.costs.forEach((x,i)=>{if(!x.calcType)x.calcType=x.area==='Mannschaftskasse'?'period-person':'pauschal';if(x.factor===undefined||x.factor===null||x.factor==='')x.factor=1;const info=costFactorInfo(x,c,days);const periodCell=x.calcType==='period-person'?escapeHtml(period):'–';const typeOpts=[['period-person','Zeitraum × Personen'],['once-person','Einmalig × Personen'],['pauschal','Pauschal']].map(([v,l])=>`<option value="${v}" ${x.calcType===v?'selected':''}>${l}</option>`).join('');const areaOpts=areas.map(a=>`<option value="${escapeHtml(a)}" ${x.area===a?'selected':''}>${escapeHtml(a)}</option>`).join('');const tr=document.createElement('tr');tr.innerHTML=`<td><select onchange="data.costs[${i}].area=this.value;if(!data.costs[${i}].calcType)data.costs[${i}].calcType=this.value==='Mannschaftskasse'?'period-person':'pauschal'; update()">${areaOpts}</select></td><td class="small">${periodCell}</td><td><div class="amount-stepper"><button type="button" class="secondary" onclick="changeAmount(${i},-5)">−</button><input type="number" value="${x.amount}" step="0.01" onchange="data.costs[${i}].amount=+this.value||0; update()"><button type="button" class="secondary" onclick="changeAmount(${i},5)">+</button></div></td><td><input type="number" value="${x.factor}" min="0" step="1" onchange="data.costs[${i}].factor=+this.value||0; update()"></td><td><input type="text" value="${escapeHtml(x.name)}" onchange="data.costs[${i}].name=this.value; update()"></td><td><select onchange="data.costs[${i}].calcType=this.value; update()">${typeOpts}</select></td><td><input type="text" value="${escapeHtml(info.label)}" disabled title="${escapeHtml(info.title)}"></td><td class="money">${eur(info.total)}</td><td><button class="danger" onclick="data.costs.splice(${i},1); update()">Entfernen</button></td>`;body.appendChild(tr)})}
function renderResults(c){document.getElementById('kpiTrip').textContent=eur(c.tripPer);document.getElementById('kpiTransfer').textContent=eur(c.transferPer);document.getElementById('kpiGift').textContent=eur(data.giftAmount);document.getElementById('kpiGiftman').textContent=eur(c.dirkShare);document.getElementById('countMit').textContent=c.payingTravelers;document.getElementById('countAboard').textContent=c.aboard;document.getElementById('countGift').textContent=c.onlyGift;document.getElementById('countNone').textContent=c.none;const pc=document.getElementById('peopleControlCounts');if(pc)pc.innerHTML=`<div class="pill"><b>${c.payingTravelers}</b>Mitreisende</div><div class="pill"><b>${c.onlyGift}</b>Schenker</div><div class="pill"><b>${c.aboard}</b>An Bord inkl. Giftman</div><div class="pill"><b>${c.none}</b>Nicht beteiligt</div>`;document.getElementById('checks').innerHTML=`<div class="check"><span>Gesamtkosten ohne Kaution</span><b>${eur(c.totalNoDeposit)}</b></div><div class="check"><span>Giftmans rechnerischer Anteil</span><b>${eur(c.dirkShare)}</b></div><div class="check"><span>Einbehaltener Überschuss/Puffer</span><b>${eur(c.retainedSurplus)}</b></div><div class="check"><span>Kontrollabweichung ohne Kaution</span><b class="${Math.abs(c.diffNoDeposit)<0.01?'ok':'bad'}">${eur(c.diffNoDeposit)}</b></div><div class="check"><span>Differenz Kaution</span><b class="${Math.abs(c.diffDeposit)<0.01?'ok':'bad'}">${eur(c.diffDeposit)}</b></div>`;const body=document.getElementById('resultBody');body.innerHTML='';c.rows.forEach(r=>{const tr=document.createElement('tr');tr.className=roleClass(r.role);tr.innerHTML=`<td>${escapeHtml(r.name)}</td><td>${r.role}</td><td>${r.type}</td><td>${eur(r.gift)}</td><td>${eur(r.travel)}</td><td>${eur(r.deposit)}</td><td><b>${eur(r.transfer)}</b></td><td>${r.hint}</td>`;body.appendChild(tr)})}
function update(){readInputs();const t=getActiveTrip();if(t)t.data=clone(data);renderPeople();const c=calc();renderCostOverview(c);renderCosts(c);renderResults(c);renderParticipantManagement(c);renderTripHome();renderPageNotes();updateStatus()}
function updateStatus(){const t=getActiveTrip();const saved=t?niceDate(t.updatedAt):'nicht gespeichert';const name=t?escapeHtml(t.name):'Kein Törn';document.getElementById('activeTripBadge').innerHTML=`Aktiver Törn: <b>${name}</b> · Zeitraum: ${escapeHtml(tripPeriod(t))} · letzter gespeicherter Stand: ${saved}`;const sd=document.getElementById('standDate');if(sd)sd.textContent='Stand: '+saved;document.querySelectorAll('.status').forEach(el=>{if(el.id!=='standDate')el.textContent='Letzte Speicherung: '+saved})}
function manualSave(){save(false);updateStatus();renderTripHome()}
function addPerson(){data.people.push(['Neue Person','Nicht beteiligt']);update()}
function addCost(area){data.costs.push({area,name:'Neue Position',factor:1,amount:0,calcType:area==='Mannschaftskasse'?'period-person':'pauschal'});update()}
function addCategory(){const name=prompt('Name der neuen Kategorie:','Sonstige Kosten');if(name===null)return;const area=name.trim();if(!area)return;data.costs.push({area,name:'Neue Position',factor:1,amount:0,calcType:'pauschal'});update();toast('Kategorie hinzugefügt: '+area)}
function resetData(){if(confirm('Aktiven Törn auf die geprüften Ursprungsdaten zurücksetzen?')){data=clone(baseData);const t=getActiveTrip();if(t){t.data=clone(data);t.updatedAt=nowIso()}persistState();syncInputs();update();toast('Ursprungsdaten geladen')}}
function activateTab(i){const tabs=document.querySelectorAll('.tab');showTab(['trips','overview','people','settings','admin','results'][i],tabs[i])}
function showTab(id,btn){document.querySelectorAll('[id^="tab-"]').forEach(e=>e.classList.add('hide'));document.getElementById('tab-'+id).classList.remove('hide');if(btn){document.querySelectorAll('.tab').forEach(e=>e.classList.remove('active'));btn.classList.add('active')}window.scrollTo({top:0,behavior:'smooth'})}
function summaryText(){const c=calc();const t=getActiveTrip();return `Chillout Pirates – ${t?t.name:'Kostenaufteilung'}\nZeitraum: ${tripPeriod(t)}\nTage Mannschaftskasse: ${tripDays(t)}${t&&t.notes?`\nBemerkung: ${t.notes}`:''}\n\nMitreisende zahlend: ${c.payingTravelers}\nAn Bord inkl. Giftman: ${c.aboard}\nNur-Schenker: ${c.onlyGift}\nGiftman zahlt: 0,00 €\nGiftmans Anteil: ${eur(c.dirkShare)}\nMitreisender ohne Kaution: ${eur(c.tripPer)}\n1. Überweisung inkl. Kaution: ${eur(c.transferPer)}\nNur-Schenker: ${eur(data.giftAmount)}\n\nEinbehaltener Überschuss/Puffer: ${eur(c.retainedSurplus)}\nKontrollabweichung ohne Kaution: ${eur(c.diffNoDeposit)}\nKontrolle Kaution: ${eur(c.diffDeposit)}`}
function makeShareUrl(){readInputs();const u=new URL(location.href);u.searchParams.set('stand',encodeState(data));return u.toString()}
async function shareSummary(){const url=makeShareUrl();const text=summaryText()+`\n\nAktueller Stand als Link:\n${url}`;try{if(navigator.share){await navigator.share({title:'Chillout Pirates Kostenaufteilung',text,url});toast('Teilen geöffnet')}else{await navigator.clipboard.writeText(text);toast('Link + Übersicht kopiert')}}catch(e){try{await navigator.clipboard.writeText(text);toast('Link + Übersicht kopiert')}catch(_){prompt('Diesen Link kopieren:',url)}}}
function downloadCsv(){const c=calc();const t=getActiveTrip();const safe=(t?t.name:'kosten').replace(/[^\wäöüÄÖÜß-]+/gi,'-');const lines=[['Name','Rolle','Typ','Geschenk','Reise ohne Kaution','Kaution','1. Überweisung','Hinweis']];c.rows.forEach(r=>lines.push([r.name,r.role,r.type,r.gift.toFixed(2),r.travel.toFixed(2),r.deposit.toFixed(2),r.transfer.toFixed(2),r.hint]));const csv=lines.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(';')).join('\n');downloadBlob(csv,`${safe}-kostenaufteilung.csv`,'text/csv;charset=utf-8')}
function exportBackup(){manualSave();downloadBlob(JSON.stringify(appState,null,2),'chillout-pirates-toerns-backup.json','application/json');toast('Backup exportiert')}
function importBackup(){const input=document.createElement('input');input.type='file';input.accept='application/json';input.onchange=()=>{const file=input.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const obj=JSON.parse(reader.result);if(obj&&Array.isArray(obj.trips)){appState=obj;appState.trips.forEach(migrateTrip)}else if(obj&&obj.people&&obj.costs){const trip=newTrip('Importierter Törn',obj);appState.trips.push(migrateTrip(trip));appState.activeTripId=trip.id}else throw new Error('Ungültiges Backup');setActiveData();persistState();syncInputs();update();toast('Backup importiert')}catch(e){toast('Backup konnte nicht gelesen werden')}};reader.readAsText(file)};input.click()}
function downloadBlob(content,name,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function escapeHtml(s){return String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
['giftMode','surplusReduces','dirkBoardCash','giftAmount','depositPerBoat','boats'].forEach(id=>document.getElementById(id).addEventListener('input',update));
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
syncInputs();update();showTab('trips',document.querySelector('.tab'));if(window.__loadedFromShare){toast('Geteilter Stand geladen – Speichern drücken, um ihn auf diesem Gerät zu sichern')}
