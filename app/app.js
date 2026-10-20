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
function gateView(){
 if(!S.account){
  if(!G.prov)return `<div class="card center gate"><div class="logo" aria-hidden="true"></div><h1>Tiny Wins</h1><h2>Sign in</h2><div class="stack"><button class="wide" data-a="signin" data-v="gmail">Continue with Gmail</button><button class="wide alt" data-a="signin" data-v="apple">Continue with Apple</button></div></div>`;
  const g=G.prov==='gmail';
  return `<div class="card gate"><button class="small ghost" data-a="gback">Back</button><h2>${g?'Gmail':'Apple'}</h2><label for="gem" class="muted">${g?'Your Gmail address':'Your Apple ID email'}</label><input id="gem" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" placeholder="${g?'name@gmail.com':'name@icloud.com'}" value="${esc(G.email)}"${G.err?' aria-invalid="true" aria-describedby="ge"':''}>${G.err?`<div class="err" id="ge" role="alert">${G.err}</div>`:''}<div style="margin-top:12px"><button class="wide" data-a="gemgo">Continue</button></div></div>`}
 return `<div class="card gate"><h2>About you</h2>${pfFields()}<div style="margin-top:12px"><button class="wide" data-a="pfdone">Start</button></div></div>`}
function greet(){const h=new Date().getHours();const g=h<12?'Good morning':h<18?'Good afternoon':'Good evening';return g+(S.name?', '+esc(S.name):'')+'.'}
function header(){return `<div class="top"><div><h1>Tiny Wins</h1><div class="muted">${greet()}</div></div><div class="row"><button class="small ghost" data-a="quickdark" aria-label="Toggle dark mode">${isDark()?'Light':'Dark'}</button><div class="pill" aria-label="Coins">${S.coins} coins</div></div></div>`}
function levelCard(){const lv=level();const pct=lv.next?Math.round((S.xp-lv.base)/(lv.next-lv.base)*100):100;
 return `<div class="card"><div class="row"><b class="grow">Level ${lv.i}: ${lv.title}</b><span class="muted">${S.xp} XP</span></div><div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div><div class="muted">${lv.next?`${lv.next-S.xp} XP to ${lv.nextTitle}`:'Top level reached.'}</div></div>`}
function streakCard(){const s=S.streak;const paused=s.last&&s.last!==today()&&dayDiff(s.last,today())>1;
 return `<div class="card row"><div class="grow"><b>${s.count===1?'1-day':s.count+'-day'} streak</b><div class="muted">${resting()?'Rest day. Your streak is safe.':paused?'Paused, not lost.':s.last===today()?'You showed up today.':'Any win keeps it going.'}</div></div><button class="small alt" data-a="rest">Rest day</button></div>`}
const catOpts=sel=>allCats().map(c=>`<option value="${esc(c)}" ${sel===c?'selected':''}>${esc(c)}</option>`).join('');
function taskHTML(tk){return `<div class="task"><div class="row"><b class="grow">${tk.done?'Done: ':''}${esc(tk.title)}</b><span class="tag">${esc(tk.cat||'home')}</span><button class="small alt" data-a="setone" data-id="${tk.id}" aria-label="Make this my top priority">Top</button><button class="small ghost" data-a="del" data-id="${tk.id}" aria-label="Remove task">&times;</button></div>
 ${tk.steps.map((s,i)=>`<div class="step ${s.d?'done':''}"><button class="chk ${s.d?'done':''}" data-a="step" data-id="${tk.id}" data-i="${i}" aria-label="Mark step done" aria-pressed="${!!s.d}"></button><span>${esc(s.t)}</span></div>`).join('')}</div>`}
function challengeCard(){const c=getChallenge(),p=challengeProgress(c),ok=p>=c.n;
 return `<div class="card"><div class="row"><h3 class="grow">Daily challenge</h3><span class="pill">+${c.r} coins</span></div><div>${esc(c.t)}</div><div class="muted">${p}/${c.n} ${c.claimed?'· claimed':''}</div><div class="bar"><i style="width:${p/c.n*100}%"></i></div>
 <div style="margin-top:8px">${c.claimed?'<span class="muted">Done. A new one comes tomorrow.</span>':`<button class="small ${ok?'':'ghost'}" data-a="claim" ${ok?'':'disabled'}>${ok?'Claim reward':'Keep going'}</button>`}</div></div>`}
function quickCard(){let q=S.qw;if(!q||!quickWins().includes(q))q=S.qw=pick(quickWins());const mine=S.myQW.includes(q);
 const base=QW.concat(preset().qw);
 const items=base.map(x=>`<div class="qwi row"><span class="grow">${esc(x)}</span></div>`).concat(S.myQW.map((x,i)=>qwEdit===i?`<div class="qwi row"><input id="qwe" class="grow" maxlength="${QW_LEN}" value="${esc(x)}" aria-label="Edit your action"><button class="small" data-a="qwsave" data-i="${i}">Save</button><button class="small ghost" data-a="qwcancel">Cancel</button></div>`:`<div class="qwi row"><span class="grow">${esc(x)}</span><span class="tag">Yours</span><button class="small ghost" data-a="qwedit" data-i="${i}" aria-label="Edit ${esc(x)}">Edit</button><button class="small ghost" data-a="qwdel" data-i="${i}" aria-label="Remove ${esc(x)}">&times;</button></div>`)).join('');
 return `<div class="card"><h3>Feeling stuck?</h3><div class="task"><b>${esc(q)}</b>${mine?' <span class="tag">Yours</span>':''}<div class="row wrap" style="margin-top:8px"><button class="small" data-a="qwdone">Done</button><button class="small ghost" data-a="qwnew">Another</button><button class="small ghost" data-a="qwall">${S.qwAll?'Hide list':'See all'}</button></div></div>
 ${S.qwAll?`<div class="qwlist">${items}</div>`:''}
 <div class="row" style="margin-top:10px"><input id="qwin" maxlength="${QW_LEN}" placeholder="Add your own" aria-label="Add your own 1-minute action"><button class="small" data-a="qwadd">Add</button></div>${S.myQW.length?`<div class="muted" style="margin-top:6px">${S.myQW.length} of ${QW_MAX} added</div>`:''}</div>`}
function reflectCard(full){const t=S.reflections.find(r=>r.date===today());
 return `<div class="card"><h3>What went well today?</h3><div class="row" style="margin-top:8px"><input id="refl" maxlength="140" placeholder="Today I..." value="${t?esc(t.text):''}" aria-label="Reflection"><button data-a="reflect">${t?'Update':'Save'}</button></div></div>`}
function moodCard(){return `<div class="card"><h3>How are you feeling?</h3><div class="row moods">${Object.keys(MOODS).map(k=>`<button class="${S.mood===k?'':'ghost'}" data-a="mood" data-m="${k}" aria-pressed="${S.mood===k}">${k[0].toUpperCase()+k.slice(1)}</button>`).join('')}</div>${S.mood?`<div class="task" style="margin-top:10px"><b>Try this:</b> ${esc(S.sug)}<div class="row wrap" style="margin-top:8px"><button class="small" data-a="sugdone">Did it</button><button class="small ghost" data-a="mood" data-m="${S.mood}">Another idea</button><button class="small alt" data-a="sugadd">Add as task</button></div></div>`:''}</div>`}
function home(){const oneTask=S.one.date===today()?S.tasks.find(t=>t.id==S.one.id):null;const needOne=S.one.date!==today();
 const rest=S.tasks.filter(t=>!oneTask||t.id!==oneTask.id);const others=rest.filter(t=>S.filter==='all'||t.cat===S.filter);
 return header()+levelCard()
 +(needOne?`<div class="card hero"><h3>What's today's top priority?</h3><div class="row" style="margin-top:10px"><input id="onein" maxlength="120" placeholder="Type it here" aria-label="Today's top priority"><button data-a="setonenew">Set</button></div></div>`
  :`<div class="card hero"><h3>Today's top priority</h3>${oneTask?taskHTML(oneTask):'<div class="muted">Done. That counts as a win.</div>'}<button class="small ghost" data-a="resetone">Change</button></div>`)
 +`<div class="card"><h3>Add a task</h3><div class="row"><input id="newt" maxlength="120" placeholder="Type a task" aria-label="New task"><button data-a="add" aria-label="Add task">Add</button></div><div class="row" style="margin-top:8px"><label class="muted" for="newcat">Category</label><select id="newcat" data-a="newcat"><option value="auto" ${S.newCat==='auto'?'selected':''}>Auto</option>${catOpts(S.newCat)}</select></div></div>`
 +`<div class="card"><div class="row"><h3 class="grow">Other tasks (${others.length})</h3><button class="small ghost" data-a="toggleall">${S.showAll?'Hide':'Show'}</button></div>${S.showAll?`<div class="row wrap chips"><button class="small ${S.filter==='all'?'':'ghost'}" data-a="filter" data-c="all">All</button>${allCats().map(c=>`<button class="small ${S.filter===c?'':'ghost'}" data-a="filter" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>${others.map(taskHTML).join('')||'<div class="muted">Nothing here.</div>'}`:''}</div>`
 +challengeCard()+quickCard()+moodCard()+((new Date().getHours()>=18||S.reflections.some(r=>r.date===today()))?reflectCard():'')+streakCard();}
const timerBtns=()=>T.run?`<button class="alt" data-a="tstop">Stop</button>`:`<button data-a="tstart">Start 5 minutes</button>`;
function timerView(){return header()+`<div class="card center"><h2>Just 5 minutes</h2>
 <svg class="ring" viewBox="0 0 220 220" role="img" aria-label="Timer"><circle cx="110" cy="110" r="100" class="rtrack" stroke-width="12" fill="none"/><circle id="ringp" cx="110" cy="110" r="100" class="rprog" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="628" stroke-dashoffset="${628*T.left/T.total}" transform="rotate(-90 110 110)"/><text class="tm rtext" x="110" y="124" text-anchor="middle" font-size="42" font-weight="800">${fmt(T.left)}</text></svg>
 <div class="row" style="justify-content:center">${timerBtns()}</div></div>
 <div class="card">${soundPanel()}<div style="margin-top:12px"><button class="alt" data-a="fullfocus">Open full-screen focus</button></div></div>`}
function focusView(){return `<div class="focus"><div class="focusin"><div class="timer tm">${fmt(T.left)}</div><div class="row">${timerBtns()}<button class="ghost" data-a="unfocus">Leave</button></div><div class="card left">${soundPanel()}</div></div></div>`}
function habitsView(){const days=lastDays(7);return header()+`<div class="card"><h2>Habits</h2>
 ${S.habits.map(h=>{const on=h.days.includes(today());return `<div class="task"><div class="row"><b class="grow">${esc(h.name)}</b><span class="muted">${habitStreak(h)} day${habitStreak(h)===1?'':'s'}</span><button class="small ghost" data-a="delhabit" data-id="${h.id}" aria-label="Remove habit">&times;</button></div>
  <div class="row" style="margin-top:8px"><button class="${on?'':'ghost'} grow" data-a="habit" data-id="${h.id}" aria-pressed="${on}">${on?'Done today':'Check in'}</button><div class="dots" aria-hidden="true">${days.map(d=>`<i class="${h.days.includes(d)?'on':''}"></i>`).join('')}</div></div></div>`}).join('')||'<div class="muted">No habits yet.</div>'}
 <div class="row" style="margin-top:10px"><input id="hn" maxlength="40" placeholder="New habit" aria-label="New habit"><button data-a="addhabit">Add</button></div></div>`}
function rewards(){return header()+`<div class="card"><h2>Rewards jar</h2><div class="muted">Coins: step 1, task 5, timer 5, habit 1, challenge 2.</div>
 ${S.treats.map(t=>`<div class="task row"><span class="grow">${esc(t.name)}</span><b>${t.cost}</b><button class="small ${S.coins>=t.cost?'':'ghost'}" data-a="redeem" data-id="${t.id}">Claim</button><button class="small ghost" data-a="deltreat" data-id="${t.id}" aria-label="Remove treat">&times;</button></div>`).join('')}
 <div class="row" style="margin-top:10px"><input id="trn" class="grow" maxlength="60" placeholder="My treat" aria-label="Treat name"><input id="trc" type="number" min="1" max="9999" inputmode="numeric" style="width:84px" value="10" aria-label="Cost in coins"><button data-a="addtreat">Add</button></div></div>
 <div class="card"><h2>Themes</h2><div class="grid">${Object.entries(THEMES).map(([k,t])=>{const own=S.themes.includes(k),on=S.theme===k;
  return `<div class="opt ${on?'sel':''}"><div class="sw">${t.sw.map(c=>`<i style="background:${c}"></i>`).join('')}</div><b>${t.n}</b><button class="small ${own?'alt':''}" data-a="theme" data-t="${k}">${on?'In use':own?'Apply':t.cost+' coins'}</button></div>`}).join('')}</div></div>`}
function progress(){const w=weekStats(),lv=level();return header()+levelCard()+`<div class="card"><h2>This week</h2><div class="stats"><div><b>${w.tasks}</b><span>tasks done</span></div><div><b>${w.steps}</b><span>steps done</span></div><div><b>${w.focusMin}</b><span>focus min</span></div></div>
 <div class="chart" role="img" aria-label="Wins per day this week">${w.bars.map(b=>`<div><i style="height:${Math.round(b.v/w.max*100)}%"></i><span>${dayShort(b.d)}</span></div>`).join('')}</div>
 <div class="muted">${w.best?`Best day: ${dayName(w.best.d)} with ${w.best.wins} win${w.best.wins===1?'':'s'}.`:'No wins yet this week.'}</div></div>
 <div class="card"><h3>All time</h3><div class="muted">Total wins: ${S.wins} · Best streak: ${S.streak.best} day${S.streak.best===1?'':'s'} · Rest days: ${S.streak.rests.length}</div></div>
 ${reflectCard()}<div class="card"><h3>Reflection history</h3>${S.reflections.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,30).map(r=>`<div class="task"><span class="muted">${esc(r.date)}</span><div>${esc(r.text)}</div></div>`).join('')||'<div class="muted">Nothing yet.</div>'}</div>`}
let showCredits=false;
function creditsView(){const lk=(u,x)=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${x}</a>`;
 return header()+`<div class="card"><div class="row"><button class="small ghost" data-a="credback">Back</button><h2 class="grow">Credits</h2></div>
 <h3>Sounds</h3><div class="credits">${SOUND_CREDITS.map(c=>`<div class="cr"><b>${c.n}</b>: ${lk(c.u,esc(c.t))} by ${esc(c.a)}. Licence: ${c.l.u?lk(c.l.u,c.l.n):c.l.n}. Changes: ${esc(c.c)}</div>`).join('')}<div class="cr">Brown noise, soft noise and calm tones are made on your device. No recordings are used.</div></div>
 <h3>Lofi music</h3><div class="credits">${LOFI.map(x=>`<div class="cr">&ldquo;${esc(x[0])}&rdquo; by ${LOFI_ARTIST} (${lk('https://incompetech.com','incompetech.com')}). Source: ${lk(lofiPage(x),'Wikimedia Commons')}, ${lk(lofiInfo(x),'track info')}. Licence: ${lk(CCBY3.u,CCBY3.n)}. Changes: none to the audio (played as published, only quieter to even out loudness).</div>`).join('')}<div class="cr">The tracks stream from Wikimedia Commons when you press play, at about 2 MB a minute. They are not stored in this app. Your device contacts Wikimedia while a track plays. Kevin MacLeod and Wikimedia are not connected to Tiny Wins and do not endorse it.</div></div>
 <h3>App</h3><div class="credits"><div class="cr">The app icon was made for Tiny Wins. The app has no third-party fonts, icons or libraries. Text uses your device's font.</div></div></div>`}
function settings(){if(showCredits)return creditsView();const n=S.nudges;const seg=(a,cur,opts)=>`<div class="row wrap chips">${opts.map(([v,l])=>`<button class="small ${String(cur)===String(v)?'':'ghost'}" data-a="${a}" data-v="${v}" aria-pressed="${String(cur)===String(v)}">${l}</button>`).join('')}</div>`;
 return header()+`<div class="card"><h2>Profile</h2><div class="muted">${S.account?`Signed in with ${S.account.provider==='gmail'?'Gmail':'Apple'}: ${esc(S.account.email)}`:''}</div><div class="fine">Saved only on this device.</div>${pfFields()}<div class="row wrap" style="margin-top:10px"><button data-a="pfsave">Save</button><button class="ghost" data-a="signout">Sign out</button></div></div>
 <div class="card"><h2>Appearance</h2><h3>Dark mode</h3>${seg('dark',S.dark,[['auto','System'],['off','Light'],['on','Dark']])}<h3>Text size</h3>${seg('txt',S.text,[[90,'Small'],[100,'Medium'],[115,'Large'],[130,'Largest']])}
 <h3>Motion</h3>${seg('calm',S.calm?1:0,[[0,'Normal'],[1,'Reduced']])}<div class="muted">Get more themes in Rewards.</div></div>
 <div class="card"><h2>Reminders</h2><div class="task row"><span class="grow">Friendly nudges</span><button class="small ${n.on?'':'ghost'}" data-a="nudge">${n.on?'On':'Off'}</button></div>
 <div class="task row"><span class="grow">Browser notifications</span><button class="small ${n.notif?'':'ghost'}" data-a="notif">${n.notif?'On':'Off'}</button></div></div>
 <div class="card"><h2>Categories</h2><div class="row wrap chips">${allCats().map(c=>`${CATS.includes(c)?`<span class="tag">${esc(c)}</span>`:`<button class="small alt" data-a="delcat" data-c="${esc(c)}" aria-label="Remove category ${esc(c)}">${esc(c)} &times;</button>`}`).join('')}</div>
 <div class="row" style="margin-top:10px"><input id="cn" maxlength="20" placeholder="New category" aria-label="New category"><button data-a="addcat">Add</button></div></div>
 ${installCard()}
 <div class="card"><h2>Your data</h2><div class="row wrap" style="margin-top:10px"><button data-a="export">Export backup</button><button class="alt" data-a="import">Import backup</button><input type="file" id="impf" accept="application/json,.json" hidden></div>
 <div class="task row" style="margin-top:12px"><span class="grow">Delete all data</span><button class="small ghost" data-a="reset">Delete</button></div></div>
 <div class="card"><div class="task row" style="margin:0"><span class="grow"><b>Credits</b></span><button class="small" data-a="credits">Open</button></div></div>`}
function nav(){return `<nav class="nav" aria-label="Main">${[['home','Today'],['timer','Focus'],['habits','Habits'],['rewards','Rewards'],['progress','Progress'],['settings','Settings']].map(([k,l])=>`<button class="${S.tab===k?'on':''}" data-a="tab" data-t="${k}" ${S.tab===k?'aria-current="page"':''}>${l}</button>`).join('')}</nav>`}
function render(){const a=$('#app');applyPrefs();const keep={};a.querySelectorAll('input[id]').forEach(i=>{if(i.type!=='range'&&i.type!=='file'&&i.value!==i.defaultValue)keep[i.id]=i.value});
 draw(a);Object.keys(keep).forEach(k=>{const el=document.getElementById(k);if(el)el.value=keep[k]})}
function draw(a){if(gateNeeded()){a.innerHTML=gateView();return}if(T.full){a.innerHTML=focusView();return}
 a.innerHTML=({home,timer:timerView,habits:habitsView,rewards,progress,settings}[S.tab]||home)()+nav();}
document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(!el||el.tagName==='SELECT')return;const a=el.dataset.a,id=el.dataset.id,v=el.dataset.v;
 const A={signin:()=>{G.prov=v;G.err='';G.email=''},gback:()=>{G.prov='';G.err=''},gemgo:()=>{const m=($('#gem').value||'').trim();G.email=m;if(!emailOK(m)){G.err='Enter a valid email address.';setTimeout(()=>{const x=$('#gem');x&&x.focus()},30);return}
  S.account={provider:G.prov,email:m.slice(0,80)};G={prov:'',err:'',email:''};pfInit();if(profileOK(S.profile))S.onboarded=true},
 pfgender:()=>{readPF();PF.gender=v;delete PF.err.gender},pfocc:()=>{readPF();PF.occ=v;delete PF.err.occ},
 pfdone:()=>{if(!pfCheck()){pfFocus();return}pfSave();S.onboarded=true;toast('Welcome, '+S.name)},
 pfsave:()=>{if(!pfCheck()){pfFocus();return}pfSave();toast('Saved')},
 signout:()=>{stopSound();lofiStop(true);setSleep(0);S.account=null;G={prov:'',err:'',email:''};pfInit()},
 tab:()=>{S.tab=el.dataset.t;showCredits=false;if(S.tab==='settings')pfInit();scrollTo(0,0)},credits:()=>{showCredits=true;scrollTo(0,0)},credback:()=>{showCredits=false;scrollTo(0,0)},add:()=>{addTask($('#newt').value);return 1},
 step:()=>{toggleStep(id,+el.dataset.i);return 1},del:()=>{S.tasks=S.tasks.filter(t=>t.id!=id)},
 setone:()=>{S.one={date:today(),id:+id};toast("Set as today's top priority")},resetone:()=>{S.one={date:null,id:null}},
 setonenew:()=>{const t=$('#onein').value.trim();if(!t)return 1;addTask(t);S.one={date:today(),id:S.tasks[0].id}},
 toggleall:()=>{S.showAll=!S.showAll},filter:()=>{S.filter=el.dataset.c},rest:()=>{restDay();return 1},
 mood:()=>{S.mood=el.dataset.m;const l=MOODS[S.mood].s.concat(preset().mood);let n,k=0;do{n=pick(l)}while(n===S.sug&&l.length>1&&k++<20);S.sug=n},
 sugdone:()=>{S.mood=null;win(1,10,'Nice one. +1 coin');return 1},sugadd:()=>{const s=S.sug;S.mood=null;addTask(s);return 1},
 qwnew:()=>{const l=quickWins();let n,k=0;do{n=pick(l)}while(n===S.qw&&k++<20);S.qw=n},qwall:()=>{S.qwAll=!S.qwAll},qwadd:()=>{const t=cleanQW([$('#qwin').value])[0];if(!t){toast('Type a short action first');return 1}
  if(S.myQW.length>=QW_MAX){toast('That is plenty. Remove one to add another');return 1}
  if(quickWins().some(x=>x.toLowerCase()===t.toLowerCase())){toast('Already in your list');return 1}
  S.myQW.push(t);S.qw=t;qwEdit=-1;$('#qwin').value='';toast('Added to your list')},
 qwedit:()=>{qwEdit=+el.dataset.i;S.qwAll=true},qwcancel:()=>{qwEdit=-1},
 qwsave:()=>{const i=+el.dataset.i,t=cleanQW([$('#qwe').value])[0];if(!t){toast('Type a short action, or remove it with the x');return 1}
  if(quickWins().some((x,k)=>x.toLowerCase()===t.toLowerCase()&&x!==S.myQW[i])){toast('Already in your list');return 1}
  const old=S.myQW[i];S.myQW[i]=t;if(S.qw===old)S.qw=t;qwEdit=-1;toast('Saved')},
 qwdel:()=>{const i=+el.dataset.i,old=S.myQW[i];S.myQW.splice(i,1);if(S.qw===old)S.qw=null;qwEdit=-1;toast('Removed')},

 qwdone:()=>{L().quick=(L().quick||0)+1;S.qw=null;win(1,3,'Nice. +1 coin');return 1},
 claim:()=>{const c=getChallenge();if(c.claimed||challengeProgress(c)<c.n)return 1;c.claimed=true;win(c.r,15,`Challenge complete. +${c.r} coins`);return 1},
 habit:()=>{toggleHabit(+id);return 1},delhabit:()=>{S.habits=S.habits.filter(h=>h.id!=id)},
 addhabit:()=>{const n=$('#hn').value.trim().slice(0,40);if(n){S.habits.push({id:Date.now(),name:n,days:[],paid:[]});$('#hn').value=''}},
 reflect:()=>{const t=($('#refl').value||'').trim();if(!t)return 1;const ex=S.reflections.find(r=>r.date===today());if(ex){ex.text=t;save();render();toast('Reflection updated');return 1}
  S.reflections.push({date:today(),text:t});win(1,5,'Reflection saved. +1 coin');return 1},
 tstart:()=>{startTimer();return 1},tstop:()=>{finishTimer(false);return 1},
 sound:()=>{startSound(el.dataset.s)},sleep:()=>{SND.sleepMin=+v;setSleep(+v)},lplay:()=>{lofiToggle()},lnext:()=>{lofiNext()},lshuf:()=>{LF.shuffle=!LF.shuffle;if(LF.state!=='off'){LF.order=lofiOrder(LF.i);LF.pos=0}},lstop:()=>{lofiStop(true)},ltrack:()=>{lofiStart(+v)},fullfocus:()=>{T.full=true},unfocus:()=>{T.full=false},
 redeem:()=>{const t=S.treats.find(x=>x.id==id);if(S.coins<t.cost){toast(`${t.cost-S.coins} more coins to go`);return 1}S.coins-=t.cost;toast(`Enjoy: ${t.name}`)},
 deltreat:()=>{S.treats=S.treats.filter(t=>t.id!=id)},addtreat:()=>{const n=$('#trn').value.trim().slice(0,60),c=Math.min(9999,Math.max(1,Math.round(+$('#trc').value||10)));if(n){S.treats.push({id:Date.now(),name:n,cost:c});$('#trn').value='';$('#trc').value=10}},
 theme:()=>{const k=el.dataset.t,t=THEMES[k];if(!S.themes.includes(k)){if(S.coins<t.cost){toast(`${t.cost-S.coins} more coins to unlock ${t.n}`);return 1}S.coins-=t.cost;S.themes.push(k);toast(`${t.n} unlocked`)}S.theme=k},
 quickdark:()=>{S.dark=isDark()?'off':'on'},dark:()=>{S.dark=v},txt:()=>{S.text=+v},calm:()=>{S.calm=v==='1'},nudge:()=>{S.nudges.on=!S.nudges.on},
 notif:()=>{if(!S.nudges.notif&&'Notification'in window){Notification.requestPermission().then(p=>{S.nudges.notif=p==='granted';if(!S.nudges.notif)toast('Not allowed. In-app nudges still work.');save();render()});return 1}S.nudges.notif=false;if(!('Notification'in window))toast('Notifications are not supported here')},
 addcat:()=>{const n=$('#cn').value.trim().toLowerCase().slice(0,20);if(n&&!allCats().includes(n))S.cats.push(n);$('#cn').value=''},delcat:()=>{const c=el.dataset.c;S.cats=S.cats.filter(x=>x!==c);S.tasks.forEach(t=>{if(t.cat===c)t.cat='home'});if(S.filter===c)S.filter='all';if(S.newCat===c)S.newCat='auto'},
inst:()=>{const d=deferredInstall;if(!d)return 1;deferredInstall=null;d.prompt();d.userChoice.then(c=>{toast(c.outcome==='accepted'?'Installing...':'No problem. You can install later.');render()}).catch(()=>render());render();return 1},install:()=>{instAll=!instAll}, export:()=>{exportData();return 1},import:()=>{$('#impf').click();return 1},
 reset:()=>{if(confirm('Delete all data on this device?')){stopSound();lofiStop(true);setSleep(0);localStorage.removeItem(KEY);S=load();G={prov:'',err:'',email:''};pfInit();scrollTo(0,0)}}};
 if(A[a]&&!A[a]()){save();render()}});
document.addEventListener('change',e=>{const t=e.target;if(t.id==='newcat'){S.newCat=t.value;save()}if(t.id==='impf'&&t.files[0])importData(t.files[0])});
document.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const id=e.target.id;if(id==='newt')addTask(e.target.value);if(id==='onein')$('[data-a=setonenew]').click();if(id==='gem')$('[data-a=gemgo]').click();if(id&&id.startsWith('pf-')){const b=$('[data-a=pfdone]')||$('[data-a=pfsave]');if(b)b.click()}if(id==='refl')$('[data-a=reflect]').click();if(id==='hn')$('[data-a=addhabit]').click();if(id==='cn')$('[data-a=addcat]').click();if(id==='trn'||id==='trc')$('[data-a=addtreat]').click();if(id==='qwin')$('[data-a=qwadd]').click();if(id==='qwe')$('[data-a=qwsave]').click()});
document.addEventListener('input',e=>{if(e.target.id==='vol'){S.vol=e.target.value/100;applyVol();save();return}if(e.target.id==='gem')G.email=e.target.value;if(e.target.id&&e.target.id.startsWith('pf-'))readPF()});
if(window.matchMedia)matchMedia('(prefers-color-scheme: dark)').addEventListener&&matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(S.dark==='auto')applyPrefs()});
let lastDay=today();
function dayCheck(){if(lastDay!==today()){lastDay=today();const f=document.activeElement;if(!(f&&f.tagName==='INPUT'&&f.type!=='range'))render()}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)dayCheck()});
setInterval(()=>{dayCheck();nudgeTick()},60e3);
if('serviceWorker'in navigator&&location.protocol!=='file:'&&location.protocol!=='about:')navigator.serviceWorker.register('sw.js').catch(()=>{});
S=load();pfInit();{const t=new URLSearchParams(location.search).get('tab');if(S.onboarded&&['home','timer','habits','rewards','progress','settings'].includes(t))S.tab=t}
if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{});
render();
