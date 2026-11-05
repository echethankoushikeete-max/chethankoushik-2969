'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

const gifs = [
'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif','https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif','https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif','https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif','https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif','https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif','https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif','https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif','https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif','https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif','https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif','https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif','https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif','https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif','https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif','https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif','https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif','https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif','https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif','https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif','https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif'];
const projects = [
 {name:'Nextlevel Studio',kind:'Client',imgs:['https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85']},
 {name:'Aura Brand Identity',kind:'Personal',imgs:['https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85']},
 {name:'Solaris Digital',kind:'Client',imgs:['https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85','https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85']}
];
const services = [
 ['01','3D Modeling','Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.'],
 ['02','Rendering','High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.'],
 ['03','Motion Design','Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.'],
 ['04','Branding','Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence.'],
 ['05','Web Design','Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.']
];

export default function Home() {
 const router = useRouter();
 const marqueeRef = useRef<HTMLElement>(null);
 const aboutText = 'With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let\'s build something incredible together!';
 useEffect(() => {
  const onScroll = () => {
   if (marqueeRef.current) {
    const top = marqueeRef.current.getBoundingClientRect().top;
    const offset = (window.innerHeight - top) * .3;
    marqueeRef.current.style.setProperty('--marquee-offset', `${offset}px`);
   }
   const about = document.querySelector<HTMLElement>('.about-copy');
   if (about) {
    const rect = about.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (window.innerHeight * .8 - rect.top) / (rect.height + window.innerHeight * .6)));
    const chars = about.querySelectorAll<HTMLElement>('span');
    chars.forEach((ch, i) => { const p = i / Math.max(1, chars.length - 1); ch.style.opacity = String(.2 + .8 * Math.max(0, Math.min(1, (progress - p * .82) * 7))); });
   }
   document.querySelectorAll<HTMLElement>('.project-card').forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (window.innerHeight * .72 - rect.top) / (window.innerHeight * .72)));
    const target = 1 - (projects.length - 1 - index) * .03;
    card.style.setProperty('--stack-scale', String(1 - (1 - target) * progress));
   });
   document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(el => {
    if (el.dataset.bound) return;
    el.dataset.bound = '1';
    el.addEventListener('pointermove', ev => { const e=ev as PointerEvent; const r=el.getBoundingClientRect(); const dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2; if(Math.abs(dx)<r.width/2+35&&Math.abs(dy)<r.height/2+35){el.style.setProperty('--magnet-x',`${dx*.14}px`);el.style.setProperty('--magnet-y',`${dy*.14}px`);} });
    el.addEventListener('pointerleave',()=>{el.style.setProperty('--magnet-x','0px');el.style.setProperty('--magnet-y','0px');});
   });
  };
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  const obs = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view');}),{threshold:.12});
  document.querySelectorAll('.fade-up,.service-row,.project-card,.about-copy').forEach(el=>obs.observe(el));
  return ()=>{window.removeEventListener('scroll',onScroll);obs.disconnect();};
 },[]);
 const enter = () => router.push('/workspace');
 return <>
  <Script src="/portrait-engine.js" strategy="afterInteractive" />
  <main className="mina-site">
   <section className="mina-hero" id="home">
    <nav className="mina-nav"><div className="mina-nav-links"><a href="#about" data-magnetic>About</a><a href="#services" data-magnetic>Price</a><a href="#projects" data-magnetic>Projects</a><a href="#contact" data-magnetic>Contact</a></div><button className="mina-enter-button" data-magnetic onClick={enter}>ENTER LIFEOS <span aria-hidden="true">↗</span></button></nav>
    <div className="hero-title-clip"><h1 className="hero-heading">Hi, i&apos;m LIFEOS</h1></div>
    <div className="hero-bottom-copy"><p>your intelligent operating system for everyday life, learning and decisions</p><a className="contact-btn" data-magnetic href="#contact">Contact Me</a></div>
    <div className="hero-portrait-wrap" id="magnetWrap">
     <div className="hero-portrait-inner" id="magnetInner">
      <img id="faceFallback" src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261031_040619_2f6f349e-a4a7-40db-8e9b-03b6acd8b99a.png&w=1024&q=92" alt="LIFEOS living portrait" />
      <canvas id="faceGl" aria-hidden="true" />
      <div id="faceProps" aria-hidden="true">
       <svg id="faceFly" viewBox="0 0 32 32"><path className="wing" d="M15 15C12 9.5 4.5 8.5 2 13c2.5 4.5 10 4.5 13 2z"/><path className="wing r" d="M17 15c3-5.5 10.5-6.5 13-2-2.5 4.5-10 4.5-13 2z"/><ellipse cx="16" cy="19.5" rx="4" ry="6.5"/><circle cx="16" cy="11.5" r="3.3"/></svg>
       <svg id="faceHand" viewBox="0 0 32 32"><path className="open" d="M10.5 16.5V8.2a1.8 1.8 0 0 1 3.6 0V14v-8a1.8 1.8 0 0 1 3.6 0V14 7a1.8 1.8 0 0 1 3.6 0v8-5a1.8 1.8 0 0 1 3.6 0v10.5c0 5-3.4 8.5-8.4 8.5-3.6 0-5.7-1.6-7.6-4.6l-3.5-5.6c-.6-1 .1-2.2 1.2-2.4 1-.2 1.9.2 2.6 1z"/><path className="grab" d="M10.5 17v-3.3a1.8 1.8 0 0 1 3.6 0V14v-1.8a1.8 1.8 0 0 1 3.6 0V14v-1.3a1.8 1.8 0 0 1 3.6 0V14v-.3a1.8 1.8 0 0 1 3.6 0v6.8c0 5-3.4 8.5-8.4 8.5-3.6 0-5.7-1.6-7.6-4.6l-2.3-3.7c-.6-1 .1-2.2 1.2-2.4 1-.2 1.9.2 2.7 1z"/></svg>
      </div>
     </div>
    </div>
   </section>
   <section className="marquee-section" ref={marqueeRef}>
    <div className="marquee-row row-right">{[...gifs.slice(0,11),...gifs.slice(0,11),...gifs.slice(0,11)].map((src,i)=><img key={i} src={src} loading="lazy" alt="3D creative project preview" />)}</div>
    <div className="marquee-row row-left">{[...gifs.slice(11),...gifs.slice(11),...gifs.slice(11)].map((src,i)=><img key={i} src={src} loading="lazy" alt="Digital design project preview" />)}</div>
   </section>
   <section className="mina-about" id="about">
    <img className="about-decor moon" src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" alt="" />
    <img className="about-decor object-left" src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" alt="" />
    <img className="about-decor lego" src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" alt="" />
    <img className="about-decor object-right" src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" alt="" />
    <div className="about-center"><h2 className="hero-heading fade-up">About me</h2><p className="about-copy">{aboutText.split('').map((ch,i)=><span key={i} style={{opacity:.2}}>{ch}</span>)}</p><a className="contact-btn" data-magnetic href="#contact">Contact Me</a></div>
   </section>
   <section className="mina-services" id="services"><h2>Services</h2><div className="services-list">{services.map(([n,name,desc],i)=><article className="service-row" data-magnetic key={n} style={{transitionDelay:`${i*.1}s`}}><span className="service-number">{n}</span><div><h3>{name}</h3><p>{desc}</p></div></article>)}</div></section>
   <section className="mina-projects" id="projects"><h2 className="hero-heading">Project</h2><div className="project-stack">{projects.map((p,i)=><article className="project-card" data-magnetic key={p.name} style={{top:`${96+i*28}px`,zIndex:i+1}}><div className="project-top"><span className="project-number">0{i+1}</span><div className="project-heading"><span>{p.kind}</span><h3>{p.name}</h3></div><a className="live-project" data-magnetic href="#contact">Live Project</a></div><div className="project-images"><div><img src={p.imgs[0]} alt={`${p.name} preview one`} loading="lazy"/><img src={p.imgs[1]} alt={`${p.name} preview two`} loading="lazy"/></div><img className="project-tall" src={p.imgs[2]} alt={`${p.name} main preview`} loading="lazy"/></div></article>)}</div></section>
   <footer className="mina-footer" id="contact"><span>LIFEOS — YOUR INTELLIGENT OPERATING SYSTEM</span><a href="#contact">LET&apos;S CREATE ↗</a><button onClick={enter}>ENTER LIFEOS ↗</button></footer>
  </main>
 </>;
}
