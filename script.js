'use strict';
document.documentElement.classList.add('js');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero');
const car = document.querySelector('.car-stage');
const track = document.querySelector('.hero-track');
const heroWord = document.querySelector('.hero-word');
const heroCopy = document.querySelector('.hero-copy');
const halo = document.querySelector('.hero-halo');
const progressBar = document.querySelector('.hero-progress i');
const bridge = document.querySelector('.theme-bridge');
const galleryImages = [...document.querySelectorAll('.work-image img')];
const lightButton = document.querySelector('#lights-button');
let lightsOn = false;
let ignitionTimer;
function setLights(on, flash = false) {
  clearTimeout(ignitionTimer);
  lightsOn = on;
  hero.classList.toggle('lights-on', on);
  hero.classList.toggle('flash', on && flash && !reducedMotion.matches);
  lightButton.setAttribute('aria-pressed', String(on));
  lightButton.setAttribute('aria-label', on ? 'Вимкнути фари' : 'Увімкнути фари');
  lightButton.querySelector('span').textContent = on ? 'Вимкнути світло' : 'Увімкнути світло';
  if (flash) ignitionTimer = setTimeout(() => hero.classList.remove('flash'), 1800);
}
lightButton.addEventListener('click', () => setLights(!lightsOn, !lightsOn));
const heroImage = document.querySelector('#hero-car');
function ignite() { if (!reducedMotion.matches) setLights(true, true); }
if (heroImage.complete) ignite(); else heroImage.addEventListener('load', ignite, {once:true});
let scheduled = false;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
function paintScroll() {
  scheduled = false;
  if (reducedMotion.matches) return;
  const rect = track.getBoundingClientRect();
  const p = clamp(-rect.top / Math.max(1, rect.height - innerHeight), 0, 1);
  car.style.transform = `translate3d(0,${-p * 65}px,0) scale(${1 + p * .13})`;
  heroWord.style.transform = `translate3d(0,${-p * 110}px,0)`;
  halo.style.transform = `translate3d(0,${-p * 25}px,0)`;
  heroCopy.style.transform = `translate3d(0,${-p * 45}px,0)`;
  heroCopy.style.opacity = String(1 - p * .4);
  progressBar.style.transform = `scaleX(${p})`;
  const b = bridge.getBoundingClientRect();
  const bp = clamp((innerHeight - b.top) / (innerHeight + b.height), 0, 1);
  bridge.querySelector('span').style.transform = `translate3d(0,${(bp - .5) * -60}px,0)`;
  bridge.style.background = `linear-gradient(180deg,#0a0a0b 0%,#3c3b3a ${25 + bp * 10}%,#a7a5a1 ${60 + bp * 10}%,#f7f6f3 100%)`;
  for (const img of galleryImages) {
    const r = img.parentElement.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) {
      const ip = clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
      img.style.transform = `translate3d(0,${-ip * r.height * .085}px,0)`;
    }
  }
}
function scheduleScroll() { if (!scheduled) { scheduled = true; requestAnimationFrame(paintScroll); } }
addEventListener('scroll', scheduleScroll, {passive:true});
addEventListener('resize', scheduleScroll);
reducedMotion.addEventListener('change', () => {
  [car,heroWord,halo,heroCopy,progressBar,...galleryImages,bridge.querySelector('span')].forEach(el => el.style.removeProperty('transform'));
  heroCopy.style.removeProperty('opacity'); hero.classList.remove('flash'); scheduleScroll();
});
paintScroll();
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
function closeMenu() { mobileMenu.hidden = true; menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Відкрити меню'); }
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded',String(expanded));
  menuButton.setAttribute('aria-label',expanded ? 'Закрити меню' : 'Відкрити меню');
  mobileMenu.hidden = !expanded;
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
addEventListener('keydown', e => {if(e.key === 'Escape' && !mobileMenu.hidden) {closeMenu();menuButton.focus();}});
matchMedia('(min-width:801px)').addEventListener('change', e => {if(e.matches)closeMenu();});
const asset = path => path.replace(/^assets\//, '');
const bmwStates = {
  before: {src:'bmw-before.png',alt:'Біла BMW з розібраною передньою частиною до складання',label:'До'},
  after: {src:'bmw-after.png',alt:'Біла BMW після складання передньої частини',label:'Після'}
};
document.querySelectorAll('[data-bmw]').forEach(button => button.addEventListener('click', () => {
  const state = bmwStates[button.dataset.bmw];
  const image = document.querySelector('#bmw-photo');
  image.src=state.src;image.alt=state.alt;
  document.querySelector('#bmw-state').textContent=state.label;
  document.querySelectorAll('[data-bmw]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
}));
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;});
  scheduleScroll();
}));
const priceData={wing:[1500,4000],door:[2000,6000],bumper:[600,1200],paint:[3500,4500]};
const formatPrice=n=>new Intl.NumberFormat('uk-UA').format(n);
document.querySelector('#estimate').addEventListener('change',()=>{
  const choices=[...document.querySelectorAll('input[name="job"]:checked')];
  const sums=choices.reduce((total,input)=>[total[0]+priceData[input.value][0],total[1]+priceData[input.value][1]],[0,0]);
  document.querySelector('#estimate-total').textContent=choices.length ? `${formatPrice(sums[0])}–${formatPrice(sums[1])} ₴` : 'Оберіть роботи';
});
document.querySelector('#estimate').addEventListener('submit',e=>e.preventDefault());
const cases = {
 nissan:{title:'Nissan',description:'Nissan біля майстерні.',images:[['nissan.png','Фото']]},
 'mercedes-suv':{title:'Mercedes-Benz SUV',description:'Кросовер Mercedes-Benz біля майстерні.',images:[['mercedes-suv.png','Фото']]},
 bmw:{title:'BMW / До та після',description:'Передня частина BMW до та після складання. [ПОТРІБНО УТОЧНИТИ У ЗАМОВНИК: перелік виконаних робіт і строк ремонту.]',images:[['bmw-before.png','До'],['bmw-after.png','Після']]},
 porsche:{title:'Porsche Panamera',description:'Porsche Panamera у майстерні. [ПОТРІБНО УТОЧНИТИ У ЗАМОВНИК: які роботи виконала Prime Line.]',images:[['porsche-workshop.png','У майстерні'],['porsche-side.png','Вигляд збоку'],['porsche-front.png','У майстерні']]},
 volvo:{title:'Volvo XC60',description:'Volvo XC60. [ПОТРІБНО УТОЧНИТИ У ЗАМОВНИК: які деталі ремонтували або фарбували в Prime Line.]',images:[['volvo.png','Фото']]},
 mercedes:{title:'Mercedes-Benz',description:'Mercedes-Benz у майстерні. [ПОТРІБНО УТОЧНИТИ У ЗАМОВНИК: модель і перелік робіт Prime Line.]',images:[['mercedes.png','Фото']]}
};
const dialog=document.querySelector('#case-dialog');
const curtain=document.querySelector('.curtain');
let lastOpener;
let transitionBusy=false;
function transition(action){
 if(transitionBusy)return;
 if(reducedMotion.matches){action();return;}
 transitionBusy=true;curtain.classList.add('play');
 setTimeout(action,300);
 setTimeout(()=>{curtain.classList.remove('play');transitionBusy=false;},650);
}
function selectCaseImage(item,index){
 const selected=item.images[index];
 const image=document.querySelector('#case-image');
 image.src=''+selected[0];image.alt=item.title+' / '+selected[1];
 document.querySelectorAll('#case-thumbs button').forEach((b,i)=>b.setAttribute('aria-pressed',String(index===i)));
}
function openCase(id,opener){
 const item=cases[id];lastOpener=opener;
 document.querySelector('#case-title').textContent=item.title;
 document.querySelector('#case-description').textContent=item.description;
 const thumbs=document.querySelector('#case-thumbs');thumbs.replaceChildren();
 item.images.forEach((entry,index)=>{const button=document.createElement('button');button.type='button';button.textContent=entry[1];button.addEventListener('click',()=>selectCaseImage(item,index));thumbs.append(button);});
 selectCaseImage(item,id==='bmw'?1:0);
 dialog.showModal();document.body.classList.add('modal-open');document.querySelector('#close-case').focus();
}
document.querySelectorAll('[data-case]').forEach(opener=>opener.addEventListener('click',e=>{e.preventDefault();transition(()=>openCase(opener.dataset.case,opener));}));
document.querySelector('#close-case').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastOpener?.focus({preventScroll:true});});
document.querySelector('#case-contact').addEventListener('click',()=>{dialog.close();setTimeout(()=>document.querySelector('#contact').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'}),0);});
document.querySelector('#year').textContent=new Date().getFullYear();

