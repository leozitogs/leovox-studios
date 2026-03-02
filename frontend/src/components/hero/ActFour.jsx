/**
 * ActFour.jsx — Ato 4: Qualidade + Diferenciação Técnica (Scroll 26% – 42%)
 *
 * Páginas 4-5 do PDF:
 * - Primeira metade: "Qualidade" (texto esquerda, mascote direita)
 * - Segunda metade: "DIFERENCIAÇÃO TÉCNICA" (mascote esquerda cortado, texto direita)
 * Ribbons verdes nos cantos, fundo branco.
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import isologo from '../../assets/brand/Isologo.svg';

const mapRange = (value, inStart, inEnd, outStart, outEnd) => {
  const t = Math.max(0, Math.min(1, (value - inStart) / (inEnd - inStart)));
  return outStart + t * (outEnd - outStart);
};

const GreenRibbons = ({ opacity }) => (
  <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity }}>
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="rg4a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#AAFF00" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#008800" stopOpacity="0.5" />
        </linearGradient>
        <filter id="rg4glow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M1250,-30 Q1380,120 1320,320 Q1260,520 1460,620"
        fill="none" stroke="url(#rg4a)" strokeWidth="55" strokeLinecap="round"
        filter="url(#rg4glow)" opacity="0.4" />
      <path d="M-40,720 Q160,520 110,360 Q60,210 210,60"
        fill="none" stroke="url(#rg4a)" strokeWidth="45" strokeLinecap="round"
        filter="url(#rg4glow)" opacity="0.35" />
    </svg>
  </div>
);

const ActFour = ({ progress = 0, isActive = true }) => {
  const p = Math.min(1, Math.max(0, progress));
  const qualTextRef = useRef(null);
  const qualMascotRef = useRef(null);
  const difTextRef = useRef(null);
  const difMascotRef = useRef(null);
  const hasAnimatedQual = useRef(false);
  const hasAnimatedDif = useRef(false);

  // Phase 1: Qualidade (0 → 0.5), Phase 2: Diferenciação (0.5 → 1)
  const isQualidade = p < 0.5;
  const qualidadeP = mapRange(p, 0, 0.5, 0, 1);
  const difP = mapRange(p, 0.5, 1, 0, 1);

  const qualidadeOpacity = isQualidade
    ? mapRange(qualidadeP, 0, 0.15, 0, 1) * mapRange(qualidadeP, 0.75, 1, 1, 0)
    : 0;
  const difOpacity = !isQualidade
    ? mapRange(difP, 0, 0.15, 0, 1) * mapRange(difP, 0.75, 1, 1, 0)
    : 0;

  // GSAP entrance for Qualidade
  useEffect(() => {
    if (!isActive || !isQualidade || hasAnimatedQual.current) return;
    hasAnimatedQual.current = true;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (qualTextRef.current) {
      tl.fromTo(qualTextRef.current,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 1.0 }
      );
    }
    if (qualMascotRef.current) {
      tl.fromTo(qualMascotRef.current,
        { opacity: 0, x: 80, rotate: 10 },
        { opacity: 1, x: 0, rotate: -5, duration: 1.2 },
        '-=0.6'
      );
    }
    return () => tl.kill();
  }, [isActive, isQualidade]);

  // GSAP entrance for Diferenciação
  useEffect(() => {
    if (!isActive || isQualidade || hasAnimatedDif.current) return;
    hasAnimatedDif.current = true;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (difMascotRef.current) {
      tl.fromTo(difMascotRef.current,
        { opacity: 0, x: -100 },
        { opacity: 1, x: -30, duration: 1.0 }
      );
    }
    if (difTextRef.current) {
      tl.fromTo(difTextRef.current,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 1.0 },
        '-=0.6'
      );
    }
    return () => tl.kill();
  }, [isActive, isQualidade]);

  useEffect(() => {
    if (!isActive) {
      hasAnimatedQual.current = false;
      hasAnimatedDif.current = false;
    }
  }, [isActive]);

  // Mascot animations driven by scroll
  const qualMascotRotate = mapRange(qualidadeP, 0, 0.4, 10, -5);
  const difMascotX = mapRange(difP, 0, 0.3, -100, -30);

  return (
    <div className="hero-act hero-act-four" style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      backgroundColor: '#FFFFFF',
      opacity: isActive ? 1 : 0,
      transition: 'opacity 0.4s ease',
      pointerEvents: isActive ? 'auto' : 'none',
    }}>
      <GreenRibbons opacity={1} />

      {/* ═══ QUALIDADE (Página 4) ═══ */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem 5%', gap: '4%',
        opacity: qualidadeOpacity,
      }}>
        {/* Texto esquerda */}
        <div ref={qualTextRef} style={{ flex: 1, maxWidth: '500px', opacity: 0 }}>
          <h2 style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 900, lineHeight: 1.05, margin: '0 0 1.5rem 0',
            background: 'linear-gradient(180deg, #66FF00 0%, #1A5C00 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Qualidade
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)',
            fontWeight: 400, color: '#333', lineHeight: 1.8, margin: 0,
          }}>
            Não criamos apenas sites. Construímos experiências digitais memoráveis.
            Unimos estratégia, engenharia e identidade visual para transformar
            ideias em produtos reais.
          </p>
        </div>

        {/* Mascote direita */}
        <div ref={qualMascotRef} style={{
          flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
          opacity: 0,
          transform: `rotate(${qualMascotRotate}deg)`,
        }}>
          <img src={isologo} alt="" style={{
            width: 'clamp(150px, 22vw, 320px)', height: 'auto',
            filter: 'drop-shadow(0 0 30px rgba(0,255,65,0.35))',
          }} />
        </div>
      </div>

      {/* ═══ DIFERENCIAÇÃO TÉCNICA (Página 5) ═══ */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem 5%', gap: '4%',
        opacity: difOpacity,
      }}>
        {/* Mascote esquerda (cortado) */}
        <div ref={difMascotRef} style={{
          flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center',
          overflow: 'hidden', position: 'relative',
          opacity: 0,
          transform: `translateX(${difMascotX}px)`,
        }}>
          <img src={isologo} alt="" style={{
            width: 'clamp(200px, 30vw, 450px)', height: 'auto',
            filter: 'drop-shadow(0 0 30px rgba(0,255,65,0.35))',
            marginLeft: '-15%',
          }} />
        </div>

        {/* Texto direita */}
        <div ref={difTextRef} style={{ flex: 1, maxWidth: '500px', opacity: 0 }}>
          <h2 style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: 900, lineHeight: 1.05, margin: '0 0 1.5rem 0',
            background: 'linear-gradient(180deg, #66FF00 0%, #1A5C00 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', textTransform: 'uppercase',
          }}>
            Diferenciação Técnica
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)',
            fontWeight: 400, color: '#333', lineHeight: 1.8, margin: 0,
          }}>
            Design sem engenharia é superfície. Engenharia sem design é invisível.
            Na Leovox, ambos são estrutura.
          </p>
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

export default ActFour;
