/**
 * ActOne.jsx — Ato 1: Hero Landing (Scroll 0% – 10%)
 *
 * Página 1 do PDF: Fundo branco, título "LEOVOX STUDIOS" em verde gradiente,
 * subtítulo "Creative Technology Lab", mascote pequeno acima, ribbons 3D verdes,
 * "Scroll to enter the experience" + seta.
 *
 * Animações cinematográficas via GSAP com fallback CSS.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

import isologo from '../../assets/brand/Isologo.svg';

const mapRange = (value, inStart, inEnd, outStart, outEnd) => {
  const t = Math.max(0, Math.min(1, (value - inStart) / (inEnd - inStart)));
  return outStart + t * (outEnd - outStart);
};

/* ============================================================================
 * Ribbons 3D Verdes — Decoração orgânica nos cantos
 * ============================================================================ */
const GreenRibbons = ({ opacity }) => (
  <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity }}>
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="ribbonGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#AAFF00" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#008800" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="ribbonGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66FF00" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#006600" stopOpacity="0.4" />
        </linearGradient>
        <filter id="ribbonGlow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Top-right ribbon */}
      <path d="M1200,-50 Q1350,100 1300,300 Q1250,500 1450,600"
        fill="none" stroke="url(#ribbonGrad1)" strokeWidth="60"
        strokeLinecap="round" filter="url(#ribbonGlow)" opacity="0.5" />
      {/* Bottom-left ribbon */}
      <path d="M-50,700 Q150,500 100,350 Q50,200 200,50"
        fill="none" stroke="url(#ribbonGrad2)" strokeWidth="50"
        strokeLinecap="round" filter="url(#ribbonGlow)" opacity="0.4" />
      {/* Top-left accent */}
      <path d="M-30,100 Q100,50 200,150 Q300,250 250,400"
        fill="none" stroke="url(#ribbonGrad1)" strokeWidth="35"
        strokeLinecap="round" filter="url(#ribbonGlow)" opacity="0.3" />
      {/* Bottom-right accent */}
      <path d="M1300,850 Q1200,750 1350,650 Q1450,550 1400,400"
        fill="none" stroke="url(#ribbonGrad2)" strokeWidth="40"
        strokeLinecap="round" filter="url(#ribbonGlow)" opacity="0.35" />
    </svg>
  </div>
);

/* ============================================================================
 * Scroll Indicator com animação CSS pura
 * ============================================================================ */
const ScrollIndicator = ({ opacity }) => (
  <div className="act-one-scroll-indicator" style={{
    position: 'absolute', bottom: '5%', left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '0.5rem',
    zIndex: 10, pointerEvents: 'none',
    opacity: opacity,
  }}>
    <span style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.7rem', fontWeight: 400,
      letterSpacing: '0.15em', textTransform: 'uppercase',
      color: '#555',
    }}>
      Scroll to enter the experience
    </span>
    <svg className="act-one-bounce-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  </div>
);

/* ============================================================================
 * ActOne — Componente Principal
 * ============================================================================ */
const ActOne = ({ progress = 0, isActive = true }) => {
  const p = Math.min(1, Math.max(0, progress));
  const containerRef = useRef(null);
  const mascotRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const tlRef = useRef(null);
  const floatRef = useRef(null);
  const hasAnimated = useRef(false);

  const runEntrance = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // Kill any existing
    if (tlRef.current) tlRef.current.kill();
    if (floatRef.current) floatRef.current.kill();

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Ensure final state is applied
        [mascotRef, titleRef, subtitleRef].forEach(ref => {
          if (ref.current) gsap.set(ref.current, { opacity: 1, y: 0, scale: 1, clearProps: 'transform' });
        });
      }
    });

    if (mascotRef.current) {
      tl.fromTo(mascotRef.current,
        { opacity: 0, y: 50, scale: 0.7 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 }
      );
    }
    if (titleRef.current) {
      tl.fromTo(titleRef.current,
        { opacity: 0, y: 70, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4 },
        '-=0.7'
      );
    }
    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 30, letterSpacing: '0.05em' },
        { opacity: 1, y: 0, letterSpacing: '0.35em', duration: 1.2 },
        '-=0.8'
      );
    }

    tlRef.current = tl;

    // Floating mascot
    if (mascotRef.current) {
      floatRef.current = gsap.to(mascotRef.current, {
        y: -14,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2,
      });
    }
  }, []);

  // Run entrance on mount
  useEffect(() => {
    const timer = setTimeout(runEntrance, 400);
    return () => {
      clearTimeout(timer);
      if (tlRef.current) tlRef.current.kill();
      if (floatRef.current) floatRef.current.kill();
    };
  }, [runEntrance]);

  // CSS fallback: after 3s, force visibility if GSAP hasn't run
  useEffect(() => {
    const fallback = setTimeout(() => {
      [mascotRef, titleRef, subtitleRef].forEach(ref => {
        if (ref.current && getComputedStyle(ref.current).opacity === '0') {
          ref.current.style.opacity = '1';
          ref.current.style.transform = 'none';
        }
      });
    }, 3000);
    return () => clearTimeout(fallback);
  }, []);

  // Scroll-driven fade out
  const fadeOut = mapRange(p, 0.5, 1.0, 1, 0);
  const contentScale = mapRange(p, 0.5, 1.0, 1, 0.88);
  const contentY = mapRange(p, 0.5, 1.0, 0, -80);
  const scrollIndicatorOpacity = mapRange(p, 0.1, 0.4, 0.7, 0);

  return (
    <div
      ref={containerRef}
      className="hero-act hero-act-one"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      {/* Ribbons 3D Verdes */}
      <GreenRibbons opacity={fadeOut} />

      {/* Grain texture sutil */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        opacity: 0.04, mixBlendMode: 'multiply',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '128px 128px',
      }} />

      {/* Conteúdo central */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        opacity: fadeOut,
        transform: `scale(${contentScale}) translateY(${contentY}px)`,
        willChange: 'transform, opacity',
      }}>
        {/* Mascote pequeno */}
        <div ref={mascotRef} style={{ marginBottom: '1.5rem', opacity: 0 }}>
          <img
            src={isologo}
            alt="Leovox Mascote"
            style={{
              width: 'clamp(60px, 8vw, 100px)',
              height: 'auto',
              filter: 'drop-shadow(0 4px 24px rgba(0, 255, 65, 0.35))',
            }}
          />
        </div>

        {/* Título LEOVOX STUDIOS */}
        <div ref={titleRef} style={{ textAlign: 'center', opacity: 0 }}>
          <h1 style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            fontWeight: 900,
            lineHeight: 1,
            margin: 0,
            background: 'linear-gradient(180deg, #66FF00 0%, #1A5C00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.02em',
          }}>
            LEOVOX STUDIOS
          </h1>
        </div>

        {/* Subtítulo */}
        <div ref={subtitleRef} style={{
          marginTop: '1rem', textAlign: 'center', opacity: 0,
        }}>
          <p style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 'clamp(0.85rem, 1.8vw, 1.3rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#1a1a1a',
            letterSpacing: '0.35em',
            margin: 0,
          }}>
            Creative Technology Lab
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator opacity={scrollIndicatorOpacity} />
    </div>
  );
};

export default ActOne;
