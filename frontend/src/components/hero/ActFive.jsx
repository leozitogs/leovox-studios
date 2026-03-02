/**
 * ActFive.jsx — Ato 5: Competências Técnicas (Scroll 42% – 52%)
 *
 * Página 6 do PDF: Mascote centralizado girando como ioiô,
 * título "COMPETÊNCIAS TÉCNICAS" em verde gradiente,
 * fileira de ícones de tecnologias em verde monocromático.
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import isologo from '../../assets/brand/Isologo.svg';

const mapRange = (value, inStart, inEnd, outStart, outEnd) => {
  const t = Math.max(0, Math.min(1, (value - inStart) / (inEnd - inStart)));
  return outStart + t * (outEnd - outStart);
};

/* ============================================================================
 * Tech Icons — SVG inline com ícones reais em verde monocromático
 * ============================================================================ */
const TECH_ICONS = [
  { name: 'JavaScript', label: 'JS', path: 'M3 3h18v18H3V3zm4.73 15.04h2.17l.01-5.7 2.8 5.7h1.58l2.8-5.7.01 5.7h2.17V6.96h-2.6L12 13.14 8.33 6.96H5.73v11.08z' },
  { name: 'TypeScript', label: 'TS', path: 'M3 3h18v18H3V3zm10.17 9.65v-1.2H7.64v1.2h1.87v5.39h1.79v-5.39h1.87zm.96 5.39h1.73v-2.77c0-.74.16-1.28.49-1.62.33-.34.78-.51 1.35-.51.43 0 .76.12 1 .35.24.23.36.58.36 1.04v3.51h1.73v-3.84c0-.87-.24-1.54-.71-2-.47-.47-1.12-.7-1.94-.7-.89 0-1.58.34-2.08 1.03v-.88h-1.73v6.39z' },
  { name: 'HTML5', label: 'HTML', path: 'M4.136 3.012h15.729l-1.431 16.15L11.991 21l-6.414-1.837L4.136 3.012zM17.09 6.172H6.91l.255 2.86h9.67l-.76 8.45-4.075 1.13-4.075-1.13-.278-3.112h2.8l.142 1.59 1.411.382 1.411-.382.148-1.651h-5.84L6.91 8.172h10.18v-2z' },
  { name: 'CSS3', label: 'CSS', path: 'M4.192 3.143h15.615l-1.42 16.034L12 21.138 5.612 19.177 4.192 3.143zM17.09 6.3H6.91l.255 2.86h7.67l-.36 4.03-2.475.67-2.475-.67-.158-1.77h-2.8l.312 3.49L12 16.533l5.1-1.62L17.09 6.3z' },
  { name: 'Python', label: 'PY', path: 'M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.42 3.35-3.42h5.766s3.24.052 3.24-3.148V3.202S18.28 0 11.914 0zM8.708 1.85c.578 0 1.047.47 1.047 1.05 0 .58-.47 1.05-1.047 1.05-.578 0-1.047-.47-1.047-1.05 0-.58.47-1.05 1.047-1.05z' },
  { name: 'PHP', label: 'PHP', path: 'M12 5.601c-5.523 0-10 2.687-10 6s4.477 6 10 6 10-2.687 10-6-4.477-6-10-6zm-2.5 8.5h-1.5v-2h-2v2H4.5v-5h1.5v1.5h2V9.101h1.5v5zm5.5-3h-1.5v3H12v-5h3.5c1.1 0 2 .9 2 2s-.9 2-2 2zm0-2.5h-1.5v1h1.5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5z' },
  { name: 'Node.js', label: 'Node', path: 'M12 1.85c-.27 0-.53.07-.77.2L3.5 6.3c-.48.28-.77.79-.77 1.34v8.72c0 .55.29 1.06.77 1.34l7.73 4.25c.24.13.5.2.77.2s.53-.07.77-.2l7.73-4.25c.48-.28.77-.79.77-1.34V7.64c0-.55-.29-1.06-.77-1.34L12.77 2.05c-.24-.13-.5-.2-.77-.2z' },
  { name: 'Three.js', label: '3JS', path: 'M12 0L1 6v12l11 6 11-6V6L12 0zm0 2.18L20.82 7 12 11.82 3.18 7 12 2.18zM2 8.27l9 4.91v9.54l-9-4.91V8.27zm20 0v9.54l-9 4.91v-9.54l9-4.91z' },
  { name: 'PostgreSQL', label: 'PG', path: 'M17.128 0a10.134 10.134 0 00-2.755.403l-.063.02A10.922 10.922 0 0012.6.258C11.422.238 10.347.524 9.55 1.1 8.786.636 7.342.12 5.672.254 3.56.422 1.747 1.598.836 3.94c-.88 2.263-.676 5.677.534 8.97.605 1.645 1.397 2.96 2.37 3.735.486.388 1.14.655 1.8.555.66-.1 1.2-.536 1.572-1.15.186-.307.342-.66.462-1.06.12-.4.205-.845.252-1.34l.003-.033-.003-.032a1.537 1.537 0 01.007-.21c.02-.16.06-.31.12-.45.12-.28.32-.5.58-.63.26-.13.57-.16.92-.07.35.09.66.28.9.54.24.26.41.58.49.94.16.72-.02 1.5-.45 2.14-.43.64-1.1 1.1-1.9 1.3-.8.2-1.72.12-2.56-.28-.84-.4-1.56-1.08-2.04-1.98a.75.75 0 00-1.36.64c.6 1.13 1.5 1.98 2.56 2.49 1.06.51 2.24.62 3.3.36 1.06-.26 1.96-.88 2.56-1.77.6-.89.84-1.97.62-3.02a3.53 3.53 0 00-.82-1.56 3.53 3.53 0 00-1.5-.9c-.58-.15-1.17-.12-1.7.1-.53.22-.97.6-1.27 1.1-.15.25-.26.52-.33.81-.07.29-.1.6-.09.92-.04.41-.12.78-.22 1.1-.1.32-.23.6-.37.83-.28.46-.58.65-.87.69-.29.04-.63-.08-.97-.35-.68-.54-1.36-1.63-1.88-3.05-1.1-2.99-1.28-6.08-.56-7.93.7-1.8 2.1-2.7 3.78-2.84 1.34-.11 2.52.3 3.18.7l.08.05.1-.04c.67-.32 1.6-.57 2.63-.58 1.03-.01 2.17.22 3.2.89l.1.07.1-.04c.56-.2 1.26-.36 2.03-.38 1.15-.03 2.5.26 3.67 1.27 2.34 2.02 3.1 5.94 1.34 11.27-.44 1.33-1.04 2.35-1.78 3.03-.74.68-1.6 1.02-2.56 1.02-.96 0-1.72-.34-2.24-.84-.52-.5-.8-1.14-.92-1.72a4.39 4.39 0 01-.04-1.56c.08-.52.24-1.02.48-1.46.48-.88 1.2-1.5 2.08-1.76.88-.26 1.88-.14 2.72.42a.75.75 0 10.84-1.24c-1.18-.79-2.58-.95-3.82-.58-1.24.37-2.24 1.24-2.9 2.46-.33.61-.54 1.27-.64 1.94-.1.67-.08 1.36.08 2.02.16.82.56 1.7 1.28 2.4.72.7 1.76 1.18 3.04 1.18 1.28 0 2.44-.48 3.4-1.36.96-.88 1.66-2.1 2.16-3.62 1.92-5.82 1.1-10.27-1.66-12.66C20.27.37 18.6 0 17.128 0z' },
  { name: 'Figma', label: 'Fig', path: 'M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4zm0-20C5.792 4 4 5.792 4 8s1.792 4 4 4h4V4H8zm0-4C5.792 0 4 1.792 4 4s1.792 4 4 4h4V0H8zm8 4h-4v8h4c2.208 0 4-1.792 4-4s-1.792-4-4-4zm-4 8c-2.208 0-4 1.792-4 4s1.792 4 4 4 4-1.792 4-4-1.792-4-4-4z' },
  { name: 'Illustrator', label: 'Ai', path: 'M19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.9c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zM14.7 16.2h-2.09l-.93-2.83H8.1l-.88 2.83H5.2L8.78 6.1h2.47L14.7 16.2zm4.5 0h-1.93V9.47h1.93V16.2zm-.96-7.76c-.66 0-1.1-.47-1.1-1.07 0-.62.45-1.08 1.12-1.08.67 0 1.1.46 1.1 1.08 0 .6-.44 1.07-1.12 1.07z' },
  { name: 'Photoshop', label: 'Ps', path: 'M19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.9c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zM9.6 11.52c-.56.25-1.22.37-1.97.37h-.86v4.31H4.85V6.1h2.93c.77 0 1.41.1 1.93.3.52.2.93.5 1.22.88.29.38.44.85.44 1.4 0 .56-.15 1.05-.44 1.45-.3.4-.72.72-1.33.99v-.6zm9.62 1.17c0 .67-.16 1.25-.48 1.73-.32.48-.78.85-1.38 1.1-.6.25-1.3.38-2.12.38-.64 0-1.18-.05-1.62-.14-.44-.1-.88-.26-1.32-.5v-1.84c.44.27.92.48 1.42.63.5.15.96.22 1.38.22.42 0 .74-.08.95-.23.21-.15.32-.37.32-.64 0-.17-.06-.32-.17-.46-.11-.14-.29-.28-.52-.43-.23-.15-.55-.32-.94-.52-.56-.28-1-.55-1.32-.82-.32-.27-.55-.57-.7-.9-.15-.33-.22-.72-.22-1.17 0-.64.17-1.18.5-1.63.33-.45.79-.79 1.37-1.02.58-.23 1.24-.34 1.98-.34.64 0 1.22.08 1.74.25.52.17 1.02.4 1.5.68l-.68 1.52c-.42-.24-.82-.42-1.2-.55-.38-.13-.76-.2-1.14-.2-.34 0-.6.07-.78.2-.18.13-.27.32-.27.56 0 .16.06.3.17.42.11.12.28.25.51.38.23.13.53.29.9.47.54.26.98.52 1.3.79.32.27.56.57.7.9.14.33.22.72.22 1.16z' },
  { name: 'React', label: 'React', path: 'M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 01-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1.03-.95-1.5-.65-.04-1.33-.07-2-.07-.68 0-1.36.03-2 .07-.33.47-.65.97-.95 1.5L8.29 12l.81 1.5c.3.53.62 1.03.95 1.5.65.04 1.33.07 2 .07.68 0 1.36-.03 2-.07.33-.47.65-.97.95-1.5M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 012.4-.36c.48-.67.99-1.31 1.51-1.9' },
];

const TechIcon = ({ icon, index, isVisible }) => {
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current || !ref.current) return;
    hasAnimated.current = true;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 30, scale: 0.7 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.5,
        delay: index * 0.08,
        ease: 'back.out(1.7)',
      }
    );
  }, [isVisible, index]);

  useEffect(() => {
    if (!isVisible) hasAnimated.current = false;
  }, [isVisible]);

  return (
    <div ref={ref} className="act-five-tech-icon" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '0.4rem',
      opacity: 0,
    }}>
      <div style={{
        width: 'clamp(44px, 5vw, 58px)',
        height: 'clamp(44px, 5vw, 58px)',
        borderRadius: '14px',
        background: 'rgba(0, 255, 65, 0.06)',
        border: '1px solid rgba(0, 255, 65, 0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(0, 255, 65, 0.15)';
        e.currentTarget.style.borderColor = 'rgba(0, 255, 65, 0.5)';
        e.currentTarget.style.boxShadow = '0 0 18px rgba(0, 255, 65, 0.25)';
        e.currentTarget.style.transform = 'translateY(-5px) scale(1.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(0, 255, 65, 0.06)';
        e.currentTarget.style.borderColor = 'rgba(0, 255, 65, 0.18)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
      }}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="#00cc33">
          <path d={icon.path} />
        </svg>
      </div>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.6rem', fontWeight: 500,
        color: '#555', letterSpacing: '0.02em',
      }}>
        {icon.name}
      </span>
    </div>
  );
};

const GreenRibbons = ({ opacity }) => (
  <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity }}>
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="rg5a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#AAFF00" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#008800" stopOpacity="0.4" />
        </linearGradient>
        <filter id="rg5glow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M1220,-40 Q1360,110 1310,310 Q1260,510 1450,610"
        fill="none" stroke="url(#rg5a)" strokeWidth="50" strokeLinecap="round"
        filter="url(#rg5glow)" opacity="0.4" />
      <path d="M-40,710 Q160,510 110,360 Q60,210 210,60"
        fill="none" stroke="url(#rg5a)" strokeWidth="40" strokeLinecap="round"
        filter="url(#rg5glow)" opacity="0.3" />
    </svg>
  </div>
);

const ActFive = ({ progress = 0, isActive = true }) => {
  const p = Math.min(1, Math.max(0, progress));
  const mascotRef = useRef(null);
  const titleRef = useRef(null);
  const hasAnimatedTitle = useRef(false);
  const floatTl = useRef(null);

  // Mascote "ioiô" animation
  useEffect(() => {
    if (!isActive || !mascotRef.current) return;

    floatTl.current = gsap.timeline({ repeat: -1, yoyo: true });
    floatTl.current
      .to(mascotRef.current, {
        y: -25, rotateZ: 8, scale: 1.05,
        duration: 1.2, ease: 'power2.inOut',
      })
      .to(mascotRef.current, {
        y: 15, rotateZ: -5, scale: 0.95,
        duration: 1.0, ease: 'power2.inOut',
      })
      .to(mascotRef.current, {
        y: 0, rotateZ: 0, scale: 1,
        duration: 0.8, ease: 'power2.inOut',
      });

    return () => { if (floatTl.current) floatTl.current.kill(); };
  }, [isActive]);

  // Title entrance
  useEffect(() => {
    if (!isActive || hasAnimatedTitle.current || !titleRef.current) return;
    hasAnimatedTitle.current = true;

    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out', delay: 0.2 }
    );
  }, [isActive]);

  useEffect(() => {
    if (!isActive) hasAnimatedTitle.current = false;
  }, [isActive]);

  const contentOpacity = mapRange(p, 0, 0.15, 0, 1) * mapRange(p, 0.8, 1, 1, 0);
  const iconsVisible = p > 0.15 && isActive;

  return (
    <div className="hero-act hero-act-five" style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      backgroundColor: '#FFFFFF',
      opacity: isActive ? 1 : 0,
      transition: 'opacity 0.4s ease',
      pointerEvents: isActive ? 'auto' : 'none',
    }}>
      <GreenRibbons opacity={contentOpacity} />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem', gap: '1.5rem',
        opacity: contentOpacity,
      }}>
        {/* Mascote girando (ioiô) */}
        <div ref={mascotRef} style={{ marginBottom: '0.5rem' }}>
          <img src={isologo} alt="" style={{
            width: 'clamp(80px, 12vw, 140px)', height: 'auto',
            filter: 'drop-shadow(0 0 25px rgba(0,255,65,0.35))',
          }} />
        </div>

        {/* Título */}
        <h2 ref={titleRef} style={{
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
          fontWeight: 900, lineHeight: 1.1,
          textAlign: 'center', margin: 0,
          textTransform: 'uppercase',
          background: 'linear-gradient(180deg, #66FF00 0%, #1A5C00 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          opacity: 0,
        }}>
          Competências Técnicas
        </h2>

        {/* Fileira de ícones tech */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center', gap: 'clamp(0.5rem, 1.5vw, 1.2rem)',
          maxWidth: '900px', width: '100%',
          padding: '1rem 0',
        }}>
          {TECH_ICONS.map((icon, index) => (
            <TechIcon
              key={icon.name}
              icon={icon}
              index={index}
              isVisible={iconsVisible}
            />
          ))}
        </div>
      </div>

      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none',
        opacity: 0.03, mixBlendMode: 'multiply',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '128px 128px',
      }} />
    </div>
  );
};

export default ActFive;
