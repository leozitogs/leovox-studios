/**
 * ActEight.jsx — Ato 8: CTA Final + Encerramento (Scroll 86% – 100%)
 *
 * Ambiente escuro com grid de circuito. Nó de energia pulsante no centro,
 * CTA impactante para contato, links sociais, transição suave.
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import CircuitGrid from './CircuitGrid';

const mapRange = (value, inStart, inEnd, outStart, outEnd) => {
  const t = Math.max(0, Math.min(1, (value - inStart) / (inEnd - inStart)));
  return outStart + t * (outEnd - outStart);
};

/* ============================================================================
 * Social Icons — SVG inline
 * ============================================================================ */
const SocialIcon = ({ href, label, path, viewBox = '0 0 24 24', delay }) => {
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || !ref.current) return;
    hasAnimated.current = true;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 15, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: delay / 1000, ease: 'back.out(1.5)' }
    );
  }, [delay]);

  return (
    <a ref={ref} href={href} target="_blank" rel="noopener noreferrer"
      aria-label={label}
      style={{
        color: '#FFFFFF', opacity: 0,
        transition: 'color 0.3s ease, transform 0.3s ease, filter 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#00FF00';
        e.currentTarget.style.transform = 'scale(1.2)';
        e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(0, 255, 0, 0.5))';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#FFFFFF';
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.filter = 'none';
      }}
    >
      <svg viewBox={viewBox} width="24" height="24" fill="currentColor">
        <path d={path} />
      </svg>
    </a>
  );
};

/* ============================================================================
 * Energy Node — Nó de energia pulsante
 * ============================================================================ */
const EnergyNode = ({ intensity }) => (
  <div className="act-eight-energy-node" style={{
    position: 'absolute', top: '42%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '120px', height: '120px', borderRadius: '50%',
    background: `radial-gradient(circle, rgba(0,255,65,${0.15 * intensity}) 0%, rgba(0,255,65,${0.05 * intensity}) 40%, transparent 70%)`,
    zIndex: 2, pointerEvents: 'none',
    filter: 'blur(20px)',
    boxShadow: `0 0 ${30 * intensity}px rgba(0, 255, 65, ${0.3 * intensity}), 0 0 ${60 * intensity}px rgba(0, 255, 65, ${0.15 * intensity})`,
  }} />
);

const ActEight = ({ progress = 0, isActive = true }) => {
  const p = Math.min(1, Math.max(0, progress));
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef = useRef(null);
  const socialsRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isActive || hasAnimated.current) return;
    hasAnimated.current = true;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (titleRef.current) {
      tl.fromTo(titleRef.current,
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 }
      );
    }
    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      );
    }
    if (btnRef.current) {
      tl.fromTo(btnRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 },
        '-=0.4'
      );
    }

    return () => tl.kill();
  }, [isActive]);

  useEffect(() => {
    if (!isActive) hasAnimated.current = false;
  }, [isActive]);

  const contentOpacity = mapRange(p, 0, 0.15, 0, 1);
  const circuitIntensity = mapRange(p, 0, 0.5, 0.2, 0.4);
  const nodeIntensity = mapRange(p, 0, 0.4, 0.3, 1);

  return (
    <div className="hero-act hero-act-eight" style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      backgroundColor: '#0D0D0D',
      opacity: isActive ? 1 : 0,
      transition: 'opacity 0.4s ease',
      pointerEvents: isActive ? 'auto' : 'none',
    }}>
      {/* Circuit Grid */}
      <CircuitGrid opacity={circuitIntensity * 4} progress={1} />

      {/* Energy Node */}
      <EnergyNode intensity={nodeIntensity} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem', textAlign: 'center',
        opacity: contentOpacity,
      }}>
        <h2 ref={titleRef} style={{
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)',
          fontWeight: 900, color: '#FFFFFF',
          margin: '0 0 1rem 0', lineHeight: 1.1,
          opacity: 0,
          textShadow: '0 0 30px rgba(0, 255, 0, 0.3)',
        }}>
          Vamos construir algo{' '}
          <span style={{
            background: 'linear-gradient(135deg, #00FF00 0%, #66FF00 50%, #00CC33 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            extraordinário
          </span>
          ?
        </h2>

        <p ref={subtitleRef} style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.85rem, 1.3vw, 1.1rem)',
          fontWeight: 400, color: '#BDBDBD',
          maxWidth: '550px', lineHeight: 1.7,
          margin: '0 0 2.5rem 0', opacity: 0,
        }}>
          Acredito que a tecnologia é a ferramenta para materializar visões.
          Se você tem um desafio, uma ideia ou um projeto que precisa de um
          parceiro que una design e engenharia com maestria, estou pronto para a conversa.
        </p>

        <a ref={btnRef} href="#contact" className="act-eight-cta-btn" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
          fontWeight: 700, color: '#0D0D0D',
          background: 'linear-gradient(135deg, #00FF00 0%, #66FF00 100%)',
          padding: '0.9rem 2.5rem',
          borderRadius: '100px', border: 'none',
          textDecoration: 'none', cursor: 'pointer',
          boxShadow: '0 0 30px rgba(0, 255, 65, 0.3), 0 4px 15px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          opacity: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 255, 65, 0.5), 0 6px 20px rgba(0, 0, 0, 0.4)';
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 65, 0.3), 0 4px 15px rgba(0, 0, 0, 0.3)';
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
        }}
        >
          Entre em Contato
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>&rarr;</span>
        </a>

        {/* Social links */}
        <div ref={socialsRef} style={{
          display: 'flex', gap: '1.5rem',
          justifyContent: 'center', marginTop: '2rem',
        }}>
          <SocialIcon
            href="https://github.com/leozitogs"
            label="GitHub"
            delay={800}
            path="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
          <SocialIcon
            href="https://linkedin.com/in/leozitogs"
            label="LinkedIn"
            delay={950}
            path="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          />
          <SocialIcon
            href="https://instagram.com/leovoxstudios"
            label="Instagram"
            delay={1100}
            path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
          />
        </div>
      </div>

      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none',
        opacity: 0.08, mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '128px 128px',
      }} />
    </div>
  );
};

export default ActEight;
