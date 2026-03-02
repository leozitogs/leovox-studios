/**
 * HeroSection.jsx — Orquestrador Principal da Hero Section v2
 * "Das Nuvens à Realidade"
 * 
 * Componente raiz que gerencia a jornada cinematográfica em 5 atos,
 * controlada por scroll via GSAP ScrollTrigger. Substitui o HeroRefined.jsx
 * anterior mantendo total compatibilidade com App.jsx e HeaderLandoStyle.jsx.
 * 
 * Responsabilidades:
 * - Gerenciar o scroll virtual (0 → 1) via GSAP ScrollTrigger
 * - Calcular o progresso individual de cada ato
 * - Controlar a CSS variable --hero-bg-dark para o Header
 * - Gerenciar o lock/unlock do body scroll
 * - Escutar o evento 'hero-force-unlock' do Header
 * - Renderizar os 5 atos com transições suaves
 * 
 * Breakpoints dos Atos:
 * | Ato | Início | Fim   | Descrição       |
 * |-----|--------|-------|-----------------|
 * | 1   | 0.00   | 0.25  | Ascensão        |
 * | 2   | 0.25   | 0.40  | Descida         |
 * | 3   | 0.40   | 0.65  | Revelação       |
 * | 4   | 0.65   | 0.78  | Transformação   |
 * | 5   | 0.78   | 1.00  | Showcase        |
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ActOne from './ActOne';
import ActTwo from './ActTwo';
import ActThree from './ActThree';
import ActFour from './ActFour';
import ActFive from './ActFive';

import './HeroSection.css';

// Registrar plugin GSAP
gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
 * CONSTANTES DE CONFIGURAÇÃO
 * ============================================================================ */

/** Altura total do scroll trigger (em viewports) */
const TOTAL_SCROLL_HEIGHT = '500vh';

/** Breakpoints dos atos (início e fim normalizados 0-1) */
const ACT_BREAKPOINTS = {
  1: { start: 0.00, end: 0.25 },
  2: { start: 0.25, end: 0.40 },
  3: { start: 0.40, end: 0.65 },
  4: { start: 0.65, end: 0.78 },
  5: { start: 0.78, end: 1.00 },
};

/** Mapeamento de progresso global → --hero-bg-dark (para o Header) */
const getHeroBgDark = (progress) => {
  // Atos 1-2: fundo claro (0)
  // Ato 3: fundo claro (0)
  // Ato 4: transição (0 → 1)
  // Ato 5: fundo escuro (1)
  if (progress < 0.65) return 0;
  if (progress > 0.78) return 1;
  // Transição linear durante o Ato 4
  return (progress - 0.65) / (0.78 - 0.65);
};

/* ============================================================================
 * Utilitário: calcula o progresso local de um ato dado o progresso global
 * ============================================================================ */
const getActProgress = (globalProgress, actNumber) => {
  const bp = ACT_BREAKPOINTS[actNumber];
  if (!bp) return 0;
  if (globalProgress < bp.start) return 0;
  if (globalProgress > bp.end) return 1;
  return (globalProgress - bp.start) / (bp.end - bp.start);
};

/* ============================================================================
 * Utilitário: determina qual ato está ativo
 * ============================================================================ */
const getActiveAct = (globalProgress) => {
  for (let act = 5; act >= 1; act--) {
    if (globalProgress >= ACT_BREAKPOINTS[act].start) return act;
  }
  return 1;
};

/* ============================================================================
 * HeroSection — Componente Principal
 * ============================================================================ */
const HeroSection = () => {
  const sectionRef = useRef(null);
  const pinnedRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const progressRef = useRef(0);

  // ──────────────────────────────────────────────────────────────────────────
  // GSAP ScrollTrigger Setup
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const pinned = pinnedRef.current;
    if (!section || !pinned) return;

    // ScrollTrigger que pina o conteúdo e mapeia scroll → progresso
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      pin: pinned,
      pinSpacing: false,
      scrub: 0.8, // Suavização do scroll
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;
        setProgress(p);

        // Atualizar CSS variable para o Header
        const bgDark = getHeroBgDark(p);
        document.documentElement.style.setProperty('--hero-bg-dark', bgDark.toFixed(3));
      },
      onLeave: () => {
        setIsLocked(false);
        document.documentElement.style.setProperty('--hero-bg-dark', '1');
      },
      onEnterBack: () => {
        setIsLocked(true);
      },
      onLeaveBack: () => {
        document.documentElement.style.setProperty('--hero-bg-dark', '0');
      },
    });

    scrollTriggerRef.current = trigger;

    // Inicializar --hero-bg-dark
    document.documentElement.style.setProperty('--hero-bg-dark', '0');

    return () => {
      trigger.kill();
      document.documentElement.style.removeProperty('--hero-bg-dark');
    };
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // Escutar evento 'hero-force-unlock' do Header
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleForceUnlock = () => {
      setIsLocked(false);
      document.body.style.overflow = '';

      // Scroll para o final da hero section
      if (scrollTriggerRef.current) {
        const endPos = scrollTriggerRef.current.end;
        window.scrollTo({ top: endPos + 1, behavior: 'instant' });
      }

      document.documentElement.style.setProperty('--hero-bg-dark', '1');
    };

    window.addEventListener('hero-force-unlock', handleForceUnlock);
    return () => window.removeEventListener('hero-force-unlock', handleForceUnlock);
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // Cálculos derivados do progresso
  // ──────────────────────────────────────────────────────────────────────────
  const activeAct = useMemo(() => getActiveAct(progress), [progress]);

  const actProgresses = useMemo(() => ({
    1: getActProgress(progress, 1),
    2: getActProgress(progress, 2),
    3: getActProgress(progress, 3),
    4: getActProgress(progress, 4),
    5: getActProgress(progress, 5),
  }), [progress]);

  // Determinar quais atos renderizar (ato ativo + adjacentes para transição)
  const shouldRender = useMemo(() => ({
    1: activeAct <= 2,
    2: activeAct >= 1 && activeAct <= 3,
    3: activeAct >= 2 && activeAct <= 4,
    4: activeAct >= 3 && activeAct <= 5,
    5: activeAct >= 4,
  }), [activeAct]);

  return (
    <section
      ref={sectionRef}
      className="hero-section-v2"
      id="hero"
      style={{ height: TOTAL_SCROLL_HEIGHT }}
    >
      {/* Container pinado que ocupa 100vh */}
      <div
        ref={pinnedRef}
        className="hero-section-v2-pinned"
      >
        {/* ════════════════════════════════════════════════════════════════════
            ATO 1: ASCENSÃO (0% – 25%)
            Céu com nuvens volumétricas + emblema 3D + textos orbitais
            ════════════════════════════════════════════════════════════════════ */}
        {shouldRender[1] && (
          <ActOne
            progress={actProgresses[1]}
            isActive={activeAct === 1}
          />
        )}

        {/* ════════════════════════════════════════════════════════════════════
            ATO 2: DESCIDA (25% – 40%)
            Transição cinematográfica céu → claridade
            ════════════════════════════════════════════════════════════════════ */}
        {shouldRender[2] && (
          <ActTwo
            progress={actProgresses[2]}
            isActive={activeAct === 2}
          />
        )}

        {/* ════════════════════════════════════════════════════════════════════
            ATO 3: REVELAÇÃO (40% – 65%)
            Sobre Mim com glassmorphism
            ════════════════════════════════════════════════════════════════════ */}
        {shouldRender[3] && (
          <ActThree
            progress={actProgresses[3]}
            isActive={activeAct === 3}
          />
        )}

        {/* ════════════════════════════════════════════════════════════════════
            ATO 4: TRANSFORMAÇÃO (65% – 78%)
            Light to dark transition
            ════════════════════════════════════════════════════════════════════ */}
        {shouldRender[4] && (
          <ActFour
            progress={actProgresses[4]}
            isActive={activeAct === 4}
          />
        )}

        {/* ════════════════════════════════════════════════════════════════════
            ATO 5: SHOWCASE (78% – 100%)
            Projetos + encerramento
            ════════════════════════════════════════════════════════════════════ */}
        {shouldRender[5] && (
          <ActFive
            progress={actProgresses[5]}
            isActive={activeAct === 5}
          />
        )}

        {/* ════════════════════════════════════════════════════════════════════
            DEBUG OVERLAY (remover em produção)
            ════════════════════════════════════════════════════════════════════ */}
        {process.env.NODE_ENV === 'development' && (
          <div className="hero-debug-overlay">
            <span>Ato {activeAct}</span>
            <span>{(progress * 100).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
