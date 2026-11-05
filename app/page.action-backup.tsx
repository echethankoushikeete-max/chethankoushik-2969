'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;

    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));

      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    /* Cursor movement */
    const handlePointer = (event: PointerEvent) => {
      const x = event.clientX;
      const y = event.clientY;

      document.documentElement.style.setProperty(
        '--mouse-x',
        `${x}px`
      );

      document.documentElement.style.setProperty(
        '--mouse-y',
        `${y}px`
      );

      const buttons = document.querySelectorAll<HTMLElement>(
        '[data-magnetic]'
      );

      buttons.forEach((button) => {
        const rect = button.getBoundingClientRect();

        const dx =
          x - (rect.left + rect.width / 2);

        const dy =
          y - (rect.top + rect.height / 2);

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 140) {
          const strength = 0.16;

          button.style.transform =
            `translate(${dx * strength}px, ${dy * strength}px)`;
        } else {
          button.style.transform = 'translate(0, 0)';
        }
      });
    };

    window.addEventListener('pointermove', handlePointer);

    /* Scroll / conscroll style effect */
    const handleScroll = () => {
      const scrollY = window.scrollY;

      hero.style.setProperty(
        '--scroll-y',
        `${scrollY}px`
      );

      const title = document.querySelector<HTMLElement>(
        '.hero-title'
      );

      const portrait = document.querySelector<HTMLElement>(
        '.portrait-stage'
      );

      if (title) {
        const amount = Math.min(scrollY * 0.18, 120);

        title.style.transform =
          `translate3d(0, ${amount}px, 0)`;
      }

      if (portrait) {
        const amount = Math.min(scrollY * -0.08, 80);

        portrait.style.transform =
          `translate3d(0, ${amount}px, 0) scale(${Math.max(
            0.9,
            1 - scrollY * 0.00015
          )})`;
      }
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    /* Reveal animations */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    document
      .querySelectorAll('.reveal')
      .forEach((element) => observer.observe(element));

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener(
        'pointermove',
        handlePointer
      );
      window.removeEventListener(
        'scroll',
        handleScroll
      );
      observer.disconnect();
    };
  }, []);

  const enterLifeOS = () => {
    router.push('/workspace');
  };

  return (
    <>
      <Script
        src="/portrait-engine.js"
        strategy="afterInteractive"
      />

      <main className="lifeos-page">
        {/* =====================================================
            HERO
        ====================================================== */}

        <section
          ref={heroRef}
          className="hero"
          id="top"
        >
          <div className="grain" />

          <div className="cursor-glow" />

          <nav className="nav">
            <div className="brand">
              <span className="brand-dot" />
              LIFEOS
            </div>

            <div className="nav-right">
              <span>AI LIFE SYSTEM</span>

              <button
                data-magnetic
                className="nav-enter"
                onClick={enterLifeOS}
              >
                ENTER LIFEOS ↗
              </button>
            </div>
          </nav>

          <div className="hero-grid">

            {/* LEFT */}
            <div className="hero-copy">

              <p className="eyebrow reveal">
                YOUR LIFE. INTELLIGENTLY ORGANIZED.
              </p>

              <h1 className="hero-title">
                <span>I AM</span>
                <span className="outline">
                  LIFEOS
                </span>
              </h1>

              <p className="hero-description reveal">
                An intelligent operating system for
                your everyday life, studies,
                decisions and next steps.
              </p>

              <div className="hero-actions reveal">

                <button
                  data-magnetic
                  className="primary-button"
                  onClick={enterLifeOS}
                >
                  <span>ENTER LIFEOS</span>
                  <span className="arrow">↗</span>
                </button>

                <a
                  data-magnetic
                  className="secondary-button"
                  href="#system"
                >
                  EXPLORE SYSTEM
                  <span>↓</span>
                </a>

              </div>

            </div>

            {/* RIGHT / GIRL */}
            <div className="portrait-stage">

              <div className="portrait-orbit orbit-one" />
              <div className="portrait-orbit orbit-two" />

              <div
                id="magnetWrap"
                className="portrait-wrap"
              >

                {/* Required by portrait-engine.js */}
                <img
                  id="faceFallback"
                  className="portrait-fallback"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=90"
                  alt="LIFEOS AI portrait"
                />

                {/* Required canvas */}
                <canvas
                  ref={canvasRef}
                  id="faceGL"
                  className="portrait-canvas"
                />

                <div
                  id="faceFly"
                  className="face-fly"
                />

                <div
                  id="faceHand"
                  className="face-hand"
                />

                <div
                  id="faceProps"
                  className="face-props"
                />

                <div className="portrait-scan" />

                <div className="portrait-label">
                  <span className="live-dot" />
                  LIFEOS CORE / ONLINE
                </div>

              </div>

            </div>
          </div>

          <div className="hero-bottom">
            <span>SCROLL TO DISCOVER</span>
            <span className="scroll-line" />
            <span>01 — 05</span>
          </div>

        </section>

        {/* =====================================================
            INTRO
        ====================================================== */}

        <section
          id="system"
          className="system-section"
        >

          <div className="section-number">
            01
          </div>

          <div className="system-content reveal">

            <p className="section-label">
              ONE SYSTEM. TWO WORLDS.
            </p>

            <h2>
              LIFE
              <br />
              <span>MEETS</span>
              <br />
              INTELLIGENCE.
            </h2>

            <p className="section-text">
              LIFEOS transforms information into
              clear actions, deadlines, answers and
              next steps — whether you are managing
              everyday life or solving a difficult
              academic problem.
            </p>

          </div>

        </section>

        {/* =====================================================
            TWO MODES
        ====================================================== */}

        <section className="modes-section">

          <div className="mode-card life-card reveal">

            <div className="mode-top">
              <span>01</span>
              <span>🌐 LIFE MODE</span>
            </div>

            <h3>
              TURN
              <br />
              LIFE INTO
              <br />
              ACTION.
            </h3>

            <p>
              Deadlines, plans, information,
              decisions and everyday tasks become
              simple next steps.
            </p>

            <div className="mode-footer">
              <span>REMIND</span>
              <span>ORGANIZE</span>
              <span>ACT</span>
            </div>

          </div>

          <div className="mode-card study-card reveal">

            <div className="mode-top">
              <span>02</span>
              <span>🎓 STUDY MODE</span>
            </div>

            <h3>
              LEARN
              <br />
              WITHOUT
              <br />
              FRICTION.
            </h3>

            <p>
              Maths, Physics, BEE, CAEG,
              assignments, images, documents and
              difficult questions — explained clearly.
            </p>

            <div className="mode-footer">
              <span>SOLVE</span>
              <span>EXPLAIN</span>
              <span>LEARN</span>
            </div>

          </div>

        </section>

        {/* =====================================================
            INPUT SYSTEM
        ====================================================== */}

        <section className="input-section">

          <div className="section-number">
            03
          </div>

          <div className="input-copy reveal">

            <p className="section-label">
              SPEAK. SHOW. UPLOAD.
            </p>

            <h2>
              HOWEVER
              <br />
              YOU THINK.
            </h2>

          </div>

          <div className="input-grid">

            <div className="input-tile reveal">
              <span className="tile-icon">⌁</span>
              <strong>TEXT</strong>
              <p>
                Tell LIFEOS what you need.
              </p>
            </div>

            <div className="input-tile reveal">
              <span className="tile-icon">◉</span>
              <strong>CAMERA</strong>
              <p>
                Show a problem or situation.
              </p>
            </div>

            <div className="input-tile reveal">
              <span className="tile-icon">↥</span>
              <strong>FILES</strong>
              <p>
                Upload documents and assignments.
              </p>
            </div>

            <div className="input-tile reveal">
              <span className="tile-icon">✦</span>
              <strong>AI</strong>
              <p>
                Get an intelligent response.
              </p>
            </div>

          </div>

        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}

        <section className="final-section">

          <div className="final-glow" />

          <p className="section-label">
            YOUR INTELLIGENT LIFE STARTS HERE.
          </p>

          <h2>
            READY TO
            <br />
            <span>ENTER?</span>
          </h2>

          <button
            data-magnetic
            className="final-button"
            onClick={enterLifeOS}
          >
            ENTER LIFEOS
            <span>↗</span>
          </button>

          <p className="final-note">
            LIFEOS / INTELLIGENCE FOR REAL LIFE.
          </p>

        </section>

        <footer className="footer">
          <span>© 2026 LIFEOS</span>
          <span>AI • LIFE • STUDY</span>
          <span>BUILT FOR HUMANS</span>
        </footer>

        <style jsx>{`

          * {
            box-sizing: border-box;
          }

          :global(html) {
            scroll-behavior: smooth;
            background: #050505;
          }

          :global(body) {
            margin: 0;
            background: #050505;
            color: #f5f5f5;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
          }

          :global(button) {
            font-family: inherit;
          }

          .lifeos-page {
            min-height: 100vh;
            overflow: hidden;
            background:
              radial-gradient(
                circle at 75% 20%,
                rgba(255,255,255,.07),
                transparent 25%
              ),
              #050505;
          }

          .hero {
            position: relative;
            min-height: 100vh;
            padding: 30px 5vw;
            overflow: hidden;
          }

          .grain {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 20;
            opacity: .055;
            background-image:
              url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E");
          }

          .cursor-glow {
            position: fixed;
            width: 260px;
            height: 260px;
            left: var(--mouse-x, 50%);
            top: var(--mouse-y, 50%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 2;
            border-radius: 50%;
            background:
              radial-gradient(
                circle,
                rgba(255,255,255,.055),
                transparent 70%
              );
            filter: blur(12px);
          }

          .nav {
            position: relative;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255,255,255,.13);
            padding-bottom: 22px;
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            letter-spacing: .18em;
            font-weight: 700;
          }

          .brand-dot,
          .live-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #fff;
            box-shadow: 0 0 15px rgba(255,255,255,.9);
          }

          .nav-right {
            display: flex;
            align-items: center;
            gap: 28px;
            color: #8d8d8d;
            font-size: 10px;
            letter-spacing: .14em;
          }

          .nav-enter {
            cursor: pointer;
            border: 1px solid rgba(255,255,255,.2);
            background: rgba(255,255,255,.04);
            color: white;
            padding: 10px 15px;
            font-size: 10px;
            letter-spacing: .12em;
            transition: .25s ease;
          }

          .nav-enter:hover {
            background: white;
            color: black;
          }

          .hero-grid {
            position: relative;
            z-index: 5;
            min-height: calc(100vh - 100px);
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center;
            gap: 4vw;
          }

          .hero-copy {
            position: relative;
            z-index: 8;
          }

          .eyebrow,
          .section-label {
            color: #8b8b8b;
            font-size: 10px;
            letter-spacing: .18em;
            margin: 0 0 25px;
          }

          .hero-title {
            display: flex;
            flex-direction: column;
            margin: 0;
            font-size: clamp(70px, 10vw, 160px);
            line-height: .77;
            letter-spacing: -.075em;
            font-weight: 800;
            transition: transform .15s linear;
          }

          .hero-title .outline {
            color: transparent;
            -webkit-text-stroke: 1px rgba(255,255,255,.85);
          }

          .hero-description {
            max-width: 390px;
            color: #929292;
            line-height: 1.6;
            font-size: 14px;
            margin-top: 45px;
          }

          .hero-actions {
            display: flex;
            gap: 12px;
            margin-top: 30px;
            align-items: center;
          }

          .primary-button,
          .final-button {
            display: flex;
            align-items: center;
            gap: 25px;
            border: 0;
            background: white;
            color: black;
            padding: 17px 22px;
            font-size: 10px;
            letter-spacing: .14em;
            cursor: pointer;
            transition:
              transform .25s ease,
              background .25s ease;
          }

          .primary-button:hover,
          .final-button:hover {
            background: #dedede;
          }

          .arrow {
            font-size: 17px;
          }

          .secondary-button {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 16px 20px;
            border: 1px solid rgba(255,255,255,.18);
            color: white;
            text-decoration: none;
            font-size: 10px;
            letter-spacing: .14em;
            transition: .25s ease;
          }

          .secondary-button:hover {
            background: rgba(255,255,255,.08);
          }

          .portrait-stage {
            position: relative;
            height: min(78vh, 800px);
            min-height: 520px;
            transition: transform .15s linear;
          }

          .portrait-wrap {
            position: absolute;
            inset: 4% 5% 0;
            overflow: hidden;
            border-radius: 48% 48% 8px 8px;
            background:
              radial-gradient(
                circle at 50% 30%,
                #222,
                #090909 65%
              );
          }

          .portrait-wrap::after {
            content: "";
            position: absolute;
            inset: 0;
            background:
              linear-gradient(
                180deg,
                transparent 50%,
                rgba(0,0,0,.65)
              );
            pointer-events: none;
            z-index: 5;
          }

          .portrait-fallback {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center top;
            filter:
              grayscale(100%)
              contrast(1.05);
            opacity: .72;
            z-index: 1;
          }

          .portrait-canvas {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 3;
          }

          .face-fly,
          .face-hand,
          .face-props {
            position: absolute;
            inset: 0;
            z-index: 4;
            pointer-events: none;
          }

          .portrait-scan {
            position: absolute;
            left: 0;
            right: 0;
            height: 1px;
            top: 20%;
            background: rgba(255,255,255,.5);
            box-shadow:
              0 0 20px rgba(255,255,255,.7);
            opacity: .35;
            z-index: 7;
            animation: scan 5s linear infinite;
          }

          @keyframes scan {
            from {
              transform: translateY(-100px);
            }

            to {
              transform: translateY(500px);
            }
          }

          .portrait-label {
            position: absolute;
            z-index: 9;
            bottom: 25px;
            left: 25px;
            display: flex;
            align-items: center;
            gap: 9px;
            font-size: 9px;
            letter-spacing: .15em;
            color: white;
          }

          .orbit-one,
          .orbit-two {
            position: absolute;
            border: 1px solid rgba(255,255,255,.09);
            border-radius: 50%;
            pointer-events: none;
          }

          .orbit-one {
            width: 120%;
            height: 40%;
            top: 30%;
            left: -10%;
            transform: rotate(-15deg);
          }

          .orbit-two {
            width: 90%;
            height: 75%;
            top: 12%;
            left: 5%;
            transform: rotate(18deg);
          }

          .hero-bottom {
            position: absolute;
            z-index: 10;
            left: 5vw;
            right: 5vw;
            bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #777;
            font-size: 9px;
            letter-spacing: .15em;
          }

          .scroll-line {
            flex: 1;
            height: 1px;
            margin: 0 25px;
            background: rgba(255,255,255,.15);
          }

          .system-section,
          .input-section {
            position: relative;
            min-height: 100vh;
            padding: 15vh 10vw;
            border-top: 1px solid rgba(255,255,255,.1);
          }

          .section-number {
            position: absolute;
            top: 40px;
            right: 5vw;
            color: #444;
            font-size: 11px;
            letter-spacing: .15em;
          }

          .system-content {
            max-width: 900px;
          }

          .system-content h2,
          .input-copy h2,
          .final-section h2 {
            font-size: clamp(60px, 10vw, 150px);
            line-height: .8;
            letter-spacing: -.07em;
            margin: 0;
          }

          .system-content h2 span,
          .input-copy h2 {
            color: transparent;
            -webkit-text-stroke: 1px rgba(255,255,255,.75);
          }

          .section-text {
            max-width: 500px;
            margin-top: 60px;
            color: #858585;
            line-height: 1.7;
            font-size: 15px;
          }

          .modes-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            min-height: 100vh;
          }

          .mode-card {
            min-height: 100vh;
            padding: 70px 6vw;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-top: 1px solid rgba(255,255,255,.1);
          }

          .life-card {
            background:
              radial-gradient(
                circle at 70% 30%,
                rgba(255,255,255,.07),
                transparent 35%
              );
          }

          .study-card {
            border-left: 1px solid rgba(255,255,255,.1);
            background:
              radial-gradient(
                circle at 30% 70%,
                rgba(255,255,255,.045),
                transparent 35%
              );
          }

          .mode-top,
          .mode-footer {
            display: flex;
            justify-content: space-between;
            color: #777;
            font-size: 10px;
            letter-spacing: .16em;
          }

          .mode-card h3 {
            font-size: clamp(50px, 7vw, 100px);
            line-height: .82;
            letter-spacing: -.06em;
            margin: 70px 0 30px;
          }

          .mode-card p {
            max-width: 390px;
            color: #888;
            line-height: 1.7;
          }

          .input-copy {
            margin-bottom: 100px;
          }

          .input-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            border-top: 1px solid rgba(255,255,255,.15);
          }

          .input-tile {
            min-height: 260px;
            padding: 30px;
            border-right: 1px solid rgba(255,255,255,.12);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .input-tile:last-child {
            border-right: 0;
          }

          .tile-icon {
            font-size: 35px;
            color: #888;
          }

          .input-tile strong {
            font-size: 13px;
            letter-spacing: .15em;
          }

          .input-tile p {
            color: #777;
            font-size: 12px;
            line-height: 1.5;
          }

          .final-section {
            min-height: 100vh;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            border-top: 1px solid rgba(255,255,255,.1);
            overflow: hidden;
          }

          .final-glow {
            position: absolute;
            width: 600px;
            height: 600px;
            border-radius: 50%;
            background:
              radial-gradient(
                circle,
                rgba(255,255,255,.09),
                transparent 65%
              );
            filter: blur(20px);
          }

          .final-section h2 {
            position: relative;
            z-index: 2;
            margin: 0 0 60px;
          }

          .final-section h2 span {
            color: transparent;
            -webkit-text-stroke: 1px rgba(255,255,255,.8);
          }

          .final-button {
            position: relative;
            z-index: 2;
            padding: 20px 30px;
          }

          .final-note {
            position: absolute;
            bottom: 30px;
            color: #555;
            font-size: 9px;
            letter-spacing: .2em;
          }

          .footer {
            padding: 25px 5vw;
            display: flex;
            justify-content: space-between;
            border-top: 1px solid rgba(255,255,255,.1);
            color: #555;
            font-size: 9px;
            letter-spacing: .15em;
          }

          .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition:
              opacity .9s ease,
              transform .9s ease;
          }

          .reveal.visible {
            opacity: 1;
            transform: translateY(0);
          }

          @media (max-width: 900px) {

            .hero-grid {
              grid-template-columns: 1fr;
              padding-top: 60px;
            }

            .hero {
              min-height: auto;
              padding-bottom: 100px;
            }

            .portrait-stage {
              height: 70vh;
              min-height: 500px;
            }

            .modes-section {
              grid-template-columns: 1fr;
            }

            .study-card {
              border-left: 0;
              border-top: 1px solid rgba(255,255,255,.1);
            }

            .input-grid {
              grid-template-columns: 1fr 1fr;
            }

            .input-tile:nth-child(2) {
              border-right: 0;
            }

            .input-tile:nth-child(3),
            .input-tile:nth-child(4) {
              border-top: 1px solid rgba(255,255,255,.12);
            }

            .nav-right > span {
              display: none;
            }
          }

          @media (max-width: 600px) {

            .hero {
              padding-left: 20px;
              padding-right: 20px;
            }

            .hero-title {
              font-size: 18vw;
            }

            .hero-actions {
              flex-direction: column;
              align-items: flex-start;
            }

            .portrait-stage {
              min-height: 420px;
            }

            .system-section,
            .input-section {
              padding: 100px 25px;
            }

            .input-grid {
              grid-template-columns: 1fr;
            }

            .input-tile {
              border-right: 0;
              border-bottom: 1px solid rgba(255,255,255,.12);
            }

            .input-tile:nth-child(3) {
              border-top: 0;
            }

            .footer {
              flex-direction: column;
              gap: 12px;
            }

            .hero-bottom {
              left: 20px;
              right: 20px;
            }
          }

        `}</style>
      </main>
    </>
  );
}