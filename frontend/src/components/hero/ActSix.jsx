/**
 * ActSix.jsx — Ato 6: Sobre Mim + Transição Dark (Scroll 52% – 68%)
 *
 * Páginas 7-8 do PDF:
 * - Primeira metade: Card glassmorphism "Sobre Mim" com foto + bio (fundo branco)
 * - Segunda metade: Mesmo card flutuando sobre fundo que transiciona para escuro,
 *   grid de circuito aparecendo nos cantos
 */

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import fotoLeonardo from '../../assets/FotoLeonardo.png';
import CircuitGrid from './CircuitGrid';

const mapRange = (value, inStart, inEnd, outStart, outEnd) => {
  const t = Math.max(0, Math.min(1, (value - inStart) / (inEnd - inStart)));
  return outStart + t * (outEnd - outStart);
};

/* ============================================================================
 * AnimatedCounter
 * ============================================================================ */
const AnimatedCounter = ({ end, suffix = '', isActive = false }) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isActive || hasAnimated.current) return;
    hasAnimated.current = true;
    const duration = 2000;
    const startTime = Date.now();
    const numericEnd = parseInt(end, 10);
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numericEnd));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, isActive]);

  useEffect(() => {
    if (!isActive) { hasAnimated.current = false; setCount(0); }
  }, [isActive]);

  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{count}{suffix}</span>;
};

const METRICS = [
  { value: '50', suffix: '+', label: 'Projetos' },
  { value: '30', suffix: '+', label: 'Clientes' },
  { value: '4', suffix: '+', label: 'Anos' },
  { value: '', suffix: '', label: 'CIn/UFPE', isText: true, displayText: 'CIn' },
];

const GreenRibbons = ({ opacity }) => (
  <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity }}>
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="rg6a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#AAFF00" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#008800" stopOpacity="0.4" />
        </linearGradient>
        <filter id="rg6glow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M1220,-40 Q1360,110 1310,310 Q1260,510 1450,610"
        fill="none" stroke="url(#rg6a)" strokeWidth="50" strokeLinecap="round"
        filter="url(#rg6glow)" opacity="0.4" />
      <path d="M-40,710 Q160,510 110,360 Q60,210 210,60"
        fill="none" stroke="url(#rg6a)" strokeWidth="40" strokeLinecap="round"
        filter="url(#rg6glow)" opacity="0.3" />
    </svg>
  </div>
);

const ActSix = ({ progress = 0, isActive = true }) => {
  const p = Math.min(1, Math.max(0, progress));
  const cardRef = useRef(null);
  const hasAnimated = useRef(false);

  // Background transition: white → dark
  const darkProgress = mapRange(p, 0.5, 1.0, 0, 1);
  const bgR = Math.round(255 - darkProgress * (255 - 13));
  const bgG = Math.round(255 - darkProgress * (255 - 13));
  const bgB = Math.round(255 - darkProgress * (255 - 13));
  const bgColor = `rgb(${bgR}, ${bgG}, ${bgB})`;

  // Ribbons fade out as we go dark
  const ribbonOpacity = mapRange(p, 0.4, 0.7, 1, 0);

  // Circuit grid fades in
  const circuitOpacity = mapRange(p, 0.5, 0.8, 0, 0.8);
  const circuitProgress = mapRange(p, 0.5, 1.0, 0, 1);

  // Card animations
  const cardOpacity = mapRange(p, 0, 0.12, 0, 1) * mapRange(p, 0.88, 1, 1, 0);
  const cardY = mapRange(p, 0, 0.15, 60, 0) + mapRange(p, 0.88, 1, 0, -40);
  const cardScale = mapRange(p, 0.88, 1, 1, 0.92);

  // Text colors transition
  const isDark = darkProgress > 0.5;
  const nameColor = isDark ? '#FFFFFF' : '#1a1a1a';
  const roleColor = '#00cc33';
  const bioColor = isDark ? '#BDBDBD' : '#4a4a4a';
  const labelColor = isDark ? '#999' : '#6a6a6a';

  // Card glass style adapts
  const cardBg = isDark
    ? 'rgba(255, 255, 255, 0.06)'
    : 'rgba(255, 255, 255, 0.45)';
  const cardBorder = isDark
    ? '1px solid rgba(0, 255, 65, 0.2)'
    : '1px solid rgba(255, 255, 255, 0.6)';
  const cardShadow = isDark
    ? '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 65, 0.05)'
    : '0 8px 32px rgba(0, 0, 0, 0.08)';

  const metricsActive = p > 0.15 && p < 0.92 && isActive;

  // GSAP entrance
  useEffect(() => {
    if (!isActive || hasAnimated.current || !cardRef.current) return;
    hasAnimated.current = true;

    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 80, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
    );
  }, [isActive]);

  useEffect(() => {
    if (!isActive) hasAnimated.current = false;
  }, [isActive]);

  return (
    <div className="hero-act hero-act-six" style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      backgroundColor: bgColor,
      opacity: isActive ? 1 : 0,
      transition: 'opacity 0.4s ease',
      pointerEvents: isActive ? 'auto' : 'none',
    }}>
      {/* Ribbons (fade out in dark) */}
      <GreenRibbons opacity={ribbonOpacity} />

      {/* Circuit Grid (fade in for dark) */}
      <CircuitGrid opacity={circuitOpacity} progress={circuitProgress} />

      {/* Card Glassmorphism */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}>
        <div ref={cardRef} style={{
          maxWidth: '850px', width: '100%',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          borderRadius: '24px',
          background: cardBg,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: cardBorder,
          boxShadow: cardShadow,
          opacity: cardOpacity,
          transform: `translateY(${cardY}px) scale(${cardScale})`,
          transition: 'background 0.6s ease, border 0.6s ease, box-shadow 0.6s ease',
          willChange: 'transform, opacity',
        }}>
          <div style={{
            display: 'flex', gap: '2rem', alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            {/* Foto */}
            <div style={{ flexShrink: 0 }}>
              <div style={{
                position: 'relative',
                width: 'clamp(120px, 18vw, 200px)',
                height: 'clamp(120px, 18vw, 200px)',
                borderRadius: '24px', overflow: 'hidden',
              }}>
                <img src={fotoLeonardo} alt="Leonardo Gonçalves" style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center top',
                }} />
                <div style={{
                  position: 'absolute', inset: '-4px',
                  borderRadius: '28px',
                  border: '2px solid rgba(0, 255, 65, 0.3)',
                  boxShadow: '0 0 20px rgba(0, 255, 65, 0.15)',
                  pointerEvents: 'none',
                }} />
              </div>
            </div>

            {/* Texto */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h2 style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(1.3rem, 2.5vw, 2rem)',
                fontWeight: 800, color: nameColor, margin: '0 0 0.25rem 0',
                lineHeight: 1.2, transition: 'color 0.6s ease',
              }}>
                Leonardo Gonçalves
              </h2>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(0.8rem, 1.3vw, 1rem)',
                fontWeight: 500, color: roleColor, margin: '0 0 1rem 0',
                letterSpacing: '0.02em',
              }}>
                Desenvolvedor &amp; Designer
              </p>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)',
                fontWeight: 400, color: bioColor, lineHeight: 1.7,
                margin: '0 0 1.5rem 0', transition: 'color 0.6s ease',
              }}>
                Estudante de Ciência da Computação no CIn/UFPE e designer gráfico
                freelancer há mais de 4 anos. Combino criatividade visual com
                engenharia de software para criar experiências digitais que
                conectam marcas ao seu público de forma impactante.
              </p>

              {/* Métricas */}
              <div style={{
                display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
              }}>
                {METRICS.map((metric) => (
                  <div key={metric.label} style={{
                    flex: 1, minWidth: '70px',
                    padding: '0.75rem',
                    borderRadius: '16px',
                    background: isDark ? 'rgba(0,255,65,0.06)' : 'rgba(255,255,255,0.4)',
                    border: isDark ? '1px solid rgba(0,255,65,0.15)' : '1px solid rgba(255,255,255,0.6)',
                    textAlign: 'center',
                    transition: 'all 0.6s ease',
                  }}>
                    <div style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
                      fontWeight: 800, color: '#00cc33', lineHeight: 1.2,
                    }}>
                      {metric.isText ? metric.displayText : (
                        <AnimatedCounter
                          end={metric.value}
                          suffix={metric.suffix}
                          isActive={metricsActive}
                        />
                      )}
                    </div>
                    <div style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.65rem', fontWeight: 500,
                      color: labelColor, letterSpacing: '0.05em',
                      textTransform: 'uppercase', marginTop: '0.25rem',
                      transition: 'color 0.6s ease',
                    }}>
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none',
        opacity: 0.03 + darkProgress * 0.07,
        mixBlendMode: isDark ? 'overlay' : 'multiply',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '128px 128px',
      }} />
    </div>
  );
};

export default ActSix;
