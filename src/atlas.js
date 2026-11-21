// ===== Horizon Atlas globe: zoom, drag, fly-to-city, scanning beam and pulsing opportunity signals =====
const AFRICA=new Set(["Algeria","Angola","Benin","Botswana","Burkina Faso","Burundi","Cameroon","Central African Rep.","Chad","Congo","Dem. Rep. Congo","Côte d'Ivoire","Djibouti","Egypt","Eq. Guinea","Eritrea","eSwatini","Ethiopia","Gabon","Gambia","Ghana","Guinea","Guinea-Bissau","Kenya","Lesotho","Liberia","Libya","Madagascar","Malawi","Mali","Mauritania","Morocco","Mozambique","Namibia","Niger","Nigeria","Rwanda","Senegal","Sierra Leone","Somalia","Somaliland","South Africa","S. Sudan","Sudan","Tanzania","Togo","Tunisia","Uganda","W. Sahara","Zambia","Zimbabwe"]);
const WORLDNAME={"DR Congo":"Dem. Rep. Congo"};
let GLOBES=[];const VIEWSTATE={rot:[-18,-2],k:1,last:null};
function stopGlobes(){GLOBES.forEach(g=>g.stop=true);GLOBES=[];}
function startGlobe(id,o){
  const cv=document.getElementById(id);if(!cv||!window.d3g)return;const g={stop:false};GLOBES.push(g);
  const dpr=window.devicePixelRatio||1;const W=cv.clientWidth||600,H=+cv.getAttribute("height");cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+"px";
  const ctx=cv.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);
  const st=o.interactive?VIEWSTATE:{rot:[-18,-2],k:1};const S0=Math.min(W,H)*0.78;
  const proj=d3g.geoOrthographic().translate([W/2,H/2]).clipAngle(90);const path=d3g.geoPath(proj,ctx);const grat=d3g.geoGraticule10();
  const R=cityRank(o.yr,o.niche);const gmax=Math.max(1,...R.map(r=>r.g));const top=new Set(R.slice(0,o.labels||8).map(r=>r.c.id));
  const selC=o.sel?cityById(o.sel):null;const selCountry=selC?(WORLDNAME[selC.c]||selC.c):null;
  let fly=null,pts=[];const PCL=o.power?powerClusters(o.yr):null;
  g.flyTo=(c,k)=>{fly={t0:performance.now(),from:[...st.rot],fk:st.k,to:[-c.lon,-c.lat],tk:k||3.4};};
  if(o.flyTo){const c=cityById(o.flyTo);if(c)g.flyTo(c,o.flyK);}
  const t0=performance.now();
  function frame(now){
    if(g.stop)return;const t=(now-t0)/1000;
    if(fly){const p=Math.min(1,(now-fly.t0)/1100);const e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;st.rot=[fly.from[0]+(fly.to[0]-fly.from[0])*e,fly.from[1]+(fly.to[1]-fly.from[1])*e];st.k=fly.fk+(fly.tk-fly.fk)*e;if(p>=1)fly=null;}
    proj.rotate(st.rot).scale(S0*st.k);ctx.clearRect(0,0,W,H);
    const sg=ctx.createRadialGradient(W/2,H/2,10,W/2,H/2,S0*st.k);sg.addColorStop(0,"#13286e");sg.addColorStop(1,"#050a1e");
    ctx.beginPath();path({type:"Sphere"});ctx.fillStyle=sg;ctx.fill();
    ctx.beginPath();path(grat);ctx.strokeStyle="rgba(120,150,255,.08)";ctx.lineWidth=.6;ctx.stroke();
    WORLD.features.forEach(f=>{const n=f.properties.n;const af=AFRICA.has(n),sel=n===selCountry;ctx.beginPath();path(f);
      ctx.fillStyle=sel?"rgba(61,214,198,.22)":af?"rgba(201,168,76,.13)":"rgba(255,255,255,.035)";ctx.fill();
      ctx.strokeStyle=sel?"rgba(61,214,198,.9)":af?"rgba(236,213,147,.55)":"rgba(255,255,255,.09)";ctx.lineWidth=sel?1.4:af?.7:.5;ctx.stroke();});
    ctx.beginPath();path({type:"Sphere"});ctx.strokeStyle="rgba(61,214,198,.35)";ctx.lineWidth=1.2;ctx.stroke();
        const centre=[-st.rot[0],-st.rot[1]];
    if(o.power&&PCL){PCL.clusters.forEach((k,ci)=>{const vis=m=>d3g.geoDistance([m.c.lon,m.c.lat],centre)<Math.PI/2;
      for(let i=0;i<k.members.length;i++)for(let j=i+1;j<k.members.length;j++){const a=k.members[i],b=k.members[j];if(!vis(a)||!vis(b))continue;ctx.beginPath();path({type:"LineString",coordinates:[[a.c.lon,a.c.lat],[b.c.lon,b.c.lat]]});ctx.strokeStyle=`rgba(255,120,90,${.18+(k.mag-5)*.08})`;ctx.lineWidth=1.2;ctx.stroke();}
      if(d3g.geoDistance([k.lon,k.lat],centre)>=Math.PI/2)return;const p=proj([k.lon,k.lat]);if(!p)return;const base=(14+k.size*10)*Math.min(2.2,Math.sqrt(st.k))*(.6+(k.mag-4)*.15);
      for(let w=0;w<3;w++){const ph=((t*.35+w/3)%1);ctx.beginPath();ctx.arc(p[0],p[1],base*(.4+ph*1.4),0,Math.PI*2);ctx.strokeStyle=`rgba(255,120,90,${(1-ph)*.45})`;ctx.lineWidth=2;ctx.stroke();}
      const gr=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],base);gr.addColorStop(0,`rgba(255,110,80,${.28+(k.mag-5)*.06})`);gr.addColorStop(1,"rgba(255,110,80,0)");ctx.beginPath();ctx.arc(p[0],p[1],base,0,Math.PI*2);ctx.fillStyle=gr;ctx.fill();
      if(ci<4){ctx.font="700 11px Inter,sans-serif";ctx.fillStyle="rgba(255,190,170,.95)";ctx.fillText("M"+k.mag+" · "+k.name,p[0]-base*.4,p[1]-base*.55-4);}});}
    pts=[];
    R.forEach(r=>{if(d3g.geoDistance([r.c.lon,r.c.lat],centre)>=Math.PI/2)return;const p=proj([r.c.lon,r.c.lat]);if(!p)return;const x=p[0],y=p[1];if(x<-20||y<-20||x>W+20||y>H+20)return;pts.push({...r,x,y});
      const rise=r.g>=gmax*.75,col=rise?"61,214,198":"236,213,147";const r0=(2.5+r.s/14)*Math.min(2,Math.sqrt(st.k));const ph=(hashStr(r.c.id)%100)/100;
      const ping=0;
      const k=((t*.6+ph)%1);ctx.beginPath();ctx.arc(x,y,r0+k*r0*2.6,0,Math.PI*2);ctx.strokeStyle=`rgba(${col},${(1-k)*.55})`;ctx.lineWidth=1.3;ctx.stroke();
      const gr=ctx.createRadialGradient(x,y,0,x,y,r0*2.2+ping*8);gr.addColorStop(0,`rgba(${col},.85)`);gr.addColorStop(1,`rgba(${col},0)`);ctx.beginPath();ctx.arc(x,y,r0*2.2+ping*8,0,Math.PI*2);ctx.fillStyle=gr;ctx.fill();
      ctx.beginPath();ctx.arc(x,y,2.4,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();
      const isSel=o.sel===r.c.id;
      if(isSel){ctx.beginPath();ctx.arc(x,y,r0*2.6+4+Math.sin(t*3)*2,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=1.6;ctx.setLineDash([4,3]);ctx.stroke();ctx.setLineDash([]);}
      if(top.has(r.c.id)||isSel||st.k>1.8){ctx.font=`${isSel?700:600} ${isSel?13:11}px Inter,sans-serif`;ctx.fillStyle=`rgba(255,255,255,${.78+ping*.22})`;ctx.fillText(r.c.n+" "+r.s,x+r0+6,y+4);}});
    requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
  if(o.interactive){
    let drag=null,moved=false;
    cv.onpointerdown=e=>{drag={x:e.clientX,y:e.clientY,r:[...st.rot]};moved=false;try{cv.setPointerCapture(e.pointerId);}catch(_){}};
    cv.onpointermove=e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4)moved=true;const s=.25/st.k;st.rot=[drag.r[0]+dx*s,Math.max(-80,Math.min(80,drag.r[1]-dy*s))];};
    cv.onpointerup=e=>{const was=drag;drag=null;if(moved||!was)return;const rc=cv.getBoundingClientRect();const x=e.clientX-rc.left,y=e.clientY-rc.top;let best=null,bd=24;pts.forEach(p=>{const d=Math.hypot(p.x-x,p.y-y);if(d<bd){bd=d;best=p;}});if(best&&o.click)o.click(best.c.id);};
    cv.onwheel=e=>{e.preventDefault();st.k=Math.max(.8,Math.min(9,st.k*(e.deltaY<0?1.12:1/1.12)));};
  }
  return g;}
function zoomAtlas(f){if(f===0){VIEWSTATE.rot=[-18,-2];VIEWSTATE.k=1;}else VIEWSTATE.k=Math.max(.8,Math.min(9,VIEWSTATE.k*f));}

// ---- starfield background ----
(function(){const c=document.createElement("canvas");c.id="stars";document.body.prepend(c);const x=c.getContext("2d");let W,H,P=[];
 function rs(){W=c.width=innerWidth;H=c.height=innerHeight;P=Array.from({length:Math.round(W*H/9000)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.2+.2,t:Math.random()*6}));}
 rs();addEventListener("resize",rs);(function f(n){x.clearRect(0,0,W,H);P.forEach(p=>{const a=.25+.35*Math.sin(n/900+p.t);x.fillStyle=`rgba(236,213,147,${a})`;x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill();});requestAnimationFrame(f);})(0);})();
render();
