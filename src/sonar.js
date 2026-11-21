// ===== Sonar globe: Africa-facing orthographic globe with a sweeping scan and pulsing city signals =====
const AFRICA=new Set(["Algeria","Angola","Benin","Botswana","Burkina Faso","Burundi","Cameroon","Central African Rep.","Chad","Congo","Dem. Rep. Congo","Côte d'Ivoire","Djibouti","Egypt","Eq. Guinea","Eritrea","eSwatini","Ethiopia","Gabon","Gambia","Ghana","Guinea","Guinea-Bissau","Kenya","Lesotho","Liberia","Libya","Madagascar","Malawi","Mali","Mauritania","Morocco","Mozambique","Namibia","Niger","Nigeria","Rwanda","Senegal","Sierra Leone","Somalia","Somaliland","South Africa","S. Sudan","Sudan","Tanzania","Togo","Tunisia","Uganda","W. Sahara","Zambia","Zimbabwe"]);
let GLOBES=[];
function stopGlobes(){GLOBES.forEach(g=>g.stop=true);GLOBES=[];}
function startGlobe(id,o){
  const cv=document.getElementById(id);if(!cv||!window.d3g)return;const g={stop:false};GLOBES.push(g);
  const dpr=window.devicePixelRatio||1;const W=cv.clientWidth||600,H=+cv.getAttribute("height");cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+"px";
  const ctx=cv.getContext("2d");ctx.scale(dpr,dpr);
  const proj=d3g.geoOrthographic().rotate([-18,-2]).translate([W/2,H/2]).scale(Math.min(W,H)*0.78).clipAngle(90);
  const path=d3g.geoPath(proj,ctx);const grat=d3g.geoGraticule10();
  const R=cityRank(o.yr,o.niche);const top=new Set(R.slice(0,o.labels||8).map(r=>r.c.id));
  const pts=R.map(r=>{const p=proj([r.c.lon,r.c.lat]);return{...r,x:p[0],y:p[1],ph:(hashStr(r.c.id)%100)/100};});
  const ctr=proj([20,2]);const gmax=Math.max(1,...pts.map(p=>p.g));
  // static layer
  const base=document.createElement("canvas");base.width=W*dpr;base.height=H*dpr;const b=base.getContext("2d");b.scale(dpr,dpr);
  const bpath=d3g.geoPath(proj,b);
  const sg=b.createRadialGradient(W/2,H/2,10,W/2,H/2,Math.max(W,H));sg.addColorStop(0,"#0f2160");sg.addColorStop(1,"#050a1e");
  b.beginPath();bpath({type:"Sphere"});b.fillStyle=sg;b.fill();
  b.beginPath();bpath(grat);b.strokeStyle="rgba(120,150,255,.08)";b.lineWidth=.6;b.stroke();
  WORLD.features.forEach(f=>{const af=AFRICA.has(f.properties.n);b.beginPath();bpath(f);b.fillStyle=af?"rgba(201,168,76,.13)":"rgba(255,255,255,.035)";b.fill();b.strokeStyle=af?"rgba(236,213,147,.55)":"rgba(255,255,255,.09)";b.lineWidth=af?.7:.5;b.stroke();});
  let t0=performance.now();
  function frame(now){
    if(g.stop)return;const t=(now-t0)/1000;ctx.clearRect(0,0,W,H);ctx.drawImage(base,0,0,W,H);
    // sweep
    const ang=(t*0.9)%(Math.PI*2);const rad=Math.max(W,H);
    for(let i=0;i<24;i++){const a0=ang-i*0.025,a1=ang-(i+1)*0.025;ctx.beginPath();ctx.moveTo(ctr[0],ctr[1]);ctx.arc(ctr[0],ctr[1],rad,a1,a0);ctx.closePath();ctx.fillStyle=`rgba(61,214,198,${0.10*(1-i/24)})`;ctx.fill();}
    ctx.beginPath();ctx.moveTo(ctr[0],ctr[1]);ctx.lineTo(ctr[0]+Math.cos(ang)*rad,ctr[1]+Math.sin(ang)*rad);ctx.strokeStyle="rgba(61,214,198,.55)";ctx.lineWidth=1.2;ctx.stroke();
    // range rings
    [80,160,240].forEach(r=>{ctx.beginPath();ctx.arc(ctr[0],ctr[1],r*W/700,0,Math.PI*2);ctx.strokeStyle="rgba(61,214,198,.07)";ctx.lineWidth=1;ctx.stroke();});
    // cities
    pts.forEach(p=>{
      const rise=p.g>=gmax*0.75;const col=rise?"61,214,198":"236,213,147";const r0=2.5+p.s/14;
      let ca=Math.atan2(p.y-ctr[1],p.x-ctr[0]);if(ca<0)ca+=Math.PI*2;let d=ang-ca;if(d<0)d+=Math.PI*2;const ping=d<0.6?1-d/0.6:0;
      const k=((t*0.6+p.ph)%1);ctx.beginPath();ctx.arc(p.x,p.y,r0+k*r0*2.6,0,Math.PI*2);ctx.strokeStyle=`rgba(${col},${(1-k)*0.55})`;ctx.lineWidth=1.3;ctx.stroke();
      const gr=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r0*2.2+ping*8);gr.addColorStop(0,`rgba(${col},${0.85})`);gr.addColorStop(1,`rgba(${col},0)`);ctx.beginPath();ctx.arc(p.x,p.y,r0*2.2+ping*8,0,Math.PI*2);ctx.fillStyle=gr;ctx.fill();
      ctx.beginPath();ctx.arc(p.x,p.y,2.2,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();
      if(o.sel===p.c.id){ctx.beginPath();ctx.arc(p.x,p.y,r0*2.6+3,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=1.5;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);}
      if(top.has(p.c.id)||o.sel===p.c.id){ctx.font="600 11px Inter,sans-serif";ctx.fillStyle=`rgba(255,255,255,${0.75+ping*0.25})`;ctx.fillText(p.c.n+" "+p.s,p.x+r0+6,p.y+4);}
    });
    requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
  if(o.click)cv.onclick=e=>{const rc=cv.getBoundingClientRect();const x=e.clientX-rc.left,y=e.clientY-rc.top;let best=null,bd=22;pts.forEach(p=>{const d=Math.hypot(p.x-x,p.y-y);if(d<bd){bd=d;best=p;}});if(best)o.click(best.c.id);};
}
render();
