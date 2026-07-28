<script>
/* ============================================================
   CLOUD VIEWS — account gate, admin dashboard, feedback
   ============================================================ */
'use strict';

(function(){
var esc=UI.esc, $=UI.$;

/* ---------- account / sign in ---------- */
var AUTH = {mode:'in', busy:false, err:'', f:{email:'',pin:'',username:'',fullName:'',phone:''}};

UI.registerView('account', function(){
  if(!Cloud.configured()) return '<div class="page"><div class="phead"><h1>Accounts are off</h1>'+
    '<p class="lede">No backend is configured for this build, so everything stays local to this browser.</p></div></div>';

  if(Cloud.signedIn()){
    var m=Cloud.me(), p=m.profile||{}, s=S.raw();
    var mins=Math.round(Cloud.totalSeconds()/60);
    return '<div class="page">'+
    '<div class="phead"><p class="kick">Signed in</p><h1>'+esc(p.full_name||p.username||p.email||'Your account')+'</h1>'+
    '<p class="lede">Your progress syncs across every device you sign in on. Audio is never uploaded — only the derived numbers.</p></div>'+
    '<div class="grid g4" style="margin-bottom:22px">'+
    '<div class="stat"><p class="k">Username</p><div class="v" style="font-size:16px">'+esc(p.username||'—')+'</div></div>'+
    '<div class="stat"><p class="k">Role</p><div class="v" style="font-size:16px">'+esc(p.role||'rep')+'</div></div>'+
    '<div class="stat cy"><p class="k">Time trained</p><div class="v">'+mins+'<span style="font-size:14px;color:var(--muted)">m</span></div></div>'+
    '<div class="stat acc"><p class="k">Synced reps</p><div class="v">'+(s.reps||0)+'</div></div></div>'+
    '<div class="card"><p class="lbl" style="margin-bottom:10px">Account</p>'+
    '<div class="prose" style="font-size:14px"><table>'+
    '<tr><td>Email</td><td>'+esc(p.email||'')+'</td></tr>'+
    '<tr><td>Name</td><td>'+esc(p.full_name||'—')+'</td></tr>'+
    '<tr><td>Phone</td><td>'+esc(p.phone||'—')+'</td></tr>'+
    '<tr><td>Team</td><td>'+esc(p.org||'—')+'</td></tr></table></div>'+
    '<div class="row" style="margin-top:14px"><button class="btn sec" data-act="sync">Sync now</button>'+
    '<button class="btn gh" data-act="out">Sign out</button></div></div>'+
    (Cloud.isAdmin()?'<div class="note vi" style="margin-top:14px"><span class="l">You are an admin</span>'+
     'Use the toggle at the top of the sidebar to switch between your own training view and the team dashboard.</div>':'')+
    '</div>';
  }

  var f=AUTH.f, signUp=AUTH.mode==='up';
  return '<div class="page" style="max-width:560px">'+
  '<div class="phead"><p class="kick">'+(signUp?'Create your account':'Welcome back')+'</p>'+
  '<h1>'+(signUp?'Join the gym':'Sign in')+'</h1>'+
  '<p class="lede">'+(signUp
    ? 'No verification email, no code to wait for. Fill this in and you are training in about twenty seconds.'
    : 'Your progress, voice profile and history follow you to any device.')+'</p></div>'+

  (AUTH.err?'<div class="note no"><span class="l">Could not continue</span>'+esc(AUTH.err)+'</div>':'')+

  '<div class="card">'+
  (signUp?
    '<div class="f" style="margin-bottom:13px"><label class="lbl">Full name</label>'+
    '<input type="text" id="auName" value="'+esc(f.fullName)+'" placeholder="Jordan Blake" autocomplete="name"></div>'+
    '<div class="f" style="margin-bottom:13px"><label class="lbl">Username</label>'+
    '<input type="text" id="auUser" value="'+esc(f.username)+'" placeholder="jordanb" autocomplete="username"></div>'+
    '<div class="f" style="margin-bottom:13px"><label class="lbl">Phone</label>'+
    '<input type="text" id="auPhone" value="'+esc(f.phone)+'" placeholder="+1 555 010 9988" autocomplete="tel"></div>'
  :'')+
  '<div class="f" style="margin-bottom:13px"><label class="lbl">Email</label>'+
  '<input type="text" id="auEmail" value="'+esc(f.email)+'" placeholder="you@company.com" autocomplete="email"></div>'+
  '<div class="f" style="margin-bottom:6px"><label class="lbl">6-digit PIN</label>'+
  '<input type="password" id="auPin" value="'+esc(f.pin)+'" placeholder="••••••" inputmode="numeric" maxlength="6" '+
  'autocomplete="'+(signUp?'new-password':'current-password')+'" style="letter-spacing:.4em;font-size:18px"></div>'+
  '<p class="tiny dim" style="margin:0 0 16px">Six digits. '+(signUp?'Do not reuse a PIN you use for your phone or your bank.':'')+'</p>'+
  '<button class="btn blk big" data-act="go"'+(AUTH.busy?' disabled':'')+'>'+
    (AUTH.busy?'Working…':(signUp?'Create account & start':'Sign in'))+'</button>'+
  '<button class="btn gh blk sm" data-act="mode" style="margin-top:9px">'+
    (signUp?'I already have an account':'I need to create an account')+'</button>'+
  '</div>'+

  (signUp?'<div class="note" style="margin-top:14px"><span class="l">What gets stored, plainly</span>'+
   '<b>Never your audio.</b> Recording happens in your browser and stays there. What syncs is the derived numbers — '+
   'your scores, your pace, your pitch range, which drills you did and how long you trained.<br><br>'+
   '<b>Your manager can see your training data.</b> Scores, activity, weak tones and time spent. That is the point of it — '+
   'it is a coaching tool. You are seeing this before you sign up so it is never a surprise.</div>':'')+

  '<div class="row" style="margin-top:16px"><button class="btn gh sm" data-go="home">Skip — train without an account</button></div>'+
  '<p class="tiny dim" style="margin-top:8px">Without an account everything still works, but progress lives only in this browser and is lost if you clear it.</p>'+
  '</div>';
});

UI.registerView('account:act', function(a){
  if(a==='mode'){ AUTH.mode = AUTH.mode==='up'?'in':'up'; AUTH.err=''; UI.render(); return; }
  if(a==='out'){ Cloud.signOut().then(function(){ UI.toast('Signed out'); UI.go('home'); }); return; }
  if(a==='sync'){ Cloud.pushAll(true).then(function(){ UI.toast('Synced'); }); return; }
  if(a==='go'){
    var f=AUTH.f;
    f.email=($('#auEmail')||{}).value||''; f.pin=($('#auPin')||{}).value||'';
    if($('#auName'))  f.fullName=$('#auName').value;
    if($('#auUser'))  f.username=$('#auUser').value;
    if($('#auPhone')) f.phone=$('#auPhone').value;

    if(!/\S+@\S+\.\S+/.test(f.email)){ AUTH.err='That email does not look right.'; UI.render(); return; }
    if(!/^\d{6}$/.test(f.pin)){ AUTH.err='Your PIN must be exactly 6 digits.'; UI.render(); return; }

    AUTH.busy=true; AUTH.err=''; UI.render();
    var p = AUTH.mode==='up' ? Cloud.signUp(f) : Cloud.signIn(f.email, f.pin);
    p.then(function(){
      AUTH.busy=false; AUTH.f={email:'',pin:'',username:'',fullName:'',phone:''};
      UI.toast('Signed in'); UI.go('home');
    }).catch(function(e){
      AUTH.busy=false;
      var m=(e&&e.message)||'Something went wrong.';
      if(/already registered|already exists/i.test(m)) m='That email already has an account — switch to sign in.';
      if(/Invalid login/i.test(m)) m='Email or PIN not recognised.';
      AUTH.err=m; UI.render();
    });
  }
});

/* ---------- admin dashboard ---------- */
var TEAM = {data:null, loading:false, tried:false, sort:'reps_7d', person:null};

UI.registerView('admin', function(){
  if(!Cloud.isAdmin()) return '<div class="page"><div class="phead"><h1>Admins only</h1>'+
    '<p class="lede">This view is for team accounts with the admin role.</p>'+
    '<p class="lede" style="margin-top:10px">If that should be you, run this once in the Supabase SQL editor:<br>'+
    '<code style="display:inline-block;margin-top:8px">update public.profiles set role = \'admin\' where email = \'you@company.com\';</code></p></div></div>';

  // fetch exactly once per visit — never re-fire from inside render
  if(!TEAM.data && !TEAM.loading && !TEAM.tried){
    TEAM.loading=true; TEAM.tried=true;
    Cloud.team().then(function(d){ TEAM.data=d; TEAM.loading=false; UI.render(); })
                .catch(function(){ TEAM.loading=false; UI.render(); });
  }
  if(TEAM.loading) return '<div class="page"><div class="empty"><div class="ei">◴</div><p>Loading the team…</p></div></div>';
  if(!TEAM.data) return '<div class="page"><div class="phead"><h1>Could not load the team</h1>'+
    '<p class="lede">The dashboard needs a live connection to Supabase and an admin role on your account. '+
    'If you are offline this will simply not work — everything else in the app still does.</p></div>'+
    '<button class="btn" data-act="retry">Try again</button></div>';

  var d=TEAM.data;
  if(TEAM.person) return personView(d, TEAM.person);

  var people=d.people.slice().sort(function(a,b){ return (b[TEAM.sort]||0)-(a[TEAM.sort]||0); });
  var active=people.filter(function(p){return (p.reps_7d||0)>0;}).length;
  var totalReps=people.reduce(function(s,p){return s+(p.reps||0);},0);
  var avg=people.filter(function(p){return p.avg_30d;});
  var teamAvg=avg.length?Math.round(avg.reduce(function(s,p){return s+ +p.avg_30d;},0)/avg.length):null;

  // team-wide weak tones
  var byTone={};
  d.weak.forEach(function(w){
    var t=byTone[w.tone]=byTone[w.tone]||{n:0,sum:0,people:0};
    t.n+=w.n; t.sum+= (+w.avg_score)*w.n; t.people++;
  });
  var weakest=Object.keys(byTone).map(function(k){
    return {tone:k, avg:Math.round(byTone[k].sum/byTone[k].n), n:byTone[k].n, people:byTone[k].people};
  }).filter(function(x){ return TONE_BY_ID[x.tone]; }).sort(function(a,b){return a.avg-b.avg;}).slice(0,6);

  return '<div class="page wide">'+
  '<div class="phead"><p class="kick">Admin · '+people.length+' account'+(people.length===1?'':'s')+'</p>'+
  '<h1>Team</h1><p class="lede">Who is actually training, what they are weak at, and what the app is getting wrong. '+
  'Click anyone for their detail.</p></div>'+

  '<div class="grid g4" style="margin-bottom:24px">'+
  '<div class="stat '+(active?'ok':'no')+'"><p class="k">Active this week</p><div class="v">'+active+'<span style="font-size:15px;color:var(--muted)">/'+people.length+'</span></div><p class="s">did at least one rep</p></div>'+
  '<div class="stat cy"><p class="k">Total reps</p><div class="v">'+totalReps.toLocaleString()+'</div><p class="s">all time</p></div>'+
  '<div class="stat '+(teamAvg>=75?'ok':teamAvg>=60?'acc':'no')+'"><p class="k">Team avg score</p><div class="v">'+(teamAvg||'—')+'</div><p class="s">last 30 days</p></div>'+
  '<div class="stat"><p class="k">Signals to review</p><div class="v">'+(d.fairness.length+d.misses.length+d.feedback.length)+'</div><p class="s">flags, misses, feedback</p></div>'+
  '</div>'+

  '<div class="sect" style="margin-top:0"><div class="shead"><h2>People</h2>'+
  '<div class="seg" id="teamSort" style="margin-left:auto">'+
  [['reps_7d','This week'],['reps','All time'],['avg_30d','Avg score'],['level','Level']].map(function(o){
    return '<button data-s="'+o[0]+'"'+(TEAM.sort===o[0]?' class="on"':'')+'>'+o[1]+'</button>'; }).join('')+
  '</div></div>'+
  '<div class="grid" style="gap:7px">'+people.map(function(p){
    var mins=Math.round((((p.payloadSeconds||0))/60));
    var stale=!(p.reps_7d>0);
    return '<button class="tw" style="width:100%;text-align:left;cursor:pointer;'+(stale?'opacity:.62':'')+'" data-act="person" data-arg="'+esc(p.id)+'">'+
      '<div style="flex:1;min-width:0">'+
      '<div style="display:flex;align-items:baseline;gap:9px;flex-wrap:wrap">'+
      '<b style="font-size:14.5px">'+esc(p.full_name||p.username||p.email||'—')+'</b>'+
      (p.role==='admin'?'<span class="chip tiny vi">admin</span>':'')+
      (stale?'<span class="chip tiny no">nothing this week</span>':'<span class="chip tiny ok">'+p.reps_7d+' reps this week</span>')+
      '</div>'+
      '<div class="meta" style="margin-top:5px">'+
      '<span class="mono tiny dim">L'+(p.level||1)+' · '+(p.reps||0)+' reps · '+(p.streak||0)+'d streak'+
      (p.avg_30d?' · avg '+p.avg_30d:'')+
      (p.avg_term_30d?' · term '+(+p.avg_term_30d>0?'+':'')+p.avg_term_30d+'st':'')+
      (p.avg_span_30d?' · range '+p.avg_span_30d+'st':'')+'</span></div></div>'+
      '<span class="tiny dim" style="flex:none">›</span></button>';
  }).join('')+'</div></div>'+

  (weakest.length?'<div class="sect"><div class="shead"><h2>Where the team is weakest</h2>'+
   '<span class="n">30 days · 3+ reps each</span></div>'+
   '<p class="sdesc">Lowest average score across everyone. This is your next group session.</p>'+
   '<div class="grid gauto">'+weakest.map(function(w){
     var t=TONE_BY_ID[w.tone];
     return '<div class="card" style="padding:14px 16px"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px">'+
       '<b style="font-size:14.5px;color:'+FAMILIES[t.fam].c+'">'+esc(t.name)+'</b>'+
       '<span class="mono tiny '+(w.avg<60?'':'dim')+'" style="color:'+(w.avg<60?'var(--no)':'')+'">'+w.avg+'</span></div>'+
       '<div class="meter '+(w.avg>=75?'ok':w.avg>=60?'':'no')+'"><i style="width:'+w.avg+'%"></i></div>'+
       '<p class="tiny dim" style="margin:7px 0 0">'+w.people+' '+(w.people===1?'person':'people')+' · '+w.n+' reps</p></div>';
   }).join('')+'</div></div>':'')+

  signalsBlock(d)+
  '</div>';
});

function signalsBlock(d){
  function rows(list, render){
    if(!list.length) return '<p class="tiny dim">Nothing yet.</p>';
    return '<div class="grid" style="gap:7px">'+list.slice(0,12).map(render).join('')+'</div>';
  }
  var who={}; (TEAM.data.people||[]).forEach(function(p){ who[p.id]=p.full_name||p.username||p.email||'someone'; });
  return '<div class="sect"><div class="shead"><h2>What the app is getting wrong</h2>'+
  '<span class="n">the feedback loop</span></div>'+
  '<p class="sdesc">This is the material that makes the engine better. Send it over and it becomes new rules and recalibrated thresholds.</p>'+

  '<div class="grid g3" style="gap:14px;align-items:start">'+
  '<div class="card"><p class="lbl" style="margin-bottom:9px;color:var(--no)">Unfair scores ('+d.fairness.length+')</p>'+
  rows(d.fairness, function(f){
    return '<div style="padding:8px 0;border-top:1px solid var(--line)">'+
    '<p class="tiny" style="margin:0 0 2px"><b>'+esc(who[f.user_id]||'—')+'</b> · '+esc(f.verdict.replace('_',' '))+'</p>'+
    '<p class="tiny dim" style="margin:0">'+esc(TONE_BY_ID[f.tone]?TONE_BY_ID[f.tone].name:f.tone||'')+' scored '+(f.score==null?'—':f.score)+
    (f.note?' — “'+esc(f.note.slice(0,70))+'”':'')+'</p></div>';
  })+'</div>'+

  '<div class="card"><p class="lbl" style="margin-bottom:9px;color:var(--cy)">Advisor misses ('+d.misses.length+')</p>'+
  rows(d.misses, function(m){
    return '<div style="padding:8px 0;border-top:1px solid var(--line)">'+
    '<p class="tiny" style="margin:0 0 2px"><b>'+esc(who[m.user_id]||'—')+'</b> · '+esc(m.stage||'')+'</p>'+
    '<p class="tiny dim" style="margin:0">“'+esc((m.line||'').slice(0,60))+'” → '+
    esc(TONE_BY_ID[m.recommended]?TONE_BY_ID[m.recommended].name:m.recommended||'')+'</p></div>';
  })+'</div>'+

  '<div class="card"><p class="lbl" style="margin-bottom:9px;color:var(--acc)">Feedback ('+d.feedback.length+')</p>'+
  rows(d.feedback, function(f){
    return '<div style="padding:8px 0;border-top:1px solid var(--line)">'+
    '<p class="tiny" style="margin:0 0 2px"><b>'+esc(who[f.user_id]||'—')+'</b> · '+esc(f.page||'')+'</p>'+
    '<p class="tiny dim" style="margin:0">'+esc((f.message||'').slice(0,110))+'</p></div>';
  })+'</div></div></div>';
}

function personView(d, id){
  var p=d.people.filter(function(x){return x.id===id;})[0];
  if(!p) return '<div class="page"><div class="empty"><p>Not found.</p></div></div>';
  var weak=d.weak.filter(function(w){return w.user_id===id;}).sort(function(a,b){return a.avg_score-b.avg_score;});
  var reps=d.reps.filter(function(r){return r.user_id===id;});
  var byDrill={}; reps.forEach(function(r){ if(r.drill) byDrill[r.drill]=(byDrill[r.drill]||0)+1; });
  var drills=Object.keys(byDrill).sort(function(a,b){return byDrill[b]-byDrill[a];});

  return '<div class="page wide">'+
  '<button class="btn gh sm" data-act="back" style="margin-bottom:18px">← Team</button>'+
  '<div class="phead"><p class="kick">'+esc(p.email||'')+'</p><h1>'+esc(p.full_name||p.username||'—')+'</h1></div>'+

  '<div class="grid g4" style="margin-bottom:22px">'+
  '<div class="stat acc"><p class="k">Level</p><div class="v">'+(p.level||1)+'</div><p class="s">'+(p.xp||0)+' xp</p></div>'+
  '<div class="stat '+((p.reps_7d||0)>0?'ok':'no')+'"><p class="k">This week</p><div class="v">'+(p.reps_7d||0)+'</div><p class="s">reps · '+(p.reps||0)+' all time</p></div>'+
  '<div class="stat"><p class="k">Streak</p><div class="v">'+(p.streak||0)+'<span style="font-size:14px;color:var(--muted)">d</span></div></div>'+
  '<div class="stat '+(p.avg_30d>=75?'ok':p.avg_30d>=60?'acc':'no')+'"><p class="k">Avg score</p><div class="v">'+(p.avg_30d||'—')+'</div><p class="s">30 days</p></div>'+
  '</div>'+

  (p.modal_hz?'<div class="card" style="margin-bottom:14px"><p class="lbl" style="margin-bottom:10px">Their voice</p>'+
   '<div class="readout">'+
   '<div class="ro"><p class="k">Modal pitch</p><div class="v" style="font-size:18px">'+Math.round(p.modal_hz)+'<span class="u">Hz</span></div></div>'+
   (p.flat_span?'<div class="ro"><p class="k">Flat</p><div class="v" style="font-size:18px">'+(+p.flat_span).toFixed(1)+'<span class="u">st</span></div><p class="t">their floor</p></div>':'')+
   (p.nat_span?'<div class="ro warn"><p class="k">Natural</p><div class="v" style="font-size:18px">'+(+p.nat_span).toFixed(1)+'<span class="u">st</span></div></div>':'')+
   (p.ceil_span?'<div class="ro good"><p class="k">Ceiling</p><div class="v" style="font-size:18px">'+(+p.ceil_span).toFixed(1)+'<span class="u">st</span></div></div>':'')+
   (p.avg_term_30d?'<div class="ro '+(+p.avg_term_30d<=-2?'good':'bad')+'"><p class="k">Avg terminal</p><div class="v" style="font-size:18px">'+(+p.avg_term_30d>0?'+':'')+(+p.avg_term_30d).toFixed(1)+'<span class="u">st</span></div><p class="t">negative = falling</p></div>':'')+
   '</div>'+
   (p.flat_span && p.ceil_span && p.nat_span ?
     '<p class="tiny dim2" style="margin:12px 0 0">They demonstrated <b style="color:var(--ink)">'+((+p.ceil_span)-(+p.flat_span)).toFixed(1)+' semitones</b> of range on demand '+
     'and use about <b style="color:var(--ink)">'+Math.round(((+p.nat_span)-(+p.flat_span))/Math.max(0.5,(+p.ceil_span)-(+p.flat_span))*100)+'%</b> of it when they talk normally. '+
     'That gap is the coaching conversation.</p>':'')+
   '</div>':'<div class="note acc" style="margin-bottom:14px"><span class="l">Not calibrated</span>They have not run voice calibration, so their scores are measured against population defaults rather than their own floor. Worth getting them to do it — it takes two minutes.</div>')+

  '<div class="split">'+
  '<div>'+
  (weak.length?'<div class="sect" style="margin-top:0"><div class="shead"><h2>Weakest tones</h2><span class="n">30 days</span></div>'+
   '<div class="grid" style="gap:6px">'+weak.slice(0,10).map(function(w){
     var t=TONE_BY_ID[w.tone]; if(!t) return '';
     return '<div style="display:flex;align-items:center;gap:11px">'+
       '<span style="flex:0 0 165px;font-size:13px;color:'+FAMILIES[t.fam].c+'">'+esc(t.name)+'</span>'+
       '<div class="meter '+(w.avg_score>=75?'ok':w.avg_score>=60?'':'no')+'" style="flex:1"><i style="width:'+w.avg_score+'%"></i></div>'+
       '<span class="mono tiny dim" style="width:64px;text-align:right">'+w.avg_score+' · '+w.n+'r</span></div>';
   }).join('')+'</div></div>':'<p class="dim">Not enough scored reps yet to rank their weak tones.</p>')+
  '</div>'+
  '<div>'+
  (drills.length?'<div class="card"><p class="lbl" style="margin-bottom:10px">Drills they actually do</p>'+
   drills.slice(0,10).map(function(k){
     var m=MODULES.filter(function(x){return x.id===k;})[0];
     return '<div style="display:flex;justify-content:space-between;padding:6px 0;border-top:1px solid var(--line);font-size:13px">'+
       '<span class="dim2">'+esc(m?m.n:k)+'</span><span class="mono dim">'+byDrill[k]+'</span></div>';
   }).join('')+'</div>':'')+
  '</div></div></div>';
}

UI.registerView('admin:act', function(a, arg){
  if(a==='person'){ TEAM.person=arg; UI.render(); UI.$('#main').scrollTop=0; }
  if(a==='back'){ TEAM.person=null; UI.render(); }
  if(a==='retry'){ TEAM.tried=false; TEAM.data=null; UI.render(); }
});
UI.registerView('admin:after', function(){
  var s=$('#teamSort');
  if(s) s.onclick=function(e){ var b=e.target.closest('[data-s]'); if(b){ TEAM.sort=b.dataset.s; UI.render(); } };
});

})();
</script>
