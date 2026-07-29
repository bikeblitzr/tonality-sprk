<script>
/* ============================================================
   THE BRAIN — a 3D map of everything the engine knows.

   Two layers:
     1. BRAIN, the authored knowledge spine (17-data-brain.js)
     2. every live dataset in the app, expanded into the same
        graph so the map and the product can never drift apart

   Rendered in raw canvas 2D — hand-rolled perspective projection,
   depth sorting and hit testing. No dependencies, works offline.
   ============================================================ */
(function(){
'use strict';
var $=UI.$, esc=UI.esc;

/* ---------------------------------------------------------------
   1 · GRAPH ASSEMBLY
   --------------------------------------------------------------- */
var G=null;             /* {nodes:[], byId:{}, kids:{}, order:[]} */

function add(list, n){ list.push(n); return n; }

function buildGraph(){
  var L=[];
  BRAIN.forEach(function(n){ L.push({id:n.id,p:n.p||null,n:n.n,k:n.k,t:n.t,h:n.h,v:n.v||null,hemi:n.hemi||0}); });

  /* ---- the 72 tones, by family, each with three dense children ---- */
  Object.keys(FAMILIES).forEach(function(fk){
    var F=FAMILIES[fk];
    add(L,{id:'F.'+fk,p:'t.fams',k:'fam',n:F.name,
      t:F.blurb,
      h:'Pick the family that matches the moment and the shortlist drops from seventy-two tones to a handful.'});
  });
  TONES.forEach(function(T){
    var tid='T.'+T.id;
    add(L,{id:tid,p:'F.'+T.fam,k:'tone',n:T.name,
      t:T.conveys,
      h:'Use it when: '+T.useWhen,
      v:'tier '+T.tier});
    add(L,{id:tid+'.mk',p:tid,k:'method',n:'How to produce it',
      t:'Pitch — '+T.recipe.pitch+' Pace — '+T.recipe.pace+' Volume — '+T.recipe.volume+
        ' Terminal — '+T.recipe.terminal+' Resonance — '+T.recipe.resonance,
      h:'The cue that gets you there fastest: '+T.cue});
    add(L,{id:tid+'.nm',p:tid,k:'number',n:'The numbers it must hit',
      t:'Pace '+T.target.wpm[0]+'-'+T.target.wpm[1]+' wpm · pitch span '+T.target.span[0]+'-'+T.target.span[1]+
        ' st · terminal '+T.target.term[0]+' to '+T.target.term[1]+' st · dynamic range '+T.target.dyn[0]+'-'+T.target.dyn[1]+
        ' dB · pause '+T.target.pause[0]+'-'+T.target.pause[1]+' ms.',
      h:'These five bands are exactly what the Tone Lab grades you against for this tone. Nothing else is scored.',
      v:T.target.span[0]+'-'+T.target.span[1]+' st'});
    add(L,{id:tid+'.ov',p:tid,k:'defect',n:'How it fails',
      t:'Overdone: '+T.overdone,
      h:'The antidote: '+T.antidote});
  });

  /* ---- the 230 twisters, by rack ---- */
  Object.keys(TWISTER_CATS).forEach(function(ck){
    add(L,{id:'C.'+ck,p:'a.racks',k:'fam',n:TWISTER_CATS[ck].name,
      t:TWISTER_CATS[ck].blurb,
      h:'Work this rack when the sounds it targets are the ones giving way in your own speech.'});
  });
  TWISTERS.forEach(function(T,i){
    add(L,{id:'W.'+i,p:'C.'+T.c,k:'twister',n:T.t.length>62?T.t.slice(0,60)+'…':T.t,
      t:T.t,
      h:T.why,
      v:'difficulty '+T.d+'/5 · '+(T.tg||[]).join(' ')});
  });

  /* ---- psychology ---- */
  Object.keys(POWER_CHAPTERS).forEach(function(ck){
    add(L,{id:'P.'+ck,p:'i.lib',k:'fam',n:POWER_CHAPTERS[ck].name,
      t:POWER_CHAPTERS[ck].blurb,
      h:'Six chapters, split by what the principle is for rather than who wrote it down first.'});
  });
  PRINCIPLES.forEach(function(P,i){
    add(L,{id:'PR.'+i,p:'P.'+P.ch,k:'principle',n:P.n,
      t:P.idea+' In practice: '+P.sales,
      h:'Delivered with the '+P.tone+' tone — '+P.toneWhy+' It fails when: '+P.fails+' Counter-move: '+P.counter});
  });
  INFLUENCE.forEach(function(X,i){
    add(L,{id:'IN.'+i,p:'i.inf',k:'principle',n:X.n,
      t:'Legitimate use: '+X.use,
      h:'The abuse: '+X.abuse+' Knowing both is how you notice it being run on you.'});
  });
  FRAMES.forEach(function(X,i){
    add(L,{id:'FR.'+i,p:'i.frames',k:'rule',n:X.n,
      t:X.d,
      h:'The re-frame: “'+X.line+'” — delivered in the '+X.tone+' tone.'});
  });

  /* ---- the codex ---- */
  CODEX.forEach(function(C){
    var body=String(C.body||'').replace(/\s+/g,' ').trim();
    add(L,{id:'CX.'+C.id,p:'cdx',k:'chapter',n:C.title,
      t:C.sub||body.slice(0,190),
      h:body.slice(0,600)+(body.length>600?'…  Open the Codex for the full chapter.':'')});
  });

  /* ---- the advisor ---- */
  STAGES.forEach(function(S,i){
    add(L,{id:'SG.'+i,p:'adv.stage',k:'stage',n:S.n,
      t:S.hint+' Tell the advisor you are here and it starts from a different distribution over all seventy-two tones before it reads a single word of what you typed.',
      h:'Before a word of your line is read, it starts from: '+
        Object.keys(S.tones||{}).sort(function(a,b){ return S.tones[b]-S.tones[a]; }).slice(0,4).map(function(k){
          var t=TONES.filter(function(y){return y.id===k;})[0]; return (t?t.name:k)+' ('+S.tones[k]+')'; }).join(', ')+'.'});
  });
  MODS.forEach(function(M,i){
    add(L,{id:'MD.'+i,p:'adv.mod',k:'rule',n:M.n,
      t:M.why,
      h:'Pushes up: '+Object.keys(M.up||{}).slice(0,5).join(', ')+'. Pushes down: '+Object.keys(M.down||{}).slice(0,5).join(', ')+'.'});
  });
  TRIGGERS.forEach(function(T,i){
    add(L,{id:'TG.'+i,p:'adv.trig',k:'trigger',n:T.why.length>58?T.why.slice(0,56)+'…':T.why,
      t:T.why,
      h:'Matches: '+String(T.re).slice(0,90)+' — when it fires it re-weights '+Object.keys(T.w||{}).length+' tones.'});
  });

  /* ---- emphasis ---- */
  EMPHASIS.forEach(function(E,i){
    var words=E.w||[];
    add(L,{id:'EM.'+i,p:'m.lib',k:'rule',n:words.join(' '),
      t:'Stress each word in turn and the claim changes: '+words.map(function(w,j){
          return w.toUpperCase()+' → '+(E.m&&E.m[j]?E.m[j]:''); }).slice(0,4).join(' · ')+'…',
      h:E.note||'Say it once per stress position. Hearing the meaning move is what teaches contrastive focus.'});
  });
  FOCUS_RULES.forEach(function(R,i){
    add(L,{id:'FC.'+i,p:'m.rules',k:'rule',n:R.r,
      t:R.d,
      h:'Wrong: '+R.bad+'  ·  Right: '+R.good});
  });
  CONTOURS.forEach(function(C){
    add(L,{id:'CO.'+C.id,p:'m.cont',k:'concept',n:C.name,
      t:C.why,
      h:'Trace it on the line “'+C.line+'”. Difficulty '+C.diff+'/5.'});
  });

  /* ---- drills ---- */
  Drill.MODULES.forEach(function(M){
    add(L,{id:'DR.'+M.id,p:'l.drills',k:'drill',n:M.n,
      t:M.d||M.blurb||M.n,
      h:'Opens at level '+S.tierNeed(M.tier)+'. Reach for it when that is the thing failing.'});
  });

  /* ---- index ---- */
  var byId={}, kids={};
  L.forEach(function(n){ byId[n.id]=n; });
  L=L.filter(function(n){ return !n.p || byId[n.p]; });
  L.forEach(function(n){ if(n.p){ (kids[n.p]=kids[n.p]||[]).push(n); } });

  /* depth, hemisphere inheritance, subtree size */
  function walk(n,d,hemi){
    n.d=d; n.hemi = n.hemi || hemi;
    var c=kids[n.id]||[];
    n.sub=1;
    c.forEach(function(x){ walk(x,d+1,n.hemi); n.sub+=x.sub; });
  }
  walk(byId.root,0,0);
  return {nodes:L, byId:byId, kids:kids};
}

/* ---------------------------------------------------------------
   2 · LAYOUT — deterministic dendritic branching in 3D,
       warped into a two-lobed brain envelope
   --------------------------------------------------------------- */
function hash(s){ var h=2166136261; for(var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return (h>>>0)/4294967295; }
function norm(v){ var m=Math.hypot(v[0],v[1],v[2])||1; return [v[0]/m,v[1]/m,v[2]/m]; }
function cross(a,b){ return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }

function layout(G){
  var root=G.byId.root;
  root.x=0; root.y=0; root.z=0;

  /* Domains fan around their own hemisphere's axis (+x / -x) so the
     structure reads as two lobes rather than a starburst, and so ten
     domain labels never pile up on each other. */
  var doms=G.kids.root||[];
  var sides={'-1':[], '1':[]};
  doms.forEach(function(dn,i){
    var s = dn.hemi || (i%2?1:-1); dn.hemi=s;
    sides[String(s)].push(dn);
  });
  [-1,1].forEach(function(s){
    var grp=sides[String(s)], m=grp.length;
    grp.forEach(function(dn,i){
      /* polar angle away from the lobe axis, alternating so neighbours
         in the ring sit at different heights and never collide */
      var phi = 0.60 + (i%2)*0.34 + hash(dn.id)*0.16;
      var az  = (i/m)*Math.PI*2 + (s>0?0.7:0) + hash(dn.id)*0.35;
      var dir = norm([ s*Math.cos(phi), Math.sin(phi)*Math.cos(az)*0.92, Math.sin(phi)*Math.sin(az) ]);
      dn.dir=dir;
      var len=150+hash(dn.id+'L')*34;
      dn.x=dir[0]*len + s*20; dn.y=dir[1]*len; dn.z=dir[2]*len;
    });
  });

  var LEN=[0,150,88,54,36,27,21,17];
  function place(par){
    var c=G.kids[par.id]||[];
    if(!c.length) return;
    var base = par.dir || norm([par.x||1,par.y,par.z]);
    var up = Math.abs(base[1])>0.9 ? [1,0,0] : [0,1,0];
    var e1 = norm(cross(base,up)), e2 = norm(cross(base,e1));
    var d = par.d+1;
    /* dense branches get more room and a wider cone, so a 230-item rack
       becomes a lobe of its own instead of a single overlapping blob */
    var bulk = Math.min(1.55, 0.86 + Math.log(1+par.sub)*0.155);
    var len  = LEN[Math.min(LEN.length-1,d)] * bulk * (0.86+hash(par.id)*0.28);
    var spread = Math.min(1.28, 0.46 + Math.log(1+c.length)*0.19);
    /* golden-angle stepping keeps siblings from lining up in visible rows */
    var GA=2.39996;
    c.forEach(function(ch,i){
      var ang = i*GA + hash(par.id)*6.283;
      var tilt = spread*Math.sqrt((i+0.5)/c.length)*(0.72+0.5*hash(ch.id));
      var st=Math.sin(tilt), ct=Math.cos(tilt), ca=Math.cos(ang), sa=Math.sin(ang);
      var dir = norm([
        base[0]*ct + (e1[0]*ca+e2[0]*sa)*st,
        base[1]*ct + (e1[1]*ca+e2[1]*sa)*st,
        base[2]*ct + (e1[2]*ca+e2[2]*sa)*st
      ]);
      ch.dir=dir;
      var l = len*(0.80+hash(ch.id+'l')*0.45);
      ch.x=par.x+dir[0]*l; ch.y=par.y+dir[1]*l; ch.z=par.z+dir[2]*l;
      place(ch);
    });
  }
  doms.forEach(place);

  /* brain envelope: wider than tall, longer front-to-back than wide */
  G.nodes.forEach(function(nd){ nd.y*=0.90; nd.z*=1.06; nd.x*=0.93; });

  /* recentre on the cloud's own centroid so the brain sits in the middle
     of the frame rather than wherever the biggest rack happened to grow */
  var cx=0,cy=0,cz=0;
  G.nodes.forEach(function(nd){ cx+=nd.x; cy+=nd.y; cz+=nd.z; });
  cx/=G.nodes.length; cy/=G.nodes.length; cz/=G.nodes.length;
  var ext=0;
  G.nodes.forEach(function(nd){
    nd.x-=cx; nd.y-=cy; nd.z-=cz;
    nd.r0=Math.hypot(nd.x,nd.y,nd.z);
    if(nd.r0>ext) ext=nd.r0;
  });
  G.extent=ext;
}

/* ---------------------------------------------------------------
   3 · VIEW
   --------------------------------------------------------------- */
var KCOL={
  root:'--acc', domain:'--acc', anchor:'--acc',
  concept:'--cy', rule:'--vi', number:'--ok', method:'--cy',
  defect:'--no', tone:'--acc', fam:'--pk', twister:'--vi',
  principle:'--pk', chapter:'--cy', stage:'--ok', trigger:'--vi',
  drill:'--ok'
};
var KNAME={
  root:'the whole engine', domain:'domain', anchor:'library',
  concept:'mechanism', rule:'rule', number:'measured figure', method:'method',
  defect:'failure mode', tone:'tone', fam:'family', twister:'articulation drill',
  principle:'principle', chapter:'codex chapter', stage:'call stage', trigger:'phrasing trigger',
  drill:'drill mode'
};

var B={sel:'root', open:{root:1}, yaw:0.5, pitch:-0.18, zoom:1, spin:true,
       tx:0,ty:0,tz:0, cx:0,cy:0,cz:0, q:'', raf:null, hover:null, canvas:null};

function ancestors(id){
  var out=[], n=G.byId[id];
  while(n){ out.unshift(n); n = n.p ? G.byId[n.p] : null; }
  return out;
}

function selectNode(id, keepOpen){
  if(!G.byId[id]) return;
  B.sel=id;
  ancestors(id).forEach(function(a){ B.open[a.id]=1; });
  B.open[id]=1;
  if(!keepOpen){
    var n=G.byId[id];
    B.tx=n.x; B.ty=n.y; B.tz=n.z;      /* camera target eases here */
  }
  paintPanel();
}

function view(){
  if(!G){ G=buildGraph(); layout(G); }
  var total=G.nodes.length;
  return '<div class="brainwrap">'+
    '<div class="braincanvas">'+
      '<canvas id="brainC"></canvas>'+
      '<div class="brainhud">'+
        '<div class="brainttl">How this works</div>'+
        '<div class="braincnt"><b>'+total+'</b> nodes · drag to turn · scroll to zoom · click a node to open it</div>'+
      '</div>'+
      '<div class="brainsearch"><span class="si">⌕</span><input type="search" id="brainQ" placeholder="Search the map" value="'+esc(B.q)+'"><span id="brainQn" class="qn"></span></div>'+
      '<div class="brainlegend" id="brainLeg"></div>'+
      '<div class="brainctl">'+
        '<button class="btn gh sm" data-act="spin">'+(B.spin?'Pause':'Spin')+'</button>'+
        '<button class="btn gh sm" data-act="reset">Reset view</button>'+
        '<button class="btn gh sm" data-act="top">Back to the top</button>'+
      '</div>'+
      '<div class="braintip" id="brainTip"></div>'+
    '</div>'+
    '<aside class="brainpanel" id="brainP"></aside>'+
  '</div>';
}

function paintPanel(){
  var p=$('#brainP'); if(!p) return;
  var n=G.byId[B.sel]; if(!n) return;
  var path=ancestors(n.id);
  var kids=(G.kids[n.id]||[]);
  var col='var('+(KCOL[n.k]||'--cy')+')';

  p.innerHTML=
   '<div class="bcrumb">'+path.map(function(a,i){
      return (i?'<span class="sep">›</span>':'')+'<button data-node="'+esc(a.id)+'"'+(a.id===n.id?' class="on"':'')+'>'+esc(a.n)+'</button>';
    }).join('')+'</div>'+
   '<div class="bkind" style="color:'+col+'">'+esc(KNAME[n.k]||n.k)+(n.v?' · <span class="mono">'+esc(n.v)+'</span>':'')+'</div>'+
   '<h2 class="btitle">'+esc(n.n)+'</h2>'+
   '<div class="bsect"><span class="l">What this is</span><p>'+esc(n.t)+'</p></div>'+
   '<div class="bsect help"><span class="l">How it helps you</span><p>'+esc(n.h)+'</p></div>'+
   (kids.length
     ? '<div class="bsect"><span class="l">Opens into '+kids.length+'</span>'+
       '<div class="bkids">'+kids.map(function(k){
          return '<button data-node="'+esc(k.id)+'" style="border-left-color:var('+(KCOL[k.k]||'--cy')+')">'+
                 '<b>'+esc(k.n)+'</b><span>'+esc(k.t.slice(0,96))+(k.t.length>96?'…':'')+'</span></button>';
         }).join('')+'</div></div>'
     : '<div class="bsect"><span class="l">End of this branch</span><p class="dim2">Nothing further under this one. '+
       (n.p?'<button class="blink" data-node="'+esc(n.p)+'">Go back up to '+esc(G.byId[n.p].n)+'</button>':'')+'</p></div>');
}

/* ---------------------------------------------------------------
   4 · RENDERER — perspective projection, depth sort, hit test
   --------------------------------------------------------------- */
function css(v){ return getComputedStyle(document.documentElement).getPropertyValue(v).trim()||'#888'; }

function start(){
  var c=$('#brainC'); if(!c) return;
  B.canvas=c;
  var ctx=c.getContext('2d'), DPR=Math.min(2,window.devicePixelRatio||1);
  var W=0,H=0, proj=[], drag=null, last=0;
  var COL={}, COLtheme=null;
  function readCols(){
    ['--acc','--cy','--ok','--no','--vi','--pk','--ink','--muted','--line'].forEach(function(k){ COL[k]=css(k); });
    COLtheme=document.documentElement.getAttribute('data-theme');
  }
  readCols();
  /* the palette is resolved from CSS variables, so it has to be re-read
     when the theme flips — otherwise labels are drawn in the old theme's
     ink and become invisible */
  function syncCols(){ if(document.documentElement.getAttribute('data-theme')!==COLtheme) readCols(); }

  function fitZoom(){ return Math.max(0.35, Math.min(1.6, 396/(G.extent||400))); }
  function size(){
    var r=c.parentNode.getBoundingClientRect();
    W=Math.max(320,r.width); H=Math.max(320,r.height);
    c.width=W*DPR; c.height=H*DPR; c.style.width=W+'px'; c.style.height=H+'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  size();
  if(!B.fitted){ B.zoom=fitZoom(); B.fitted=1; }
  B.fit=fitZoom;
  var ro=new ResizeObserver(size); ro.observe(c.parentNode);

  function visible(n){
    if(!n.p) return true;
    return !!B.open[n.p];
  }
  function matches(n){
    if(!B.q) return false;
    var q=B.q.toLowerCase();
    return n.n.toLowerCase().indexOf(q)>=0 || n.t.toLowerCase().indexOf(q)>=0 || n.h.toLowerCase().indexOf(q)>=0;
  }

  function frame(ts){
    var dt=Math.min(50, ts-last||16); last=ts;
    syncCols();
    if(B.spin && !drag) B.yaw += dt*0.00006;

    /* camera easing toward the selected node */
    B.cx += (B.tx-B.cx)*0.07; B.cy += (B.ty-B.cy)*0.07; B.cz += (B.tz-B.cz)*0.07;

    var cy=Math.cos(B.yaw), sy=Math.sin(B.yaw), cp=Math.cos(B.pitch), sp=Math.sin(B.pitch);
    var focal=760, scale=Math.min(W,H)/900*B.zoom;
    var selPath={}; ancestors(B.sel).forEach(function(a){ selPath[a.id]=1; });
    var hits=0;

    proj.length=0;
    for(var i=0;i<G.nodes.length;i++){
      var n=G.nodes[i];
      var x=n.x-B.cx, y=n.y-B.cy, z=n.z-B.cz;
      var x1=x*cy - z*sy, z1=x*sy + z*cy;
      var y1=y*cp - z1*sp, z2=y*sp + z1*cp;
      var d=focal + z2*0.9;
      if(d<60) continue;
      var f=focal/d;
      var vis=visible(n);
      var m=matches(n); if(m) hits++;
      proj.push({n:n, sx:W/2 + x1*f*scale, sy:H/2 + y1*f*scale, f:f, z:z2, vis:vis, m:m,
                 on:selPath[n.id], sel:n.id===B.sel});
    }
    proj.sort(function(a,b){ return b.z-a.z; });

    ctx.clearRect(0,0,W,H);

    /* edges */
    ctx.lineWidth=1;
    for(var e=0;e<proj.length;e++){
      var P=proj[e], n2=P.n; if(!n2.p) continue;
      var par=n2.__pp; /* resolved below on the same pass via map */
      if(!par) continue;
      void par;
    }
    var pmap={}; proj.forEach(function(P){ pmap[P.n.id]=P; });
    proj.forEach(function(P){
      var par=P.n.p && pmap[P.n.p]; if(!par) return;
      var strong = P.on || par.on || P.sel;
      var a = strong ? 0.55 : (P.vis ? 0.16 : 0.055);
      if(P.m) a=Math.max(a,0.5);
      ctx.strokeStyle = strong ? COL['--acc'] : COL['--line'];
      ctx.globalAlpha = a*Math.min(1,P.f*1.2);
      ctx.beginPath(); ctx.moveTo(par.sx,par.sy); ctx.lineTo(P.sx,P.sy); ctx.stroke();
    });
    ctx.globalAlpha=1;

    /* nodes */
    proj.forEach(function(P){
      var n3=P.n;
      var base = 1.35 + Math.max(0, 5.0 - n3.d*0.9) + Math.min(3.6, Math.log(1+n3.sub)*0.88);
      var r = base*P.f*B.zoom*0.9;
      if(r<0.35) return;
      var col = COL[KCOL[n3.k]||'--cy'];
      var alpha = P.sel?1 : P.on?0.95 : P.m?1 : P.vis?0.78 : 0.30;
      if(P.m || P.sel || P.on){
        var g=ctx.createRadialGradient(P.sx,P.sy,0,P.sx,P.sy,r*4.5);
        g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.globalAlpha=0.30; ctx.fillStyle=g;
        ctx.beginPath(); ctx.arc(P.sx,P.sy,r*4.5,0,6.2832); ctx.fill();
      }
      ctx.globalAlpha=alpha; ctx.fillStyle=col;
      ctx.beginPath(); ctx.arc(P.sx,P.sy,r,0,6.2832); ctx.fill();
      if(P.sel){ ctx.globalAlpha=1; ctx.strokeStyle=COL['--ink']; ctx.lineWidth=1.6;
        ctx.beginPath(); ctx.arc(P.sx,P.sy,r+4,0,6.2832); ctx.stroke(); ctx.lineWidth=1; }
    });

    /* labels — legible ones only, front-to-back, skipping any that would
       land on top of one already drawn. Selected always wins. */
    ctx.globalAlpha=1;
    ctx.font='600 11.5px ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
    ctx.textAlign='left'; ctx.textBaseline='middle';
    var cands=[];
    proj.forEach(function(P){
      var n4=P.n;
      var show = P.sel || P.on || P.m || (P.vis && n4.d<=1) || (P.vis && B.open[n4.p] && n4.d<=2 && P.f>0.92);
      if(show) cands.push(P);
    });
    /* nearest first, but the selection and its path outrank distance */
    cands.sort(function(a,b){
      var pa=(a.sel?8:0)+(a.n.d<=1?6:0)+(a.on?2:0)+(a.m?1:0),
          pb=(b.sel?8:0)+(b.n.d<=1?6:0)+(b.on?2:0)+(b.m?1:0);
      return pb-pa || a.z-b.z;
    });
    var taken=[];
    cands.forEach(function(P){
      var n4=P.n;
      var r=(1.1+Math.max(0,4.6-n4.d*0.85))*P.f*B.zoom;
      var txt=n4.n.length>34?n4.n.slice(0,32)+'…':n4.n;
      var w=ctx.measureText(txt).width;
      /* try right, then left, then below, then above before giving up */
      var slots=[[P.sx+r+3,P.sy-9],[P.sx-r-w-11,P.sy-9],[P.sx-w/2-4,P.sy+r+5],[P.sx-w/2-4,P.sy-r-23]];
      var box=null;
      for(var si=0; si<slots.length && !box; si++){
        var cand={x:slots[si][0], y:slots[si][1], w:w+8, h:18};
        if(cand.x<-40 || cand.x>W+40 || cand.y<-30 || cand.y>H+30) continue;
        var clash=false;
        for(var i=0;i<taken.length;i++){
          var t=taken[i];
          if(cand.x < t.x+t.w && cand.x+cand.w > t.x && cand.y < t.y+t.h && cand.y+cand.h > t.y){ clash=true; break; }
        }
        if(!clash) box=cand;
      }
      if(!box) return;
      taken.push(box);
      ctx.globalAlpha=0.78; ctx.fillStyle=COL['--line'];
      ctx.fillRect(box.x,box.y,box.w,box.h);
      ctx.globalAlpha=P.sel||P.m?1:0.92;
      ctx.fillStyle=P.sel?COL['--acc']:COL['--ink'];
      ctx.fillText(txt,box.x+4,box.y+9.5);
    });
    ctx.globalAlpha=1;

    var qn=$('#brainQn'); if(qn) qn.textContent = B.q ? (hits+' found') : '';
    B.raf=requestAnimationFrame(frame);
  }
  B.raf=requestAnimationFrame(frame);

  /* --- interaction --- */
  function pick(mx,my){
    var best=null, bd=1e9;
    for(var i=proj.length-1;i>=0;i--){
      var P=proj[i]; if(!P.vis && !P.m) continue;
      var d=Math.hypot(P.sx-mx,P.sy-my);
      var r=Math.max(9,(1.1+Math.max(0,4.6-P.n.d*0.85))*P.f*B.zoom+6);
      if(d<r && d<bd){ bd=d; best=P; }
    }
    return best;
  }
  c.onpointerdown=function(e){
    c.setPointerCapture(e.pointerId);
    drag={x:e.offsetX,y:e.offsetY,ox:e.offsetX,oy:e.offsetY,moved:0};
  };
  c.onpointermove=function(e){
    if(drag){
      var dx=e.offsetX-drag.x, dy=e.offsetY-drag.y;
      B.yaw += dx*0.006; B.pitch = Math.max(-1.35, Math.min(1.35, B.pitch + dy*0.005));
      drag.moved += Math.abs(dx)+Math.abs(dy);
      drag.x=e.offsetX; drag.y=e.offsetY;
      return;
    }
    var P=pick(e.offsetX,e.offsetY);
    var tip=$('#brainTip');
    if(P){
      c.style.cursor='pointer';
      tip.style.display='block'; tip.style.left=(P.sx+14)+'px'; tip.style.top=(P.sy-10)+'px';
      tip.innerHTML='<b>'+esc(P.n.n)+'</b><span>'+esc(KNAME[P.n.k]||P.n.k)+
        ((G.kids[P.n.id]||[]).length?' · opens into '+G.kids[P.n.id].length:'')+'</span>';
    } else { c.style.cursor='grab'; tip.style.display='none'; }
  };
  c.onpointerup=function(e){
    var wasDrag = drag && drag.moved>6;
    drag=null;
    if(wasDrag) return;
    var P=pick(e.offsetX,e.offsetY);
    if(P) selectNode(P.n.id);
  };
  c.onpointerleave=function(){ drag=null; var t=$('#brainTip'); if(t) t.style.display='none'; };
  c.onwheel=function(e){
    e.preventDefault();
    B.zoom = Math.max(0.35, Math.min(4.2, B.zoom * (e.deltaY>0?0.9:1.111)));
  };

  return {stop:function(){ if(B.raf) cancelAnimationFrame(B.raf); ro.disconnect(); }};
}

/* legend */
function paintLegend(){
  var leg=$('#brainLeg'); if(!leg) return;
  var counts={};
  G.nodes.forEach(function(n){ counts[n.k]=(counts[n.k]||0)+1; });
  leg.innerHTML=Object.keys(counts).sort(function(a,b){return counts[b]-counts[a];}).map(function(k){
    return '<span><i style="background:var('+(KCOL[k]||'--cy')+')"></i>'+esc(KNAME[k]||k)+' <b>'+counts[k]+'</b></span>';
  }).join('');
}

var running=null;
UI.registerView('brain', view);
UI.registerView('brain:after', function(){
  if(running){ running.stop(); running=null; }
  paintPanel(); paintLegend();
  running=start();
  var q=$('#brainQ');
  if(q) q.oninput=function(){
    B.q=this.value.trim();
    if(B.q.length>1){
      var hit=G.nodes.filter(function(n){
        return n.n.toLowerCase().indexOf(B.q.toLowerCase())>=0; })[0];
      if(hit){ ancestors(hit.id).forEach(function(a){ B.open[a.id]=1; }); }
    }
  };
});
UI.registerView('brain:act', function(a){
  if(a==='spin'){ B.spin=!B.spin; UI.render(); }
  if(a==='reset'){ B.yaw=0.5; B.pitch=-0.18; B.zoom=B.fit?B.fit():1; B.tx=B.ty=B.tz=0; }
  if(a==='top'){ B.open={root:1}; G.kids.root.forEach(function(d){ B.open[d.id]=1; }); selectNode('root'); }
});

document.addEventListener('click', function(e){
  var b=e.target.closest('[data-node]');
  if(b && UI.current()==='brain'){ selectNode(b.dataset.node); }
});

window.Brain={ graph:function(){ if(!G){G=buildGraph();layout(G);} return G; }, select:selectNode };
})();
</script>
