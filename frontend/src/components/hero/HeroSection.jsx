/**
 * HeroSection.jsx — Orquestrador Principal da Hero Section v3
 * "Jornada Cinematográfica Leovox"
 *
 * Refatorado para seguir fielmente o PDF "Design de Interface" (9 páginas).
 * 8 atos controlados por GSAP ScrollTrigger com animações cinematográficas.
 *
 * Breakpoints dos Atos:
 * | Ato | Início | Fim   | Descrição                              |
 * |-----|--------|-------|----------------------------------------|
 * | 1   | 0.00   | 0.10  | Hero Landing (título + mascote + CTA)  |
 * | 2   | 0.10   | 0.18  | Mascote Zoom-In                        |
 * | 3   | 0.18   | 0.26  | Mascote + LVX atrás (garras)           |
 * | 4   | 0.26   | 0.42  | Qualidade + Diferenciação Técnica      |
 * | 5   | 0.42   | 0.52  | Competências Técnicas                  |
 * | 6   | 0.52   | 0.68  | Sobre Mim + Transição Dark             |
 * | 7   | 0.68   | 0.86  | Estudo de Caso Leovox (3 cards)        |
 * | 8   | 0.86   | 1.00  | CTA Final + Encerramento               |
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ActOne from './ActOne';
import ActTwo from './ActTwo';
import ActThree from './ActThree';
import ActFour from './ActFour';
import ActFive from './ActFive';
import ActSix from './ActSix';
import ActSeven from './ActSeven';
import ActEight from './ActEight';

import './HeroSection.css';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
 * CONSTANTES
 * ============================================================================ */
const TOTAL_SCROLL_HEIGHT = '800vh';

const ACT_BREAKPOINTS = {
  1: { start: 0.00, end: 0.10 },
  2: { start: 0.10, end: 0.18 },
  3: { start: 0.18, end: 0.26 },
  4: { start: 0.26, end: 0.42 },
  5: { start: 0.42, end: 0.52 },
  6: { start: 0.52, end: 0.68 },
  7: { start: 0.68, end: 0.86 },
  8: { start: 0.86, end: 1.00 },
};

const getHeroBgDark = (progress) => {
  // Atos 1-5: fundo claro (0)
  // Ato 6 segunda metade: transição (0 → 1)
  // Atos 7-8: fundo escuro (1)
  if (progress < 0.60) return 0;
  if (progress > 0.68) return 1;
  return (progress - 0.60) / (0.68 - 0.60);
};

const getActProgress = (globalProgress, actNumber) => {
  const bp = ACT_BREAKPOINTS[actNumber];
  if (!bp) return 0;
  if (globalProgress < bp.start) return 0;
  if (globalProgress > bp.end) return 1;
  return (globalProgress - bp.start) / (bp.end - bp.start);
};

const getActiveAct = (globalProgress) => {
  for (let act = 8; act >= 1; act--) {
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
  const progressRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const pinned = pinnedRef.current;
    if (!section || !pinned) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      pin: pinned,
      pinSpacing: false,
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;
        setProgress(p);
        const bgDark = getHeroBgDark(p);
        document.documentElement.style.setProperty('--hero-bg-dark', bgDark.toFixed(3));
      },
      onLeave: () => {
        document.documentElement.style.setProperty('--hero-bg-dark', '1');
      },
      onLeaveBack: () => {
        document.documentElement.style.setProperty('--hero-bg-dark', '0');
      },
    });

    scrollTriggerRef.current = trigger;
    document.documentElement.style.setProperty('--hero-bg-dark', '0');

    return () => {
      trigger.kill();
      document.documentElement.style.removeProperty('--hero-bg-dark');
    };
  }, []);

  // Escutar evento 'hero-force-unlock' do Header
  useEffect(() => {
    const handleForceUnlock = () => {
      document.body.style.overflow = '';
      if (scrollTriggerRef.current) {
        const endPos = scrollTriggerRef.current.end;
        window.scrollTo({ top: endPos + 1, behavior: 'instant' });
      }
      document.documentElement.style.setProperty('--hero-bg-dark', '1');
    };
    window.addEventListener('hero-force-unlock', handleForceUnlock);
    return () => window.removeEventListener('hero-force-unlock', handleForceUnlock);
  }, []);

  const activeAct = useMemo(() => getActiveAct(progress), [progress]);

  const actProgresses = useMemo(() => ({
    1: getActProgress(progress, 1),
    2: getActProgress(progress, 2),
    3: getActProgress(progress, 3),
    4: getActProgress(progress, 4),
    5: getActProgress(progress, 5),
    6: getActProgress(progress, 6),
    7: getActProgress(progress, 7),
    8: getActProgress(progress, 8),
  }), [progress]);

  const shouldRender = useMemo(() => ({
    1: activeAct <= 2,
    2: activeAct >= 1 && activeAct <= 3,
    3: activeAct >= 2 && activeAct <= 4,
    4: activeAct >= 3 && activeAct <= 5,
    5: activeAct >= 4 && activeAct <= 6,
    6: activeAct >= 5 && activeAct <= 7,
    7: activeAct >= 6 && activeAct <= 8,
    8: activeAct >= 7,
  }), [activeAct]);

  return (
    <section
      ref={sectionRef}
      className="hero-section-v2"
      id="hero"
      style={{ height: TOTAL_SCROLL_HEIGHT }}
    >
      <div ref={pinnedRef} className="hero-section-v2-pinned">
        {/* ATO 1: Hero Landing */}
        {shouldRender[1] && (
          <ActOne progress={actProgresses[1]} isActive={activeAct === 1} />
        )}

        {/* ATO 2: Mascote Zoom */}
        {shouldRender[2] && (
          <ActTwo progress={actProgresses[2]} isActive={activeAct === 2} />
        )}

        {/* ATO 3: Mascote + LVX */}
        {shouldRender[3] && (
          <ActThree progress={actProgresses[3]} isActive={activeAct === 3} />
        )}

        {/* ATO 4: Qualidade + Diferenciação */}
        {shouldRender[4] && (
          <ActFour progress={actProgresses[4]} isActive={activeAct === 4} />
        )}

        {/* ATO 5: Competências Técnicas */}
        {shouldRender[5] && (
          <ActFive progress={actProgresses[5]} isActive={activeAct === 5} />
        )}

        {/* ATO 6: Sobre Mim + Transição Dark */}
        {shouldRender[6] && (
          <ActSix progress={actProgresses[6]} isActive={activeAct === 6} />
        )}

        {/* ATO 7: Estudo de Caso Leovox */}
        {shouldRender[7] && (
          <ActSeven progress={actProgresses[7]} isActive={activeAct === 7} />
        )}

        {/* ATO 8: CTA Final */}
        {shouldRender[8] && (
          <ActEight progress={actProgresses[8]} isActive={activeAct === 8} />
        )}

        {/* DEBUG */}
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
