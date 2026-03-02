/**
 * ActTwo.jsx — Ato 2: Mascote Zoom-In (Scroll 10% – 18%)
 *
 * Página 2 do PDF: Mascote ampliado e centralizado com glow verde,
 * ribbons nos cantos. Transição de zoom progressivo controlada pelo scroll.
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import isologo from '../../assets/brand/Isologo.svg';

const mapRange = (value, inStart, inEnd, outStart, outEnd) => {
  const t = Math.max(0, Math.min(1, (value - inStart) / (inEnd - inStart)));
  return outStart + t * (outEnd - outStart);
};

/* Ribbons reutilizáveis */
const GreenRibbons = ({ opacity }) => (
  <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity }}>
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="rg2a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#AAFF00" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#008800" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="rg2b" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66FF00" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#006600" stopOpacity="0.4" />
        </linearGradient>
        <filter id="rg2glow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M1200,-50 Q1350,100 1300,300 Q1250,500 1450,600"
        fill="none" stroke="url(#rg2a)" strokeWidth="60"
        strokeLinecap="round" filter="url(#rg2glow)" opacity="0.5" />
      <path d="M-50,700 Q150,500 100,350 Q50,200 200,50"
        fill="none" stroke="url(#rg2b)" strokeWidth="50"
        strokeLinecap="round" filter="url(#rg2glow)" opacity="0.4" />
    </svg>
  </div>
);

const ActTwo = ({ progress = 0, isActive = true }) => {
  const p = Math.min(1, Math.max(0, progress));
  const mascotRef = useRef(null);
  const hasAnimated = useRef(false);

  // Entrance animation when act becomes active
  useEffect(() => {
    if (!isActive || hasAnimated.current || !mascotRef.current) return;
    hasAnimated.current = true;

    gsap.fromTo(mascotRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }
    );
  }, [isActive]);

  useEffect(() => {
    if (!isActive) hasAnimated.current = false;
  }, [isActive]);

  // Mascote escala de 1 → 3.5 progressivamente com scroll
  const mascotScale = mapRange(p, 0, 1, 1.2, 3.5);
  const mascotOpacity = mapRange(p, 0, 0.08, 0, 1) * mapRange(p, 0.85, 1, 1, 0);
  const glowIntensity = mapRange(p, 0.2, 0.7, 0.2, 0.6);
  const ribbonOpacity = mapRange(p, 0.5, 1, 1, 0.3);
  const bgBrightness = mapRange(p, 0.7, 1, 1, 0.97);

  return (
    <div className="hero-act hero-act-two" style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      backgroundColor: `rgb(${Math.round(255 * bgBrightness)}, ${Math.round(255 * bgBrightness)}, ${Math.round(255 * bgBrightness)})`,
      opacity: isActive ? 1 : 0,
      transition: 'opacity 0.4s ease',
      pointerEvents: isActive ? 'auto' : 'none',
    }}>
      <GreenRibbons opacity={ribbonOpacity} />

      {/* Glow verde atrás do mascote */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(-50%, -50%) scale(${mascotScale * 0.8})`,
        width: '200px', height: '200px', borderRadius: '50%',
        background: `radial-gradient(circle, rgba(0,255,65,${glowIntensity}) 0%, transparent 70%)`,
        zIndex: 2, pointerEvents: 'none', filter: 'blur(30px)',
      }} />

      {/* Mascote centralizado com zoom */}
      <div ref={mascotRef} style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img
          src={isologo}
          alt="Leovox Mascote"
          style={{
            width: 'clamp(80px, 12vw, 150px)',
            height: 'auto',
            transform: `scale(${mascotScale})`,
            opacity: mascotOpacity,
            filter: `drop-shadow(0 0 ${20 + glowIntensity * 40}px rgba(0,255,65,${glowIntensity}))`,
            willChange: 'transform, opacity, filter',
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

export default ActTwo;
