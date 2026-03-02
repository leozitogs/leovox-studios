// Hero CINEMATOGRÁFICO com scroll REVERSÍVEL (bidirecional)
// Permite refazer a animação rolando para cima!
// v5 — "Nebula Viva": gradientes nativos CSS, grid tech, glow pulse
// v5.1 — Correção: --hero-bg-dark resetado ao reverter + hero-force-unlock
// v6 — Animação de entrada do Isologo (recriação fiel do vídeo Scene-1)

import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import {
  motion,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';

import isologo from '../assets/brand/Isologo.svg';
import leovoxType from '../assets/brand/Leovox_type.svg';
import leovox3D from '../assets/Leovox3D.png';
import portfolioName from '../assets/portfolio_name.svg';

import './HeroRefined.css';

/* ============================================================================
 * CONSTANTES DE ANIMAÇÃO DO ISOLOGO (extraídas do vídeo Scene-1)
 * ─────────────────────────────────────────────────────────────────
 * Vídeo: 4.033s, 30fps, 1280x720 (jitter.video)
 *
 * Fase 1 — Entrada (0.0s → 0.8s):
 *   scale(0) + rotate(-15°) → scale(1) + rotate(0°) + opacity 0→1
 *   Easing: cubic-bezier com overshoot (back-out)
 *
 * Fase 2 — Pulso dramático (0.8s → 2.5s):
 *   scale(1) → scale(~1.65) → scale(1) — efeito "heartbeat"
 *   Easing: ease-in-out suave
 *
 * Fase 3 — Repouso (2.5s → 4.0s):
 *   Logo estável em scale(1), glow verde sutil permanece
 * ============================================================================ */
const ENTRANCE_TIMING = {
  INITIAL_DELAY: 0.15,
  ENTRANCE_DURATION: 0.7,
  ENTRANCE_ROTATE: -15,
  PULSE_DELAY: 0.2,
  PULSE_DURATION: 1.6,
  PULSE_SCALE_PEAK: 1.65,
};

const ENTRANCE_EASING = {
  backOut: [0.34, 1.56, 0.64, 1],
  easeInOut: [0.42, 0, 0.58, 1],
};

/* ============================================================================
 * VARIANTES DE ANIMAÇÃO DO ISOLOGO (Framer Motion)
 * ============================================================================ */
const isologoEntranceVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
    rotate: ENTRANCE_TIMING.ENTRANCE_ROTATE,
  },
  entrance: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: ENTRANCE_TIMING.ENTRANCE_DURATION,
      delay: ENTRANCE_TIMING.INITIAL_DELAY,
      ease: ENTRANCE_EASING.backOut,
      opacity: {
        duration: ENTRANCE_TIMING.ENTRANCE_DURATION * 0.5,
        delay: ENTRANCE_TIMING.INITIAL_DELAY,
        ease: 'easeOut',
      },
    },
  },
  pulse: {
    opacity: 1,
    scale: [1, ENTRANCE_TIMING.PULSE_SCALE_PEAK, 1],
    rotate: 0,
    transition: {
      scale: {
        duration: ENTRANCE_TIMING.PULSE_DURATION,
        ease: ENTRANCE_EASING.easeInOut,
        times: [0, 0.45, 1],
      },
      opacity: { duration: 0 },
      rotate: { duration: 0 },
    },
  },
  idle: {
    opacity: 1,
    scale: 1,
    rotate: 0,
  },
  reducedMotion: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

/* ============================================================================
 * VARIANTES DO GLOW (efeito de brilho verde animado)
 * ============================================================================ */
const glowVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: [0, 0.6, 0.4],
    scale: [0.8, 1.1, 1],
    transition: {
      duration: 2.0,
      delay: ENTRANCE_TIMING.INITIAL_DELAY + ENTRANCE_TIMING.ENTRANCE_DURATION * 0.3,
      ease: ENTRANCE_EASING.easeInOut,
    },
  },
  breathing: {
    opacity: [0.4, 0.7, 0.4],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

const HeroRefined = () => {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // ============================================================================
  // ESTADO DA ANIMAÇÃO DE ENTRADA DO ISOLOGO
  // ============================================================================
  const [entrancePhase, setEntrancePhase] = useState('hidden');
  const [glowPhase, setGlowPhase] = useState('hidden');
  const [entranceComplete, setEntranceComplete] = useState(false);

  // ============================================================================
  // PROGRESSO VIRTUAL DE SCROLL (0 → 2) - BIDIRECIONAL
  // ============================================================================
  const scrollProgress = useMotionValue(0);
  const [isLocked, setIsLocked] = React.useState(true);

  const touchStartY = useRef(null);

  // ============================================================================
  // EFEITO PARALLAX COM MOUSE - CINEMATOGRÁFICO
  // ============================================================================
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((event) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  // ============================================================================
  // ANIMAÇÃO DE ENTRADA DO ISOLOGO (recriação do vídeo Scene-1)
  // ============================================================================
  useEffect(() => {
    if (prefersReducedMotion) {
      setEntrancePhase('reducedMotion');
      setGlowPhase('visible');
      setEntranceComplete(true);
      return;
    }

    // Fase 1: Entrada (scale-up + rotate + fade-in)
    setEntrancePhase('entrance');
    setGlowPhase('visible');

    // Fase 2: Pulso dramático (após a entrada completar)
    const pulseTimeout = setTimeout(() => {
      setEntrancePhase('pulse');
    }, (ENTRANCE_TIMING.INITIAL_DELAY + ENTRANCE_TIMING.ENTRANCE_DURATION + ENTRANCE_TIMING.PULSE_DELAY) * 1000);

    // Fase 3: Idle + breathing glow (após o pulso)
    const idleTimeout = setTimeout(() => {
      setEntrancePhase('idle');
      setEntranceComplete(true);
      setGlowPhase('breathing');
    }, (ENTRANCE_TIMING.INITIAL_DELAY + ENTRANCE_TIMING.ENTRANCE_DURATION + ENTRANCE_TIMING.PULSE_DELAY + ENTRANCE_TIMING.PULSE_DURATION) * 1000);

    return () => {
      clearTimeout(pulseTimeout);
      clearTimeout(idleTimeout);
    };
  }, [prefersReducedMotion]);

  // ============================================================================
  // TRAVA / LIBERA SCROLL DO BODY - DINÂMICO
  // ============================================================================
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isLocked]);

  // ✅ TRANSIÇÕES REVERSÍVEIS COM scrollProgress (1.0 → 2.0)
  const [transitionStarted, setTransitionStarted] = useState(false);

  // ============================================================================
  // LISTENER: hero-force-unlock
  // Escuta o evento customizado disparado pelo botão "ME CONTATE" do Header.
  // Quando o usuário clica no botão, o Header dispara este evento para forçar
  // o Hero a completar sua animação e liberar o scroll do body.
  // ============================================================================
  useEffect(() => {
    const handleForceUnlock = () => {
      // Completa a animação de entrada instantaneamente
      setEntrancePhase('idle');
      setEntranceComplete(true);
      setGlowPhase('breathing');

      // Completa a animação do Hero instantaneamente
      scrollProgress.set(2);
      setIsLocked(false);
      setTransitionStarted(true);

      // Força o estado visual final do Hero (fundo escuro completo)
      document.documentElement.style.setProperty('--hero-bg-dark', '1.00');

      const heroSticky = document.querySelector('.hero-refined-sticky');
      const particles = document.querySelector('.particles-refined-canvas');
      const bgTexture = document.querySelector('.background-texture');
      const spectralWrapper = document.querySelector('.hero-spectral-wrapper');
      const spectralVignette = document.querySelector('.hero-spectral-vignette');
      const spectralGrain = document.querySelector('.hero-spectral-grain');
      const textContainer = document.querySelector('.portfolio-text-transition-container');
      const logo3D = document.querySelector('.isologo-3d-layer');
      const leovoxTypeEl = document.querySelector('.leovox-type-layer');

      // Aplica o estado visual final (como se o scroll tivesse completado)
      if (heroSticky) heroSticky.style.backgroundColor = 'rgb(3, 3, 3)';
      if (particles) particles.style.opacity = '0';
      if (bgTexture) bgTexture.style.opacity = '1';
      if (spectralWrapper) spectralWrapper.style.opacity = '1';
      if (spectralVignette) spectralVignette.style.opacity = '1';
      if (spectralGrain) spectralGrain.style.opacity = String(0.18);
      if (textContainer) textContainer.style.opacity = '1';

      // Move logos para posição final
      const logoY = -window.innerHeight * 0.36;
      const logoScale = 1 - 0.62;
      if (logo3D) logo3D.style.transform = `translate(0, ${logoY}px) scale(${logoScale})`;
      if (leovoxTypeEl) leovoxTypeEl.style.transform = `translate(0, ${logoY}px) scale(${logoScale})`;
    };

    window.addEventListener('hero-force-unlock', handleForceUnlock);

    return () => {
      window.removeEventListener('hero-force-unlock', handleForceUnlock);
    };
  }, [scrollProgress]);

  useEffect(() => {
    const unsubscribe = scrollProgress.on('change', (latest) => {
      if (latest >= 1 && !transitionStarted) {
        setTransitionStarted(true);
      } else if (latest < 1 && transitionStarted) {
        setTransitionStarted(false);
      }
    });

    return () => unsubscribe();
  }, [scrollProgress, transitionStarted]);

  // ============================================================================
  // ✅ CORREÇÃO CRÍTICA: Resetar --hero-bg-dark quando transitionStarted volta a false
  // ============================================================================
  useEffect(() => {
    if (transitionStarted) return;

    // Reseta a CSS variable que o Header lê
    document.documentElement.style.setProperty('--hero-bg-dark', '0.00');

    // Restaura os estilos dos elementos que foram manipulados via DOM direto
    const heroSticky = document.querySelector('.hero-refined-sticky');
    const particles = document.querySelector('.particles-refined-canvas');
    const bgTexture = document.querySelector('.background-texture');
    const spectralWrapper = document.querySelector('.hero-spectral-wrapper');
    const spectralVignette = document.querySelector('.hero-spectral-vignette');
    const spectralGrain = document.querySelector('.hero-spectral-grain');
    const textContainer = document.querySelector('.portfolio-text-transition-container');
    const title = document.querySelector('.portfolio-title-transition');
    const desc = document.querySelector('.portfolio-desc-transition');
    const logo3D = document.querySelector('.isologo-3d-layer');
    const leovoxTypeEl = document.querySelector('.leovox-type-layer');

    if (heroSticky) heroSticky.style.backgroundColor = 'rgb(255, 255, 255)';
    if (particles) particles.style.opacity = '1';
    if (bgTexture) bgTexture.style.opacity = '0';
    if (spectralWrapper) spectralWrapper.style.opacity = '0';
    if (spectralVignette) spectralVignette.style.opacity = '0';
    if (spectralGrain) spectralGrain.style.opacity = '0';
    if (textContainer) textContainer.style.opacity = '0';
    if (title) {
      title.style.transform = 'translateY(100px)';
      title.style.opacity = '0';
    }
    if (desc) {
      desc.style.transform = 'translateY(80px)';
      desc.style.opacity = '0';
    }
    if (logo3D) logo3D.style.transform = '';
    if (leovoxTypeEl) leovoxTypeEl.style.transform = '';
  }, [transitionStarted]);

  // ============================================================================
  // ✅ Animações reversíveis usando scrollProgress (1.0 → 2.0)
  // v5: Background escurece para #030303 (mais profundo que o antigo #0a0a0a)
  // ============================================================================
  useEffect(() => {
    if (!transitionStarted) return;

    const logo3D = document.querySelector('.isologo-3d-layer');
    const leovoxTypeEl = document.querySelector('.leovox-type-layer');
    const particles = document.querySelector('.particles-refined-canvas');
    const bgTexture = document.querySelector('.background-texture');
    const heroSticky = document.querySelector('.hero-refined-sticky');
    const textContainer = document.querySelector('.portfolio-text-transition-container');
    const title = document.querySelector('.portfolio-title-transition');
    const desc = document.querySelector('.portfolio-desc-transition');

    // Camadas do background escuro "Nebula Viva"
    const spectralWrapper = document.querySelector('.hero-spectral-wrapper');
    const spectralVignette = document.querySelector('.hero-spectral-vignette');
    const spectralGrain = document.querySelector('.hero-spectral-grain');

    if (!logo3D || !leovoxTypeEl) return;

    const unsubscribe = scrollProgress.on('change', (latest) => {
      // Mapeia 1.0 → 2.0 para 0 → 1
      const progress = Math.max(0, Math.min(1, latest - 1));

      // ✅ Logos movem para TOPO CENTRALIZADO (0 → 0.5)
      const logoProgress = Math.min(1, progress / 0.5);
      const logoY = logoProgress * -window.innerHeight * 0.36;
      const logoScale = 1 - (logoProgress * 0.62);

      logo3D.style.transform = `translate(0, ${logoY}px) scale(${logoScale})`;
      leovoxTypeEl.style.transform = `translate(0, ${logoY}px) scale(${logoScale})`;

      // ✅ Partículas desaparecem (0 → 0.3)
      if (particles) {
        const particlesProgress = Math.min(1, progress / 0.3);
        particles.style.opacity = 1 - particlesProgress;
      }

      // ✅ Background escurece (0.1 → 0.6)
      // v5: escurece até rgb(3,3,3) — mais profundo para o conceito Nebula Viva
      if (heroSticky) {
        const bgProgress = Math.max(0, Math.min(1, (progress - 0.1) / 0.5));
        const r = Math.round(255 - (bgProgress * 252));
        const g = Math.round(255 - (bgProgress * 252));
        const b = Math.round(255 - (bgProgress * 252));
        heroSticky.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        
        document.documentElement.style.setProperty('--hero-bg-dark', bgProgress.toFixed(2));
      }

      // ✅ Background texture base
      if (bgTexture) {
        const textureProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.5));
        bgTexture.style.opacity = textureProgress;
      }

      // ✅ NEBULA WRAPPER — gradientes + grid + glow aparecem juntos
      // FIX: Aparece de 0.10 → 0.50 (começa mais cedo para acompanhar o escurecimento)
      if (spectralWrapper) {
        const wrapperProgress = Math.max(0, Math.min(1, (progress - 0.10) / 0.40));
        spectralWrapper.style.opacity = wrapperProgress;
      }

      // ✅ Vinheta escura — aparece cedo (0.15 → 0.50)
      if (spectralVignette) {
        const p = Math.max(0, Math.min(1, (progress - 0.15) / 0.35));
        spectralVignette.style.opacity = p;
      }

      // ✅ Grain animado — aparece gradualmente (0.35 → 0.75)
      // FIX: opacidade máxima aumentada para 0.18 para ser visível sobre fundo escuro
      if (spectralGrain) {
        const p = Math.max(0, Math.min(1, (progress - 0.35) / 0.40));
        spectralGrain.style.opacity = p * 0.18;
      }

      // ✅ Container de textos aparece (0.3 → 0.8)
      if (textContainer) {
        const containerProgress = Math.max(0, Math.min(1, (progress - 0.3) / 0.5));
        textContainer.style.opacity = containerProgress;
      }

      // ✅ Título aparece (0.4 → 0.9)
      if (title) {
        const titleProgress = Math.max(0, Math.min(1, (progress - 0.4) / 0.5));
        const titleY = (1 - titleProgress) * 100;
        title.style.transform = `translateY(${titleY}px)`;
        title.style.opacity = titleProgress;
      }

      // ✅ Descrição aparece (0.5 → 1.0)
      if (desc) {
        const descProgress = Math.max(0, Math.min(1, (progress - 0.5) / 0.5));
        const descY = (1 - descProgress) * 80;
        desc.style.transform = `translateY(${descY}px)`;
        desc.style.opacity = descProgress;
      }
    });

    return () => unsubscribe();
  }, [transitionStarted, scrollProgress]);

  // Libera scroll quando atinge 100%
  const unlockScroll = useCallback(() => {
    if (!isLocked) return;
    setIsLocked(false);
  }, [isLocked]);

  // Trava scroll quando volta abaixo de 100%
  const lockScroll = useCallback(() => {
    if (isLocked) return;
    setIsLocked(true);
  }, [isLocked]);

  const applyDelta = useCallback(
    (delta) => {
      const current = scrollProgress.get();
      const next = Math.min(2, Math.max(0, current + delta));

      scrollProgress.set(next);

      if (next >= 2 && isLocked) {
        unlockScroll();
      }
      
      if (current >= 2 && next < 2) {
        lockScroll();
      }
    },
    [scrollProgress, unlockScroll, lockScroll]
  );

  // ============================================================================
  // INPUT DE SCROLL COM MOUSE / TRACKPAD - BIDIRECIONAL
  // ============================================================================
  const handleWheel = useCallback(
    (event) => {
      const current = scrollProgress.get();

      if (!isLocked) {
        if (event.deltaY > 0) {
          return;
        }
        else {
          event.preventDefault();
          lockScroll();
          const delta = event.deltaY * 0.0012;
          applyDelta(delta);
        }
      }
      else {
        event.preventDefault();
        const delta = event.deltaY * 0.0012;
        applyDelta(delta);
      }
    },
    [isLocked, scrollProgress, applyDelta, lockScroll]
  );

  // ============================================================================
  // INPUT DE SCROLL EM TOUCH (MOBILE) - BIDIRECIONAL
  // ============================================================================
  const handleTouchStart = useCallback(
    (event) => {
      if (!event.touches || !event.touches[0]) return;
      touchStartY.current = event.touches[0].clientY;
    },
    []
  );

  const handleTouchMove = useCallback(
    (event) => {
      if (touchStartY.current == null) return;
      if (!event.touches || !event.touches[0]) return;

      const currentY = event.touches[0].clientY;
      const deltaY = touchStartY.current - currentY;

      const current = scrollProgress.get();

      if (!isLocked) {
        if (deltaY < 0) {
          return;
        }
        else {
          event.preventDefault();
          lockScroll();
          const normalized = (deltaY / window.innerHeight) * 0.8;
          applyDelta(normalized);
        }
      }
      else {
        event.preventDefault();
        const normalized = (deltaY / window.innerHeight) * 0.8;
        applyDelta(normalized);
      }
    },
    [isLocked, scrollProgress, applyDelta, lockScroll]
  );

  // ============================================================================
  // TRANSFORMAÇÕES ANIMADAS VIA FRAMER MOTION
  // ============================================================================

  // CAMADA 1: NOME LEOVOX SVG (ATRÁS - z-index 11)
  const leovoxTypeOpacity = useTransform(
    scrollProgress,
    [0, 0.1, 0.3, 0.5, 0.7, 0.85, 1],
    [0, 0.2, 0.5, 0.7, 0.85, 0.95, 1]
  );

  const leovoxTypeScale = useTransform(
    scrollProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [1.1, 1.06, 1.03, 1.01, 1]
  );

  const svgPathProgress = useTransform(
    scrollProgress,
    [0, 0.3, 0.6, 0.8, 1],
    [0, 0.3, 0.7, 0.9, 1]
  );

  // CAMADA 2: ISOLOGO 2D (INICIAL - z-index 12)
  // Nota: A opacidade e scale do scroll são aplicadas APENAS após a animação de entrada
  const isologo2DOpacity = useTransform(
    scrollProgress,
    [0, 0.15, 0.3, 0.5, 0.6, 0.7],
    [1, 0.9, 0.7, 0.4, 0.15, 0]
  );

  const isologo2DScale = useTransform(
    scrollProgress,
    [0, 0.2, 0.4, 0.6, 0.7],
    [1, 1.05, 1.1, 1.15, 1.2]
  );

  const isologo2DRotate = useTransform(
    scrollProgress,
    [0, 0.3, 0.5, 0.7],
    [0, -2, -5, -8]
  );

  // Parallax 2D — Desabilita quando scrollProgress >= 0.7
  const isologo2DParallaxX = useTransform(mouseX, [-1, 1], [-20, 20]);
  const isologo2DParallaxY = useTransform(mouseY, [-1, 1], [-15, 15]);

  // CAMADA 3: ISOLOGO 3D (NA FRENTE - z-index 13)
  const isologo3DOpacity = useTransform(
    scrollProgress,
    [0.6, 0.65, 0.75, 0.85, 0.95, 1],
    [0, 0.1, 0.4, 0.7, 0.95, 1]
  );

  const isologo3DScale = useTransform(
    scrollProgress,
    [0.6, 0.7, 0.8, 0.9, 0.95, 1],
    [0.7, 0.85, 0.95, 1.06, 1.02, 1]
  );

  const isologo3DY = useTransform(
    scrollProgress,
    [0.6, 0.7, 0.85, 0.95, 1],
    [60, 25, 5, -5, 0]
  );

  const isologo3DRotateZ = useTransform(
    scrollProgress,
    [0.6, 0.7, 0.85, 0.95, 1],
    [-12, -6, 2, 1, 0]
  );

  const isologo3DRotateY = useTransform(
    scrollProgress,
    [0.6, 0.7, 0.85, 0.95, 1],
    [20, 10, -2, -1, 0]
  );

  const isologo3DRotateX = useTransform(
    scrollProgress,
    [0.6, 0.75, 0.9, 1],
    [10, 5, 1, 0]
  );

  // Parallax 3D — Desabilita quando scrollProgress >= 1.0
  const isologo3DParallaxX = useTransform(
    [mouseX, scrollProgress],
    ([mx, sp]) => sp >= 1 ? 0 : mx * 25
  );
  const isologo3DParallaxY = useTransform(
    [mouseY, scrollProgress],
    ([my, sp]) => sp >= 1 ? 0 : my * 25
  );
  
  const isologo3DParallaxRotateY = useTransform(
    [mouseX, scrollProgress],
    ([mx, sp]) => sp >= 1 ? 0 : mx * 8
  );
  const isologo3DParallaxRotateX = useTransform(
    [mouseY, scrollProgress],
    ([my, sp]) => sp >= 1 ? 0 : -my * 8
  );

  // ============================================================================
  // PARTÍCULAS ORIGINAIS
  // ============================================================================
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log('Partículas refinadas carregadas!', container);
  }, []);

  const particlesOptions = useMemo(
    () => ({
      background: {},
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: 'push',
          },
          onHover: {
            enable: true,
            mode: 'repulse',
          },
        },
        modes: {
          push: {
            quantity: 2,
          },
          repulse: {
            distance: 120,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: '#00ff41',
        },
        collisions: {
          enable: true,
          mode: 'bounce',
        },
        links: {
          enable: false,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'bounce',
          },
          random: true,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 1200,
          },
          value: 40,
        },
        opacity: {
          value: { min: 0.3, max: 0.6 },
          random: true,
          animation: {
            enable: true,
            speed: 0.5,
            minimumValue: 0.2,
            sync: false,
          },
        },
        rotate: {
          value: { min: 0, max: 360 },
          random: true,
          direction: 'random',
          animation: {
            enable: true,
            speed: 3,
            sync: false,
          },
        },
        shape: {
          type: 'image',
          options: {
            image: [
              {
                src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDBmZjQxIiBzdHJva2Utd2lkdGg9IjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBvbHlnb24gcG9pbnRzPSIxMiwyIDE5LDEyIDEyLDIyIDUsMTIiLz48L3N2Zz4=',
                width: 24,
                height: 24,
              },
              {
                src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDBmZjQxIiBzdHJva2Utd2lkdGg9IjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOSIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiIGZpbGw9IiMwMGZmNDEiLz48L3N2Zz4=',
                width: 24,
                height: 24,
              },
              {
                src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDBmZjQxIiBzdHJva2Utd2lkdGg9IjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiByeD0iMiIvPjxyZWN0IHg9IjkiIHk9IjkiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiIGZpbGw9IiMwMGZmNDEiLz48L3N2Zz4=',
                width: 24,
                height: 24,
              },
              {
                src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDBmZjQxIiBzdHJva2Utd2lkdGg9IjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBvbHlnb24gcG9pbnRzPSIxMiwyIDE5LDggMTYsMTggOCwxOCA1LDgiLz48L3N2Zz4=',
                width: 24,
                height: 24,
              },
              {
                src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwZmY0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkw0IDE4SDIwTDEyIDJaIi8+PC9zdmc+',
                width: 24,
                height: 24,
              },
            ],
          },
        },
        size: {
          value: { min: 10, max: 18 },
          random: true,
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 8,
            sync: false,
          },
        },
      },
      detectRetina: true,
    }),
    []
  );

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <section
      className="hero-refined-container"
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseMove={handleMouseMove}
    >
      <div className="hero-refined-sticky">
        {/* Background texture (base — mantida para compatibilidade) */}
        <div className="background-texture" />

        {/* ✅ NEBULA VIVA v5: Background escuro premium */}
        <div className="hero-spectral-wrapper" />

        {/* Vinheta escura — continuidade com seção seguinte */}
        <div className="hero-spectral-vignette" />
        {/* Grain animado — textura de película cinematográfica */}
        <div className="hero-spectral-grain" />

        {/* Partículas ORIGINAIS */}
        <Particles
          id="tsparticles-refined"
          init={particlesInit}
          loaded={particlesLoaded}
          options={particlesOptions}
          className="particles-refined-canvas"
        />

        {/* Conteúdo do Hero */}
        <div className="hero-refined-content">
          {/* CAMADA 1: NOME LEOVOX SVG (ATRÁS - z-index 11) */}
          {!transitionStarted ? (
            <motion.div
              className="leovox-type-layer"
              style={{
                opacity: leovoxTypeOpacity,
                scale: leovoxTypeScale,
              }}
            >
              <motion.img
                src={leovoxType}
                alt="Leovox Typography"
                className="leovox-type-svg"
                style={{
                  '--svg-path-progress': svgPathProgress,
                }}
              />
            </motion.div>
          ) : (
            <div className="leovox-type-layer">
              <img
                src={leovoxType}
                alt="Leovox Typography"
                className="leovox-type-svg"
              />
            </div>
          )}

          {/* ============================================================
              CAMADA 2: ISOLOGO 2D (INICIAL - z-index 12)
              v6: Agora com animação de entrada (recriação do vídeo Scene-1)
              ─────────────────────────────────────────────────────────────
              Antes da animação de entrada completar:
                → Usa isologoEntranceVariants (scale/rotate/opacity animados)
              Após a animação de entrada completar:
                → Usa scroll-driven transforms (isologo2DOpacity, etc.)
              ============================================================ */}

          {/* Glow verde (camada de fundo da animação de entrada) */}
          <motion.div
            className="isologo-entrance-glow"
            variants={glowVariants}
            initial="hidden"
            animate={glowPhase}
            aria-hidden="true"
          />

          {!entranceComplete ? (
            /* Durante a animação de entrada: Framer Motion controla scale/rotate/opacity */
            <motion.div
              className="isologo-2d-layer"
              variants={isologoEntranceVariants}
              initial="hidden"
              animate={entrancePhase}
            >
              <img
                src={isologo}
                alt="Leovox Isologo"
                className="isologo-refined"
                draggable={false}
              />
            </motion.div>
          ) : (
            /* Após a entrada: scroll-driven transforms assumem o controle */
            <motion.div
              className="isologo-2d-layer"
              style={{
                opacity: isologo2DOpacity,
                scale: isologo2DScale,
                rotate: isologo2DRotate,
                x: isologo2DParallaxX,
                y: isologo2DParallaxY,
              }}
            >
              <img
                src={isologo}
                alt="Leovox Isologo"
                className="isologo-refined"
              />
            </motion.div>
          )}

          {/* CAMADA 3: ISOLOGO 3D (NA FRENTE - z-index 13) */}
          {!transitionStarted ? (
            <motion.div
              className="isologo-3d-layer"
              style={{
                opacity: isologo3DOpacity,
                scale: isologo3DScale,
                y: isologo3DY,
                x: isologo3DParallaxX,
                rotateZ: isologo3DRotateZ,
                rotateY: isologo3DRotateY,
                rotateX: isologo3DRotateX,
              }}
            >
              <motion.img
                src={leovox3D}
                alt="Leovox 3D"
                className="isologo-3d"
                style={{
                  y: isologo3DParallaxY,
                  rotateY: isologo3DParallaxRotateY,
                  rotateX: isologo3DParallaxRotateX,
                }}
              />
            </motion.div>
          ) : (
            <div className="isologo-3d-layer">
              <img
                src={leovox3D}
                alt="Leovox 3D"
                className="isologo-3d"
              />
            </div>
          )}

          {/* ✅ SVG PORTFOLIO NAME */}
          <div className="portfolio-text-transition-container">
            <img 
              src={portfolioName} 
              alt="Creative Portfolio Digital" 
              className="portfolio-name-svg"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroRefined;
