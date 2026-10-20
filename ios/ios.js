/* Tiny Wins for iPhone: iOS-style UI layer. Business logic comes from core.js (shared with the main app). */
function greet(){const h=new Date().getHours();const g=h<12?"Good morning":h<18?"Good afternoon":"Good evening";return g+(S.name?", "+esc(S.name):"")+"."}
const IC=(d,f)=>`<svg viewBox="0 0 24 24" aria-hidden="true" class="ic${f?' f':''}">${d}</svg>`;
const I={today:IC('<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16.5 9.5"/>'),focus:IC('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M9.5 3h5"/>'),
 habits:IC('<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8.5 3v4M15.5 3v4"/>'),rewards:IC('<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>'),
 settings:IC('<path d="M4 7h9M18 7h2M4 17h3M12 17h8"/><circle cx="15.5" cy="7" r="2.5"/><circle cx="9.5" cy="17" r="2.5"/>'),back:IC('<path d="M15 4.5L7.5 12l7.5 7.5"/>'),chev:IC('<path d="M9.5 6l6 6-6 6"/>'),
 plus:IC('<path d="M12 5v14M5 12h14"/>'),more:IC('<circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/>',1),play:IC('<path d="M8 5.5v13l10.5-6.5z"/>',1),
 pause:IC('<rect x="6.5" y="5.5" width="3.8" height="13" rx="1"/><rect x="13.7" y="5.5" width="3.8" height="13" rx="1"/>',1),next:IC('<path d="M5.5 6v12l8.5-6z"/><rect x="15.5" y="6" width="2.6" height="12" rx="1"/>',1),
 check:IC('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),stop:IC('<rect x="6.5" y="6.5" width="11" height="11" rx="2"/>',1),expand:IC('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),minus:IC('<circle cx="12" cy="12" r="10"/><path d="M7.5 12h9" stroke="#fff"/>',0)};
const TABS=[['home','Today',I.today],['timer','Focus',I.focus],['habits','Habits',I.habits],['rewards','Rewards',I.rewards],['settings','Settings',I.settings]];
const TT={progress:'Progress',profile:'Profile',appearance:'Appearance',reminders:'Reminders',cats:'Categories',install:'Home Screen',data:'Your data',credits:'Credits',tracks:'Lofi tracks'};
let NV={home:[],timer:[],habits:[],rewards:[],settings:[]},ANIM='',SCR={},SH=null,AL=null,AS=null,OVNEW=false,EDIT={habits:false,treats:false},RW='treats';
const topScr=()=>{const s=NV[S.tab]||[];return s[s.length-1]||''};
const spinner='<span class="spin" role="progressbar" aria-label="Loading"></span>';
const grp=(rows,head,foot,hid)=>`${head?`<div class="ghead"${hid?` id="${hid}"`:''}>${head}</div>`:''}<div class="group">${rows}</div>${foot?`<div class="gfoot">${foot}</div>`:''}`;
const link=(v,label,val)=>`<button class="cell link" data-a="push" data-v="${v}"><span class="grow">${label}</span>${val?`<span class="val">${val}</span>`:''}${I.chev}</button>`;
const seg=(a,cur,opts,lbl)=>`<div class="seg" role="group"${lbl?` aria-label="${lbl}"`:''}>${opts.map(([v,l])=>`<button data-a="${a}" data-v="${v}" aria-pressed="${String(cur)===String(v)}">${l}</button>`).join('')}</div>`;
const swc=(a,on,label)=>`<label class="cell"><span class="grow">${label}</span><input type="checkbox" switch role="switch" data-a="${a}" ${on?'checked':''}></label>`;
const coinsPill=()=>`<span class="coins" aria-label="Coins">${S.coins} coins</span>`;
/* theme -> iOS colors */
function applyPrefs(){const r=document.documentElement,th=THEMES[S.theme]||THEMES.slate,dk=isDark();r.dataset.theme=S.theme;r.dataset.mode=dk?'dark':'light';r.style.setProperty('--ts',S.text/100);
 r.classList.toggle('calm',!!S.calm);const lum=h=>{const n=parseInt(h.slice(1),16);return(.3*(n>>16)+.59*(n>>8&255)+.11*(n&255))/255};
 const tint=dk?(S.theme==='noir'?'#e4e4e4':`color-mix(in srgb, ${th.sw[0]} 62%, white)`):th.sw[0];
 const bg=dk?(th.dbar||(S.theme==='midnight'?th.bar:'#000')):(lum(th.bar)<.5?'#f2f2f7':th.bar);
 r.style.setProperty('--tint',tint);r.style.setProperty('--onTint',dk?'#000':'#fff');r.style.setProperty('--bg',bg);r.style.colorScheme=dk?'dark':'light';
 document.querySelectorAll('meta[name=theme-color]').forEach(m=>m.content=bg);}
/* nav bar */
function nb(title,o={}){const st=NV[S.tab]||[],back=st.length?(st.length>1?TT[st[st.length-2]]:TABS.find(t=>t[0]===S.tab)[1]):null,large=!st.length;
 return `<header class="nb${large?' lg':''}"><div class="nbbar"><div class="nbl">${back?`<button class="nbback" data-a="pop" aria-label="Back to ${back}">${I.back}<span>${esc(back)}</span></button>`:(o.left||'')}</div><div class="nbt"${large?' aria-hidden="true"':''}>${esc(title)}</div><div class="nbr">${o.right||''}</div></div></header>${large?`<div class="lt"><h1>${esc(title)}</h1>${o.sub?`<div class="sub">${o.sub}</div>`:''}</div>`:''}`}
function tabbar(){return `<nav class="tabbar" aria-label="Main">${TABS.map(([k,l,ic])=>`<button class="${S.tab===k?'on':''}" data-a="tab" data-t="${k}" ${S.tab===k?'aria-current="page"':''}>${ic}<span>${l}</span></button>`).join('')}</nav>`}
/* gate */
function gateView(){
 if(!S.account){
  if(!G.prov)return `<main class="gscr welcome ${ANIM}"><div class="wtop"><img class="logo" src="icon-192.png" alt=""><h1>Tiny Wins</h1><p class="sub">Small steps. No guilt.</p></div>
   <div class="wbtm"><h2 class="sih">Sign in</h2><button class="btn big" data-a="signin" data-v="gmail">Continue with Gmail</button><button class="btn big apple" data-a="signin" data-v="apple">Continue with Apple</button></div></main>`;
  const g=G.prov==='gmail';
  return `<main class="gscr ${ANIM}"><header class="nb"><div class="nbbar"><div class="nbl"><button class="nbback" data-a="gback" aria-label="Back">${I.back}<span>Sign in</span></button></div><div class="nbt">${g?'Gmail':'Apple'}</div><div class="nbr"></div></div></header>
   <div class="content"><div class="lt"><h1>${g?'Gmail':'Apple'}</h1></div>${grp(`<div class="cell fcell"><input id="gem" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" enterkeyhint="go" placeholder="${g?'name@gmail.com':'name@icloud.com'}" value="${esc(G.email)}"${G.err?' aria-invalid="true" aria-describedby="ge"':''}></div>`,`<label for="gem">${g?'Your Gmail address':'Your Apple ID email'}</label>`)}
   ${G.err?`<div class="err" id="ge" role="alert">${G.err}</div>`:''}<button class="btn big" data-a="gemgo">Continue</button></div></main>`}
 return `<main class="gscr ${ANIM}"><div class="content"><div class="lt top"><h1>About you</h1></div>${pfFields()}<button class="btn big" data-a="pfdone">Start</button></div></main>`}
function pfFields(){const e=PF.err||{},er=k=>e[k]?`<div class="err" id="pe-${k}" role="alert">${e[k]}</div>`:'',bad=k=>e[k]?` aria-invalid="true" aria-describedby="pe-${k}"`:'';
 return grp(`<div class="cell fcell"><input id="pf-name" maxlength="30" autocomplete="name" enterkeyhint="next" value="${esc(PF.name)}"${bad('name')}></div>`,'<label for="pf-name">Name</label>')+er('name')
 +grp(`<div class="cell fcell"><input id="pf-dob" type="date" min="1900-01-01" max="${today()}" autocomplete="bday" value="${esc(PF.dob)}"${bad('dob')}></div>`,'<label for="pf-dob">Birth date</label>')+er('dob')
 +grp(GENDERS.map(g=>`<button class="cell pick" data-a="pfgender" data-v="${g}" aria-pressed="${PF.gender===g}"><span class="grow">${g}</span>${PF.gender===g?I.check:''}</button>`).join(''),'Gender','','pg-l').replace('<div class="group">','<div class="group" role="group" aria-labelledby="pg-l">')+er('gender')
 +grp(`<div class="cell fcell"><input id="pf-occ" maxlength="40" autocomplete="organization-title" value="${esc(PF.occ)}"${bad('occ')}></div>`,'<label for="pf-occ">Occupation</label>')
 +`<div class="chips">${OCCS.map(o=>{const on=PF.occ.trim().toLowerCase()===o.toLowerCase();return `<button class="chip" data-a="pfocc" data-v="${o}" aria-pressed="${on}">${o}</button>`}).join('')}</div>`+er('occ')
 +grp(`<div class="cell fcell"><input id="pf-contact" maxlength="60" inputmode="email" autocomplete="email" autocapitalize="off" placeholder="Phone or email" value="${esc(PF.contact)}"${bad('contact')}></div>`,'<label for="pf-contact">Contact (optional)</label>')+er('contact')}
/* Today */
function taskHTML(tk){return `<div class="group task"><div class="cell thead"><div class="grow"><b>${tk.done?'Done: ':''}${esc(tk.title)}</b> <span class="tag">${esc(tk.cat||'home')}</span></div><button class="ib" data-a="tmore" data-id="${tk.id}" aria-label="Task options">${I.more}</button></div>
 ${tk.steps.map((s,i)=>`<button class="cell step${s.d?' done':''}" data-a="step" data-id="${tk.id}" data-i="${i}" aria-pressed="${!!s.d}" aria-label="${esc(s.t)}"><span class="chk" aria-hidden="true">${s.d?I.check:''}</span><span class="grow">${esc(s.t)}</span></button>`).join('')}</div>`}
function levelCell(){const lv=level(),pct=lv.next?Math.round((S.xp-lv.base)/(lv.next-lv.base)*100):100;
 return `<div class="group"><button class="cell link lvl" data-a="push" data-v="progress"><div class="grow"><div class="row"><b class="grow">Level ${lv.i}: ${lv.title}</b><span class="val">${S.xp} XP</span></div><div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div><div class="sec">${lv.next?`${lv.next-S.xp} XP to ${lv.nextTitle}`:'Top level reached.'}</div></div>${I.chev}</button></div>`}
function homeV(){const oneTask=S.one.date===today()?S.tasks.find(t=>t.id==S.one.id):null,needOne=S.one.date!==today();
 const rest=S.tasks.filter(t=>!oneTask||t.id!==oneTask.id),others=rest.filter(t=>S.filter==='all'||t.cat===S.filter);
 const c=getChallenge(),p=challengeProgress(c),ok=p>=c.n;
 let q=S.qw;if(!q||!quickWins().includes(q))q=S.qw=pick(quickWins());const mine=S.myQW.includes(q);const rf=S.reflections.find(r=>r.date===today());const s=S.streak,paused=s.last&&s.last!==today()&&dayDiff(s.last,today())>1;
 return nb('Today',{sub:greet(),right:`${coinsPill()}<button class="nbbtn" data-a="sheet" data-v="add" aria-label="Add task">${I.plus}</button>`})+`<div class="content">${levelCell()}
 ${needOne?grp(`<div class="cell fcell"><input id="onein" maxlength="120" placeholder="Type it here" enterkeyhint="done" aria-label="Today's top priority"><button class="btn sm" data-a="setonenew">Set</button></div>`,"What's today's top priority?")
  :`<div class="ghead">Today's top priority</div>${oneTask?taskHTML(oneTask):grp('<div class="cell sec">Done. That counts as a win.</div>')}<div class="rowbtns"><button class="tbtn" data-a="resetone">Change</button></div>`}
 <div class="ghead row"><span class="grow">Other tasks (${others.length})</span><button class="tbtn" data-a="toggleall">${S.showAll?'Hide':'Show'}</button></div>
 ${S.showAll?`<div class="chips scrollx">${[['all','All']].concat(allCats().map(x=>[x,x])).map(([k,l])=>`<button class="chip" data-a="filter" data-c="${esc(k)}" aria-pressed="${S.filter===k}">${esc(l)}</button>`).join('')}</div>${others.map(taskHTML).join('')||grp('<div class="cell sec">Nothing here.</div>')}`:''}
 <div class="rowbtns"><button class="tbtn" data-a="sheet" data-v="add">${I.plus} Add a task</button></div>
 ${grp(`<div class="cell col"><div class="row"><b class="grow">${esc(c.t)}</b><span class="pill">+${c.r} coins</span></div><div class="sec">${p}/${c.n}${c.claimed?' · claimed':''}</div><div class="bar"><i style="width:${p/c.n*100}%"></i></div>
  <div>${c.claimed?'<span class="sec">Done. A new one comes tomorrow.</span>':`<button class="btn sm${ok?'':' gray'}" data-a="claim" ${ok?'':'disabled'}>${ok?'Claim reward':'Keep going'}</button>`}</div></div>`,'Daily challenge')}
 ${grp(`<div class="cell col"><b>${esc(q)}</b>${mine?' <span class="tag">Yours</span>':''}<div class="row wrap gap"><button class="btn sm" data-a="qwdone">Done</button><button class="btn sm gray" data-a="qwnew">Another</button><button class="btn sm gray" data-a="qwall">See all</button></div></div>
  <div class="cell fcell"><input id="qwin" maxlength="${QW_LEN}" placeholder="Add your own" enterkeyhint="done" aria-label="Add your own 1-minute action"><button class="btn sm" data-a="qwadd">Add</button></div>`,'Feeling stuck?',S.myQW.length?`${S.myQW.length} of ${QW_MAX} added`:'')}
 <div class="ghead">How are you feeling?</div>${seg('mood',S.mood,Object.keys(MOODS).map(k=>[k,k[0].toUpperCase()+k.slice(1)]),'Mood').replace(/data-v=/g,'data-m=')}
 ${S.mood?grp(`<div class="cell col"><div><b>Try this:</b> ${esc(S.sug)}</div><div class="row wrap gap"><button class="btn sm" data-a="sugdone">Did it</button><button class="btn sm gray" data-a="mood" data-m="${S.mood}">Another idea</button><button class="btn sm gray" data-a="sugadd">Add as task</button></div></div>`):''}
 ${(new Date().getHours()>=18||rf)?reflectGrp():''}
 ${grp(`<div class="cell"><div class="grow"><b>${s.count===1?'1-day':s.count+'-day'} streak</b><div class="sec">${resting()?'Rest day. Your streak is safe.':paused?'Paused, not lost.':s.last===today()?'You showed up today.':'Any win keeps it going.'}</div></div><button class="btn sm gray" data-a="rest">Rest day</button></div>`,'Streak')}</div>`}
function reflectGrp(){const t=S.reflections.find(r=>r.date===today());return grp(`<div class="cell fcell"><input id="refl" maxlength="140" placeholder="Today I..." enterkeyhint="done" value="${t?esc(t.text):''}" aria-label="Reflection"><button class="btn sm" data-a="reflect">${t?'Update':'Save'}</button></div>`,'What went well today?')}
function progressV(){const w=weekStats();return nb('Progress')+`<div class="content"><div class="lt"><h1>Progress</h1></div>${levelCell().replace('data-a="push" data-v="progress"','tabindex="-1"').replace(I.chev,'')}
 ${grp(`<div class="cell col"><div class="stats"><div><b>${w.tasks}</b><span>tasks done</span></div><div><b>${w.steps}</b><span>steps done</span></div><div><b>${w.focusMin}</b><span>focus min</span></div></div>
 <div class="chart" role="img" aria-label="Wins per day this week">${w.bars.map(b=>`<div><i style="height:${Math.round(b.v/w.max*100)}%"></i><span>${dayShort(b.d)}</span></div>`).join('')}</div><div class="sec">${w.best?`Best day: ${dayName(w.best.d)} with ${w.best.wins} win${w.best.wins===1?'':'s'}.`:'No wins yet this week.'}</div></div>`,'This week')}
 ${grp(`<div class="cell"><span class="grow">Total wins</span><span class="val">${S.wins}</span></div><div class="cell"><span class="grow">Best streak</span><span class="val">${S.streak.best} day${S.streak.best===1?'':'s'}</span></div><div class="cell"><span class="grow">Rest days</span><span class="val">${S.streak.rests.length}</span></div>`,'All time')}
 ${reflectGrp()}${grp(S.reflections.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,30).map(r=>`<div class="cell col"><span class="sec">${esc(r.date)}</span><div>${esc(r.text)}</div></div>`).join('')||'<div class="cell sec">Nothing yet.</div>','Reflection history')}</div>`}
/* Focus */
const timerBtns=()=>T.run?`<button class="btn big red" data-a="tstop">Stop</button>`:`<button class="btn big" data-a="tstart">Start 5 minutes</button>`;
function ringSVG(){return `<svg class="ring" viewBox="0 0 220 220" role="img" aria-label="Timer"><circle cx="110" cy="110" r="100" class="rtrack" stroke-width="12" fill="none"/><circle id="ringp" cx="110" cy="110" r="100" class="rprog" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="628" stroke-dashoffset="${628*T.left/T.total}" transform="rotate(-90 110 110)"/><text class="tm rtext" x="110" y="124" text-anchor="middle" font-size="44" font-weight="700">${fmt(T.left)}</text></svg>`}
function lofiInner(){const t=LOFI[LF.i],on=LF.state!=='off',offl=navigator.onLine===false,pl=LF.state==='playing'||LF.state==='loading';
 return `<div class="cell lofi"><div class="art" aria-hidden="true">${LF.state==='loading'?spinner:(LF.state==='playing'?'<span class="eq"><i></i><i></i><i></i></span>':'♪')}</div><div class="grow lofinow" role="status" aria-live="polite">${t&&on?`<b>${esc(t[0])}</b><div class="sec">${esc(LF.msg||(LF.state==='paused'?'Paused':'Playing'))} · ${LOFI_ARTIST}</div>`:`<b>Lofi</b><div class="sec">${esc(offl?'You are offline. Lofi needs internet.':(LF.msg||'Press play. Needs internet.'))}</div>`}</div>
 <button class="ib round" data-a="lplay" aria-label="${pl?'Pause':'Play lofi'}">${pl?I.pause:I.play}</button><button class="ib" data-a="lnext" aria-label="Next" ${on?'':'disabled'}>${I.next}</button>${on?`<button class="ib" data-a="lstop" aria-label="Stop">${I.stop}</button>`:''}</div>
 <label class="cell"><span class="grow">Shuffle</span><input type="checkbox" switch role="switch" data-a="lshuf" ${LF.shuffle?'checked':''}></label>${link('tracks','Tracks',LOFI.length)}`}
function updLofi(){const e=document.getElementById('lofi');if(e)e.innerHTML=lofiInner();if(topScr()==='tracks'&&!gateNeeded())render()}
function soundPanel(){return grp(SOUNDS.map(([k,n])=>`<button class="cell pick" data-a="sound" data-s="${k}" aria-pressed="${SND.kind===k}"><span class="grow">${n}</span>${SND.kind===k?I.check:''}</button>`).join(''),'Ambient sound','Works offline.')
 +`<div class="ghead">Lofi music</div><div class="group" id="lofi">${lofiInner()}</div>`
 +grp(`<div class="cell"><label for="vol" class="sec">Volume</label><input id="vol" class="grow" type="range" min="0" max="100" value="${Math.round(S.vol*100)}" aria-label="Volume"></div>`)
 +`<div class="ghead row"><span class="grow">Sleep timer</span><span class="sec sleepleft">${sleepText()}</span></div>`+seg('sleep',SND.sleepAt?SND.sleepMin:0,[[0,'Off'],[15,'15 min'],[30,'30 min'],[60,'60 min']],'Sleep timer')}
function timerV(){return nb('Focus',{right:`<button class="nbbtn" data-a="fullfocus" aria-label="Full-screen focus">${I.expand}</button>`})+`<div class="content"><div class="ringwrap">${ringSVG()}<div class="center">${timerBtns()}</div></div>${soundPanel()}
 <button class="btn big gray" data-a="fullfocus">Full-screen focus</button></div>`}
function tracksV(){const on=LF.state!=='off';return nb('Lofi tracks')+`<div class="content"><div class="lt"><h1>Lofi tracks</h1></div>${grp(LOFI.map((x,k)=>`<button class="cell pick" data-a="ltrack" data-v="${k}" aria-pressed="${on&&LF.i===k}"><span class="grow">${esc(x[0])}<div class="sec">${LOFI_ARTIST}</div></span>${on&&LF.i===k?(LF.state==='loading'?spinner:I.check):''}</button>`).join(''),'','Streams from Wikimedia Commons. Needs internet.')}</div>`}
function focusView(){return `<div class="cover ${ANIM}"><div class="cvbar"><button class="tbtn" data-a="unfocus">Leave</button></div><div class="ringwrap big">${ringSVG()}<div class="center">${timerBtns()}</div></div>${soundPanel()}</div>`}
/* Habits */
function habitsV(){const days=lastDays(7);return nb('Habits',{right:S.habits.length?`<button class="nbtxt" data-a="edit" data-v="habits">${EDIT.habits?'Done':'Edit'}</button>`:''})+`<div class="content">
 ${grp(S.habits.map(h=>{const on=h.days.includes(today()),n=habitStreak(h);return `<div class="cell habit">${EDIT.habits?`<button class="ib del" data-a="delhabit" data-id="${h.id}" aria-label="Remove habit ${esc(h.name)}">${I.minus}</button>`:''}<div class="grow"><b>${esc(h.name)}</b><div class="sec">${n} day${n===1?'':'s'} <span class="dots" aria-hidden="true">${days.map(d=>`<i class="${h.days.includes(d)?'on':''}"></i>`).join('')}</span></div></div>
 <button class="ckbtn${on?' on':''}" data-a="habit" data-id="${h.id}" aria-pressed="${on}" aria-label="${on?'Done today':'Check in'}: ${esc(h.name)}">${on?I.check:''}<span>${on?'Done today':'Check in'}</span></button></div>`}).join('')||'<div class="cell sec">No habits yet.</div>')}
 ${grp(`<div class="cell fcell"><input id="hn" maxlength="40" placeholder="New habit" enterkeyhint="done" aria-label="New habit"><button class="btn sm" data-a="addhabit">Add</button></div>`,'Add a habit','Check in: +1 coin.')}</div>`}
/* Rewards */
function rewardsV(){return nb('Rewards',{right:`${coinsPill()}${RW==='treats'&&S.treats.length?`<button class="nbtxt" data-a="edit" data-v="treats">${EDIT.treats?'Done':'Edit'}</button>`:''}`})+`<div class="content">${seg('rwseg',RW,[['treats','Treats'],['themes','Themes']],'Rewards section')}
 ${RW==='treats'?grp(S.treats.map(t=>`<div class="cell">${EDIT.treats?`<button class="ib del" data-a="deltreat" data-id="${t.id}" aria-label="Remove treat ${esc(t.name)}">${I.minus}</button>`:''}<span class="grow">${esc(t.name)}</span><span class="val">${t.cost}</span><button class="btn sm${S.coins>=t.cost?'':' gray'}" data-a="redeem" data-id="${t.id}">Claim</button></div>`).join('')||'<div class="cell sec">No treats yet.</div>','Rewards jar','Coins: step 1, task 5, timer 5, habit 1, challenge 2.')
  +grp(`<div class="cell fcell"><input id="trn" class="grow" maxlength="60" placeholder="My treat" aria-label="Treat name"><input id="trc" type="number" min="1" max="9999" inputmode="numeric" value="10" aria-label="Cost in coins"><button class="btn sm" data-a="addtreat">Add</button></div>`,'Add a treat')
 :`<div class="ghead">Themes</div><div class="grid">${Object.entries(THEMES).map(([k,t])=>{const own=S.themes.includes(k),on=S.theme===k;return `<div class="opt${on?' sel':''}"><div class="sw">${t.sw.map(c=>`<i style="background:${c}"></i>`).join('')}</div><b>${t.n}</b><button class="btn sm${own&&!on?' gray':''}" data-a="theme" data-t="${k}">${on?'In use':own?'Apply':t.cost+' coins'}</button></div>`}).join('')}</div>`}</div>`}
/* Settings */
function settingsV(){const n=(S.profile.name||'?').trim();return nb('Settings')+`<div class="content">
 <div class="group"><button class="cell link prof" data-a="push" data-v="profile"><span class="av" aria-hidden="true">${esc(n[0]||'?').toUpperCase()}</span><span class="grow"><b>${esc(n)}</b><div class="sec">${S.account?`${S.account.provider==='gmail'?'Gmail':'Apple'}: ${esc(S.account.email)}`:''}</div></span>${I.chev}</button></div>
 ${grp(link('appearance','Appearance',S.dark==='auto'?'System':S.dark==='on'?'Dark':'Light')+link('reminders','Reminders',S.nudges.on?'On':'Off')+link('cats','Categories',allCats().length))}
 ${grp(link('install','Add to Home Screen',isStandalone()?'Added':'')+link('data','Your data')+link('credits','Credits'))}
 ${grp(`<button class="cell danger" data-a="signout">Sign out</button>`)}</div>`}
function profileV(){return nb('Profile',{right:`<button class="nbtxt b" data-a="pfsave">Save</button>`})+`<div class="content"><div class="lt"><h1>Profile</h1></div>${pfFields()}<button class="btn big" data-a="pfsave">Save</button></div>`}
function appearanceV(){return nb('Appearance')+`<div class="content"><div class="lt"><h1>Appearance</h1></div><div class="ghead">Dark mode</div>${seg('dark',S.dark,[['auto','System'],['off','Light'],['on','Dark']],'Dark mode')}
 <div class="ghead">Text size</div>${seg('txt',S.text,[[90,'Small'],[100,'Medium'],[115,'Large'],[130,'Largest']],'Text size')}
 ${grp(swc('calmsw',S.calm,'Reduce motion'),'Motion')}${grp(`<button class="cell link" data-a="gothemes"><span class="grow">Themes</span><span class="val">${THEMES[S.theme].n}</span>${I.chev}</button>`)}</div>`}
function remindersV(){return nb('Reminders')+`<div class="content"><div class="lt"><h1>Reminders</h1></div>${grp(swc('nudge',S.nudges.on,'Friendly nudges')+swc('notif',S.nudges.notif,'Notifications'),'','Notifications work when Tiny Wins is on your Home Screen.')}</div>`}
function catsV(){return nb('Categories')+`<div class="content"><div class="lt"><h1>Categories</h1></div>${grp(allCats().map(c=>CATS.includes(c)?`<div class="cell"><span class="grow">${esc(c)}</span></div>`:`<div class="cell"><span class="grow">${esc(c)}</span><button class="tbtn red" data-a="delcat" data-c="${esc(c)}" aria-label="Remove category ${esc(c)}">Remove</button></div>`).join(''))}
 ${grp(`<div class="cell fcell"><input id="cn" maxlength="20" placeholder="New category" enterkeyhint="done" aria-label="New category"><button class="btn sm" data-a="addcat">Add</button></div>`,'Add a category')}</div>`}
function installV(){const st=isStandalone(),file=location.protocol==='file:';return nb('Home Screen')+`<div class="content"><div class="lt"><h1>Home Screen</h1></div>
 ${st?grp('<div class="cell">Tiny Wins is on your Home Screen.</div>'):grp(`<div class="cell"><span class="num">1</span><span class="grow">Open Tiny Wins in Safari</span></div><div class="cell"><span class="num">2</span><span class="grow">Tap Share</span></div><div class="cell"><span class="num">3</span><span class="grow">Tap Add to Home Screen, then Add</span></div>`,'Add to Home Screen',file?'This copy was opened as a file. Use the https address to add it.':'Chrome and Edge on iOS 16.4+ also have Add to Home Screen in Share.')}</div>`}
function dataV(){return nb('Your data')+`<div class="content"><div class="lt"><h1>Your data</h1></div>${grp(`<button class="cell tint" data-a="export">Export backup</button><button class="cell tint" data-a="import">Import backup</button><input type="file" id="impf" accept="application/json,.json" hidden>`,'Backup')}
 ${grp(`<button class="cell danger" data-a="reset">Delete all data</button>`)}</div>`}
function creditsV(){const lk=(u,x)=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${x}</a>`;return nb('Credits')+`<div class="content"><div class="lt"><h1>Credits</h1></div>
 ${grp(SOUND_CREDITS.map(c=>`<div class="cell col cr"><b>${c.n}</b><div>${lk(c.u,esc(c.t))} by ${esc(c.a)}. Licence: ${c.l.u?lk(c.l.u,c.l.n):c.l.n}. Changes: ${esc(c.c)}</div></div>`).join('')+'<div class="cell cr">Brown noise, soft noise and calm tones are made on your device. No recordings are used.</div>','Sounds')}
 ${grp(LOFI.map(x=>`<div class="cell col cr"><b>${esc(x[0])}</b><div>by ${LOFI_ARTIST} (${lk('https://incompetech.com','incompetech.com')}). Source: ${lk(lofiPage(x),'Wikimedia Commons')}, ${lk(lofiInfo(x),'track info')}. Licence: ${lk(CCBY3.u,CCBY3.n)}. Changes: none to the audio (only quieter to even out loudness).</div></div>`).join(''),'Lofi music','Tracks stream from Wikimedia Commons when you press play, about 2 MB a minute. They are not stored in this app. Kevin MacLeod and Wikimedia are not connected to Tiny Wins and do not endorse it.')}
 ${grp('<div class="cell cr">The app icon was made for Tiny Wins. No third-party fonts, icons or libraries. Text uses your device font.</div>','App')}</div>`}
/* overlays: sheet, alert, action sheet */
function sheetHTML(){if(SH==='add')return `<div class="shhd"><button class="tbtn" data-a="closesheet">Cancel</button><b>New task</b><button class="tbtn b" data-a="add">Add</button></div>
 ${grp(`<div class="cell fcell"><input id="newt" maxlength="120" placeholder="Type a task" enterkeyhint="done" aria-label="New task"></div>`)}
 ${grp(`<div class="cell"><label for="newcat" class="grow">Category</label><select id="newcat"><option value="auto" ${S.newCat==='auto'?'selected':''}>Auto</option>${allCats().map(c=>`<option value="${esc(c)}" ${S.newCat===c?'selected':''}>${esc(c)}</option>`).join('')}</select></div>`,'','Split into small 2-minute steps.')}`;
 if(SH==='qw'){const base=QW.concat(preset().qw);return `<div class="shhd"><span></span><b>Feeling stuck?</b><button class="tbtn b" data-a="closesheet">Done</button></div><div class="shsc">
 ${S.myQW.length?grp(S.myQW.map((x,i)=>qwEdit===i?`<div class="cell fcell"><input id="qwe" maxlength="${QW_LEN}" value="${esc(x)}" aria-label="Edit your action"><button class="btn sm" data-a="qwsave" data-i="${i}">Save</button><button class="tbtn" data-a="qwcancel">Cancel</button></div>`:`<div class="cell"><span class="grow">${esc(x)}</span><button class="tbtn" data-a="qwedit" data-i="${i}" aria-label="Edit ${esc(x)}">Edit</button><button class="tbtn red" data-a="qwdel" data-i="${i}" aria-label="Remove ${esc(x)}">Remove</button></div>`).join(''),'Yours',`${S.myQW.length} of ${QW_MAX} added`):''}
 ${grp(base.map(x=>`<div class="cell"><span class="grow">${esc(x)}</span></div>`).join(''),'Ideas')}</div>`}return ''}
function drawOv(){const o=$('#ov');let h='';const n=OVNEW?' new':'';
 if(SH)h+=`<div class="dim${n}" data-a="closesheet"></div><div class="sheet${n}" role="dialog" aria-modal="true" aria-label="${SH==='add'?'New task':'Feeling stuck'}"><div class="grab" aria-hidden="true"></div>${sheetHTML()}</div>`;
 if(AS)h+=`<div class="dim${n}" data-a="ascancel"></div><div class="asheet${n}" role="dialog" aria-modal="true"><div class="asg">${AS.title?`<div class="ast">${esc(AS.title)}</div>`:''}${AS.btns.map((b,i)=>`<button class="${b.red?'red':''}" data-a="asbtn" data-v="${i}">${esc(b.l)}</button>`).join('')}</div><div class="asg"><button class="b" data-a="ascancel">Cancel</button></div></div>`;
 if(AL)h+=`<div class="dim al${n}"></div><div class="alert${n}" role="alertdialog" aria-modal="true" aria-labelledby="alt"><div class="alb"><b id="alt">${esc(AL.title)}</b>${AL.msg?`<div>${esc(AL.msg)}</div>`:''}</div><div class="albtns">${AL.btns.map((b,i)=>`<button class="${b.red?'red':''}${b.bold?' b':''}" data-a="albtn" data-v="${i}">${esc(b.l)}</button>`).join('')}</div></div>`;
 o.innerHTML=h;document.body.classList.toggle('modal',!!(SH||AS||AL));OVNEW=false}
function ask(title,msg,okL,fn,red){AL={title,msg,btns:[{l:'Cancel'},{l:okL,red,bold:!red,f:fn}]};OVNEW=true;drawOv();setTimeout(()=>{const b=document.querySelector('.albtns button:last-child');b&&b.focus()},50)}
/* render */
function screen(){const t=topScr();if(t)return({progress:progressV,profile:profileV,appearance:appearanceV,reminders:remindersV,cats:catsV,install:installV,data:dataV,credits:creditsV,tracks:tracksV}[t]||homeV)();
 return({home:homeV,timer:timerV,habits:habitsV,rewards:rewardsV,settings:settingsV}[S.tab]||homeV)()}
function render(){applyPrefs();const keep={};document.querySelectorAll('#app input[id],#ov input[id]').forEach(i=>{if(i.type!=='range'&&i.type!=='file'&&i.value!==i.defaultValue)keep[i.id]=i.value});
 const a=$('#app');if(gateNeeded()){a.innerHTML=gateView();SH=null;AS=null}else if(T.full)a.innerHTML=focusView();else a.innerHTML=`<main class="scr ${ANIM}">${screen()}</main>`+tabbar();
 drawOv();Object.keys(keep).forEach(k=>{const el=document.getElementById(k);if(el)el.value=keep[k]});ANIM='';onScroll()}
function go(anim,y){ANIM=anim;render();scrollTo(0,y||0)}
function onScroll(){document.body.classList.toggle('scrolled',scrollY>28)}
addEventListener('scroll',onScroll,{passive:true});
function kb(){const v=window.visualViewport;if(!v)return;const k=Math.max(0,innerHeight-v.height-v.offsetTop);document.documentElement.style.setProperty('--kb',k+'px')}
if(window.visualViewport){visualViewport.addEventListener('resize',kb);visualViewport.addEventListener('scroll',kb)}
/* iOS share sheet for backups when available */
const _exportData=exportData;
exportData=function(){const txt=JSON.stringify({app:'tinywins',version:3,exported:new Date().toISOString(),data:S},null,2),name='tinywins-backup-'+today()+'.json';
 try{const f=new File([txt],name,{type:'application/json'});if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:'Tiny Wins backup'}).then(()=>toast('Backup saved')).catch(e=>{if(!(e&&e.name==='AbortError'))_exportData()});return}}catch(e){}
 _exportData()};
/* actions */
document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(!el||el.tagName==='SELECT')return;const a=el.dataset.a,id=el.dataset.id,v=el.dataset.v;
 if(el.tagName==='A')return;
 const A={signin:()=>{G.prov=v;G.err='';G.email='';ANIM='push'},gback:()=>{G.prov='';G.err='';ANIM='pop'},
  gemgo:()=>{const m=($('#gem').value||'').trim();G.email=m;if(!emailOK(m)){G.err='Enter a valid email address.';render();setTimeout(()=>{const x=$('#gem');x&&x.focus()},30);return 1}
   S.account={provider:G.prov,email:m.slice(0,80)};G={prov:'',err:'',email:''};pfInit();if(profileOK(S.profile))S.onboarded=true;ANIM='push'},
  pfgender:()=>{readPF();PF.gender=v;delete PF.err.gender},pfocc:()=>{readPF();PF.occ=v;delete PF.err.occ},
  pfdone:()=>{if(!pfCheck()){render();pfFocus();return 1}pfSave();S.onboarded=true;S.tab='home';toast('Welcome, '+S.name);ANIM='fade';scrollTo(0,0)},
  pfsave:()=>{if(!pfCheck()){render();pfFocus();return 1}pfSave();toast('Saved')},
  signout:()=>{ask('Sign out?','','Sign out',()=>{stopSound();lofiStop(true);setSleep(0);S.account=null;G={prov:'',err:'',email:''};pfInit();NV.settings=[];S.tab='home';save();render();scrollTo(0,0)},true);return 1},
  tab:()=>{const t=el.dataset.t;if(t===S.tab){if(NV[t].length){NV[t]=[];go('pop');return 1}scrollTo({top:0,behavior:S.calm?'auto':'smooth'});return 1}
   SCR[S.tab]=scrollY;S.tab=t;if(t==='settings')pfInit();save();render();scrollTo(0,SCR[t]||0);return 1},
  push:()=>{SCR[S.tab+NV[S.tab].length]=scrollY;NV[S.tab].push(v);if(v==='profile')pfInit();go('push');return 1},
  pop:()=>{NV[S.tab].pop();go('pop',SCR[S.tab+NV[S.tab].length]);return 1},
  gothemes:()=>{RW='themes';SCR[S.tab]=scrollY;S.tab='rewards';save();render();scrollTo(0,0);return 1},
  sheet:()=>{SH=v;OVNEW=true;drawOv();setTimeout(()=>{const i=$(SH==='add'?'#newt':'.sheet button');i&&i.focus()},v==='add'?320:60);return 1},
  closesheet:()=>{SH=null;qwEdit=-1;drawOv();return 1},
  add:()=>{const i=$('#newt');if(!i||!i.value.trim()){i&&i.focus();return 1}addTask(i.value);SH=null;drawOv();return 1},
  tmore:()=>{const tk=S.tasks.find(x=>x.id==id);if(!tk)return 1;AS={title:tk.title,btns:[{l:'Make top priority',f:()=>{S.one={date:today(),id:+id};toast("Set as today's top priority")}},{l:'Delete task',red:1,f:()=>{S.tasks=S.tasks.filter(t=>t.id!=id);toast('Task deleted')}}]};OVNEW=true;drawOv();return 1},
  asbtn:()=>{const b=AS&&AS.btns[+v];AS=null;if(b&&b.f)b.f();save();render();return 1},ascancel:()=>{AS=null;drawOv();return 1},
  albtn:()=>{const b=AL&&AL.btns[+v];AL=null;drawOv();if(b&&b.f)b.f();return 1},
  step:()=>{toggleStep(id,+el.dataset.i);return 1},del:()=>{S.tasks=S.tasks.filter(t=>t.id!=id)},
  setone:()=>{S.one={date:today(),id:+id};toast("Set as today's top priority")},resetone:()=>{S.one={date:null,id:null}},
  setonenew:()=>{const t=$('#onein').value.trim();if(!t)return 1;addTask(t);S.one={date:today(),id:S.tasks[0].id}},
  toggleall:()=>{S.showAll=!S.showAll},filter:()=>{S.filter=el.dataset.c},rest:()=>{restDay();return 1},
  mood:()=>{S.mood=el.dataset.m;const l=MOODS[S.mood].s.concat(preset().mood);let n,k=0;do{n=pick(l)}while(n===S.sug&&l.length>1&&k++<20);S.sug=n},
  sugdone:()=>{S.mood=null;win(1,10,'Nice one. +1 coin');return 1},sugadd:()=>{const s=S.sug;S.mood=null;addTask(s);return 1},
  qwnew:()=>{const l=quickWins();let n,k=0;do{n=pick(l)}while(n===S.qw&&k++<20);S.qw=n},qwall:()=>{SH='qw';OVNEW=true;drawOv();return 1},
  qwadd:()=>{const t=cleanQW([$('#qwin').value])[0];if(!t){toast('Type a short action first');return 1}
   if(S.myQW.length>=QW_MAX){toast('That is plenty. Remove one to add another');return 1}
   if(quickWins().some(x=>x.toLowerCase()===t.toLowerCase())){toast('Already in your list');return 1}
   S.myQW.push(t);S.qw=t;qwEdit=-1;$('#qwin').value='';toast('Added to your list')},
  qwedit:()=>{qwEdit=+el.dataset.i;if(!SH){SH='qw';OVNEW=true}save();render();setTimeout(()=>{const i=$('#qwe');i&&i.focus()},40);return 1},qwcancel:()=>{qwEdit=-1},
  qwsave:()=>{const i=+el.dataset.i,t=cleanQW([$('#qwe').value])[0];if(!t){toast('Type a short action, or remove it');return 1}
   if(quickWins().some((x,k)=>x.toLowerCase()===t.toLowerCase()&&x!==S.myQW[i])){toast('Already in your list');return 1}
   const old=S.myQW[i];S.myQW[i]=t;if(S.qw===old)S.qw=t;qwEdit=-1;toast('Saved')},
  qwdel:()=>{const i=+el.dataset.i,old=S.myQW[i];S.myQW.splice(i,1);if(S.qw===old)S.qw=null;qwEdit=-1;toast('Removed')},
  qwdone:()=>{L().quick=(L().quick||0)+1;S.qw=null;win(1,3,'Nice. +1 coin');return 1},
  claim:()=>{const c=getChallenge();if(c.claimed||challengeProgress(c)<c.n)return 1;c.claimed=true;win(c.r,15,`Challenge complete. +${c.r} coins`);return 1},
  habit:()=>{toggleHabit(+id);return 1},delhabit:()=>{const h=S.habits.find(x=>x.id==id);ask('Remove "'+(h?h.name:'habit')+'"?','','Remove',()=>{S.habits=S.habits.filter(x=>x.id!=id);if(!S.habits.length)EDIT.habits=false;save();render()},true);return 1},
  addhabit:()=>{const n=$('#hn').value.trim().slice(0,40);if(n){S.habits.push({id:Date.now(),name:n,days:[],paid:[]});$('#hn').value=''}},
  edit:()=>{EDIT[v]=!EDIT[v]},rwseg:()=>{RW=v;EDIT.treats=false},
  reflect:()=>{const t=($('#refl').value||'').trim();if(!t)return 1;const ex=S.reflections.find(r=>r.date===today());if(ex){ex.text=t;save();render();toast('Reflection updated');return 1}
   S.reflections.push({date:today(),text:t});win(1,5,'Reflection saved. +1 coin');return 1},
  tstart:()=>{startTimer();return 1},tstop:()=>{finishTimer(false);return 1},
  sound:()=>{startSound(el.dataset.s)},sleep:()=>{SND.sleepMin=+v;setSleep(+v)},lplay:()=>{lofiToggle();return 1},lnext:()=>{lofiNext();return 1},
  lshuf:()=>{LF.shuffle=!LF.shuffle;if(LF.state!=='off'){LF.order=lofiOrder(LF.i);LF.pos=0}},lstop:()=>{lofiStop(true)},ltrack:()=>{lofiStart(+v)},
  fullfocus:()=>{T.full=true;ANIM='up';scrollTo(0,0)},unfocus:()=>{T.full=false;ANIM='fade'},
  redeem:()=>{const t=S.treats.find(x=>x.id==id);if(S.coins<t.cost){toast(`${t.cost-S.coins} more coins to go`);return 1}S.coins-=t.cost;toast(`Enjoy: ${t.name}`)},
  deltreat:()=>{const t=S.treats.find(x=>x.id==id);ask('Remove "'+(t?t.name:'treat')+'"?','','Remove',()=>{S.treats=S.treats.filter(x=>x.id!=id);if(!S.treats.length)EDIT.treats=false;save();render()},true);return 1},
  addtreat:()=>{const n=$('#trn').value.trim().slice(0,60),c=Math.min(9999,Math.max(1,Math.round(+$('#trc').value||10)));if(n){S.treats.push({id:Date.now(),name:n,cost:c});$('#trn').value='';$('#trc').value=10}},
  theme:()=>{const k=el.dataset.t,t=THEMES[k];if(!S.themes.includes(k)){if(S.coins<t.cost){toast(`${t.cost-S.coins} more coins to unlock ${t.n}`);return 1}
   ask(`Unlock ${t.n}?`,`${t.cost} coins`,'Unlock',()=>{if(S.coins<t.cost)return;S.coins-=t.cost;S.themes.push(k);S.theme=k;toast(`${t.n} unlocked`);save();render()});return 1}S.theme=k},
  dark:()=>{S.dark=v},txt:()=>{S.text=+v},calmsw:()=>{S.calm=!S.calm},nudge:()=>{S.nudges.on=!S.nudges.on},
  notif:()=>{if(!S.nudges.notif&&'Notification'in window){Notification.requestPermission().then(p=>{S.nudges.notif=p==='granted';if(!S.nudges.notif)toast('Not allowed. In-app nudges still work.');save();render()});return 1}
   S.nudges.notif=false;if(!('Notification'in window))toast('Add Tiny Wins to your Home Screen to get notifications')},
  addcat:()=>{const n=$('#cn').value.trim().toLowerCase().slice(0,20);if(n&&!allCats().includes(n))S.cats.push(n);$('#cn').value=''},
  delcat:()=>{const c=el.dataset.c;S.cats=S.cats.filter(x=>x!==c);S.tasks.forEach(t=>{if(t.cat===c)t.cat='home'});if(S.filter===c)S.filter='all';if(S.newCat===c)S.newCat='auto'},
  export:()=>{exportData();return 1},import:()=>{$('#impf').click();return 1},
  reset:()=>{ask('Delete all data?','This removes everything in Tiny Wins on this iPhone.','Delete',()=>{stopSound();lofiStop(true);setSleep(0);localStorage.removeItem(KEY);S=load();G={prov:'',err:'',email:''};pfInit();NV={home:[],timer:[],habits:[],rewards:[],settings:[]};render();scrollTo(0,0)},true);return 1}};
 if(A[a]&&!A[a]()){save();render()}});
document.addEventListener('change',e=>{const t=e.target;if(t.id==='newcat'){S.newCat=t.value;save()}if(t.id==='impf'&&t.files[0])importData(t.files[0])});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(AL){AL=null;drawOv()}else if(AS){AS=null;drawOv()}else if(SH){SH=null;drawOv()}return}
 if(e.key!=='Enter')return;const id=e.target.id,c=s=>{const b=$(s);b&&b.click()};
 if(id==='newt')c('.sheet [data-a=add]');if(id==='onein')c('[data-a=setonenew]');if(id==='gem')c('[data-a=gemgo]');if(id&&id.startsWith('pf-'))c('[data-a=pfdone],.content [data-a=pfsave]');
 if(id==='refl')c('[data-a=reflect]');if(id==='hn')c('[data-a=addhabit]');if(id==='cn')c('[data-a=addcat]');if(id==='trn'||id==='trc')c('[data-a=addtreat]');if(id==='qwin')c('[data-a=qwadd]');if(id==='qwe')c('[data-a=qwsave]')});
document.addEventListener('input',e=>{if(e.target.id==='vol'){S.vol=e.target.value/100;applyVol();save();return}if(e.target.id==='gem')G.email=e.target.value;if(e.target.id&&e.target.id.startsWith('pf-'))readPF()});
if(window.matchMedia)matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(S.dark==='auto')applyPrefs()});
let lastDay=today();
function dayCheck(){if(lastDay!==today()){lastDay=today();const f=document.activeElement;if(!(f&&f.tagName==='INPUT'&&f.type!=='range'))render()}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)dayCheck()});
setInterval(()=>{dayCheck();nudgeTick()},60e3);
if(!('switch' in HTMLInputElement.prototype))document.documentElement.classList.add('noswitch');
if('serviceWorker'in navigator&&location.protocol!=='file:'&&location.protocol!=='about:')navigator.serviceWorker.register('sw.js').catch(()=>{});
S=load();pfInit();if(S.tab==='progress'){S.tab='home';NV.home=['progress']}
{const t=new URLSearchParams(location.search).get('tab');if(S.onboarded&&['home','timer','habits','rewards','settings'].includes(t))S.tab=t}
if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{});
render();
{const sp=document.getElementById('splash');if(sp)setTimeout(()=>{sp.classList.add('gone');setTimeout(()=>sp.remove(),400)},S.calm?50:350)}
