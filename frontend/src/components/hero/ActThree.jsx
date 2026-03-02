/**
 * ActThree.jsx — Ato 3: Revelação (Scroll 40% – 65%)
 * 
 * Após a aterrissagem, o visitante conhece o profissional por trás da marca.
 * Atmosfera clean, moderna e profissional com glassmorphism sobre fundo claro.
 * 
 * Elementos:
 * - Fundo off-white (#f5f5f7) com grain sutil e formas geométricas verdes
 * - Card glassmorphism central com foto + bio
 * - Mini-cards de métricas com contador animado
 * - Ícones de tecnologias flutuantes
 * - CTAs duplos (Ver Projetos + Me Contate)
 * 
 * @param {Object} props
 * @param {number} props.progress - Progresso normalizado do Ato 3 (0-1)
 * @param {boolean} props.isActive - Se o ato está visível/ativo
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import GlassCard, { GlassCardMini } from './GlassCard';
import TechOrbit from './TechOrbit';

import fotoLeonardo from '../../assets/FotoLeonardo.png';

/* ============================================================================
 * AnimatedCounter — Contador animado para métricas
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
      // Easing: ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numericEnd));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, isActive]);

  // Reset quando desativa
  useEffect(() => {
    if (!isActive) {
      hasAnimated.current = false;
      setCount(0);
    }
  }, [isActive]);

  return (
    <span className="hero-counter-value">
      {count}{suffix}
    </span>
  );
};

/* ============================================================================
 * DADOS DAS MÉTRICAS
 * ============================================================================ */
const METRICS = [
  { value: '50', suffix: '+', label: 'Projetos' },
  { value: '30', suffix: '+', label: 'Clientes' },
  { value: '4', suffix: '+', label: 'Anos' },
  { value: '', suffix: '', label: 'CIn/UFPE', isText: true, displayText: 'CIn' },
];

/* ============================================================================
 * ActThree — Componente Principal
 * ============================================================================ */
const ActThree = ({ progress = 0, isActive = true }) => {
  const p = Math.min(1, Math.max(0, progress));

  // Opacidades e transformações
  const cardOpacity = p < 0.1
    ? 0
    : p < 0.3
      ? (p - 0.1) / 0.2
      : p > 0.85
        ? Math.max(0, 1 - (p - 0.85) / 0.15)
        : 1;

  const cardTranslateY = p < 0.3
    ? 60 * (1 - Math.min(1, p / 0.3))
    : p > 0.85
      ? -40 * ((p - 0.85) / 0.15)
      : 0;

  const cardScale = p > 0.85
    ? 1 - (p - 0.85) / 0.15 * 0.15
    : 1;

  const metricsActive = p > 0.25 && p < 0.9;
  const techOrbitOpacity = p < 0.2
    ? 0
    : p < 0.4
      ? (p - 0.2) / 0.2
      : p > 0.85
        ? Math.max(0, 1 - (p - 0.85) / 0.15)
        : 1;

  const ctaOpacity = p < 0.4
    ? 0
    : p < 0.6
      ? (p - 0.4) / 0.2
      : p > 0.85
        ? Math.max(0, 1 - (p - 0.85) / 0.15)
        : 1;

  // Stagger para elementos do card
  const photoOpacity = p < 0.15 ? 0 : Math.min(1, (p - 0.15) / 0.15);
  const textOpacity = p < 0.2 ? 0 : Math.min(1, (p - 0.2) / 0.15);
  const metricsOpacity = p < 0.25 ? 0 : Math.min(1, (p - 0.25) / 0.15);

  const handleScrollToProjects = useCallback(() => {
    // Scroll para a seção de projetos (ExpertiseShowcase ou próxima seção)
    const projectsSection = document.querySelector('[data-section="projects"]') ||
      document.querySelector('.expertise-showcase') ||
      document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleScrollToContact = useCallback(() => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div
      className="hero-act hero-act-three"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: '#f5f5f7',
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      {/* Fundo: formas geométricas abstratas verdes */}
      <div className="hero-act-three-bg-shapes" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <svg
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <circle cx="200" cy="150" r="120" fill="rgba(0, 255, 65, 0.04)" />
          <circle cx="1000" cy="600" r="180" fill="rgba(0, 255, 65, 0.03)" />
          <rect x="800" y="100" width="200" height="200" rx="30" fill="rgba(0, 255, 65, 0.025)" transform="rotate(15 900 200)" />
          <polygon points="150,500 250,650 50,650" fill="rgba(0, 255, 65, 0.03)" />
          <circle cx="600" cy="400" r="250" fill="rgba(0, 255, 65, 0.015)" />
        </svg>
      </div>

      {/* Grain sutil */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.03,
          mixBlendMode: 'multiply',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Ícones de tecnologias flutuantes */}
      <TechOrbit variant="light" opacity={techOrbitOpacity} />

      {/* Card Glassmorphism Central */}
      <div
        className="hero-act-three-card-wrapper"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <GlassCard
          variant="light"
          className="hero-act-three-main-card"
          style={{
            maxWidth: '900px',
            width: '100%',
            padding: '2.5rem',
            opacity: cardOpacity,
            transform: `translateY(${cardTranslateY}px) scale(${cardScale})`,
            transition: 'transform 0.3s ease, opacity 0.3s ease',
          }}
        >
          <div className="hero-act-three-card-content">
            {/* Foto Leonardo (Esquerda) */}
            <div
              className="hero-act-three-photo"
              style={{
                opacity: photoOpacity,
                transition: 'opacity 0.5s ease',
              }}
            >
              <div className="hero-act-three-photo-frame">
                <img
                  src={fotoLeonardo}
                  alt="Leonardo Gonçalves"
                  className="hero-act-three-photo-img"
                  loading="lazy"
                />
                {/* Glow verde na borda da foto */}
                <div className="hero-act-three-photo-glow" />
              </div>
            </div>

            {/* Conteúdo Textual (Direita) */}
            <div
              className="hero-act-three-text"
              style={{
                opacity: textOpacity,
                transition: 'opacity 0.5s ease 0.1s',
              }}
            >
              <h2 className="hero-act-three-name">Leonardo Gonçalves</h2>
              <p className="hero-act-three-role">Desenvolvedor &amp; Designer</p>
              <p className="hero-act-three-bio">
                Estudante de Ciência da Computação no CIn/UFPE e designer gráfico
                freelancer há mais de 4 anos. Combino criatividade visual com
                engenharia de software para criar experiências digitais que
                conectam marcas ao seu público de forma impactante.
              </p>

              {/* Mini-cards de métricas */}
              <div
                className="hero-act-three-metrics"
                style={{
                  opacity: metricsOpacity,
                  transition: 'opacity 0.5s ease 0.2s',
                }}
              >
                {METRICS.map((metric, index) => (
                  <GlassCardMini
                    key={metric.label}
                    variant="light"
                    className="hero-act-three-metric-card"
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      minWidth: '100px',
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 0 20px rgba(0, 255, 65, 0.15)',
                    }}
                  >
                    <div className="hero-metric-value">
                      {metric.isText ? (
                        <span className="hero-counter-value">{metric.displayText}</span>
                      ) : (
                        <AnimatedCounter
                          end={metric.value}
                          suffix={metric.suffix}
                          isActive={metricsActive}
                        />
                      )}
                    </div>
                    <div className="hero-metric-label">{metric.label}</div>
                  </GlassCardMini>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* CTAs Duplos */}
        <div
          className="hero-act-three-ctas"
          style={{
            position: 'absolute',
            bottom: '12%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '1rem',
            zIndex: 6,
            opacity: ctaOpacity,
            transition: 'opacity 0.5s ease',
            pointerEvents: ctaOpacity > 0.5 ? 'auto' : 'none',
          }}
        >
          <button
            className="hero-cta-primary"
            onClick={handleScrollToProjects}
          >
            Ver Projetos
          </button>
          <button
            className="hero-cta-secondary"
            onClick={handleScrollToContact}
          >
            Me Contate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActThree;
