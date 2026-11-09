(()=>{
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 // Scroll progress
 const progress=document.createElement('div');progress.className='scroll-progress';document.body.append(progress);
 const updateProgress=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%'};
 addEventListener('scroll',updateProgress,{passive:true});updateProgress();
 // Reveal content as it enters the viewport.
 const revealTargets=$$('.section,.booking-strip,.contact,.footer,.package-card,.stay-card,.thing,.reach-grid article,.review-card,.faq-list details');
 revealTargets.forEach((el,i)=>{if(!el.classList.contains('reveal'))el.classList.add('reveal');el.style.transitionDelay=(Math.min(i%4,3)*75)+'ms'});
 if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -35px 0px'});revealTargets.forEach(el=>io.observe(el))}else revealTargets.forEach(el=>el.classList.add('is-visible'));
 // Button touch ripples, including touchscreens.
 document.addEventListener('pointerdown',e=>{const target=e.target.closest('.button,.nav-book,.stay-actions button,.float-actions a');if(!target)return;const rect=target.getBoundingClientRect(),size=Math.max(rect.width,rect.height)*.55;const ripple=document.createElement('span');ripple.className='ripple';ripple.style.width=ripple.style.height=size+'px';ripple.style.left=(e.clientX-rect.left-size/2)+'px';ripple.style.top=(e.clientY-rect.top-size/2)+'px';target.append(ripple);setTimeout(()=>ripple.remove(),700)});
 // Active section indicator in the navigation.
 const links=$$('.nav a[href^="#"]');const sections=links.map(a=>$(a.getAttribute('href'))).filter(Boolean);
 if('IntersectionObserver' in window){const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id))}}),{rootMargin:'-35% 0px -55% 0px'});sections.forEach(s=>navObserver.observe(s))}
 // Close mobile menu with Escape and keep its accessibility state in sync.
 const menu=$('.menu'),nav=$('.nav');if(menu&&nav){menu.setAttribute('aria-expanded','false');menu.addEventListener('click',()=>menu.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false'));nav.addEventListener('click',e=>{if(e.target.closest('a'))menu.setAttribute('aria-expanded','false')});addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}})}
 // Prevent invalid date ranges and provide clear checkout minimums.
 const checkin=$('#checkin'),checkout=$('#checkout');if(checkin&&checkout){checkin.addEventListener('change',()=>{checkout.min=checkin.value;if(checkout.value&&checkout.value<=checkin.value)checkout.value=''})}
 // Small image fallback for unavailable remote photography.
 $$('img').forEach(img=>{img.addEventListener('error',()=>{if(img.dataset.fallback)return;img.dataset.fallback='1';img.style.background='linear-gradient(135deg,#4c1022,#b08a45)';img.style.minHeight='120px';img.alt=img.alt||'DandeliTourDestination Dandeli'});});
})();
