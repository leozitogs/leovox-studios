/**
 * ActThree.jsx — Ato 3: Mascote + LVX (Scroll 18% – 26%)
 *
 * Página 3 do PDF: Mascote grande centralizado com "LVX" em verde neon
 * atrás, estilo agressivo/angular. Ribbons nos cantos.
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import isologo from '../../assets/brand/Isologo.svg';
import lvxLogo from '../../assets/brand/LvxLogoModerna.svg';

const mapRange = (value, inStart, inEnd, outStart, outEnd) => {
  const t = Math.max(0, Math.min(1, (value - inStart) / (inEnd - inStart)));
  return outStart + t * (outEnd - outStart);
};

const GreenRibbons = ({ opacity }) => (
  <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity }}>
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="rg3a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#AAFF00" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#008800" stopOpacity="0.5" />
        </linearGradient>
        <filter id="rg3glow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M1200,-50 Q1350,100 1300,300 Q1250,500 1450,600"
        fill="none" stroke="url(#rg3a)" strokeWidth="55"
        strokeLinecap="round" filter="url(#rg3glow)" opacity="0.45" />
      <path d="M-50,700 Q150,500 100,350 Q50,200 200,50"
        fill="none" stroke="url(#rg3a)" strokeWidth="45"
        strokeLinecap="round" filter="url(#rg3glow)" opacity="0.35" />
    </svg>
  </div>
);

const ActThree = ({ progress = 0, isActive = true }) => {
  const p = Math.min(1, Math.max(0, progress));
  const lvxRef = useRef(null);
  const mascotRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isActive || hasAnimated.current) return;
    hasAnimated.current = true;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // LVX text slams in from behind
    if (lvxRef.current) {
      tl.fromTo(lvxRef.current,
        { opacity: 0, scale: 0.3, rotateZ: -5 },
        { opacity: 1, scale: 1, rotateZ: 0, duration: 0.8 }
      );
    }
    if (mascotRef.current) {
      tl.fromTo(mascotRef.current,
        { opacity: 0, scale: 1.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1.0 },
        '-=0.5'
      );
    }

    return () => tl.kill();
  }, [isActive]);

  useEffect(() => {
    if (!isActive) hasAnimated.current = false;
  }, [isActive]);

  const fadeOut = mapRange(p, 0.7, 1, 1, 0);
  const lvxScale = mapRange(p, 0, 0.5, 0.9, 1.1);
  const lvxGlow = mapRange(p, 0, 0.5, 0.3, 0.7);
  const mascotScale = mapRange(p, 0, 0.5, 2.5, 3.0);

  return (
    <div className="hero-act hero-act-three" style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      backgroundColor: '#FFFFFF',
      opacity: isActive ? 1 : 0,
      transition: 'opacity 0.4s ease',
      pointerEvents: isActive ? 'auto' : 'none',
    }}>
      <GreenRibbons opacity={fadeOut} />

      {/* LVX text behind mascot — aggressive green neon */}
      <div ref={lvxRef} style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0,
      }}>
        <img
          src={lvxLogo}
          alt=""
          aria-hidden="true"
          style={{
            width: 'clamp(300px, 55vw, 700px)',
            height: 'auto',
            transform: `scale(${lvxScale})`,
            filter: `drop-shadow(0 0 30px rgba(0,255,65,${lvxGlow})) drop-shadow(0 0 60px rgba(0,255,65,${lvxGlow * 0.5})) brightness(1.1) hue-rotate(-5deg)`,
            willChange: 'transform, filter',
          }}
        />
      </div>

      {/* Mascote grande por cima */}
      <div ref={mascotRef} style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0,
      }}>
        <img
          src={isologo}
          alt="Leovox Mascote"
          style={{
            width: 'clamp(100px, 15vw, 180px)',
            height: 'auto',
            transform: `scale(${mascotScale})`,
            filter: 'drop-shadow(0 0 25px rgba(0,255,65,0.4))',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
        opacity: 0.03, mixBlendMode: 'multiply',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '128px 128px',
      }} />
    </div>
  );
};

export default ActThree;
