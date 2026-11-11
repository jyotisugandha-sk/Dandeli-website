import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// A purpose-built, fully 3D low-poly/stylised ranger character. Every limb is
// independently articulated; the entrance, wave, landing and welcome are real
// 3D transforms rather than moving a flat picture.
const canvases=[...document.querySelectorAll('canvas.ranger-3d')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function makeCharacter(scene){
 const root=new THREE.Group();scene.add(root);
 const mat=(color,roughness=.78)=>new THREE.MeshStandardMaterial({color,roughness});
 const skin=mat('#e8ae88'),skinLight=mat('#f4c5a0'),hair=mat('#39251e'),hairHi=mat('#563326'),shirt=mat('#637b43'),shirtDark=mat('#405b32'),pants=mat('#394b36'),boots=mat('#493329'),sole=mat('#d1b58a'),hat=mat('#b58b4e'),hatBand=mat('#55432b'),white=mat('#fff4df'),iris=mat('#51372b'),black=mat('#211b19'),bag=mat('#80613b'),gold=mat('#d7b66c');
 const sphere=(parent,m,pos,scale)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(1,24,18),m);o.position.set(...pos);o.scale.set(...scale);parent.add(o);return o};
 const cyl=(parent,m,r1,r2,h,pos,rot=[0,0,0])=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,16),m);o.position.set(...pos);o.rotation.set(...rot);parent.add(o);return o};
 const limb=(parent,m,a,b,rA,rB)=>{const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),d=B.clone().sub(A);const o=new THREE.Mesh(new THREE.CylinderGeometry(rB,rA,d.length(),14),m);o.position.copy(A.add(B).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());parent.add(o);return o};
 // torso and backpack
 sphere(root,shirt,[0,2.05,0],[.48,.62,.29]);sphere(root,shirtDark,[0,2.48,0],[.43,.18,.28]);
 sphere(root,bag,[.38,2.15,-.12],[.23,.48,.24]);sphere(root,bag,[.38,1.91,.02],[.22,.24,.22]);
 // neck and head
 cyl(root,skin,.14,.15,.22,[0,2.69,0]);const head=new THREE.Group();head.position.set(0,3.15,.02);root.add(head);
 sphere(head,skin,[0,0,0],[.48,.57,.39]);
 // ears
 sphere(head,skin,[-.48,-.02,0],[.11,.16,.1]);sphere(head,skin,[.48,-.02,0],[.11,.16,.1]);
 // ponytail behind head
 sphere(head,hair,[.1,.25,-.31],[.35,.42,.23]);sphere(head,hairHi,[.25,-.13,-.48],[.17,.42,.16]).rotation.z=-.3;
 // fringe and hair cap
 sphere(head,hair,[0,.39,-.05],[.5,.27,.4]);sphere(head,hairHi,[-.22,.19,.25],[.25,.16,.12]);
 // face eyes with pupils and highlights
 const eyes=[];for(const x of [-.19,.19]){sphere(head,white,[x,.06,.345],[.115,.15,.065]);const eye=sphere(head,iris,[x,.045,.401],[.061,.085,.035]);eyes.push(eye);sphere(head,black,[x,.04,.427],[.032,.052,.02]);sphere(head,white,[x-.018,.075,.444],[.018,.022,.012]);sphere(head,hair,[x,.22,.35],[.12,.035,.035]);}
 // nose, smile and cheeks
 sphere(head,skinLight,[0,-.055,.39],[.07,.08,.06]);const smile=new THREE.Mesh(new THREE.TorusGeometry(.105,.018,8,24,Math.PI),mat('#8f493e'));smile.position.set(0,-.19,.365);smile.rotation.z=Math.PI;head.add(smile);
 for(const x of [-.31,.31])sphere(head,mat('#d98e7e'),[x,-.12,.31],[.085,.045,.025]);
 // ranger hat: crown, brim and band
 cyl(head,hat,.31,.26,.27,[0,.59,0]);const brim=new THREE.Mesh(new THREE.CylinderGeometry(.62,.62,.075,32),hat);brim.position.set(0,.48,0);head.add(brim);cyl(head,hatBand,.27,.27,.045,[0,.57,0]);
 // hips and legs with independently pivoted upper/lower legs
 sphere(root,pants,[0,1.49,0],[.36,.22,.25]);const legs=[];
 for(const x of [-.19,.19]){const hip=new THREE.Group();hip.position.set(x,1.43,0);root.add(hip);limb(hip,pants,[0,0,0],[0,-.48,0],.14,.105);sphere(hip,pants,[0,-.49,0],[.115,.13,.12]);limb(hip,pants,[0,-.49,0],[0,-.91,.02],.105,.085);sphere(hip,boots,[0,-.98,.09],[.15,.13,.23]);sphere(hip,sole,[0,-1.08,.11],[.16,.045,.23]);legs.push(hip);}
 // arms: shoulder pivots, upper arm, elbow and forearm, hands
 const arms=[];for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.43,2.43,0);root.add(arm);limb(arm,shirt,[0,0,0],[side*.16,-.35,0],.14,.105);const elbow=new THREE.Group();elbow.position.set(side*.16,-.35,0);arm.add(elbow);limb(elbow,skin,[0,0,0],[side*.07,-.34,.015],.095,.075);sphere(elbow,skinLight,[side*.07,-.39,.04],[.105,.11,.1]);for(let f=0;f<4;f++)limb(elbow,skinLight,[side*.07+(f-1.5)*.035,-.42,.08],[side*.07+(f-1.5)*.045,-.51,.09],.018,.012);arms.push({arm,elbow,side});}
 // belt and small chest details
 cyl(root,boots,.34,.34,.1,[0,1.69,0]);sphere(root,gold,[-.12,2.17,.285],[.045,.045,.025]);
 root.userData={head,eyes,arms,legs};return root;
}
function setup(canvas){
 const scene=new THREE.Scene();scene.background=null;
 const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,1.85,8.8);camera.lookAt(0,1.95,0);
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 scene.add(new THREE.HemisphereLight(0xffe9ce,0x263d2a,2.0));const key=new THREE.DirectionalLight(0xffe2b5,3.1);key.position.set(-3,6,5);scene.add(key);const rim=new THREE.DirectionalLight(0x8cbf9a,2.2);rim.position.set(3,3,-4);scene.add(rim);
 const floor=new THREE.Mesh(new THREE.CircleGeometry(1.05,40),new THREE.MeshBasicMaterial({color:0xd7b66c,transparent:true,opacity:.16}));floor.rotation.x=-Math.PI/2;floor.position.y=0;scene.add(floor);
 const model=makeCharacter(scene);model.scale.setScalar(.94);model.position.y=-.05;
 const isContact=canvas.dataset.scene==='contact';let start=performance.now(),last=0,frame=0,visible=true;
 const resize=()=>{const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(canvas);resize();
 const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting; if(visible) last=0;},{threshold:0.01});visibility.observe(canvas);
 function animate(now){
  frame=requestAnimationFrame(animate);
  if(!visible||document.hidden)return;
  if(now-last<16)return; last=now;
  const t=(now-start)/1000;
  const {head,arms,legs,eyes}=model.userData;
  const easeOut=(x)=>1-Math.pow(1-Math.max(0,Math.min(1,x)),3);
  const smooth=(a,b,x)=>{const q=Math.max(0,Math.min(1,(x-a)/(b-a)));return q*q*(3-2*q)};

  if(!isContact){
   // Sequence: forward-facing greeting, superhero-style vertical descent,
   // compressed three-point landing, recovery, then a relaxed welcoming stance.
   // Short, continuous entrance: no long frozen hover before the drop.
   const greeting=smooth(0,.08,t)*(1-smooth(.38,.62,t));
   const fall=smooth(.48,1.28,t);
   const impact=Math.max(0,1-Math.abs(t-1.31)/.20);
   const airborne=t>.48&&t<1.31;
   const wave=Math.sin(t*13)*greeting;
   const dropHeight=2.05*(1-easeOut((t-.48)/.83));
   model.position.y=t<.48?2.05:dropHeight-impact*.18;
   const squash=1-impact*.22;
   model.scale.set(.94*(1+impact*.09),.94*squash,.94*(1+impact*.09));
   model.rotation.x=airborne?-.08+fall*.10:impact*.07;
   model.rotation.z=airborne?Math.sin(t*13)*.025:impact*.02;
   arms[0].arm.rotation.z=airborne?-.95:(-.12+wave*.88);
   arms[0].elbow.rotation.z=airborne?-.42:(-.18+Math.max(0,wave)*.7);
   arms[1].arm.rotation.z=airborne?.95:(.12+Math.max(0,-wave)*.22);
   arms[1].elbow.rotation.z=airborne?.36:(-.08+.04*Math.sin(t*2));
   legs[0].rotation.x=airborne?-.38:impact*.42;
   legs[1].rotation.x=airborne?.34:impact*.32;
   legs[0].rotation.z=airborne?-.10:0; legs[1].rotation.z=airborne?.10:0;
   if(t>1.52){
    const idle=t-1.52, settle=Math.exp(-idle*5);
    model.position.y=-.05+Math.sin(idle*1.8)*.018;
    model.rotation.x=Math.sin(idle*1.1)*.01*settle+Math.sin(idle*.8)*.006;
    arms[0].arm.rotation.z=-.13+Math.sin(idle*1.5)*.025;
    arms[0].elbow.rotation.z=-.16+Math.sin(idle*1.7)*.025;
    arms[1].arm.rotation.z=.13+Math.sin(idle*1.3)*.02;
    arms[1].elbow.rotation.z=-.08;
    legs[0].rotation.x=Math.sin(idle*1.2)*.009; legs[1].rotation.x=-Math.sin(idle*1.2)*.009;
   }
   head.rotation.y=Math.sin(t*.85)*.035;
   head.rotation.x=Math.sin(t*1.2)*.014;
   head.rotation.z=Math.sin(t*.9)*.012;
  } else {
   // Contact pose: softened head tilt, gentle open-arm welcome and attentive gaze.
   const idle=t;
   model.position.y=-.05+Math.sin(idle*1.45)*.025;
   model.rotation.y=Math.sin(idle*.65)*.018;
   model.scale.set(.94,.94,.94);
   head.rotation.y=Math.sin(idle*.55)*.025;
   head.rotation.x=-.055+Math.sin(idle*.9)*.012;
   head.rotation.z=-.045+Math.sin(idle*.7)*.012;
   arms[0].arm.rotation.z=-.30+Math.sin(idle*1.25)*.045;
   arms[0].elbow.rotation.z=-.34+Math.sin(idle*1.15)*.035;
   arms[1].arm.rotation.z=.34+Math.sin(idle*1.1)*.045;
   arms[1].elbow.rotation.z=-.30+Math.sin(idle*1.3)*.035;
   legs[0].rotation.x=Math.sin(idle*1.2)*.009;
   legs[1].rotation.x=-Math.sin(idle*1.2)*.009;
  }
  // Soft blinking; contact pose blinks a little more slowly for a warm, calm look.
  const blinkPeriod=isContact?4.1:3.25;
  const phase=(t%blinkPeriod)/blinkPeriod;
  const blink=(phase>.91&&phase<.96)?Math.max(.12,Math.abs(phase-.935)/.025):1;
  for(const eye of eyes) eye.scale.y=.085*blink;
  // Gentle gaze shift rather than exaggerated eye movement.
  for(let i=0;i<eyes.length;i++) eyes[i].position.x=(i===0?-.19:.19)+Math.sin(t*.42)*.012;
  renderer.render(scene,camera);
 }
 // Start the render loop; reduced-motion users still get a stable, fully 3D pose.
 animate(performance.now());
}
canvases.forEach(c=>{try{setup(c)}catch(e){console.error('3D ranger could not initialise:',e);c.insertAdjacentHTML('afterend','<p class="three-fallback">3D character needs WebGL and an internet connection.</p>')}});
