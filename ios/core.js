/* GENERATED from ../tinywins/app.js by sync_core.py. Shared logic, do not edit here. */
function dobOK(v){if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;const y=+v.slice(0,4),m=+v.slice(5,7),d=+v.slice(8,10),dt=new Date(y,m-1,d);if(dt.getFullYear()!==y||dt.getMonth()!==m-1||dt.getDate()!==d)return false;return y>=1900&&dt<=new Date()}
'use strict';
const $=s=>document.querySelector(s);const KEY='tinywins.v1';
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const dayDiff=(a,b)=>Math.round((new Date(b)-new Date(a))/864e5);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const def={onboarded:false,account:null,profile:{name:'',dob:'',gender:'',occ:'',contact:''},name:'',xp:0,preset:'other',theme:'slate',themes:['slate'],dark:'auto',text:100,calm:false,newCat:'auto',filter:'all',cats:[],myQW:[],log:{},habits:[{id:1,name:'Drink water',days:[],paid:[]},{id:2,name:'Go for a walk',days:[],paid:[]},{id:3,name:'Sleep on time',days:[],paid:[]}],challenge:null,reflections:[],sug:'',vol:.5,coins:0,tasks:[],
 streak:{count:0,last:null,best:0,rests:[]},treats:[{id:1,name:'One episode of a show',cost:20},{id:2,name:'A favorite snack',cost:10}],
 one:{date:null,id:null},showAll:false,nudges:{on:true,notif:false,ignored:0,lastShown:0,lastAction:Date.now()},wins:0,tab:'home',mood:null};
let S;
function load(){let o={};try{o=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
 if(!o||typeof o!=='object'||Array.isArray(o))o={};
 if(o.pet){if(o.xp==null)o.xp=(o.pet&&o.pet.xp)||0;delete o.pet}
 const s=Object.assign(structuredClone(def),o);const D=structuredClone(def);
 s.nudges=Object.assign(D.nudges,o.nudges||{});s.streak=Object.assign(D.streak,o.streak||{});s.one=Object.assign(D.one,o.one||{});
 if(!Array.isArray(s.streak.rests))s.streak.rests=[];
 ['tasks','habits','treats','reflections','cats','themes'].forEach(k=>{if(!Array.isArray(s[k]))s[k]=structuredClone(def[k])});
 if(!s.log||typeof s.log!=='object'||Array.isArray(s.log))s.log={};
 {const A=o.account;s.account=(A&&typeof A==='object'&&['gmail','apple'].includes(A.provider)&&typeof A.email==='string'&&emailOK(A.email))?{provider:A.provider,email:A.email.slice(0,80)}:null;
  const op=(o.profile&&typeof o.profile==='object'&&!Array.isArray(o.profile))?o.profile:{},ag=0;
  s.profile={name:String(op.name||s.name||'').slice(0,30),dob:dobOK(op.dob)?op.dob:'',gender:GENDERS.includes(op.gender)?op.gender:'',occ:String(op.occ||'').slice(0,40),contact:String(op.contact||'').slice(0,60)};
  s.name=String(s.profile.name||s.name||'').slice(0,30);s.onboarded=!!s.account&&profileOK(s.profile);if(s.challenge&&typeof s.challenge==='object')s.challenge.r=CH_R}
 s.xp=+s.xp||0;s.coins=Math.max(0,+s.coins||0);s.wins=+s.wins||0;
 s.vol=Math.min(1,Math.max(0,+s.vol));if(isNaN(s.vol))s.vol=.5;
 if(![90,100,115,130].includes(+s.text))s.text=100;s.text=+s.text;
 if(!['auto','on','off'].includes(s.dark))s.dark='auto';
 if(!THEMES_OK.includes(s.theme))s.theme='slate';s.themes=s.themes.filter(t=>THEMES_OK.includes(t));if(!s.themes.includes('slate'))s.themes.unshift('slate');if(!s.themes.includes(s.theme))s.themes.push(s.theme);
 if(!['home','timer','habits','rewards','progress','settings'].includes(s.tab))s.tab='home';
 if(!PRESET_OK.includes(s.preset))s.preset='other';
 s.tasks=s.tasks.filter(t=>t&&typeof t==='object').map((t,ix)=>{if(!Array.isArray(t.steps))t.steps=[];if(t.id==null)t.id=Date.now()+ix;t.title=String(t.title||'Task');if(!t.cat)t.cat=guessCat(t.title);t.steps=t.steps.filter(x=>x&&typeof x==='object').map(x=>{x.t=String(x.t||'');if(x.d&&!x.p)x.p=true;return x});return t});
 s.habits=s.habits.filter(h=>h&&typeof h==='object').map(h=>{h.name=String(h.name||'Habit');if(!Array.isArray(h.days))h.days=[];if(!Array.isArray(h.paid))h.paid=h.days.slice();return h});
 s.treats=s.treats.filter(t=>t&&typeof t==='object').map(t=>({id:t.id||Date.now(),name:String(t.name||'Treat'),cost:Math.max(1,Math.round(+t.cost||25))}));
 s.reflections=s.reflections.filter(r=>r&&r.date&&r.text);
 s.myQW=cleanQW(s.myQW);
 if(!s.cats.every(c=>typeof c==='string'))s.cats=s.cats.filter(c=>typeof c==='string');
 return s}
const CH_R=2;
const THEMES_OK=['slate','forest','sand','ocean','dusk','midnight','mint','teal','rose','sunset','gold','royal','crimson','noir'],PRESET_OK=['student','professional','caregiver','other'];
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2600)}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const TPL=[
 [/\b(clean|tidy|room|bedroom|bathroom|declutter|mess)/,['Put on one song you like','Pick up 5 things from the floor','Throw away any obvious trash','Clear one small surface','Put dirty clothes in one pile','Admire your work for 10 seconds']],
 [/\b(dish|kitchen)/,['Run warm water','Wash just the cups','Wash 5 more items','Wipe the counter once','Dry or rack them']],
 [/\b(laundry|clothes|wash)/,['Grab the laundry basket','Toss clothes in the machine','Add detergent & press start','Set a reminder to switch them','Fold just 5 items']],
 [/\b(email|inbox|mail|message|reply|text)/,['Open your inbox','Delete 5 obvious junk mails','Reply to the easiest one','Star anything that needs more time','Close the tab — done!']],
 [/\b(study|homework|read|learn|revise|exam)/,['Get your materials on the desk','Read just the first page or heading','Write 3 key words you saw','Do one tiny exercise','Note where to start next time']],
 [/\b(work|report|essay|write|project|assignment)/,['Open the file','Write the title or a messy first line','Make a 3-bullet outline','Fill in just one bullet','Save it — progress is progress']],
 [/\b(exercise|workout|gym|run|walk|yoga|stretch)/,['Put on comfy clothes','Drink some water','Do 1 minute of stretching','Move for 2 minutes (any way!)','Cool down with a deep breath']],
 [/\b(shower|bath|teeth|hygiene|skincare)/,['Grab your towel','Turn on the water','Just step in — the hardest part','Wash up gently','Moisturize & feel fresh']],
 [/\b(cook|meal|eat|food|lunch|dinner|breakfast)/,['Drink a glass of water','Pick the easiest food option','Get out ingredients/bowl','Make it (simple counts!)','Eat slowly and enjoy']],
 [/\b(shop|grocer|buy)/,['Open notes app','List 3 things you need','Check what you already have','Grab bags/wallet or open the shop app','Get just the list items']],
 [/\b(call|phone|appointment|book)/,['Find the number or link','Write what you want to say in one line','Take a deep breath','Make the call / click book','Celebrate! That was brave']],
 [/\b(bill|pay|budget|money|tax)/,['Open the bank or bill app','Find the one bill due soonest','Check the amount','Pay it or schedule it','Note it down as done']]];
/* levels */
function win(coins,xp,msg){const before=level().title;S.coins+=coins;S.xp+=xp;S.wins++;L().wins++;markActive();const after=level().title;
 toast(after!==before?`Level up: ${after}! +${coins} coin${coins===1?'':'s'}`:(msg||`+${coins} coin${coins===1?'':'s'}`));save();render();}
function markActive(){const t=today(),s=S.streak;S.nudges.ignored=0;S.nudges.lastAction=Date.now();
 if(s.last===t)return;s.count+=1;s.last=t;s.best=Math.max(s.best,s.count);}
function restDay(){const t=today();if(!S.streak.rests.includes(t))S.streak.rests.push(t);save();render();toast('Rest day saved. Your streak is safe.');}
const resting=()=>S.streak.rests.includes(today());
const MOODS={tired:{s:['Drink a glass of water','Put one thing back where it belongs','Open a window for fresh air','Lie down and stretch for 2 minutes','Do just the first step of any task']},
 bored:{s:['Race a timer: tidy for 5 minutes','Put on a new playlist and wash a few dishes','Reply to one message you have been avoiding','Rearrange one small shelf','Take a 5-minute walk']},
 stressed:{s:['Breathe in for 4, hold 4, out for 6. Repeat 3 times','Write down the 3 things on your mind','Pick the smallest thing on your list','Splash cool water on your face','Make a warm drink and sit for a moment']},
 okay:{s:['Pick your top priority and do step 1','Do a 5-minute timer on anything','Clear one small surface',"Plan tomorrow's top priority",'Knock out a quick 2-minute task']}};
/* presets */
const PRESETS={
 student:{label:'Student',
  tpl:[[/\b(assignment|essay|paper|thesis|report)/,['Open the assignment brief','Write the title and one messy sentence','List 3 points you want to cover','Draft just one paragraph','Save it and note what comes next']],
   [/\b(exam|test|quiz|revision|revise)/,['Pick one topic only','Skim the headings for 2 minutes','Write 3 things you remember without looking','Check them against your notes','Mark the topic as covered']],
   [/\b(lecture|class|notes|reading)/,['Open the material','Read the first section only','Write 3 key words','Add one question to ask later','Close it and take a short break']]],
  qw:['Open your notes and read one page','Write down one question about today\'s topic','Pack your bag for tomorrow','Charge your phone and laptop'],
  mood:['Review one flashcard','Tidy your study space for 2 minutes']},
 professional:{label:'Professional',
  tpl:[[/\b(meeting|agenda|standup)/,['Open the calendar invite','Write the one outcome you want','Jot down 3 talking points','Send or save the notes','Block time for any follow-up']],
   [/\b(report|presentation|slides|deck|proposal)/,['Open the file','Write the headline you want people to remember','Outline 3 sections','Fill in one section roughly','Save and note the next piece']],
   [/\b(invoice|expense|timesheet|admin)/,['Open the form or tool','Gather the first 3 items','Enter them','Check the total','Submit or save as draft']]],
  qw:['Reply to one short email','Update one line in your to-do list','Close 5 browser tabs you no longer need','Write tomorrow\'s top priority on a note'],
  mood:['Decline or defer one non-essential request','Take a 5-minute walk away from the screen']},
 caregiver:{label:'Parent or caregiver',
  tpl:[[/\b(meal|lunchbox|snack|school|pack)/,['Check what is already available','Pick the simplest option','Prepare one portion','Put things where you can find them','Clean up just the main surface']],
   [/\b(appointment|doctor|clinic|medication|pharmacy)/,['Find the number, form or booking page','Write down your main question','Make the call or send the request','Add the time to your calendar','Note anything you need to bring']],
   [/\b(routine|bedtime|chores|laundry)/,['Pick the one part that matters most','Set out what you need','Do the first part','Ask for help with one piece if you can','Stop when it is good enough']]],
  qw:['Sit down and drink some water','Write a short list for tomorrow','Put one load of laundry in','Ask someone for one small bit of help'],
  mood:['Take 5 quiet minutes for yourself','Lower the bar: do the minimum version today']},
 other:{label:'Something else',tpl:[],qw:[],mood:[]}};
const preset=()=>PRESETS[S.preset]||PRESETS.other;
const QW=['Drink a glass of water','Take 3 slow breaths','Stand up and stretch','Put 3 things back where they belong','Clear one small surface','Delete 5 old emails or photos','Write down one thing on your mind','Look out a window for one minute','Wash one cup or plate','Open the task you are avoiding for just 60 seconds','Send one short message you owe','Roll your shoulders and unclench your jaw'];
const QW_MAX=30,QW_LEN=60;
function cleanQW(a){const out=[],seen=new Set();(Array.isArray(a)?a:[]).forEach(x=>{if(typeof x!=='string')return;const t=x.replace(/\s+/g,' ').trim().slice(0,QW_LEN);if(t&&!seen.has(t.toLowerCase())&&out.length<QW_MAX){seen.add(t.toLowerCase());out.push(t)}});return out}
let qwEdit=-1;
const quickWins=()=>QW.concat(preset().qw,S.myQW||[]);
function breakdown(t){const l=t.toLowerCase();for(const[r,s]of preset().tpl.concat(TPL))if(r.test(l))return s.slice();
 return [`Get what you need for "${t}"`,'Set up your space for 1 minute',`Do the very first small part of "${t}"`,'Keep going for 2 more minutes',"Wrap up and note what's next"];}
const CATS=['study','work','home','health'];
const allCats=()=>CATS.concat(S.cats||[]);
function guessCat(t){t=t.toLowerCase();
 if(/\b(study|homework|read|exam|class|learn|assignment|revise|lecture|essay)/.test(t))return'study';
 if(/\b(work|email|report|meeting|project|invoice|client|presentation|inbox)/.test(t))return'work';
 if(/\b(exercise|walk|gym|shower|sleep|doctor|stretch|water|meds|yoga|appointment)/.test(t))return'health';
 return'home'}
function addTask(title){title=(title||'').trim().replace(/\s+/g,' ').slice(0,120);if(!title)return;const ni=$('#newt');if(ni)ni.value='';const cat=(S.newCat&&S.newCat!=='auto')?S.newCat:guessCat(title);
 S.tasks.unshift({id:Date.now()+Math.floor(Math.random()*999),title,cat,steps:breakdown(title).map(x=>({t:x,d:false})),done:false,created:today()});
 save();render();toast(S.showAll||S.one.date!==today()?'Split into small 2-minute steps':'Added to Other tasks, split into 2-minute steps')}
/* daily log for stats */
function L(d){d=d||today();return S.log[d]||(S.log[d]={tasks:0,steps:0,focus:0,sessions:0,wins:0})}
/* sounds: recorded loops (embedded in sounds.js, work offline) + gentle generated sounds */
const SOUNDS=[['off','Off'],['rain','Rain'],['ocean','Shore waves'],['stream','Stream'],['breeze','Soft wind'],['cafe','Cafe'],['brown','Brown noise'],['pink','Soft noise'],['tones','Calm tones']];
const REC={rain:1,ocean:1,stream:1,breeze:1,cafe:1};
const CC0={n:'CC0 1.0',u:'https://creativecommons.org/publicdomain/zero/1.0/'};
const SOUND_CREDITS=[
 {n:'Rain',t:'LightRainDistantThunderJuly5th2016.WAV',a:'kvgarlic',u:'https://freesound.org/people/kvgarlic/sounds/349454/',l:CC0,c:'trimmed, high-pass filtered to remove thunder, gently low-passed (soft roll-off above about 4 kHz), drop peaks compressed and their attacks softened, a very quiet warm room tone added (generated, no recording), looped with a crossfade, mono 48 kbps mp3.'},
 {n:'Shore waves',t:'Waves',a:'Dsw4 (own work, recorded on the shore of Lake Ontario, 2008)',u:'https://commons.wikimedia.org/wiki/File:Waves.ogg',l:{n:'Public domain (dedicated by the author)',u:''},c:'56 s excerpt, mono, filtered, volume matched, crossfaded into a loop, 48 kbps mp3.'},
 {n:'Stream',t:'Stream River Water Up Close',a:'jackthemurray',u:'https://freesound.org/people/jackthemurray/sounds/433589/',l:CC0,c:'trimmed to 56 s, mono, filtered, volume matched, crossfaded into a loop, 48 kbps mp3.'},
 {n:'Soft wind',t:'Gentle breeze and birds singing',a:'ezwa (via PDSounds)',u:'https://commons.wikimedia.org/wiki/File:Gentle_breeze_and_birds_singing.ogg',l:{n:'Public domain (dedicated by the author via PDSounds)',u:''},c:'trimmed to 24 s, mono, filtered, volume matched, crossfaded into a loop, 48 kbps mp3.'},
 {n:'Cafe',t:'Restaurant Ambience',a:'stephan (via PDSounds)',u:'https://commons.wikimedia.org/wiki/File:Restaurant_ambience.ogg',l:{n:'Public domain (dedicated by the author via PDSounds)',u:''},c:'trimmed to 64 s, mono, filtered, volume matched, crossfaded into a loop, 48 kbps mp3.'}];
let AC=null,BUF={},SND={nodes:[],timer:null,kind:'off',gen:0,fade:1,sleepAt:0,sleepIv:null,out:null,sg:null,el:null};
const volGain=()=>Math.pow(S.vol,2)*3.2;
function ctx(){if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();
 if(!SND.out){const g=AC.createGain(),c=AC.createDynamicsCompressor();g.connect(c);c.connect(AC.destination);SND.out=g;g.gain.value=volGain()}return AC}
function applyVol(){if(SND.out&&AC)SND.out.gain.setTargetAtTime(volGain()*SND.fade,AC.currentTime,.08);if(LF.a&&LF.state!=='off')LF.a.volume=lofiVol()}
function silentWav(){const n=8000,u=new Uint8Array(44+n),v=new DataView(u.buffer),w=(o,t)=>{for(let i=0;i<t.length;i++)u[o+i]=t.charCodeAt(i)};w(0,'RIFF');v.setUint32(4,36+n,true);w(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,8000,true);v.setUint32(28,8000,true);v.setUint16(32,1,true);v.setUint16(34,8,true);w(36,'data');v.setUint32(40,n,true);u.fill(128,44);let b='';for(let i=0;i<u.length;i++)b+=String.fromCharCode(u[i]);return 'data:audio/wav;base64,'+btoa(b)}
function unlockIOS(){try{const now=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=660;g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.15,now+.03);g.gain.exponentialRampToValueAtTime(.0001,now+.4);o.connect(g);g.connect(AC.destination);o.start(now);o.stop(now+.45)}catch(e){}
 try{if(!SND.el){const a=document.createElement('audio');a.src=silentWav();a.loop=true;a.setAttribute('playsinline','');SND.el=a}SND.el.play().catch(()=>{})}catch(e){}}
function b64buf(s){const bin=atob(s),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return u.buffer}
function decode(ab){return new Promise((res,rej)=>{const p=AC.decodeAudioData(ab,res,rej);if(p&&p.catch)p.catch(rej)})}
function getRec(k){if(BUF[k])return Promise.resolve(BUF[k]);if(typeof SOUND_DATA==='undefined'||!SOUND_DATA[k])return Promise.reject(new Error('missing'));
 return decode(b64buf(SOUND_DATA[k])).then(b=>(BUF[k]=b))}
function noiseBuf(type){const sr=AC.sampleRate,len=sr*8,x=Math.floor(sr*.6),g=new Float32Array(len+x);let last=0,b0=0,b1=0,b2=0;
 for(let i=0;i<g.length;i++){const w=Math.random()*2-1;
  if(type==='brown'){last=(last+.02*w)/1.02;g[i]=last}else{b0=.99765*b0+w*.099;b1=.963*b1+w*.2965;b2=.57*b2+w*1.05;g[i]=b0+b1+b2+w*.18}}
 const b=AC.createBuffer(1,len,sr),d=b.getChannelData(0);
 for(let i=0;i<len;i++)d[i]=i<x?g[i]*(i/x)+g[len+i]*(1-i/x):g[i];
 let s=0;for(let i=0;i<len;i++)s+=d[i]*d[i];const k=.06/Math.sqrt(s/len);for(let i=0;i<len;i++)d[i]*=k;return b}
function stopSound(){const nodes=SND.nodes;SND.gen++;SND.kind='off';clearTimeout(SND.timer);
 if(SND.sg&&AC)try{SND.sg.gain.cancelScheduledValues(AC.currentTime);SND.sg.gain.setTargetAtTime(0,AC.currentTime,.08)}catch(e){}
 SND.nodes=[];SND.sg=null;setTimeout(()=>nodes.forEach(n=>{try{n.stop&&n.stop()}catch(e){}try{n.disconnect()}catch(e){}}),500)}
function startSound(kind){stopSound();if(kind==='off')return;lofiStop(true);
 try{ctx()}catch(e){toast('Sound is not supported on this device');return}
 unlockIOS();SND.kind=kind;const my=++SND.gen;
 const build=buf=>{if(SND.gen!==my)return;const N=n=>(SND.nodes.push(n),n),now=AC.currentTime;
  const sg=N(AC.createGain());SND.sg=sg;sg.gain.setValueAtTime(0,now);sg.connect(SND.out);
  const lfo=(rate,depth,target)=>{const o=N(AC.createOscillator()),l=N(AC.createGain());o.frequency.value=rate;l.gain.value=depth;o.connect(l);l.connect(target);o.start()};
  const loop=(b,lp,lvl)=>{const s=N(AC.createBufferSource());s.buffer=b;s.loop=true;const f=N(AC.createBiquadFilter());f.type='lowpass';f.frequency.value=lp;s.connect(f);f.connect(sg);sg.gain.linearRampToValueAtTime(lvl,now+2.5);s.start();return s};
  if(REC[kind])loop(buf,16000,1);
  else if(kind==='brown'){loop(noiseBuf('brown'),450,.85);lfo(.06,.12,sg.gain)}
  else if(kind==='pink'){loop(noiseBuf('pink'),2600,.9);lfo(.05,.1,sg.gain)}
  else if(kind==='tones'){const pad=N(AC.createGain()),lp=N(AC.createBiquadFilter());lp.type='lowpass';lp.frequency.value=1100;pad.connect(lp);lp.connect(sg);sg.gain.linearRampToValueAtTime(1,now+3);
   [110,164.81,220,277.18,329.63].forEach((fr,i)=>{const o=N(AC.createOscillator()),g=N(AC.createGain()),m=N(AC.createGain());o.type='sine';o.frequency.value=fr;o.detune.value=(i%2?4:-4);g.gain.value=.03;m.gain.value=.022;
    const l=N(AC.createOscillator());l.frequency.value=.04+i*.017;l.connect(m);m.connect(g.gain);o.connect(g);g.connect(pad);o.start();l.start()});
   const bus=N(AC.createGain()),dl=N(AC.createDelay(2)),fb=N(AC.createGain()),df=N(AC.createBiquadFilter());dl.delayTime.value=.5;fb.gain.value=.4;df.type='lowpass';df.frequency.value=1800;
   bus.connect(sg);bus.connect(dl);dl.connect(df);df.connect(fb);fb.connect(dl);df.connect(sg);
   const notes=[440,493.88,554.37,659.25,739.99,880],chime=()=>{if(SND.gen!==my)return;const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type='sine';o.frequency.value=notes[Math.floor(Math.random()*notes.length)];
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.05,t+.04);g.gain.exponentialRampToValueAtTime(.0001,t+4.5);o.connect(g);g.connect(bus);o.start(t);o.stop(t+4.6);SND.timer=setTimeout(chime,4000+Math.random()*6000)};SND.timer=setTimeout(chime,2000)}};
 if(REC[kind]){if(!BUF[kind])toast('Loading sound...');getRec(kind).then(build).catch(()=>{if(SND.gen===my){SND.kind='off';toast('Could not load this sound');render()}})}else build()}
/* sleep timer */
function sleepText(){return SND.sleepAt?Math.max(1,Math.ceil((SND.sleepAt-Date.now())/60000))+' min left':''}
function updSleep(){document.querySelectorAll('.sleepleft').forEach(e=>e.textContent=sleepText())}
function setSleep(min){clearInterval(SND.sleepIv);SND.fade=1;applyVol();SND.sleepAt=0;if(!min)return;SND.sleepAt=Date.now()+min*60000;
 SND.sleepIv=setInterval(()=>{const left=SND.sleepAt-Date.now();
  if(left<=0){clearInterval(SND.sleepIv);SND.sleepAt=0;stopSound();lofiStop(true);SND.fade=1;applyVol();toast('Sleep timer finished');render();return}
  SND.fade=left<20000?Math.max(0,left/20000):1;applyVol();updSleep()},1000)}
/* in-app lofi player. Kevin MacLeod tracks (CC BY 3.0) are streamed over HTTPS from Wikimedia Commons, which allows hotlinking.
   Online only. Never bundled, never cached (the service worker ignores cross-origin and Range requests). Credits: Settings > Credits. */
const LOFI_BASE='https://upload.wikimedia.org/wikipedia/commons/',LOFI_ARTIST='Kevin MacLeod',CCBY3={n:'CC BY 3.0',u:'https://creativecommons.org/licenses/by/3.0/'};
/* [title, ISRC, path on Commons, loudness-matching gain] */
const LOFI=[['Slow Jam','USUAN1600015','5/53/Slow_Jam_%28ISRC_USUAN1600015%29.mp3',0.51],
 ['Summer Day','USUAN1200083','4/4c/Summer_Day_%28ISRC_USUAN1200083%29.mp3',0.67],
 ['Dream Culture','USUAN1300046','1/1f/Dream_Culture_%28ISRC_USUAN1300046%29.mp3',0.91],
 ['Backed Vibes (clean)','USUAN1100479','5/5e/Backed_Vibes_%28clean%29_%28ISRC_USUAN1100479%29.mp3',0.62],
 ['Chill Wave','USUAN1600048','9/9b/Chill_Wave_%28ISRC_USUAN1600048%29.mp3',0.5],
 ['Deliberate Thought','USUAN1100261','b/b4/Deliberate_Thought_%28ISRC_USUAN1100261%29.mp3',0.97],
 ['Windswept','USUAN1100757','d/d2/Windswept_%28ISRC_USUAN1100757%29.mp3',0.81],
 ['Clear Air','USUAN1100626','4/45/Clear_Air_%28ISRC_USUAN1100626%29.mp3',0.87],
 ['Dreamer','USUAN1600043','d/d5/Dreamer_%28ISRC_USUAN1600043%29.mp3',1]];
let LF={state:'off',i:-1,order:[],pos:0,shuffle:true,msg:'',fails:0,a:null,wd:null,open:false};
const lofiFile=t=>t[2].split('/').pop(),lofiPage=t=>'https://commons.wikimedia.org/wiki/File:'+lofiFile(t),lofiInfo=t=>'https://incompetech.com/music/royalty-free/index.html?isrc='+t[1];
function lofiVol(){const t=LOFI[LF.i];return Math.max(0,Math.min(1,Math.pow(S.vol,2)*(t?t[3]:1)*SND.fade))}
function lofiOrder(first){const n=LOFI.length,o=[...Array(n).keys()];
 if(LF.shuffle)for(let k=n-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[o[k],o[j]]=[o[j],o[k]]}
 if(first!=null&&first>=0){o.splice(o.indexOf(first),1);o.unshift(first)}return o}
function lofiInner(){const t=LOFI[LF.i],on=LF.state!=='off',offl=navigator.onLine===false,pl=LF.state==='playing'||LF.state==='loading';
 return `<h3>Lofi player</h3>
 ${offl?'<div class="muted lofimsg" role="status">You are offline. Lofi needs internet.</div>':''}
 <div class="lofinow" role="status" aria-live="polite">${t&&on?`<b>${esc(t[0])}</b><div class="muted">${esc(LF.msg||(LF.state==='paused'?'Paused':'Playing'))}</div>`:`<span class="muted">${esc(LF.msg||'Press play. Needs internet.')}</span>`}</div>
 <div class="row wrap"><button class="small ${pl?'alt':''}" data-a="lplay">${pl?'Pause':(on?'Play':'Play lofi')}</button><button class="small ghost" data-a="lnext" ${on?'':'disabled'}>Next</button><button class="small ghost" data-a="lshuf" aria-pressed="${LF.shuffle}">Shuffle: ${LF.shuffle?'on':'off'}</button>${on?'<button class="small ghost" data-a="lstop">Stop</button>':''}</div>
 <details class="lofitracks" ${LF.open?'open':''} ontoggle="LF.open=this.open"><summary>Tracks (${LOFI.length})</summary><div class="row wrap chips">${LOFI.map((x,k)=>`<button class="small ${on&&LF.i===k?'':'ghost'}" data-a="ltrack" data-v="${k}" aria-pressed="${on&&LF.i===k}">${esc(x[0])}</button>`).join('')}</div></details>`}
function updLofi(){const e=document.getElementById('lofi');if(e&&!e.contains(document.activeElement))e.innerHTML=lofiInner();else if(e){const f=document.activeElement&&document.activeElement.dataset&&document.activeElement.dataset.a;e.innerHTML=lofiInner();const b=f&&e.querySelector('[data-a="'+f+'"]');if(b)b.focus()}}
function lofiMedia(){if(!('mediaSession'in navigator))return;try{const t=LOFI[LF.i];if(!t||LF.state==='off'){navigator.mediaSession.metadata=null;navigator.mediaSession.playbackState='none';return}
 navigator.mediaSession.metadata=new MediaMetadata({title:t[0],artist:LOFI_ARTIST,album:'Tiny Wins lofi (CC BY 3.0)',artwork:[{src:'icon-192.png',sizes:'192x192',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png'}]});
 navigator.mediaSession.playbackState=LF.state==='playing'?'playing':'paused'}catch(e){}}
function lofiEl(){if(LF.a)return LF.a;const a=LF.a=new Audio();a.preload='none';a.setAttribute('playsinline','');
 a.addEventListener('playing',()=>{if(LF.a!==a||LF.state==='off')return;clearTimeout(LF.wd);LF.state='playing';LF.fails=0;LF.msg='';lofiMedia();updLofi()});
 a.addEventListener('waiting',()=>{if(LF.state==='off')return;if(navigator.onLine===false){lofiOffline();return}if(LF.state==='playing'){LF.msg='Buffering...';updLofi()}});
 a.addEventListener('pause',()=>{if(LF.state==='playing'&&!a.ended){LF.state='paused';LF.msg='';lofiMedia();updLofi()}});
 a.addEventListener('ended',()=>{if(LF.state!=='off')lofiNext()});
 a.addEventListener('error',()=>{if(LF.state!=='off'&&a.getAttribute('src'))lofiBad()});
 a.addEventListener('stalled',()=>{if(LF.state!=='off'&&navigator.onLine===false)lofiOffline()});
 if('mediaSession'in navigator)try{const h=(n,f)=>navigator.mediaSession.setActionHandler(n,f);h('play',()=>{if(LF.state==='paused')lofiToggle()});h('pause',()=>{if(LF.state==='playing'||LF.state==='loading')lofiToggle()});h('nexttrack',()=>{if(LF.state!=='off')lofiNext()});h('stop',()=>lofiStop())}catch(e){}
 return a}
function lofiStop(silent){clearTimeout(LF.wd);const a=LF.a;LF.state='off';if(a){try{a.pause();a.removeAttribute('src');a.load()}catch(e){}}LF.i=-1;LF.msg='';lofiMedia();if(!silent)updLofi()}
function lofiOffline(){lofiStop(true);LF.msg='Lofi needs internet';toast('Lofi needs internet');updLofi()}
function lofiBad(){clearTimeout(LF.wd);if(navigator.onLine===false){lofiOffline();return}
 if(++LF.fails>=LOFI.length){lofiStop(true);LF.msg="Couldn't reach the lofi tracks. Check your connection and try again.";toast("Lofi isn't available right now");updLofi();return}
 toast("Skipped a track that wouldn't load");lofiNext()}
function lofiLoad(i){const a=lofiEl(),t=LOFI[i];LF.i=i;LF.state='loading';LF.msg='Loading...';clearTimeout(LF.wd);
 a.src=LOFI_BASE+t[2];a.volume=lofiVol();lofiMedia();updLofi();
 LF.wd=setTimeout(()=>{if(LF.a===a&&LF.state==='loading')lofiBad()},25000);
 const p=a.play();if(p&&p.catch)p.catch(e=>{if(LF.a!==a||LF.state==='off')return;if(e&&e.name==='AbortError')return;if(e&&e.name==='NotAllowedError'){clearTimeout(LF.wd);LF.state='paused';LF.msg='Press play to start';updLofi();return}lofiBad()})}
function lofiNext(){if(LF.state==='off')return;LF.pos++;if(LF.pos>=LOFI.length){const last=LF.i;LF.order=lofiOrder();if(LF.order.length>1&&LF.order[0]===last)LF.order.push(LF.order.shift());LF.pos=0}lofiLoad(LF.order[LF.pos])}
function lofiStart(first){if(navigator.onLine===false){lofiStop(true);LF.msg='Lofi needs internet';toast('Lofi needs internet');updLofi();return}
 stopSound();LF.fails=0;LF.order=lofiOrder(first);LF.pos=0;lofiLoad(LF.order[0])}
function lofiToggle(){const a=LF.a;if(LF.state==='off'){lofiStart();return}
 if(LF.state==='paused'){if(navigator.onLine===false&&!(a&&a.buffered&&a.buffered.length)){lofiOffline();return}LF.state='loading';LF.msg='';updLofi();const p=a.play();if(p&&p.catch)p.catch(e=>{if(!(e&&e.name==='AbortError'))lofiBad()})}
 else{LF.state='paused';LF.msg='';a.pause();lofiMedia();updLofi()}}
window.addEventListener('offline',()=>{if(LF.state==='loading')lofiOffline();else updLofi()});
window.addEventListener('online',()=>{if(LF.state==='off'&&LF.msg==='Lofi needs internet')LF.msg='';updLofi()});
function soundPanel(){return `<h3>Ambient sound</h3><div class="row wrap chips">${SOUNDS.map(([k,n])=>`<button class="small ${SND.kind===k?'':'ghost'}" data-a="sound" data-s="${k}" aria-pressed="${SND.kind===k}">${n}</button>`).join('')}</div>
 <div id="lofi">${lofiInner()}</div>
 <div class="row vol"><label for="vol" class="muted">Volume</label><input id="vol" type="range" min="0" max="100" value="${Math.round(S.vol*100)}" aria-label="Volume"></div>
 <h3>Sleep timer</h3><div class="row wrap chips">${[[0,'Off'],[15,'15 min'],[30,'30 min'],[60,'60 min']].map(([m,l])=>`<button class="small ${(m===0&&!SND.sleepAt)||(m&&SND.sleepAt&&SND.sleepMin===m)?'':'ghost'}" data-a="sleep" data-v="${m}">${l}</button>`).join('')}<span class="muted sleepleft">${sleepText()}</span></div>
 `}
/* timer */
let T={total:300,left:300,run:false,iv:null,end:0,full:false};
function startTimer(){if(T.run)return;T.run=true;T.end=Date.now()+T.left*1000;
 T.iv=setInterval(()=>{T.left=Math.max(0,Math.ceil((T.end-Date.now())/1000));if(T.left<=0)finishTimer(true);else updTimer()},500);render()}
function finishTimer(full){clearInterval(T.iv);const spent=T.total-T.left;T.run=false;T.left=T.total;
 if(full||spent>=10){const l=L();l.focus+=spent;l.sessions++;win(5,full?20:10,full?'5 minutes done. +5 coins':'You started, and that counts. +5 coins')}
 else{toast('Starting is the hard part. Try again anytime.');render()}}
function updTimer(){document.querySelectorAll('.tm').forEach(el=>el.textContent=fmt(T.left));const r=$('#ringp');if(r)r.setAttribute('stroke-dashoffset',628*(T.left/T.total))}
const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
/* nudges */
const NUDGES=['Want to do one small step? It only takes 2 minutes.','No pressure. Pick the smallest thing on your list.','A 5-minute start still counts.','Checking in. Is there anything small you can finish?','Take a breath. One step whenever you are ready.'];
function nudgeTick(){const n=S.nudges;if(!S.onboarded||!n.on||resting())return;const gap=Math.min(4,1+n.ignored)*30*60e3;
 if(Date.now()-n.lastAction<gap||Date.now()-n.lastShown<gap)return;n.lastShown=Date.now();n.ignored++;save();const msg=pick(NUDGES);
 toast(msg);if(n.notif&&'Notification'in window&&Notification.permission==='granted'&&document.hidden)new Notification('Tiny Wins',{body:msg,icon:'icon.svg'});}
/* themes & preferences */
const THEMES={slate:{n:'Slate',cost:0,bar:'#f3f1ec',sw:['#4e6a85','#9bb89a','#f3f1ec']},forest:{n:'Forest',cost:60,bar:'#eff3ec',sw:['#4c7358','#a7c3a0','#eff3ec']},
 sand:{n:'Sand',cost:60,bar:'#f6f0e6',sw:['#9a7b57','#c9b89a','#f6f0e6']},ocean:{n:'Ocean',cost:70,bar:'#ecf3f6',sw:['#2f7b94','#8cc3cf','#ecf3f6']},
 dusk:{n:'Dusk',cost:80,bar:'#f0eef4',sw:['#6b6592','#b3aed2','#f0eef4']},midnight:{n:'Midnight',cost:90,bar:'#10161f',sw:['#8fb0d6','#6f9a8a','#10161f']},
 mint:{n:'Mint',cost:60,bar:'#eef8f2',dbar:'#0e1a14',sw:['#1b7347','#2f9a68','#eef8f2']},
 teal:{n:'Teal',cost:70,bar:'#eaf5f4',dbar:'#0c1a1a',sw:['#0b726d','#2c9a92','#eaf5f4']},
 rose:{n:'Rose',cost:70,bar:'#fbeff3',dbar:'#1c0f15',sw:['#a82b58','#c8517c','#fbeff3']},
 sunset:{n:'Sunset',cost:80,bar:'#fbf1e8',dbar:'#1a110c',sw:['#a8400a','#c9631f','#fbf1e8']},
 gold:{n:'Gold',cost:100,bar:'#f6f3ea',dbar:'#17171a',sw:['#7d5b00','#a37a0c','#f6f3ea']},
 royal:{n:'Royal',cost:100,bar:'#f3effa',dbar:'#130d20',sw:['#5b2fa6','#7d52c4','#f3effa']},
 crimson:{n:'Crimson',cost:120,bar:'#f8eded',dbar:'#0a0606',sw:['#c4122f','#111111','#f8eded']},
 noir:{n:'Noir',cost:120,bar:'#f4f4f4',dbar:'#080808',sw:['#161616','#8e8e8e','#f4f4f4']}};
const DARKFIRST=['midnight','crimson','noir'];
function isDark(){return (DARKFIRST.includes(S.theme)&&S.dark!=='off')||S.dark==='on'||(S.dark==='auto'&&window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)}
function applyPrefs(){const r=document.documentElement;r.dataset.theme=S.theme;r.dataset.mode=isDark()?'dark':'light';r.style.fontSize=(16*S.text/100)+'px';
 r.classList.toggle('calm',!!S.calm);const m=document.querySelector('meta[name=theme-color]');if(m)m.content=isDark()?(THEMES[S.theme].dbar||'#10161f'):THEMES[S.theme].bar}
/* daily challenge */
const CHALLENGES=[{t:'Complete 3 task steps today',k:'steps',n:3,r:2},{t:'Finish one whole task',k:'tasks',n:1,r:2},{t:'Do one 5-minute focus session',k:'sessions',n:1,r:2},{t:'Check in on 2 habits',k:'habits',n:2,r:2},
 {t:'Complete 5 task steps today',k:'steps',n:5,r:2},{t:'Do a 1-minute quick win',k:'quick',n:1,r:2},{t:'Write your end-of-day reflection',k:'reflect',n:1,r:2}];
function hashStr(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)}
function getChallenge(){if(!S.challenge||S.challenge.date!==today()){const c=CHALLENGES[hashStr(today())%CHALLENGES.length];S.challenge={date:today(),...c,claimed:false};save()}return S.challenge}
function challengeProgress(c){const l=L();const h=S.habits.filter(x=>x.days.includes(today())).length;
 return Math.min(c.n,{steps:l.steps,tasks:l.tasks,sessions:l.sessions,habits:h,quick:l.quick||0,reflect:S.reflections.some(r=>r.date===today())?1:0}[c.k]||0)}
/* habits */
function habitStreak(h){let n=0,d=new Date();if(!h.days.includes(today()))d.setDate(d.getDate()-1);
 for(;;){const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');if(h.days.includes(k)){n++;d.setDate(d.getDate()-1)}else break}return n}
function lastDays(n){const o=[];for(let i=n-1;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);o.push(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'))}return o}
/* levels */
const LEVELS=[[0,'Starter'],[40,'Doer'],[120,'Finisher'],[260,'Steady'],[480,'Momentum'],[800,'Small Steps Pro']];
function level(){let i=0;LEVELS.forEach((l,k)=>{if(S.xp>=l[0])i=k});const nx=LEVELS[i+1];return{i:i+1,title:LEVELS[i][1],base:LEVELS[i][0],next:nx?nx[0]:null,nextTitle:nx?nx[1]:null}}
function toggleStep(tid,i){const tk=S.tasks.find(x=>x.id==tid);if(!tk)return;const st=tk.steps[i];st.d=!st.d;
 if(st.d&&!st.p){st.p=true;L().steps++;if(tk.steps.every(x=>x.d)&&!tk.done){tk.done=true;tk.paid=true;L().tasks++;win(5,30,'Task complete. +5 coins')}else win(1,8,'+1 coin')}
 else{if(tk.steps.every(x=>x.d)&&!tk.done)tk.done=true;if(!st.d)tk.done=false;save();render()}}
function toggleHabit(id){const h=S.habits.find(x=>x.id==id),t=today(),k=h.days.indexOf(t);
 if(k>=0){h.days.splice(k,1);save();render()}else{h.days.push(t);if(!h.paid.includes(t)){h.paid.push(t);win(1,2,'Checked in. +1 coin')}else{save();render()}}}
/* stats */
function weekStats(){const days=lastDays(7);let tasks=0,steps=0,focus=0,best=null;const bars=days.map(d=>{const l=S.log[d]||{tasks:0,steps:0,focus:0,wins:0};tasks+=l.tasks;steps+=l.steps;focus+=l.focus;
  if(l.wins>0&&(!best||l.wins>best.wins))best={d,wins:l.wins};return{d,v:l.wins,tasks:l.tasks}});
 return{tasks,steps,focusMin:Math.round(focus/60),best,bars,max:Math.max(1,...bars.map(b=>b.v))}}
const dayName=d=>new Date(d+'T12:00:00').toLocaleDateString(undefined,{weekday:'long'});
const dayShort=d=>new Date(d+'T12:00:00').toLocaleDateString(undefined,{weekday:'narrow'});
/* backup */
function exportData(){const txt=JSON.stringify({app:'tinywins',version:3,exported:new Date().toISOString(),data:S},null,2);
 if(window.TinyWinsNative&&TinyWinsNative.saveFile){TinyWinsNative.saveFile('tinywins-backup-'+today()+'.json',txt);toast('Choose where to save the backup');return}
 const b=new Blob([txt],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='tinywins-backup-'+today()+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000);toast('Backup file saved')}
function importData(file){const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(r.result);const d=j&&j.data?j.data:j;if(!d||typeof d!=='object'||!Array.isArray(d.tasks))throw 0;
  {const kA=S.account,kP=S.profile;if(!d.account||!d.account.email)d.account=kA;if(!d.profile||!d.profile.name)d.profile=kP}
  localStorage.setItem(KEY,JSON.stringify(d));S=load();save();pfInit();applyPrefs();render();toast('Backup restored')}catch(e){toast('That file does not look like a Tiny Wins backup')}};r.readAsText(file)}
/* install help */
let deferredInstall=null,instAll=false;
const isNativeApp=()=>/Electron\/|TinyWinsApp\//.test(navigator.userAgent||'');
const isStandalone=()=>(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true||isNativeApp();
function platform(){const u=navigator.userAgent||'',p=navigator.platform||'';if(isNativeApp())return'nativeapp';if(/iPhone|iPod|iPad/.test(u)||(p==='MacIntel'&&navigator.maxTouchPoints>1))return'ios';if(/Android/.test(u))return'android';if(/CrOS/.test(u))return'chromeos';if(/Win/.test(p))return'windows';if(/Mac/.test(p))return'mac';if(/Linux|X11/.test(p+u))return'linux';return'other'}
const INSTALL_HELP={
 ios:['iPhone and iPad','Open this page in Safari. Tap Share, then Add to Home Screen, then Add.','Chrome and Edge on iOS 16.4 or later also have Add to Home Screen in their Share menu.'],
 android:['Android','In Chrome, tap Install below, or open the three-dot menu and tap Install app. In Samsung Internet, open the menu and choose Add page to Home screen. In Firefox, open the menu and tap Install.',''],
 windows:['Windows','In Chrome or Edge, click Install below or the install icon in the address bar.','Firefox cannot install web apps.'],
 mac:['Mac','In Safari 17 or later, choose File, then Add to Dock. In Chrome or Edge, click Install below or the install icon in the address bar.','Firefox cannot install web apps.'],
 linux:['Linux','In Chrome, Chromium or Edge, click Install below or the install icon in the address bar.','Firefox cannot install web apps.'],
 chromeos:['Chromebook','Click Install below, or the install icon in the address bar.','']};
function installCard(){
 const pf=platform(),h=INSTALL_HELP[pf];
 if(pf==='nativeapp')return `<div class="card" id="install"><h2>Install this app</h2><div class="muted">This is the Tiny Wins app. Use Export backup to keep a copy of your data.</div></div>`;
 if(isStandalone())return `<div class="card" id="install"><h2>Install this app</h2><div class="muted">Tiny Wins is installed.</div></div>`;
 const file=location.protocol==='file:',insecure=!file&&window.isSecureContext===false;
 const lead=file?'You opened Tiny Wins as a file. To install it, open its https address in a browser.':insecure?'Installing needs an https address.':'Install Tiny Wins to open it like any other app.';
 const btn=deferredInstall?`<div style="margin:10px 0"><button data-a="inst">Install Tiny Wins</button></div>`:'';
 const mine=h?`<div class="inst"><b>${h[0]}</b><div class="muted">${h[1]}</div>${h[2]?`<div class="muted" style="margin-top:4px">${h[2]}</div>`:''}</div>`:'';
 const others=Object.entries(INSTALL_HELP).filter(([k])=>k!==pf).map(([k,v])=>`<div class="inst"><b>${v[0]}</b><div class="muted">${v[1]}</div></div>`).join('');
 return `<div class="card" id="install"><h2>Install this app</h2><div class="muted">${lead}</div>${btn}${mine}<div class="row" style="margin-top:8px"><button class="small ghost" data-a="install" aria-expanded="${instAll}">${instAll?'Hide other devices':'Other devices'}</button></div>${instAll?others:''}</div>`}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;if(S&&S.tab==='settings'&&!document.activeElement.matches('input'))render()});
window.addEventListener('appinstalled',()=>{deferredInstall=null;toast('Tiny Wins is installed');if(S&&S.tab==='settings')render()});
/* views */
/* local sign-in and profile. Everything is stored only on this device (localStorage). No online account, nothing is sent. */
const GENDERS=['Female','Male','Non-binary','Prefer not to say'],OCCS=['Student','Professional','Parent or caregiver','Other'];
const emailOK=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const contactOK=v=>{const d=(v.match(/\d/g)||[]).length;return emailOK(v)||(/^\+?[\d\s().-]{7,20}$/.test(v)&&d>=7&&d<=15)};
const profileOK=p=>!!p&&!!String(p.name||'').trim()&&dobOK(p.dob)&&GENDERS.includes(p.gender)&&!!String(p.occ||'').trim();
const gateNeeded=()=>!S.account||!profileOK(S.profile);
function occPreset(o){o=String(o||'').toLowerCase().trim();if(!o||o==='other')return'other';
 if(/student|school|college|universit|pupil|undergrad|graduate|learner/.test(o))return'student';
 if(/parent|caregiver|carer|mother|father|mom|mum|dad|guardian|homemaker|stay.at.home/.test(o))return'caregiver';
 if(/professional|work|engineer|teacher|manager|developer|nurse|doctor|designer|analyst|consultant|employee|office|business|lawyer|accountant|freelanc|self.employed|clerk|officer|admin/.test(o))return'professional';
 return'other'}
let G={prov:'',err:'',email:''},PF={name:'',dob:'',gender:'',occ:'',contact:'',err:{}};
function pfInit(){const p=(S&&S.profile)||{};PF={name:p.name||(S&&S.name)||'',dob:p.dob||'',gender:p.gender||'',occ:p.occ||'',contact:p.contact||'',err:{}}}
function readPF(){['name','dob','occ','contact'].forEach(k=>{const e=document.getElementById('pf-'+k);if(e)PF[k]=e.value})}
function pfCheck(){readPF();const e={},n=PF.name.trim(),a=String(PF.dob).trim(),o=PF.occ.trim(),c=PF.contact.trim();
 if(!n)e.name='Please enter your name.';
 if(!dobOK(a))e.dob='Please enter a valid birth date.';
 if(!GENDERS.includes(PF.gender))e.gender='Please choose one.';
 if(!o)e.occ='Please enter or pick one.';
 if(c&&!contactOK(c))e.contact='Enter a phone number or email, or leave it empty.';
 PF.err=e;return !Object.keys(e).length}
function pfSave(){const o=PF.occ.trim();S.profile={name:PF.name.trim().slice(0,30),dob:String(PF.dob).trim(),gender:PF.gender,occ:o.slice(0,40),contact:PF.contact.trim().slice(0,60)};S.name=S.profile.name;S.preset=occPreset(o);S.qw=null}
function pfFocus(){setTimeout(()=>{const k=['name','dob','occ','contact'].find(x=>PF.err[x]),el=k&&document.getElementById('pf-'+k);if(el)el.focus()},30)}
function pfFields(){const e=PF.err||{},er=k=>e[k]?`<div class="err" id="pe-${k}" role="alert">${e[k]}</div>`:'',bad=k=>e[k]?` aria-invalid="true" aria-describedby="pe-${k}"`:'';
 return `<div class="fld"><label for="pf-name" class="muted">Name</label><input id="pf-name" maxlength="30" autocomplete="name" value="${esc(PF.name)}"${bad('name')}>${er('name')}</div>
 <div class="fld"><label for="pf-dob" class="muted">Birth date</label><input id="pf-dob" type="date" min="1900-01-01" max="${new Date().toISOString().slice(0,10)}" autocomplete="bday" value="${esc(PF.dob)}"${bad('dob')}>${er('dob')}</div>
 <div class="fld"><div class="muted" id="pg-l">Gender</div><div class="row wrap chips" role="group" aria-labelledby="pg-l">${GENDERS.map(g=>`<button class="small ${PF.gender===g?'':'ghost'}" data-a="pfgender" data-v="${g}" aria-pressed="${PF.gender===g}">${g}</button>`).join('')}</div>${er('gender')}</div>
 <div class="fld"><label for="pf-occ" class="muted">Occupation</label><input id="pf-occ" maxlength="40" autocomplete="organization-title" value="${esc(PF.occ)}"${bad('occ')}><div class="row wrap chips">${OCCS.map(o=>`<button class="small ${PF.occ.trim().toLowerCase()===o.toLowerCase()?'':'ghost'}" data-a="pfocc" data-v="${o}" aria-pressed="${PF.occ.trim().toLowerCase()===o.toLowerCase()}">${o}</button>`).join('')}</div>${er('occ')}</div>
 <div class="fld"><label for="pf-contact" class="muted">Contact (optional)</label><input id="pf-contact" maxlength="60" inputmode="email" autocomplete="email" autocapitalize="off" placeholder="Phone or email" value="${esc(PF.contact)}"${bad('contact')}>${er('contact')}</div>`}
