const $=s=>document.querySelector(s);const $$=s=>document.querySelectorAll(s);
const body=document.body, header=$('.header'), preloader=$('.site-preloader');
body.classList.add('loading');
window.addEventListener('load',()=>{
  setTimeout(()=>{preloader?.classList.add('is-hidden');body.classList.remove('loading');body.classList.add('site-ready')},1500);
},{once:true});

const menuToggle=$('.menu-toggle'),nav=$('.nav'),searchBtn=$('#searchBtn'),searchModal=$('#searchModal'),closeSearch=$('#closeSearch')||$('.close-search'),toast=$('#toast'),cartCount=$('.cart-count');
menuToggle?.addEventListener('click',()=>nav.classList.toggle('open'));
searchBtn?.addEventListener('click',()=>searchModal?.classList.add('open'));
closeSearch?.addEventListener('click',()=>searchModal?.classList.remove('open'));
searchModal?.addEventListener('click',e=>{if(e.target===searchModal)searchModal.classList.remove('open')});
const showToast=t=>{if(!toast)return;toast.textContent=t;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),2200)};
$$('.heart').forEach(btn=>btn.addEventListener('click',()=>{btn.textContent=btn.textContent==='♡'?'♥':'♡';showToast(btn.textContent==='♥'?'Aggiunto ai preferiti':'Rimosso dai preferiti')}));
$$('.quick').forEach(btn=>btn.addEventListener('click',()=>{cartCount.textContent=Number(cartCount.textContent)+1;showToast('Aggiunto al carrello')}));
$$('.tabs button').forEach(btn=>btn.addEventListener('click',()=>{$('.tabs .active')?.classList.remove('active');btn.classList.add('active')}));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
$$('.reveal-section').forEach(el=>observer.observe(el));

// Stats counter when the block enters the viewport
const stats=$('.stats');let statsDone=false;
const counterObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting||statsDone)return;statsDone=true;$$('.stats strong').forEach(el=>{
  const raw=el.textContent.trim(),target=parseInt(raw,10),suffix=raw.replace(String(target),'');let start=null,duration=1500;
  const tick=now=>{if(!start)start=now;const p=Math.min((now-start)/duration,1);const eased=1-Math.pow(1-p,3);el.textContent=Math.round(target*eased).toLocaleString('it-IT')+suffix;if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);
});counterObserver.disconnect()}),{threshold:.45});if(stats)counterObserver.observe(stats);

// Header state + reading progress
const progress=$('.scroll-progress span');
const onScroll=()=>{const y=window.scrollY;header?.classList.toggle('scrolled',y>35);const max=document.documentElement.scrollHeight-window.innerHeight;progress&&(progress.style.width=(max?Math.min(y/max,1)*100:0)+'%')};onScroll();window.addEventListener('scroll',onScroll,{passive:true});

// Gold cursor glow (desktop only)
if(window.matchMedia('(pointer:fine)').matches){const glow=$('.cursor-glow');window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';body.classList.add('cursor-active')},{passive:true});window.addEventListener('mouseout',e=>{if(!e.relatedTarget)body.classList.remove('cursor-active')})}

// Magnetic buttons
$$('.btn,.quick,.text-link').forEach(el=>{el.classList.add('magnetic');el.addEventListener('pointermove',e=>{if(!window.matchMedia('(pointer:fine)').matches)return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/r.width,y=(e.clientY-r.top-r.height/2)/r.height;el.style.transform=`translate(${x*8}px,${y*6}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')});

$('#newsletter')?.addEventListener('submit',e=>{e.preventDefault();showToast('Grazie per esserti iscritto!')});


// Final cinematic hero slider — four carpet-focused banners
const heroPanels=[...document.querySelectorAll('.hero-panel')],heroBgs=[...document.querySelectorAll('.hero-bg-slide')],heroDots=[...document.querySelectorAll('.hero-dots button')],slideCurrent=document.querySelector('.hero-slide b'),prevHero=document.querySelector('.hero-prev'),nextHero=document.querySelector('.hero-next'),heroSlider=document.querySelector('.hero-slider');let heroIndex=0,heroTimer;function setHeroSlide(next){if(!heroPanels.length)return;heroIndex=(next+heroPanels.length)%heroPanels.length;heroPanels.forEach((el,i)=>el.classList.toggle('is-active',i===heroIndex));heroBgs.forEach((el,i)=>el.classList.toggle('is-active',i===heroIndex));heroDots.forEach((el,i)=>el.classList.toggle('is-active',i===heroIndex));if(slideCurrent)slideCurrent.textContent=String(heroIndex+1).padStart(2,'0')}function restartHeroTimer(){clearInterval(heroTimer);if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)heroTimer=setInterval(()=>setHeroSlide(heroIndex+1),6000)}heroDots.forEach((dot,i)=>dot.addEventListener('click',()=>{setHeroSlide(i);restartHeroTimer()}));prevHero?.addEventListener('click',()=>{setHeroSlide(heroIndex-1);restartHeroTimer()});nextHero?.addEventListener('click',()=>{setHeroSlide(heroIndex+1);restartHeroTimer()});heroSlider?.addEventListener('mouseenter',()=>clearInterval(heroTimer));heroSlider?.addEventListener('mouseleave',restartHeroTimer);setHeroSlide(0);restartHeroTimer();
