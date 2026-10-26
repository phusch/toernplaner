/* Huschel App Speicher – Törnplaner V1.5.8. Ausschließlich additive Sicherung.
   KEIN automatischer Datenimport, KEINE Änderung der Kalkulation/alten Supabase-Funktionen. */
(() => {
  'use strict';
  const B = window.HuschelToernBridge;
  const PROJECT_URL = 'https://qijordwpbwwbizfcslrv.supabase.co';
  const APP_ID = 'toernplaner';
  const USER_ID = '9be7d1bc-4d69-4cb8-bb42-cb2d3c705f75';
  const KEY_PUB = 'huschel-toernplaner-publishable-v1';
  const KEY_EMAIL = 'huschel-toernplaner-email-v1';
  const KEY_LOCAL = 'huschel-toernplaner-extra-snapshot-v1';
  const $ = id => document.getElementById(id);
  const panel = $('hsToernPanel');
  if (!B || !panel || !window.supabase?.createClient) {
    console.warn('Huschel Speicher: Datenschnittstelle oder Supabase-Bibliothek fehlt.');
    return;
  }
  let client = null, logged = false, busy = false, sha = undefined;
  let revision = 0, savedAt = null, remote = null, preview = null, previewSource = '';
  let oldScroll = 0;
  const originalOverflow = () => document.body.style.overflow;
  let previousOverflow = '';
  const date = v => { try { return v ? new Date(v).toLocaleString('de-DE') : '–'; } catch { return '–'; } };
  const lamp = (msg, mode='warn') => {
    const el = $('hsLamp');el.className = 'hst-lamp hst-' + mode;
    el.textContent = (mode === 'ok' ? '🟢 ' : mode === 'error' ? '🔴 ' : '🟡 ') + msg;
  };
  const log = msg => $('hsMessage').textContent = msg;
  const meta = () => $('hsMeta').textContent = 'GitHub-Revision: ' + (sha === undefined ? 'nicht geprüft' : revision) + ' · letzte Speicherung: ' + date(savedAt);
  const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
  function valid(data) {
    return !!(data && !Array.isArray(data) && Array.isArray(data.trips) && data.trips.length > 0 &&
      data.trips.length <= 200 && data.trips.every(t => t && typeof t.id === 'string' &&
        t.data && Array.isArray(t.data.people) && Array.isArray(t.data.costs)));
  }
  function getSnapshot() {
    if (B.isDirty()) throw Error('Es gibt möglicherweise ungespeicherte Eingaben. Bitte zuerst im Törnplaner auf „Speichern“ klicken, dann erneut versuchen.');
    const data = B.readSnapshot();
    if (!valid(data)) throw Error('Der lokale Törn-Datenstand ist ungültig. Kein Speichervorgang durchgeführt.');
    return data;
  }
  function setAuth(ok, email='') {
    logged = !!ok;
    $('hsAuthStatus').classList.toggle('is-in', !!ok);
    $('hsAuthStatus').textContent = ok ? '🟢 Angemeldet · Supabase-Zugang aktiv' : '⚪ Nicht angemeldet';
    $('hsLoginArea').hidden = !!ok;
    $('hsLogout').hidden = !ok;
    $('hsAccountLabel').textContent = ok ? 'Angemeldet als ' + email + ' · getrennt von der bisherigen Törnplaner-Cloud' : 'Huschel App Speicher · getrennt vom bisherigen Törnplaner-Supabase';
  }
  async function ensureClient() {
    if (client) return client;
    const key = $('hsKey').value.trim();
    if (!key.startsWith('sb_publishable_') && !key.startsWith('eyJ')) throw Error('Bitte den Publishable/anon Key des Projekts huschel-speicher-pilot eingeben.');
    client = window.supabase.createClient(PROJECT_URL, key, {
      auth: { persistSession:true, autoRefreshToken:true, detectSessionInUrl:false,
        storageKey:'huschel-toernplaner-auth-v1' }
    });
    return client;
  }
  async function user() {
    const c = await ensureClient();
    const { data, error } = await c.auth.getUser();
    if (error || !data?.user || data.user.id !== USER_ID) {
      setAuth(false);
      throw Error('Bitte zuerst mit dem freigegebenen Huschel-Supabase-Konto anmelden.');
    }
    setAuth(true, data.user.email || '');
    return data.user;
  }
  async function invoke(payload) {
    const c = await ensureClient();
    await user();
    const {data,error} = await c.functions.invoke('github-app-storage',{body:payload});
    if (error) {
      let detail = error.message || String(error);
      if (error.context instanceof Response) {
        const response = error.context;
        try { const obj = await response.clone().json();detail = obj?.error || obj?.message || detail; }
        catch { detail += ' (HTTP ' + response.status + ')'; }
        if (response.status === 409) detail = 'Versionskonflikt: ' + detail;
      }
      throw Error(detail);
    }
    if (!data?.ok) throw Error(data?.error || 'Keine gültige Antwort der Speicherfunktion.');
    return data;
  }
  function setRemote(response) {
    sha = response.sha ?? null;
    revision = Number(response.revision || 0);
    savedAt = response.savedAt || null;
    remote = response.exists ? response.data : null;
    meta();
  }
  async function getRemote() {
    const r = await invoke({action:'load',app:APP_ID});
    if (r.exists && !valid(r.data)) throw Error('GitHub enthält ein unerwartetes Törn-Datenformat. Nichts importiert oder überschrieben.');
    setRemote(r);
    return r;
  }
  const doTask = async (action, fn) => {
    if (busy) return;
    busy = true;
    panel.querySelectorAll('button').forEach(b=>b.disabled=true);
    try { await fn(); }
    catch (e) {
      const message = String(e?.message || e);
      lamp(action === 'GitHub Speichern' ? 'GitHub-Speicherung nicht bestätigt' : action + ' fehlgeschlagen','error');
      log(action + ': ' + message + (action === 'GitHub Speichern' ? '\nBitte vor erneutem Speichern den GitHub-Stand prüfen; eine unterbrochene Antwort beweist nicht, dass nichts gespeichert wurde.' : '\nDer laufende Törnplaner wurde nicht durch diese Aktion ersetzt.'));
    } finally {
      busy = false;panel.querySelectorAll('button').forEach(b=>b.disabled=false);
    }
  };
  function showPreview(data, source) {
    if (!valid(data)) throw Error('Ungültiger Sicherungsstand. Keine Törns übernommen.');
    preview = JSON.parse(JSON.stringify(data));
    previewSource = source;
    $('hsPreviewTitle').textContent = 'Vorschau: ' + source + ' · ' + data.trips.length + ' Törn(e)';
    const box=$('hsTripChoices');box.replaceChildren();
    data.trips.forEach((t,i)=>{
      const label=document.createElement('label');label.className='hst-choice';
      const input=document.createElement('input');input.type='checkbox';input.value=String(i);
      const text=document.createElement('div');const bold=document.createElement('strong');bold.textContent=t.name || '(ohne Namen)';
      const info=document.createElement('span');info.textContent=(t.startDate || '?') + ' – ' + (t.endDate || '?') + ' · ' + t.data.people.length + ' Teilnehmer · zuletzt: ' + date(t.updatedAt);
      text.append(bold,info);label.append(input,text);box.append(label);
    });
    $('hsBackupConfirm').checked = false;
    $('hsPreview').hidden=false;
    const fresh = typeof B.isFreshStorage === 'function' && B.isFreshStorage();
    $('hsRestoreFresh').hidden = !fresh;
    $('hsFreshHint').textContent = fresh
      ? 'Neues, noch leeres Gerät: Du kannst die vollständige Sicherung mit allen Original-Törn-IDs und dem aktiven Törn übernehmen. Erst nach ausdrücklicher Bestätigung; kein automatischer Import.'
      : 'Dein Gerät enthält bereits einen Datenstand. Eine vollständige Wiederherstellung ist hier gesperrt, um alle bestehenden Törns und Zahlungen zu schützen. Du kannst einzelne Törns als Kopien hinzufügen.';
    lamp('Sicherung geladen: nur Vorschau – vorhandene Daten unverändert','warn');
    log('Wähle bei Bedarf einzelne Törns aus. Übernommen wird ausschließlich als zusätzliche Sicherungskopie. Die bisherigen Törns und die frühere Supabase-Cloud bleiben unverändert.');
    $('hsPreview').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function hidePreview() { preview=null;previewSource='';$('hsPreview').hidden=true;$('hsBackupConfirm').checked=false; }
  $('hsToernOpen').addEventListener('click',()=>{
    oldScroll = window.scrollY;previousOverflow=originalOverflow();panel.hidden=false;document.body.style.overflow='hidden';$('hsBack').focus();
    void doTask('Anmeldestatus', async()=>{
      try { await user(); }
      catch { setAuth(false); log('Bitte anmelden. Die vorhandenen Törn-Daten wurden nicht verändert.'); }
    });
  });
  $('hsBack').addEventListener('click',()=>{panel.hidden=true;hidePreview();document.body.style.overflow=previousOverflow;window.scrollTo(0,oldScroll);$('hsToernOpen').focus();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden&& !busy) $('hsBack').click();});
  $('hsKey').value=localStorage.getItem(KEY_PUB)||'';
  $('hsEmail').value=localStorage.getItem(KEY_EMAIL)||'huschka@eventdesign.com';
  $('hsLogin').addEventListener('click',()=>doTask('Anmeldung',async()=>{
    const c=await ensureClient();const email=$('hsEmail').value.trim();
    const {data,error}=await c.auth.signInWithPassword({email,password:$('hsPassword').value});
    $('hsPassword').value='';
    if(error) throw error;
    if(!data.user || data.user.id !== USER_ID){await c.auth.signOut();throw Error('Dieses Benutzerkonto ist nicht für Huschel App Speicher freigegeben.');}
    localStorage.setItem(KEY_PUB,$('hsKey').value.trim());localStorage.setItem(KEY_EMAIL,email);
    setAuth(true,email);lamp('Angemeldet · GitHub-Speicherstand noch nicht geprüft','warn');
    log('Anmeldung erfolgreich. Deine bisherige Törnplaner-Cloud und alle Daten bleiben unverändert.');
  }));
  $('hsLogout').addEventListener('click',()=>doTask('Abmelden',async()=>{if(client){const {error}=await client.auth.signOut();if(error)throw error;}setAuth(false);lamp('Abgemeldet','warn');log('Huschel-Sitzung beendet. Vorhandene Törns unverändert.');}));
  $('hsCloudLoad').addEventListener('click',()=>doTask('GitHub Laden',async()=>{
    const result=await getRemote();
    if(!result.exists){hidePreview();lamp('Für den Törnplaner noch kein GitHub-Speicherstand vorhanden','warn');log('Es wurde nichts geladen oder verändert. Du kannst die aktuellen Törns bei Bedarf auf GitHub sichern.');return;}
    showPreview(result.data,'GitHub (Revision '+revision+', '+date(savedAt)+')');
  }));
  $('hsCloudSave').addEventListener('click',()=>doTask('GitHub Speichern',async()=>{
    const snapshot=getSnapshot();
    const response=await getRemote(); // vor jedem PUT frisch prüfen, keine Übernahme in die App
    if(response.exists && same(snapshot,response.data)){
      lamp('GitHub ist bereits auf diesem Datenstand','ok');log('Keine neue GitHub-Revision nötig. Bestehende Törns unverändert.');return;
    }
    const size=new TextEncoder().encode(JSON.stringify(snapshot)).byteLength;
    const msg=response.exists
      ? 'Auf GitHub liegt Revision '+revision+' vom '+date(savedAt)+'.\n\nDu möchtest sie durch den aktuellen lokalen Stand mit '+snapshot.trips.length+' Törns ('+Math.round(size/1024)+' KB) ersetzen.\n\nDas ändert NICHT die bisherigen Törns oder die andere Supabase-Cloud.\n\nVorher bitte ein JSON-Backup erstellen. GitHub-Speicherung jetzt ausführen?'
      : 'Erste GitHub-Sicherung aller '+snapshot.trips.length+' Törns ('+Math.round(size/1024)+' KB) anlegen?\n\nVorher bitte ein JSON-Backup erstellen.';
    if(!confirm(msg)) {lamp('GitHub Speichern von dir abgebrochen – kein Speichern angefordert','warn');log('Der bestehende lokale Datenstand bleibt unverändert.');return;}
    const saved=await invoke({action:'save',app:APP_ID,sha:sha,revision:revision,data:snapshot});
    sha=saved.sha;revision=Number(saved.revision||revision+1);savedAt=saved.savedAt||null;remote=snapshot;meta();
    lamp('Aktuelle Törns sicher auf GitHub gespeichert','ok');log(snapshot.trips.length+' Törn(e) gesichert · Revision '+revision+' · '+date(savedAt)+'. Lokaler Speicher und alte Supabase-Cloud nicht verändert.');
  }));
  $('hsLocalSave').addEventListener('click',()=>doTask('Lokal Speichern',async()=>{
    const snapshot=getSnapshot();
    localStorage.setItem(KEY_LOCAL,JSON.stringify({format:'huschel-toern-backup-v1',savedAt:new Date().toISOString(),data:snapshot}));
    lamp('Zusätzliche lokale Sicherung erstellt','ok');log('Eigener Sicherheits-Speicherschlüssel. Der bisherige Törnplaner-Speicher wurde nicht verändert.');
  }));
  $('hsLocalLoad').addEventListener('click',()=>doTask('Lokal Laden',async()=>{
    const raw=localStorage.getItem(KEY_LOCAL);if(!raw)throw Error('Noch keine zusätzliche lokale Sicherung vorhanden.');
    const saved=JSON.parse(raw);if(saved.format!=='huschel-toern-backup-v1')throw Error('Unbekanntes Sicherungsformat.');
    showPreview(saved.data,'lokale Sicherung ('+date(saved.savedAt)+')');
  }));
  $('hsExport').addEventListener('click',()=>doTask('JSON Backup',async()=>{
    const snapshot=getSnapshot();const text=JSON.stringify(snapshot,null,2);
    const link=document.createElement('a');const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));
    link.href=url;link.download='toernplaner-sicherheitsbackup-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);
    lamp('JSON-Backup als Download angeboten','ok');log('Bitte kontrolliere im Download-Ordner, dass die JSON-Datei tatsächlich vorhanden ist. Sie enthält sämtliche Törns und Zahlungsdaten.');
  }));
  $('hsImport').addEventListener('click',()=>{$('hsFile').value='';$('hsFile').click();});
  $('hsFile').addEventListener('change',()=>doTask('JSON Backup laden',async()=>{
    const file=$('hsFile').files?.[0];if(!file)return;
    if(file.size>10_000_000)throw Error('Diese Sicherungsdatei ist unerwartet groß (maximal 10 MB).');
    const data=JSON.parse(await file.text());
    const actual=data?.format==='huschel-toern-backup-v1' ? data.data : data;
    showPreview(actual,'JSON-Backup '+file.name);
  }));
    $('hsRestoreFresh').addEventListener('click',()=>doTask('Originalstand auf neuem Gerät einrichten',async()=>{
    if(!preview)throw Error('Zunächst eine gültige JSON-Sicherung zur Vorschau auswählen.');
    if(typeof B.isFreshStorage!=='function' || !B.isFreshStorage())
      throw Error('Dieses Gerät besitzt bereits lokale Daten. Die Wiederherstellung ist gesperrt; nur Kopien sind möglich.');
    const message='VOLLSTÄNDIGEN ORIGINALSTAND AUF DIESEM NEUEN, LEEREN GERÄT EINRICHTEN?\n\n'+
      preview.trips.length+' Törns inklusive Teilnehmer, Zahlungen, Wise-Daten und ursprünglichem aktiven Törn.\n\n'+
      'Die vorhandene bisherige Supabase-Cloud und GitHub werden NICHT verändert.\n'+
      'Dieser Vorgang ist NUR erlaubt, weil auf diesem Gerät noch keine Törn-Daten gespeichert sind.';
    if(!confirm(message)){
      lamp('Originalstand-Übernahme von dir abgebrochen – keine Daten geändert','warn');
      log('Die Sicherung wurde nicht übernommen.');return;
    }
    const restored=B.restoreOnFreshStorage(preview);
    hidePreview();
    lamp('Originalstand sicher lokal eingerichtet – GitHub noch nicht gespeichert','ok');
    log(restored.count+' Törns aus deiner privaten JSON-Sicherung übernommen, aktiver Törn: '+restored.active+'. Die bisherige Törnplaner-Supabase-Cloud ist unverändert. Für die dauerhafte private GitHub-Sicherung bitte anschließend bewusst „GitHub Speichern“ ausführen.');
  }));
$('hsCopyTrips').addEventListener('click',()=>doTask('Törns als Kopien übernehmen',async()=>{
    if(!preview)throw Error('Keine gültige Sicherungsvorschau geöffnet.');
    if(! $('hsBackupConfirm').checked)throw Error('Bitte zuerst ein aktuelles JSON-Backup erstellen und die Bestätigung aktivieren.');
    const chosen=Array.from($('hsTripChoices').querySelectorAll('input:checked')).map(input=>preview.trips[Number(input.value)]);
    if(!chosen.length)throw Error('Bitte mindestens einen Törn auswählen.');
    if(B.isDirty())throw Error('Bitte erst die laufenden Eingaben im Törnplaner lokal speichern.');
    if(!confirm(chosen.length+' Törn(e) aus '+previewSource+' als NEUE KOPIEN übernehmen?\n\nAlle bestehenden Törns einschließlich Zahlungen bleiben erhalten.')){
      lamp('Übernahme von dir abgebrochen – keine Törns ergänzt','warn');log('Die laufenden Törns sind unverändert.');return;
    }
    const names=B.addCopies(chosen);
    hidePreview();
    lamp(names.length+' Sicherungskopie(n) hinzugefügt – bestehende Törns erhalten','ok');
    log('Erfolgreich ergänzt: '+names.join(', ')+'. Öffne die Törn-Verwaltung, wenn du eine Kopie prüfen möchtest. Die bestehende Supabase-Cloud bleibt unverändert.');
  }));
  $('hsCancelPreview').addEventListener('click',()=>{hidePreview();lamp('Vorschau geschlossen – keine Daten übernommen','warn');log('Bestehende Törns und Zahlungen sind unverändert.');});
  meta();
  // Keine automatische Aktion auf den Originaldaten. Nur vorhandene Huschel-Sitzung prüfen.
  void (async () => {
    try { if($('hsKey').value)await user(); }
    catch { setAuth(false); }
  })();
})();
