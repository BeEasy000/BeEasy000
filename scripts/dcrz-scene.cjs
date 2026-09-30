// DCRZ Studio wireframe scene. Deterministic: render(timeInSeconds).
// Geometry and timing are shared with the reviewed interactive concept.
module.exports = function createScene(ctx, width, height, theme = 'dark') {
  const config = { particles: true }, reduced = false;
  const canvas = { dataset: {} };
  const status = { textContent: '' }, sceneLabel = { textContent: '' }, sceneButton = { textContent: '' };
    const clamp=x=>Math.max(0,Math.min(1,x));
    const ease=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10);};
    const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
    const edges=[];
    function edge(a,b,kind='main'){edges.push({a,b,kind,seed:edges.length*.731});}
    function loop(points,kind='main'){points.forEach((p,i)=>edge(p,points[(i+1)%points.length],kind));}
    for(const z of [-.82,.82]) {
      loop([[-.98,0,z],[.98,0,z],[.98,1.42,z],[0,2.24,z],[-.98,1.42,z]]);
      edge([-.98,1.42,z],[.98,1.42,z]);
      for(let y=.24;y<1.4;y+=.24) edge([-.98,y,z],[.98,y,z],'mesh');
    }
    for(const p of [[-.98,0],[.98,0],[-.98,1.42],[.98,1.42],[0,2.24]])edge([p[0],p[1],-.82],[p[0],p[1],.82]);
    for(let z=-.62;z<.81;z+=.24){
      edge([-1.13,1.36,z],[0,2.3,z],'roof');edge([0,2.3,z],[1.13,1.36,z],'roof');
    }
    for(let y=.24;y<1.4;y+=.24){edge([-.98,y,-.82],[-.98,y,.82],'mesh');edge([.98,y,-.82],[.98,y,.82],'mesh');}
    // Projecting eaves, ridge cap and fine roof seams.
    for(const z of [-.98,.98]) {
      for(const dy of [0,-.065]){edge([-1.13,1.36+dy,z],[0,2.3+dy,z],'roof');edge([0,2.3+dy,z],[1.13,1.36+dy,z],'roof');}
    }
    for(const x of [-1.13,1.13])for(const y of [1.36,1.295])edge([x,y,-.98],[x,y,.98],'roof');
    edge([0,2.3,-.98],[0,2.3,.98],'roof');
    for(let x=.27;x<1.1;x+=.27){let y=2.3-x/1.13*.94;edge([x,y,-.98],[x,y,.98],'mesh');edge([-x,y,-.98],[-x,y,.98],'mesh');}
    function solidBox(x1,x2,y1,y2,z1,z2,kind='main'){
      for(const y of [y1,y2])loop([[x1,y,z1],[x2,y,z1],[x2,y,z2],[x1,y,z2]],kind);
      for(const x of [x1,x2])for(const z of [z1,z2])edge([x,y1,z],[x,y2,z],kind);
    }
    solidBox(-1.045,1.045,-.08,.035,-.88,.89,'trim');
    solidBox(-.69,-.42,1.94,2.51,-.46,-.17,'roof');
    solidBox(-.735,-.375,2.49,2.57,-.505,-.125,'trim');
    // Front and side windows: recessed frames, mullions and projecting sills.
    function windowFrame(cx,cy,w,h,side=false,back=false){
      const p=(u,v,d=0)=>side?[back?-1.002-d:1.002+d,v,u]:[u,v,back?-.843-d:.843+d];
      for(const inset of [0,.037])loop([p(cx-w/2+inset,cy-h/2+inset),p(cx+w/2-inset,cy-h/2+inset),p(cx+w/2-inset,cy+h/2-inset),p(cx-w/2+inset,cy+h/2-inset)],'detail');
      edge(p(cx,cy-h/2+.04),p(cx,cy+h/2-.04),'detail');
      edge(p(cx-w/2+.04,cy+.025),p(cx+w/2-.04,cy+.025),'detail');
      edge(p(cx-w/2-.04,cy-h/2-.025,.055),p(cx+w/2+.04,cy-h/2-.025,.055),'trim');
    }
    for(const x of [-.67,.67]){windowFrame(x,.86,.39,.53);windowFrame(x,.86,.39,.53,false,true);}
    for(const side of [false,true])for(const z of [-.42,.4])windowFrame(z,.84,.44,.55,true,side);
    loop([[-.245,.035,.85],[.245,.035,.85],[.245,1.035,.85],[-.245,1.035,.85]],'detail');
    loop([[-.19,.095,.86],[.19,.095,.86],[.19,.98,.86],[-.19,.98,.86]],'trim');
    for(const y of [.24,.62])loop([[-.135,y,.87],[.135,y,.87],[.135,y+.24,.87],[-.135,y+.24,.87]],'mesh');
    edge([.13,.51,.885],[.165,.51,.885],'detail');
    for(const r of [.15,.185]){
      const pts=Array.from({length:24},(_,i)=>[Math.cos(i*Math.PI/12)*r,1.79+Math.sin(i*Math.PI/12)*r,.85]);loop(pts,'trim');
    }
    edge([-.14,1.79,.86],[.14,1.79,.86],'detail');edge([0,1.65,.86],[0,1.93,.86],'detail');
    // Small covered porch, columns and stepped entrance.
    solidBox(-.53,.53,-.015,.09,.88,1.43,'trim');
    solidBox(-.4,.4,-.08,-.005,1.43,1.61,'trim');
    for(const x of [-.46,.46]){solidBox(x-.025,x+.025,.09,1.12,1.32,1.37,'trim');solidBox(x-.05,x+.05,.09,.18,1.295,1.395,'mesh');}
    for(const z of [.86,1.47]){edge([-.57,1.12,z],[0,1.48,z],'roof');edge([0,1.48,z],[.57,1.12,z],'roof');edge([-.57,1.12,z],[.57,1.12,z],'trim');}
    for(const p of [[-.57,1.12],[0,1.48],[.57,1.12]])edge([p[0],p[1],.86],[p[0],p[1],1.47],'roof');
    for(const x of [-.28,.28])edge([x,1.48-Math.abs(x)*.36/.57,.86],[x,1.48-Math.abs(x)*.36/.57,1.47],'mesh');
    // Two restrained geometric planters frame the porch.
    for(const x of [-.83,.83]){
      solidBox(x-.115,x+.115,.025,.2,1.01,1.24,'trim');
      for(let i=0;i<5;i++){const a=i*Math.PI*2/5;edge([x,.2,1.12],[x+Math.cos(a)*.105,.37+(i%2)*.065,1.12+Math.sin(a)*.1],'plant');edge([x+Math.cos(a)*.105,.37+(i%2)*.065,1.12+Math.sin(a)*.1],[x,.31,1.12],'plant');}
    }
    // Stylized first-generation Toyota GT86. Curves are sampled into fine rods.
    const carEdges=[];
    let carNormal=null,carStage='body';
    function carEdge(a,b,kind='main'){carEdges.push({a,b,kind,stage:carStage,normal:carNormal,seed:carEdges.length*.017});}
    function carPath(points,kind='main',closed=false){for(let i=1;i<points.length;i++)carEdge(points[i-1],points[i],kind);if(closed)carEdge(points[points.length-1],points[0],kind);}
    function carLoop(points,kind='main'){carPath(points,kind,true);}
    function carCurve(points,kind='main',closed=false){
      const result=[],n=points.length;
      for(let i=0;i<(closed?n:n-1);i++){
        const a=points[closed?(i+n-1)%n:Math.max(0,i-1)],b=points[i],c=points[(i+1)%n],d=points[closed?(i+2)%n:Math.min(n-1,i+2)];
        for(let j=0;j<7;j++){const t=j/7;result.push(b.map((v,k)=>.5*((2*v)+(-a[k]+c[k])*t+(2*a[k]-5*v+4*c[k]-d[k])*t*t+(-a[k]+3*v-3*c[k]+d[k])*t*t*t)));}
      }
      if(!closed)result.push(points[n-1]);carPath(result,kind,closed);
    }
    const circle=(cx,cy,cz,ry,rz,plane='side',rx=ry)=>Array.from({length:40},(_,i)=>{const a=i*Math.PI/20;return plane==='side'?[cx,cy+Math.sin(a)*ry,cz+Math.cos(a)*rz]:[cx+Math.cos(a)*rx,cy+Math.sin(a)*ry,cz];});
    const shoulder=[[-1.75,.67,.7],[-1.45,.77,.84],[-1.05,.79,.88],[-.55,.745,.815],[.3,.73,.80],[.82,.79,.89],[1.17,.79,.885],[1.57,.71,.78],[1.83,.54,.635]];
    for(const side of [-1,1]){
      carNormal=[side,0,0];carStage='body';
      const p=(x,y,z)=>[side*x,y,z];
      carCurve(shoulder.map(([z,x,y])=>p(x,y,z)));
      carCurve([p(.68,.58,-1.73),p(.78,.62,-1.38),p(.77,.64,-.6),p(.75,.65,.3),p(.8,.69,1.2),p(.70,.62,1.72)],'mesh');
      carCurve([p(.76,.24,-.72),p(.775,.215,-.25),p(.78,.22,.4),p(.79,.27,.73)],'trim');
      carCurve([p(.75,.19,-.73),p(.77,.175,0),p(.78,.195,.73)],'main');
      carCurve([p(.65,.26,-1.78),p(.75,.29,-1.56),p(.805,.325,-1.435)],'trim');
      carCurve([p(.80,.325,1.435),p(.74,.24,1.64),p(.62,.23,1.84)],'trim');
      for(const zc of [-1.055,1.055]){
        carStage='body';
        carPath(Array.from({length:33},(_,i)=>p(.805,.322+Math.sin(i*Math.PI/32)*.375,zc+Math.cos(i*Math.PI/32)*.38)),'main');
        carPath(Array.from({length:33},(_,i)=>p(.785,.32+Math.sin(i*Math.PI/32)*.411,zc+Math.cos(i*Math.PI/32)*.411)),'trim');
        carStage='wheels';
        for(const [r,x,kind] of [[.31,.82,'main'],[.286,.832,'trim'],[.237,.842,'detail'],[.216,.844,'trim'],[.17,.813,'mesh'],[.053,.854,'detail']])carLoop(circle(side*x,.315,zc,r,r),kind);
        // Five split spokes, wheel bolts, brake disc and a small caliper.
        for(let i=0;i<5;i++){
          const a=i*Math.PI*2/5;
          for(const offset of [-.13,.13])carCurve([p(.86,.315+Math.sin(a)*.057,zc+Math.cos(a)*.057),p(.864,.315+Math.sin(a+offset*.6)*.13,zc+Math.cos(a+offset*.6)*.13),p(.849,.315+Math.sin(a+offset)*.217,zc+Math.cos(a+offset)*.217)],'trim');
          const y=.315+Math.sin(a)*.034,z=zc+Math.cos(a)*.034;
          carLoop(circle(side*.861,y,z,.009,.009),'detail');
        }
        carCurve([p(.827,.22,zc-.12),p(.834,.24,zc-.16),p(.834,.40,zc-.16),p(.827,.42,zc-.12)],'detail');
      }
      // Continuous bowed greenhouse and frameless side windows.
      carStage='glass';
      carCurve([p(.70,.825,.64),p(.59,1.08,.27),p(.53,1.205,-.12),p(.535,1.18,-.5),p(.62,1.025,-.87),p(.73,.85,-1.20)],'main');
      carCurve([p(.69,.848,.55),p(.59,1.07,.23),p(.542,1.166,-.13),p(.545,1.145,-.46),p(.635,.986,-.92),p(.665,.877,-.77),p(.69,.848,.55)],'detail');
      carCurve([p(.545,1.147,-.46),p(.59,1.015,-.48),p(.665,.862,-.50)],'trim');
      carCurve([p(.551,1.14,-.50),p(.60,1.012,-.52),p(.67,.868,-.54)],'trim');
      carStage='body';
      carCurve([p(.705,.837,.54),p(.748,.69,.50),p(.777,.43,.46),p(.768,.277,.26),p(.761,.263,-.44),p(.755,.36,-.65),p(.733,.59,-.66),p(.706,.847,-.55)],'trim');
      carCurve([p(.75,.72,-.36),p(.768,.74,-.49),p(.75,.713,-.55)],'detail',true);
      // Fender vent and mirror with a rounded housing.
      carCurve([p(.79,.835,.73),p(.785,.804,.50),p(.775,.795,.38),p(.779,.822,.49)],'trim',true);
      carEdge(p(.71,.90,.42),p(.85,.90,.43),'trim');
      carCurve([p(.85,.87,.28),p(.95,.89,.32),p(.98,.96,.44),p(.91,.985,.51),p(.82,.94,.47)],'main',true);
      carCurve([p(.865,.89,.29),p(.952,.917,.35),p(.96,.957,.44)],'detail');
      // Raised front fenders flow into a gently domed hood.
      carCurve([p(.61,.844,.66),p(.55,.824,1.00),p(.45,.748,1.51),p(.31,.69,1.74)],'trim');
      carCurve([p(.30,.86,.62),p(.30,.84,1.04),p(.25,.78,1.45),p(.21,.70,1.73)],'mesh');
      // Swept-back GT86 headlamp outline and projector lens.
      carStage='details';
      carNormal=[side*.4,.1,1];
      carCurve([p(.275,.68,1.79),p(.46,.70,1.75),p(.68,.765,1.57),p(.73,.82,1.43),p(.68,.665,1.70),p(.49,.62,1.81)],'detail',true);
      carCurve([p(.315,.682,1.795),p(.48,.688,1.765),p(.64,.726,1.63),p(.695,.774,1.48)],'trim');
      carLoop(circle(side*.592,.705,1.711,.060,.06,'front',.056),'detail');
      carLoop(circle(side*.592,.705,1.712,.042,.042,'front',.039),'trim');
      // Fog lamp pockets and lower bumper air channels.
      carCurve([p(.56,.48,1.80),p(.70,.565,1.70),p(.72,.34,1.72),p(.53,.29,1.825)],'trim',true);
      carLoop(circle(side*.635,.365,1.80,.048,.048,'front',.047),'detail');
      carCurve([p(.54,.25,1.84),p(.70,.235,1.75),p(.74,.26,1.62)],'main');
      // Sculpted rear lamps, round inner elements and twin exhaust tips.
      carNormal=[side*.3,0,-1];
      carCurve([p(.24,.785,-1.70),p(.53,.79,-1.75),p(.74,.80,-1.59),p(.71,.62,-1.68),p(.58,.55,-1.75),p(.39,.615,-1.785)],'detail',true);
      carLoop(circle(side*.573,.666,-1.77,.088,.088,'front',.078),'detail');
      carLoop(circle(side*.573,.666,-1.773,.065,.065,'front',.057),'trim');
      for(const r of [.074,.055])carLoop(circle(side*.52,.25,-1.80,r,r,'front',r),'trim');
      carCurve([p(.20,.30,-1.79),p(.29,.40,-1.80),p(.52,.405,-1.78),p(.69,.36,-1.71)],'trim');
    }
    carNormal=[0,1,0];carStage='glass';
    // Crown of the roof; front and rear glass follow the same smooth shell.
    for(const [z,x,y] of [[.26,.59,1.08],[-.12,.53,1.205],[-.50,.535,1.18],[-.88,.62,1.025],[.64,.70,.825],[-1.20,.73,.85]])carCurve([[-x,y,z],[-x*.55,y+.025,z],[0,y+.045,z],[x*.55,y+.025,z],[x,y,z]],'trim');
    for(const x of [-.26,.26])carCurve([[x,1.10,.26],[x,1.24,-.12],[x,1.215,-.5],[x,1.07,-.88]],'mesh');
    carStage='body';
    for(const [z,x,y] of [[.85,.59,.848],[1.2,.53,.82],[1.53,.43,.747],[-1.38,.73,.84],[-1.57,.72,.80]])carCurve([[-x,y,z],[0,y+.025,z],[x,y,z]],'mesh');
    // Subtle integrated rear lip.
    for(const z of [-1.60,-1.67])carCurve([[-.70,.81,z],[-.37,.84,z],[0,.845,z],[.37,.84,z],[.70,.81,z]],'trim');
    carNormal=[0,0,1];carStage='details';
    carCurve([[-.53,.59,1.82],[-.28,.625,1.855],[0,.64,1.864],[.28,.625,1.855],[.53,.59,1.82]],'main');
    // Single wide trapezoid intake, with a restrained grille mesh.
    carCurve([[-.365,.525,1.861],[-.445,.36,1.88],[-.39,.285,1.88],[0,.277,1.895],[.39,.285,1.88],[.445,.36,1.88],[.365,.525,1.861],[0,.536,1.878]],'detail',true);
    for(const y of [.32,.37,.42,.47])carCurve([[-.37,y,1.888],[0,y,1.905],[.37,y,1.888]],'mesh');
    for(let x=-.3;x<=.3;x+=.075)carEdge([x,.30,1.905],[x+.07,.51,1.887],'mesh');
    carCurve([[-.62,.23,1.84],[0,.213,1.915],[.62,.23,1.84]],'trim');
    // Toyota oval badge and nested ovals, front and rear.
    for(const z of [1.851,-1.779]){
      carNormal=[0,0,Math.sign(z)];
      carLoop(circle(0,.672,z,.033,.033,'front',.05),'detail');
      carLoop(circle(0,.674,z+.002,.026,.026,'front',.017),'trim');
      carLoop(circle(0,.681,z+.003,.010,.010,'front',.038),'trim');
    }
    carNormal=[0,0,-1];
    carCurve([[-.69,.5,-1.72],[-.4,.43,-1.78],[0,.42,-1.80],[.4,.43,-1.78],[.69,.5,-1.72]],'trim');
    carLoop([[-.20,.48,-1.79],[.20,.48,-1.79],[.20,.62,-1.79],[-.20,.62,-1.79]],'trim');
    for(const x of [-.27,0,.27])carEdge([x,.19,-1.73],[x,.29,-1.80],'trim');
    carNormal=null;carStage='body';
    const camera=[];
    const camEdge=(a,b)=>camera.push({a,b});
    function box(x1,x2,y1,y2,z1,z2){
      for(const x of [x1,x2]){camEdge([x,y1,z1],[x,y2,z1]);camEdge([x,y1,z2],[x,y2,z2]);camEdge([x,y1,z1],[x,y1,z2]);camEdge([x,y2,z1],[x,y2,z2]);}
      for(const y of [y1,y2])for(const z of [z1,z2])camEdge([x1,y,z],[x2,y,z]);
    }
    box(-3.02,-2.42,1.23,1.69,-.27,.27);
    box(-2.86,-2.63,1.69,1.79,-.15,.15);
    for(let n=0;n<20;n++) {
      let a=n*Math.PI/10,b=(n+1)*Math.PI/10;
      for(const x of [-2.42,-2.12])camEdge([x,1.46+Math.cos(a)*.18,Math.sin(a)*.18],[x,1.46+Math.cos(b)*.18,Math.sin(b)*.18]);
      if(n%5===0)camEdge([-2.42,1.46+Math.cos(a)*.18,Math.sin(a)*.18],[-2.12,1.46+Math.cos(a)*.18,Math.sin(a)*.18]);
    }
    camEdge([-2.74,1.23,0],[-2.74,1.03,0]);
    for(const foot of [[-3.24,0,.47],[-2.18,0,.39],[-2.8,0,-.48]]) {
      camEdge([-2.74,1.03,0],foot);camEdge([-2.74,.56,0],mix([-2.74,1.03,0],foot,.65));
    }
    const makeParticles=list=>list.flatMap((e,i)=>Array.from({length:e.kind==='mesh'?1:3},(_,j)=>({p:mix(e.a,e.b,(j+.5)/(e.kind==='mesh'?1:3)),seed:i*13.7+j*7.3})));
    const houseParticles=makeParticles(edges),carParticles=makeParticles(carEdges.filter((e,i)=>i%5===0));
    const scale=()=>Math.min(width/6.8,height/3.9);
    function project(p){return [width*.52+(p[0]*.94+p[2]*.34)*scale(),height*.78+(-p[1]+p[2]*.28-p[0]*.10)*scale()];}
    function house(p,angle,lift){return [p[0]*Math.cos(angle)+p[2]*Math.sin(angle)+.96,p[1]+lift,-p[0]*Math.sin(angle)+p[2]*Math.cos(angle)];}
    function line(a,b,color,alpha=1,lineWidth=1){if(alpha<=0)return;ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();}
    function dot(p,r,color,alpha=1){if(alpha<=0)return;ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.beginPath();ctx.arc(p[0],p[1],r,0,Math.PI*2);ctx.fill();}
    function draw(total){
      const cycle=total%42.7,isCar=cycle>=17.7,t=isCar?(cycle-17.7)*17.7/25:cycle;
      const activeEdges=isCar?carEdges:edges,particles=isCar?carParticles:houseParticles;
      const subjectHeight=isCar?1.25:2.57;
      const transform=(p,angle,lift)=>house(isCar?[p[0]*1.08,p[1]*1.08+.2,p[2]*1.08]:p,angle,lift);
      const subject=isCar?'CONCESIONARIAS · 360°':'INMOBILIARIAS · 360°';
      if(sceneLabel.textContent!==subject){sceneLabel.textContent=subject;sceneButton.textContent=isCar?'Ver casa':'Ver GT86';}
      ctx.clearRect(0,0,width,height);
      const lavender=theme==='light'?'#7554b6':'#c3b4fa',mint=theme==='light'?'#276954':'#a0dac5';
      const formed=ease((t-1.4)/4.4),fade=1-ease((t-15.4)/1.9),appearance=formed*fade;
      const scanZ=1.96-3.92*ease((t-2.65)/1.95);
      const angle=(isCar?.57:.28)+ease((t-5.8)/9.5)*Math.PI*2,lift=Math.sin(Math.max(0,t-5.8)*.85)*.045*ease((t-5.8)/2);
      let prev=null;
      for(let n=0;n<=96;n++){let a=n/96*Math.PI*2,p=project([.96+Math.cos(a)*1.77,-.03,Math.sin(a)*1.24]);if(prev)line(prev,p,mint,.18);prev=p;}
      for(let x=-.8;x<2.7;x+=.44)line(project([x,-.04,-1.15]),project([x,-.04,1.15]),lavender,.045);
      for(let z=-1.1;z<1.2;z+=.44)line(project([-.8,-.04,z]),project([2.7,-.04,z]),lavender,.045);
      // Faint viewfinder marks define the empty subject before the capture.
      if(t<1.6){const a=project([-.48,2.2,0]),b=project([2.45,.12,0]);for(const [x,y,dx,dy] of [[a[0],a[1],1,1],[b[0],a[1],-1,1],[a[0],b[1],1,-1],[b[0],b[1],-1,-1]]){line([x,y],[x+dx*9,y],mint,.35);line([x,y],[x,y+dy*9],mint,.35);}}
      if(t>1.26&&t<2){const a=project([-2.1,1.46,0]),b=project([.96,2.2,-.6]),c=project([.96,0,.6]);ctx.globalAlpha=Math.sin(clamp((t-1.26)/.74)*Math.PI)*.10;ctx.fillStyle=mint;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.lineTo(...c);ctx.closePath();ctx.fill();}
      const ordered=activeEdges.map(e=>({e,depth:transform(mix(e.a,e.b,.5),angle,0)[2]})).sort((a,b)=>a.depth-b.depth);
      for(const {e,depth} of ordered){
        const level=clamp((e.a[1]+e.b[1])/(subjectHeight*2));
        const delay=level*1.7+(e.kind==='detail'?.44:e.kind==='mesh'?.23:0)+(.5+.5*Math.sin(e.seed))*.16;
        let progress=ease((t-1.5-delay)/2.45);
        const midpoint=mix(e.a,e.b,.5);
        if(isCar){
          if(e.stage==='wheels'){
            const zc=midpoint[2]>0?1.055:-1.055;
            const radius=Math.hypot(midpoint[1]-.315,midpoint[2]-zc);
            const phase=((Math.atan2(midpoint[1]-.315,midpoint[2]-zc)-Math.PI/2+Math.PI*2)%(Math.PI*2))/(Math.PI*2);
            progress=ease((t-1.48-phase*.88-(radius<.255?.23:0))/.34);
          }else if(e.stage==='glass'){
            progress=ease((t-4.5-clamp((1.3-midpoint[2])/3)*.24)/.75);
          }else if(e.stage==='details'){
            progress=ease((t-4.92-clamp((1.9-midpoint[2])/3.8)*.2)/.65);
          }else{
            progress=ease((midpoint[2]-scanZ+.06)/.32)*ease((t-2.58)/.18);
          }
        }
        if(progress<=0)continue;
        const center=mix(e.a,e.b,.5),a=project(transform(mix(center,e.a,progress),angle,lift)),b=project(transform(mix(center,e.b,progress),angle,lift));
        let depthOpacity=.45+.55*clamp((depth+1.4)/2.8);
        if(isCar&&e.normal){
          const n=e.normal,nx=n[0]*Math.cos(angle)+n[2]*Math.sin(angle),nz=-n[0]*Math.sin(angle)+n[2]*Math.cos(angle);
          const facing=-.34*nx+.3*n[1]+.94*nz;
          depthOpacity=.08+.92*ease((facing+.13)/.5);
        }
        const base=e.kind==='mesh'?.15:e.kind==='roof'?.73:e.kind==='plant'?.65:.9;
        const color=e.kind==='detail'||e.kind==='plant'?mint:lavender;
        const opacity=ease(progress*2)*fade*base*depthOpacity;
        line(a,b,color,opacity,e.kind==='mesh'?.55:e.kind==='trim'?.85:1.08);
        if(isCar&&e.stage==='body'&&t>2.65&&t<4.65){
          const glow=Math.exp(-Math.pow((midpoint[2]-scanZ)/.15,2))*.6*depthOpacity;
          line(a,b,mint,glow,1.55);
        }
        if(progress<.995&&e.kind!=='mesh'&&(!isCar||e.stage==='wheels'&&Math.sin(e.seed*90)>.96)){
          const glow=Math.sin(progress*Math.PI)*fade*.7;
          dot(a,1.25,mint,glow);dot(b,1.25,mint,glow);
        }
      }
      if(isCar&&t>2.6&&t<4.85){
        const strength=ease((t-2.6)/.3)*(1-ease((t-4.48)/.37));
        const a=project(transform([-.96,.02,scanZ],angle,lift)),b=project(transform([.96,.02,scanZ],angle,lift));
        line(a,b,mint,strength*.12,7);line(a,b,mint,strength*.75,1.2);
      }
      if(!isCar&&config.particles&&t>1.3&&t<6.1){
        for(const p of particles){
          const delay=clamp(p.p[1]/subjectHeight)*1.7;
          const pull=ease((t-1.35-delay)/2.3),spread=1-pull;
          const alpha=ease((t-1.3)/.55)*(1-ease((t-3.6-delay)/.9))*(isCar?.45:.68);
          const swirl=spread*spread,phase=p.seed+pull*1.7;
          const v=[p.p[0]+Math.cos(phase)*swirl*.8,p.p[1]-.4*spread+Math.sin(p.seed*2)*swirl*.3,p.p[2]+Math.sin(phase)*swirl*.8];
          dot(project(transform(v,angle,lift)),.6+(Math.sin(p.seed)+1)*.2,mint,alpha);
        }
      }
      // The camera and its three legs remain wireframe throughout the loop.
      for(const e of camera)line(project(e.a),project(e.b),mint,.85,1.05);
      dot(project([-2.91,1.55,.28]),1.4,t<1.26?lavender:mint,.9);
      if(t>=1.26&&t<1.64&&!reduced){
        const k=(t-1.26)/.38,a=project([-2.1,1.46,0]),r=scale()*(.4+1.5*k);
        ctx.globalAlpha=(1-k)*.85;const grad=ctx.createRadialGradient(...a,0,...a,r);grad.addColorStop(0,'#ffffff');grad.addColorStop(.13,'#dbfff2');grad.addColorStop(.4,'#9ddbc955');grad.addColorStop(1,'#9ddbc900');ctx.fillStyle=grad;ctx.fillRect(a[0]-r,a[1]-r,r*2,r*2);
        for(let i=0;i<8;i++){let v=i*Math.PI/4;line([a[0]+Math.cos(v)*8,a[1]+Math.sin(v)*8],[a[0]+Math.cos(v)*r*.8,a[1]+Math.sin(v)*r*.8],'#effff8',(1-k)*.9,1);}
      }
      if(appearance>.8){let orbitT=t*.5,p=project([.96+Math.cos(orbitT)*1.77,-.03,Math.sin(orbitT)*1.24]);dot(p,2.3,mint,fade);}
      ctx.globalAlpha=1;
      const label=t<1.26?'ENCUADRANDO':t<1.64?'FLASH':t<5.8?(isCar?(t<2.65?'TRAZANDO RUEDAS':t<4.5?'REVELANDO CARROCERÍA':'VIDRIOS Y DETALLES'):'MATERIALIZANDO'):t<15.4?'RECORRIDO 360°':'NUEVA CAPTURA';
      if(status.textContent!==label)status.textContent=label;
      canvas.dataset.phase=label;canvas.dataset.time=t.toFixed(2);canvas.dataset.subject=isCar?'gt86':'casa';
    }

  return draw;
};
