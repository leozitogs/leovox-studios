/**
 * ActSeven.jsx — Ato 7: Estudo de Caso Leovox (Scroll 68% – 86%)
 *
 * Seção escura com 3 cards dark glassmorphism:
 * Card 1 — "Dualidade na Identidade" (Branding) — slide da esquerda
 * Card 2 — "O Coração da Marca" (Mascote) — slide da direita
 * Card 3 — "Narrativa de Dois Atos" (UI/UX) — slide da esquerda
 *
 * Mockups da Leovox como imagens dos cards.
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import CircuitGrid from './CircuitGrid';

// Mockups
import cartaoImg from '../../assets/leovox-mockups/CartaoLeovox.png';
import leovoxImg from '../../assets/leovox-mockups/Leovox.png';
import browserImg from '../../assets/leovox-mockups/BrowserLeovox.png';

const mapRange = (value, inStart, inEnd, outStart, outEnd) => {
  const t = Math.max(0, Math.min(1, (value - inStart) / (inEnd - inStart)));
  return outStart + t * (outEnd - outStart);
};

/* ============================================================================
 * DarkGlassCard — Card dark glassmorphism reutilizável
 * ============================================================================ */
const DarkGlassCard = ({ image, title, description, tags, direction, delay, isVisible }) => {
  const cardRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current || !cardRef.current) return;
    hasAnimated.current = true;

    const fromX = direction === 'left' ? -80 : 80;
    gsap.fromTo(cardRef.current,
      { opacity: 0, x: fromX, scale: 0.95, rotateY: direction === 'left' ? -5 : 5 },
      {
        opacity: 1, x: 0, scale: 1, rotateY: 0,
        duration: 1.0,
        delay: delay / 1000,
        ease: 'power3.out',
      }
    );
  }, [isVisible, direction, delay]);

  useEffect(() => {
    if (!isVisible) hasAnimated.current = false;
  }, [isVisible]);

  return (
    <div ref={cardRef} style={{
      width: '100%',
      maxWidth: '380px',
      borderRadius: '16px',
      overflow: 'hidden',
      background: 'rgba(26, 26, 26, 0.60)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(0, 255, 65, 0.20)',
      boxShadow: 'inset 0 0 10px rgba(0, 255, 65, 0.05), 0 4px 30px rgba(0, 0, 0, 0.4)',
      opacity: 0,
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
      cursor: 'pointer',
      flexShrink: 0,
      perspective: '1000px',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'rgba(0, 255, 65, 0.50)';
      e.currentTarget.style.boxShadow = 'inset 0 0 15px rgba(0, 255, 65, 0.08), 0 8px 40px rgba(0, 0, 0, 0.5), 0 0 35px rgba(0, 255, 65, 0.12)';
      e.currentTarget.style.transform = 'translateY(-8px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'rgba(0, 255, 65, 0.20)';
      e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(0, 255, 65, 0.05), 0 4px 30px rgba(0, 0, 0, 0.4)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      {/* Imagem */}
      <div style={{
        width: '100%', aspectRatio: '16 / 10',
        overflow: 'hidden', position: 'relative',
      }}>
        <img src={image} alt={title} style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.5s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(26,26,26,0.8) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        <h3 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
          fontWeight: 700, color: '#FFFFFF',
          margin: '0 0 0.6rem 0', lineHeight: 1.3,
        }}>
          {title}
        </h3>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.75rem, 1vw, 0.85rem)',
          fontWeight: 400, color: '#BDBDBD',
          lineHeight: 1.7, margin: '0 0 1rem 0',
        }}>
          {description}
        </p>

        {/* Tags */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.4rem',
          marginBottom: '1rem',
        }}>
          {tags.map((tag) => (
            <span key={tag} style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.65rem', fontWeight: 500,
              color: '#66FF66',
              padding: '0.2rem 0.6rem',
              borderRadius: '100px',
              background: 'rgba(0, 255, 65, 0.08)',
              border: '1px solid rgba(0, 255, 65, 0.15)',
              letterSpacing: '0.02em',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Botão */}
        <button style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.8rem', fontWeight: 600,
          color: '#00FF00', background: 'transparent',
          border: 'none', cursor: 'pointer',
          padding: '0.4rem 0', letterSpacing: '0.02em',
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          transition: 'gap 0.3s ease, color 0.3s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.gap = '0.8rem'; e.currentTarget.style.color = '#66FF66'; }}
        onMouseLeave={(e) => { e.currentTarget.style.gap = '0.4rem'; e.currentTarget.style.color = '#00FF00'; }}
        >
          Ver Detalhes
          <span style={{ fontSize: '1rem', lineHeight: 1 }}>&rarr;</span>
        </button>
      </div>
    </div>
  );
};

/* ============================================================================
 * CARDS DATA
 * ============================================================================ */
const CARDS = [
  {
    image: cartaoImg,
    title: 'Dualidade na Identidade',
    description: 'A tipografia grunge do logo principal transmite criatividade e energia, enquanto o monograma \'LVX\' oferece uma assinatura técnica e minimalista. A dualidade representa a união fundamental entre arte e código.',
    tags: ['Branding', 'Identidade Visual', 'Tipografia'],
    direction: 'left',
    delay: 0,
  },
  {
    image: leovoxImg,
    title: 'O Coração da Marca',
    description: 'O mascote é a personificação da Leovox. Com um estilo que mescla o 3D e o 2D, ele serve como um guia carismático através da jornada do usuário, criando um ponto de conexão memorável e moderno.',
    tags: ['Ilustração Vetorial', 'Motion Design', 'Blender'],
    direction: 'right',
    delay: 300,
  },
  {
    image: browserImg,
    title: 'Narrativa de Dois Atos',
    description: 'A experiência foi dividida em dois atos. O \'Ato Claro\' introduz a marca com energia vibrante e formas orgânicas. O \'Ato Escuro\' mergulha o usuário em um ambiente técnico, focado em projetos e resultados.',
    tags: ['UI/UX Design', 'Animação de Scroll', 'Three.js'],
    direction: 'left',
    delay: 600,
  },
];

/* ============================================================================
 * ActSeven — Componente Principal
 * ============================================================================ */
const ActSeven = ({ progress = 0, isActive = true }) => {
  const p = Math.min(1, Math.max(0, progress));
  const titleRef = useRef(null);
  const introRef = useRef(null);
  const hasAnimated = useRef(false);

  // Title animation
  useEffect(() => {
    if (!isActive || hasAnimated.current) return;
    hasAnimated.current = true;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (titleRef.current) {
      tl.fromTo(titleRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0 }
      );
    }
    if (introRef.current) {
      tl.fromTo(introRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      );
    }

    return () => tl.kill();
  }, [isActive]);

  useEffect(() => {
    if (!isActive) hasAnimated.current = false;
  }, [isActive]);

  const contentOpacity = mapRange(p, 0, 0.1, 0, 1) * mapRange(p, 0.9, 1, 1, 0);
  const circuitGlow = mapRange(p, 0, 0.5, 0.15, 0.35);
  const cardsVisible = p > 0.12 && isActive;

  return (
    <div className="hero-act hero-act-seven" style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      backgroundColor: '#0D0D0D',
      opacity: isActive ? 1 : 0,
      transition: 'opacity 0.4s ease',
      pointerEvents: isActive ? 'auto' : 'none',
    }}>
      {/* Circuit Grid */}
      <CircuitGrid opacity={circuitGlow * 4} progress={1} />

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%',
        transform: 'translateX(-50%)',
        width: '600px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,255,65,0.04) 0%, transparent 70%)',
        zIndex: 2, pointerEvents: 'none', filter: 'blur(40px)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-start',
        padding: 'clamp(4rem, 8vh, 6rem) 2rem 2rem',
        opacity: contentOpacity,
        overflowY: 'auto',
      }}>
        {/* Título */}
        <h2 ref={titleRef} style={{
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
          fontWeight: 800, color: '#FFFFFF',
          textAlign: 'center', margin: '0 0 0.5rem 0',
          lineHeight: 1.2, opacity: 0,
          textShadow: '0 0 20px rgba(0, 255, 0, 0.5), 0 0 40px rgba(0, 255, 0, 0.2)',
        }}>
          Estudo de Caso: <span style={{
            color: '#00FF00',
            textShadow: '0 0 20px rgba(0, 255, 0, 0.6), 0 0 40px rgba(0, 255, 0, 0.3)',
          }}>Leovox</span>
        </h2>

        {/* Parágrafo introdutório */}
        <p ref={introRef} style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.8rem, 1.1vw, 1rem)',
          fontWeight: 400, color: '#BDBDBD',
          textAlign: 'center', maxWidth: '650px',
          lineHeight: 1.7, margin: '0.75rem auto 2.5rem auto',
          opacity: 0,
        }}>
          O primeiro projeto em destaque é a própria fundação deste espaço. Uma identidade
          visual e uma experiência digital que encapsulam a fusão entre design criativo e
          engenharia robusta — a filosofia Leovox em ação.
        </p>

        {/* Cards */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center', gap: '1.5rem',
          maxWidth: '1200px', width: '100%',
        }}>
          {CARDS.map((card) => (
            <DarkGlassCard
              key={card.title}
              {...card}
              isVisible={cardsVisible}
            />
          ))}
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

export default ActSeven;
