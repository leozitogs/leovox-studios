/* HeroRefined.jsx */
// Hero CINEMATOGRÁFICO com scroll REVERSÍVEL (bidirecional)
// Permite refazer a animação rolando para cima!

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
} from 'framer-motion';

import isologo from '../assets/brand/Isologo.svg';
import leovoxType from '../assets/brand/Leovox_type.svg';
import leovox3D from '../assets/Leovox3D.png';
import portfolioName from '../assets/portfolio_name.svg';

import './HeroRefined.css';
// ✅ GSAP não é mais necessário - usando scrollProgress customizado

const HeroRefined = () => {
  const containerRef = useRef(null);

  // ============================================================================
  // PROGRESSO VIRTUAL DE SCROLL (0 → 1) - BIDIRECIONAL
  // Agora permite voltar para 0!
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
    
    // Normaliza posição do mouse (-1 a 1)
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

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

  // ✅ NOVO: TRANSIÇÕES REVERSÍVEIS COM scrollProgress (1.0 → 2.0)
  const [transitionStarted, setTransitionStarted] = useState(false);

  useEffect(() => {
    // Monitora quando scrollProgress atinge 1.0 para trocar de motion.div para div
    const unsubscribe = scrollProgress.on('change', (latest) => {
      if (latest >= 1 && !transitionStarted) {
        setTransitionStarted(true);
      } else if (latest < 1 && transitionStarted) {
        setTransitionStarted(false);
      }
    });

    return () => unsubscribe();
  }, [scrollProgress, transitionStarted]);

  // ✅ NOVO: Animações reversíveis usando scrollProgress (1.0 → 2.0)
  useEffect(() => {
    if (!transitionStarted) return;

    const logo3D = document.querySelector('.isologo-3d-layer');
    const leovoxType = document.querySelector('.leovox-type-layer');
    const particles = document.querySelector('.particles-refined-canvas');
    const bgTexture = document.querySelector('.background-texture');
    const heroSticky = document.querySelector('.hero-refined-sticky');
    const textContainer = document.querySelector('.portfolio-text-transition-container');
    const title = document.querySelector('.portfolio-title-transition');
    const desc = document.querySelector('.portfolio-desc-transition');

    if (!logo3D || !leovoxType) return;

    // ✅ Monitora scrollProgress (1.0 → 2.0)
    const unsubscribe = scrollProgress.on('change', (latest) => {
      // Mapeia 1.0 → 2.0 para 0 → 1
      const progress = Math.max(0, Math.min(1, latest - 1));
      
      console.log('📊 Transição progress:', progress.toFixed(2));

      // ✅ Logos movem para TOPO CENTRALIZADO (0 → 0.5)
      const logoProgress = Math.min(1, progress / 0.5);
      const logoY = logoProgress * -window.innerHeight * 0.36; // Move para cima (36%)
      const logoScale = 1 - (logoProgress * 0.62); // 1 → 0.38 (ainda menores para enquadramento perfeito)

      logo3D.style.transform = `translate(0, ${logoY}px) scale(${logoScale})`;
      leovoxType.style.transform = `translate(0, ${logoY}px) scale(${logoScale})`;

      // ✅ Partículas desaparecem (0 → 0.3)
      if (particles) {
        const particlesProgress = Math.min(1, progress / 0.3);
        particles.style.opacity = 1 - particlesProgress;
      }

      // ✅ Background escurece (0.1 → 0.6)
      if (heroSticky) {
        const bgProgress = Math.max(0, Math.min(1, (progress - 0.1) / 0.5));
        const r = Math.round(255 - (bgProgress * 185)); // 255 → 70 (cinza escuro)
        const g = Math.round(255 - (bgProgress * 185));
        const b = Math.round(255 - (bgProgress * 185));
        heroSticky.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        
        // ✅ SINALIZADOR: Atualiza CSS variable no body para Header detectar
        document.documentElement.style.setProperty('--hero-bg-dark', bgProgress.toFixed(2));
      }

      // ✅ Textura aparece (0.2 → 0.7)
      if (bgTexture) {
        const textureProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.5));
        bgTexture.style.opacity = textureProgress;
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
      const next = Math.min(2, Math.max(0, current + delta)); // ✅ Estendido para 2.0

      scrollProgress.set(next);

      // ✅ Libera scroll quando atinge 2.0 (final da transição)
      if (next >= 2 && isLocked) {
        unlockScroll();
      }
      
      // Trava scroll ao voltar abaixo de 2.0
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

      // Se scroll está liberado (progress >= 1)
      if (!isLocked) {
        // Permite scroll para baixo (navegar para outras páginas)
        if (event.deltaY > 0) {
          return; // Deixa scroll nativo funcionar
        }
        // Scroll para CIMA: trava e volta a animação
        else {
          event.preventDefault();
          lockScroll();
          const delta = event.deltaY * 0.0012;
          applyDelta(delta);
        }
      }
      // Se scroll está travado (progress < 1)
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

      // Se scroll está liberado (progress >= 1)
      if (!isLocked) {
        // Swipe para baixo (deltaY negativo): deixa scroll nativo
        if (deltaY < 0) {
          return;
        }
        // Swipe para cima (deltaY positivo): trava e volta animação
        else {
          event.preventDefault();
          lockScroll();
          const normalized = (deltaY / window.innerHeight) * 0.8;
          applyDelta(normalized);
        }
      }
      // Se scroll está travado (progress < 1)
      else {
        event.preventDefault();
        const normalized = (deltaY / window.innerHeight) * 0.8;
        applyDelta(normalized);
      }
    },
    [isLocked, scrollProgress, applyDelta, lockScroll]
  );

  // ============================================================================
  // SEQUÊNCIA CINEMATOGRÁFICA COM TRANSIÇÃO SUAVE 2D→3D
  // Usando scrollProgress (0 → 1) - REVERSÍVEL
  // ============================================================================

  // CAMADA 1: NOME LEOVOX SVG (ATRÁS - z-index 11) - MAIOR PARA DESTAQUE
  const leovoxTypeOpacity = useTransform(
    scrollProgress,
    [0.2, 0.35, 0.6, 0.7],
    [0, 1, 1, 1]
  );

  const leovoxTypeScale = useTransform(
    scrollProgress,
    [0.2, 0.4, 0.65],
    [0.8, 1, 1]
  );

  const svgPathProgress = useTransform(
    scrollProgress,
    [0.2, 0.25, 0.55, 0.65],
    [0, 0, 1, 1]
  );

  // CAMADA 2: ISOLOGO 2D (INICIAL - z-index 12)
  const isologo2DOpacity = useTransform(
    scrollProgress,
    [0, 0.05, 0.55, 0.65, 0.75, 0.85],
    [1, 1, 1, 0.8, 0.4, 0]
  );

  const isologo2DScale = useTransform(
    scrollProgress,
    [0, 0.1, 0.3, 0.55, 0.65, 0.75],
    [1, 1.03, 1.05, 1.05, 1.02, 0.98]
  );

  const isologo2DRotate = useTransform(
    scrollProgress,
    [0, 0.2, 0.4, 0.55, 0.65, 0.75],
    [0, 2, -2, 0, -3, -5]
  );

  // Parallax 2D - Movimento SUTIL (camada mais próxima)
  const isologo2DParallaxX = useTransform(mouseX, [-1, 1], [-15, 15]);
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

  // Parallax 3D - Movimento MAIS AMPLO (camada na frente)
  // ✅ MODIFICADO: Desabilita parallax quando scrollProgress >= 1.0
  const isologo3DParallaxX = useTransform(
    [mouseX, scrollProgress],
    ([mx, sp]) => sp >= 1 ? 0 : mx * 25
  );
  const isologo3DParallaxY = useTransform(
    [mouseY, scrollProgress],
    ([my, sp]) => sp >= 1 ? 0 : my * 25
  );
  
  // Rotação parallax 3D adicional para profundidade
  // ✅ MODIFICADO: Desabilita rotação parallax quando scrollProgress >= 1.0
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
        {/* Background texture */}
        <div className="background-texture" />

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
          {/* CAMADA 1: NOME LEOVOX SVG (ATRÁS - z-index 11) - MAIOR */}
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

          {/* CAMADA 2: ISOLOGO 2D (INICIAL - z-index 12) */}
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