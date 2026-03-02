/**
 * ActOne.jsx — Ato 1: Ascensão (Scroll 0% – 25%)
 * 
 * O primeiro ato serve como hook visual poderoso. A cena apresenta um céu
 * com nuvens volumétricas (shader GLSL), e o emblema 3D da Leovox emerge
 * progressivamente das nuvens conforme o usuário faz scroll.
 * 
 * COREOGRAFIA DE SCROLL (progresso 0 → 1 dentro do Ato 1):
 * 
 * | Progresso | Evento                                                    |
 * |-----------|-----------------------------------------------------------|
 * | 0.00      | Céu com nuvens. Emblema invisível abaixo das nuvens.      |
 * | 0.00-0.10 | Glow verde pulsa no centro (antecipação).                 |
 * | 0.10-0.35 | Emblema emerge de baixo com scale-up + fade-in.           |
 * | 0.25-0.45 | Título "LEOVOX STUDIOS" aparece com fade acima.           |
 * | 0.35-0.55 | Tagline "Design. Código. Impacto." typewriter abaixo.     |
 * | 0.40-0.60 | Tech orbit icons aparecem com stagger.                    |
 * | 0.00-0.30 | Scroll indicator visível, depois desaparece.              |
 * | 0.75-1.00 | Tudo faz fade-out preparando para Ato 2.                  |
 * 
 * @param {Object} props
 * @param {number} props.progress - Progresso normalizado do Ato 1 (0-1)
 * @param {boolean} props.isActive - Se o ato está visível/ativo
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CloudsBackground from './CloudsBackground';
import EmblemViewer from './EmblemViewer';
import TechOrbit from './TechOrbit';

/* ============================================================================
 * CONSTANTES
 * ============================================================================ */
const TAGLINE = 'Design. Código. Impacto.';

/* ============================================================================
 * Utilitário: mapeia um valor de [inStart, inEnd] para [outStart, outEnd]
 * com clamp automático.
 * ============================================================================ */
const mapRange = (value, inStart, inEnd, outStart, outEnd) => {
  const t = Math.max(0, Math.min(1, (value - inStart) / (inEnd - inStart)));
  return outStart + t * (outEnd - outStart);
};

/* ============================================================================
 * TypewriterText — Efeito de digitação para a tagline
 * ============================================================================ */
const TypewriterText = ({ text, shouldStart, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!shouldStart || hasStarted) return;
    setHasStarted(true);

    let index = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 80);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [shouldStart, text, delay, hasStarted]);

  // Reset quando desativa
  useEffect(() => {
    if (!shouldStart) {
      setHasStarted(false);
      setDisplayedText('');
    }
  }, [shouldStart]);

  // Cursor blink
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className="hero-typewriter">
      {displayedText}
      <span
        className="hero-typewriter-cursor"
        style={{ opacity: cursorVisible ? 1 : 0 }}
      >
        |
      </span>
    </span>
  );
};

/* ============================================================================
 * ScrollIndicator — Seta pulsante na base
 * ============================================================================ */
const ScrollIndicator = ({ opacity }) => (
  <motion.div
    className="hero-scroll-indicator"
    style={{ opacity }}
    animate={{ y: [0, 8, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
  >
    <span className="hero-scroll-indicator-text">Descubra mais</span>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  </motion.div>
);

/* ============================================================================
 * ActOne — Componente Principal
 * ============================================================================ */
const ActOne = ({ progress = 0, isActive = true }) => {
  const p = Math.min(1, Math.max(0, progress));

  // ─── COREOGRAFIA DO EMBLEMA 3D ──────────────────────────────────────────
  // O emblema emerge de baixo (positionY negativo → 0) com scale-up e fade-in
  const emblemOpacity = mapRange(p, 0.10, 0.25, 0, 1) * mapRange(p, 0.75, 0.95, 1, 0);
  const emblemScale = mapRange(p, 0.10, 0.30, 0.4, 1.0) * mapRange(p, 0.80, 1.0, 1.0, 0.7);
  const emblemPositionY = mapRange(p, 0.10, 0.30, -1.5, 0.0) + mapRange(p, 0.80, 1.0, 0, 0.8);
  const emblemVisible = isActive && p > 0.05 && p < 0.98;

  // ─── COREOGRAFIA DO GLOW VERDE ──────────────────────────────────────────
  const glowOpacity = mapRange(p, 0.0, 0.10, 0, 0.8) * mapRange(p, 0.75, 0.95, 1, 0);
  const glowScale = mapRange(p, 0.0, 0.15, 0.3, 1.0);

  // ─── COREOGRAFIA DO TÍTULO ──────────────────────────────────────────────
  const titleOpacity = mapRange(p, 0.25, 0.40, 0, 1) * mapRange(p, 0.75, 0.90, 1, 0);
  const titleTranslateY = mapRange(p, 0.25, 0.40, -30, 0) + mapRange(p, 0.80, 1.0, 0, -20);

  // ─── COREOGRAFIA DA TAGLINE ─────────────────────────────────────────────
  const taglineOpacity = mapRange(p, 0.35, 0.50, 0, 1) * mapRange(p, 0.75, 0.90, 1, 0);
  const taglineTranslateY = mapRange(p, 0.35, 0.50, 30, 0) + mapRange(p, 0.80, 1.0, 0, 20);
  const taglineShouldStart = p > 0.38;

  // ─── COREOGRAFIA DO TECH ORBIT ──────────────────────────────────────────
  const techOrbitOpacity = mapRange(p, 0.40, 0.55, 0, 1) * mapRange(p, 0.75, 0.90, 1, 0);

  // ─── COREOGRAFIA DO SCROLL INDICATOR ────────────────────────────────────
  const scrollIndicatorOpacity = mapRange(p, 0.0, 0.05, 0, 0.8) * mapRange(p, 0.20, 0.35, 1, 0);

  // ─── COREOGRAFIA DAS NUVENS ─────────────────────────────────────────────
  // Nuvens fazem fade-out no final do ato para transição suave
  const cloudsFadeOut = mapRange(p, 0.80, 1.0, 0, 1);

  return (
    <div
      className="hero-act hero-act-one"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      {/* ═══ CAMADA 0: Céu com nuvens volumétricas ═══ */}
      <CloudsBackground fadeOut={cloudsFadeOut} />

      {/* ═══ CAMADA 1: Glow verde central (antecipação) ═══ */}
      <div
        className="hero-act-one-glow"
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${glowScale})`,
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0, 255, 65, 0.35) 0%, rgba(0, 255, 65, 0.12) 35%, transparent 65%)',
          opacity: glowOpacity,
          zIndex: 1,
          pointerEvents: 'none',
          filter: 'blur(25px)',
        }}
      />

      {/* ═══ CAMADA 2: Emblema 3D (emerge das nuvens) ═══ */}
      <EmblemViewer
        opacity={emblemOpacity}
        modelScale={emblemScale}
        positionY={emblemPositionY}
        autoRotate={true}
        visible={emblemVisible}
      />

      {/* ═══ CAMADA 3: Textos (título + tagline) ═══ */}
      <div
        className="hero-act-one-text-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* LEOVOX STUDIOS — acima do emblema */}
        <div
          className="hero-act-one-title-group"
          style={{
            opacity: titleOpacity,
            transform: `translateY(${-130 + titleTranslateY}px)`,
          }}
        >
          <h1 className="hero-act-one-title">
            <span className="hero-act-one-title-leovox">LEOVOX</span>
            <span className="hero-act-one-title-studios">STUDIOS</span>
          </h1>
        </div>

        {/* Tagline com typewriter — abaixo do emblema */}
        <div
          className="hero-act-one-tagline"
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${130 + taglineTranslateY}px)`,
          }}
        >
          <TypewriterText
            text={TAGLINE}
            shouldStart={taglineShouldStart}
            delay={200}
          />
        </div>
      </div>

      {/* ═══ CAMADA 4: Ícones de tecnologias orbitais ═══ */}
      <TechOrbit
        variant="sky"
        opacity={techOrbitOpacity}
      />

      {/* ═══ CAMADA 5: Indicador de scroll ═══ */}
      <ScrollIndicator opacity={scrollIndicatorOpacity} />
    </div>
  );
};

export default ActOne;
