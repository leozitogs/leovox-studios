import { Suspense, useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import './CinematicShirtShowcase.css'
import ShirtIntro from './ShirtIntro'

// ============================================================================
// CONFIGURAÇÃO GLOBAL
// ============================================================================
const BG_COLOR = '#050505'
const SCROLL_PAGES = 6

/**
 * FASES DO SCROLLYTELLING — Coreografia em 5 atos (estilo Apple)
 *
 * Cena 1 (Intro):   0%–15%  → Visão frontal heróica, enquadramento total
 * Cena 2 (Escudo):  15%–40% → Close-up macro no peito (logo), ângulo inclinado
 * Cena 3 (Manga):   40%–65% → Lateral, foco nos detalhes da manga
 * Cena 4 (Dorso):   65%–85% → Giro orbital 180°, composição artística das costas
 * Cena 5 (Encaixe): 85%–100% → Recuo, centralização perfeita, estático
 */
const PHASES = {
  TRANSITION: { start: 0.00, end: 0.15 },
  CHEST:      { start: 0.15, end: 0.40 },
  SLEEVE:     { start: 0.40, end: 0.65 },
  BACK:       { start: 0.65, end: 0.85 },
  OVERVIEW:   { start: 0.85, end: 1.00 },
}

/**
 * KEYFRAMES DE CÂMERA E ROTAÇÃO
 *
 * ENCAIXE FINAL (OVERVIEW): A câmera recua e se centraliza perfeitamente.
 * cam.y = 1.0 (levemente acima do centro) + look.y = 0.5 garante que
 * a camisa fique verticalmente centralizada no viewport.
 * cam.z = 12 dá espaço suficiente para enquadrar o corpo inteiro
 * sem cortar nas bordas.
 */
const KEYFRAMES = {
  // INTRO: Camisa centralizada, corpo inteiro, visão frontal elegante
  TRANSITION: {
    cam: { x: 0, y: 0.5, z: 13 },
    look: { x: 0, y: 0 },
    rot: 0,
  },
  // ESCUDO: Zoom no peito/escudo — câmera sobe e se aproxima bastante
  CHEST: {
    cam: { x: -2.5, y: 1.8, z: 7.5 },
    look: { x: -0.5, y: 1.2 },
    rot: 0.15,
  },
  // MANGA: Gira para mostrar a manga direita — zoom na lateral
  SLEEVE: {
    cam: { x: 2.5, y: 1.0, z: 8 },
    look: { x: 0.5, y: 0.5 },
    rot: Math.PI * 0.45,
  },
  // COSTAS: Giro completo para 180° — zoom nas costas
  BACK: {
    cam: { x: -1.5, y: 1.2, z: 8 },
    look: { x: -0.3, y: 0.6 },
    rot: Math.PI,
  },
  // VISÃO 360° / ENCAIXE FINAL: Centralizado, enquadrado, estático
  OVERVIEW: {
    cam: { x: 0, y: 1.0, z: 12 },
    look: { x: 0, y: 0.5 },
    rot: Math.PI * 2,
  },
}

// Mobile overrides: câmera mais longe, sem offset lateral
const KEYFRAMES_MOBILE = {
  TRANSITION: { cam: { x: 0, y: 0.5, z: 17 }, look: { x: 0, y: 0 }, rot: 0 },
  CHEST:      { cam: { x: 0, y: 1.5, z: 10 }, look: { x: 0, y: 1.0 }, rot: 0.15 },
  SLEEVE:     { cam: { x: 0, y: 0.8, z: 11 }, look: { x: 0, y: 0.4 }, rot: Math.PI * 0.45 },
  BACK:       { cam: { x: 0, y: 1.0, z: 11 }, look: { x: 0, y: 0.5 }, rot: Math.PI },
  OVERVIEW:   { cam: { x: 0, y: 1.0, z: 15 }, look: { x: 0, y: 0.5 }, rot: Math.PI * 2 },
}

// Legendas de design
const CAPTIONS = [
  {
    phase: 'CHEST',
    title: 'Identidade Visual Única',
    sub: 'Cada escudo é projetado para representar a alma da equipe. Cores, formas e tipografia se fundem em uma identidade inconfundível.',
    position: 'left',
  },
  {
    phase: 'SLEEVE',
    title: 'Texturas de Alta Performance',
    sub: 'Padronagens exclusivas nas mangas que combinam estética e funcionalidade. Design que respira junto com o atleta.',
    position: 'right',
  },
  {
    phase: 'BACK',
    title: 'Design de Elite',
    sub: 'A composição traseira revela a arte completa. Cada elemento é posicionado com precisão ergonômica para máximo impacto visual.',
    position: 'left',
  },
  {
    phase: 'OVERVIEW',
    title: 'Composição 360°',
    sub: 'Uma visão completa do design pensado para dominar dentro e fora de campo. Cada ângulo conta uma história.',
    position: 'right',
  },
]

// ============================================================================
// UTILITÁRIOS
// ============================================================================
function phaseProgress(scroll, start, end) {
  if (scroll <= start) return 0
  if (scroll >= end) return 1
  return (scroll - start) / (end - start)
}

function getCurrentPhase(p) {
  if (p < PHASES.TRANSITION.end) return 'TRANSITION'
  if (p < PHASES.CHEST.end) return 'CHEST'
  if (p < PHASES.SLEEVE.end) return 'SLEEVE'
  if (p < PHASES.BACK.end) return 'BACK'
  return 'OVERVIEW'
}

function getNextPhase(phase) {
  const order = ['TRANSITION', 'CHEST', 'SLEEVE', 'BACK', 'OVERVIEW']
  const idx = order.indexOf(phase)
  return idx < order.length - 1 ? order[idx + 1] : phase
}

/** Smooth easing: ease-in-out cubic */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/** Interpolate between two keyframes with easing */
function lerpKeyframes(kfA, kfB, t) {
  const e = easeInOutCubic(t)
  return {
    cam: {
      x: THREE.MathUtils.lerp(kfA.cam.x, kfB.cam.x, e),
      y: THREE.MathUtils.lerp(kfA.cam.y, kfB.cam.y, e),
      z: THREE.MathUtils.lerp(kfA.cam.z, kfB.cam.z, e),
    },
    look: {
      x: THREE.MathUtils.lerp(kfA.look.x, kfB.look.x, e),
      y: THREE.MathUtils.lerp(kfA.look.y, kfB.look.y, e),
    },
    rot: THREE.MathUtils.lerp(kfA.rot, kfB.rot, e),
  }
}

// ============================================================================
// COMPONENTES 3D
// ============================================================================

/**
 * StageEnvironment — Background 3D escuro.
 * INTOCADO: mesma cor, fog, chão.
 */
function StageEnvironment() {
  return (
    <>
      <color attach="background" args={[BG_COLOR]} />
      <fog attach="fog" args={[BG_COLOR, 12, 40]} />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          color="#080808"
          roughness={0.85}
          metalness={0.3}
          envMapIntensity={0.15}
        />
      </mesh>
    </>
  )
}

/**
 * HeroShirt — Modelo 3D. INTOCADO.
 * position, scale, material = idênticos ao original funcional.
 */
function HeroShirt({ scrollProgress }) {
  const { scene } = useGLTF('/CamisaCrow.glb')
  const meshRef = useRef()
  const { viewport } = useThree()

  const responsiveScale = viewport.width < 5 ? 0.75 : 1.1

  const optimizedScene = useMemo(() => {
    const clone = scene.clone()
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        child.material = new THREE.MeshPhysicalMaterial({
          map: child.material.map,
          normalMap: child.material.normalMap,
          color: 0xffffff,
          roughness: 0.45,
          metalness: 0.1,
          envMapIntensity: 1.8,
          clearcoat: 0.15,
          side: THREE.FrontSide,
        })
      }
    })
    return clone
  }, [scene])

  useFrame(() => {
    if (!meshRef.current) return

    const p = scrollProgress
    const isMobile = viewport.width < 5
    const kf = isMobile ? KEYFRAMES_MOBILE : KEYFRAMES
    const phase = getCurrentPhase(p)
    const nextPhase = getNextPhase(phase)

    const phaseStart = PHASES[phase].start
    const phaseEnd = PHASES[phase].end
    const t = phaseProgress(p, phaseStart, phaseEnd)

    const interpolated = lerpKeyframes(kf[phase], kf[nextPhase], t)

    // INÉRCIA: lerp com fator fixo 0.05
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      interpolated.rot,
      0.05
    )
  })

  return (
    <group position={[0, -0.8, 0]}>
      <primitive
        object={optimizedScene}
        ref={meshRef}
        scale={responsiveScale}
      />
    </group>
  )
}

/**
 * CinematicLighting — Iluminação de estúdio profissional.
 * INTOCADO: mesmas luzes, posições, intensidades.
 */
function CinematicLighting({ flashIntensity }) {
  const flashRef = useRef()

  useFrame(() => {
    if (flashRef.current) {
      const target = 60 + flashIntensity * 600
      flashRef.current.intensity = THREE.MathUtils.lerp(
        flashRef.current.intensity,
        target,
        0.1
      )
    }
  })

  return (
    <>
      <Environment preset="city" blur={0.8} background={false} />

      {/* Key Light */}
      <spotLight
        position={[5, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={80}
        color="#ffffff"
        castShadow
        shadow-bias={-0.0001}
      />

      {/* Flash Light — Branco puro */}
      <pointLight
        ref={flashRef}
        position={[0, 5, 8]}
        intensity={60}
        color="#ffffff"
        distance={30}
      />

      {/* Rim Light — Azulado frio */}
      <spotLight
        position={[-6, 6, -6]}
        angle={0.5}
        intensity={100}
        color="#4488ff"
        distance={20}
      />

      {/* Fill Light — Quente sutil */}
      <spotLight
        position={[6, 4, -4]}
        angle={0.5}
        intensity={50}
        color="#ffaa66"
        distance={18}
      />

      {/* Back Light — Contorno */}
      <pointLight
        position={[0, 8, -10]}
        intensity={35}
        color="#ffffff"
        distance={25}
      />
    </>
  )
}

/**
 * CameraRig — Posiciona a câmera interpolando entre keyframes.
 * Inércia com fator fixo 0.05.
 */
function CameraRig({ scrollProgress }) {
  const { camera, viewport } = useThree()
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0))

  const isMobile = viewport.width < 5

  useFrame(() => {
    const p = scrollProgress
    const kf = isMobile ? KEYFRAMES_MOBILE : KEYFRAMES
    const phase = getCurrentPhase(p)
    const nextPhase = getNextPhase(phase)

    const phaseStart = PHASES[phase].start
    const phaseEnd = PHASES[phase].end
    const t = phaseProgress(p, phaseStart, phaseEnd)

    const interpolated = lerpKeyframes(kf[phase], kf[nextPhase], t)

    // INÉRCIA: lerp com fator fixo 0.05
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, interpolated.cam.x, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, interpolated.cam.y, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, interpolated.cam.z, 0.05)

    lookTarget.current.x = THREE.MathUtils.lerp(lookTarget.current.x, interpolated.look.x, 0.05)
    lookTarget.current.y = THREE.MathUtils.lerp(lookTarget.current.y, interpolated.look.y, 0.05)
    lookTarget.current.z = 0

    camera.lookAt(lookTarget.current)
  })

  return null
}

// ============================================================================
// COMPONENTES UI (HTML)
// ============================================================================

/** Flash Overlay — Transição branca cinematográfica */
function FlashOverlay({ intensity }) {
  if (intensity < 0.01) return null
  return (
    <div
      className="lv-flash-overlay"
      style={{
        opacity: intensity,
        background: `radial-gradient(
          ellipse at 50% 45%,
          rgba(255,255,255,${intensity * 0.9}) 0%,
          rgba(220,230,255,${intensity * 0.35}) 30%,
          rgba(80,100,160,${intensity * 0.1}) 55%,
          transparent 75%
        )`,
      }}
    />
  )
}

/** DesignCaption — Legenda flutuante por fase */
function DesignCaption({ caption, isVisible }) {
  if (!caption) return null

  const alignClasses = {
    left: 'lv-caption-left',
    right: 'lv-caption-right',
    center: 'lv-caption-center',
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={caption.phase}
          className={`lv-design-caption ${alignClasses[caption.position]}`}
          initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -25, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="lv-caption-tag">LEOVOX STUDIOS</span>
          <h2 className="lv-caption-title">{caption.title}</h2>
          <div className="lv-caption-divider" />
          <p className="lv-caption-description">{caption.sub}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** ScrollProgressIndicator — Indicador lateral direito */
function ScrollProgressIndicator({ progress }) {
  const phases = ['INTRO', 'ESCUDO', 'MANGA', 'COSTAS', 'VISÃO 360°']
  const activeIndex =
    progress < PHASES.TRANSITION.end ? 0 :
    progress < PHASES.CHEST.end      ? 1 :
    progress < PHASES.SLEEVE.end     ? 2 :
    progress < PHASES.BACK.end       ? 3 : 4

  return (
    <div className="lv-progress-indicator">
      {phases.map((label, i) => (
        <div
          key={label}
          className={`lv-progress-step${i === activeIndex ? ' active' : ''}${i < activeIndex ? ' done' : ''}`}
        >
          <span className="lv-progress-label">{label}</span>
          <span className="lv-progress-pip" />
        </div>
      ))}
    </div>
  )
}

/** FinalCTA — Call-to-action premium */
function FinalCTA({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="lv-final-cta"
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="lv-cta-eyebrow">LEOVOX STUDIOS</p>
          <h2 className="lv-cta-title">
            VOCÊ MERECE<br />
            <span className="lv-cta-highlight">UMA IDENTIDADE ÚNICA</span>
          </h2>
          <p className="lv-cta-sub">
            Do conceito ao campo — arte personalizada que transforma times em marcas.
          </p>
          <a href="#contact" className="lv-btn-cta">
            <span>CRIAR MEU DESIGN</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * LensFlareOverlay — Efeito de lens flare em HTML overlay.
 * Aparece sutilmente durante transições entre fases.
 */
function LensFlareOverlay({ scrollProgress }) {
  let flareIntensity = 0
  const boundaries = [
    PHASES.TRANSITION.end,
    PHASES.CHEST.end,
    PHASES.SLEEVE.end,
    PHASES.BACK.end,
  ]

  for (const boundary of boundaries) {
    const dist = Math.abs(scrollProgress - boundary)
    if (dist < 0.05) {
      flareIntensity = Math.max(flareIntensity, 1 - dist / 0.05)
    }
  }

  if (flareIntensity < 0.01) return null

  return (
    <div
      className="lv-lens-flare-overlay"
      style={{
        opacity: flareIntensity * 0.4,
      }}
    />
  )
}

/**
 * ParticleField — Partículas flutuantes de fundo (CSS puro).
 * Cria profundidade e atmosfera premium sem impacto no Canvas 3D.
 */
function ParticleField() {
  // Gerar partículas estáticas com posições aleatórias fixas
  const particles = useMemo(() => {
    const items = []
    for (let i = 0; i < 40; i++) {
      items.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 8,
        duration: 4 + Math.random() * 6,
        opacity: 0.1 + Math.random() * 0.25,
      })
    }
    return items
  }, [])

  return (
    <div className="lv-particle-field">
      {particles.map((p) => (
        <span
          key={p.id}
          className="lv-particle"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function CinematicShirtShowcase() {
  const trackRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [flashIntensity, setFlashIntensity] = useState(0)
  const [showIntro, setShowIntro] = useState(true)
  const [show3D, setShow3D] = useState(false)

  // ========================================================================
  // SCROLL HANDLER
  // ========================================================================
  useEffect(() => {
    let rafId
    let lastProgress = 0

    const handleScroll = () => {
      if (!trackRef.current) return

      const rect = trackRef.current.getBoundingClientRect()
      const trackHeight = trackRef.current.offsetHeight
      const viewportHeight = window.innerHeight
      const scrolled = -rect.top
      const scrollableDistance = trackHeight - viewportHeight

      if (scrollableDistance <= 0) return

      let p = scrolled / scrollableDistance
      p = Math.max(0, Math.min(1, p))

      if (Math.abs(p - lastProgress) > 0.0003) {
        lastProgress = p
        setProgress(p)

        // Flash branco: dispara entre 2% e 11%
        if (p > 0.015 && p < 0.11) {
          const up = phaseProgress(p, 0.015, 0.05)
          const down = phaseProgress(p, 0.05, 0.11)
          setFlashIntensity(up < 1 ? up : Math.max(0, 1 - down))
        } else {
          setFlashIntensity(0)
        }

        // Visibilidade PNG vs 3D
        if (p > 0.04) {
          setShowIntro(false)
          setShow3D(true)
        } else {
          setShowIntro(true)
          setShow3D(false)
        }
      }
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Caption ativa
  const getActiveCaption = useCallback(() => {
    if (progress < PHASES.CHEST.start + 0.04) return null
    if (progress < PHASES.SLEEVE.start) return CAPTIONS[0]
    if (progress < PHASES.BACK.start) return CAPTIONS[1]
    if (progress < PHASES.OVERVIEW.start) return CAPTIONS[2]
    if (progress < 0.93) return CAPTIONS[3]
    return null
  }, [progress])

  const activeCaption = getActiveCaption()
  const showCTA = progress >= 0.93

  return (
    <section className="lv-showcase-section" id="showcase">
      <div
        ref={trackRef}
        className="lv-scroll-track"
        style={{ height: `${SCROLL_PAGES * 100}vh` }}
      >
        <div className="lv-sticky-master">

          {/* BACKGROUND COMPLEXO: Múltiplas camadas de efeito */}
          <div className="lv-grid-floor" />
          <div className="lv-ambient-glow" />
          <div className="lv-energy-lines" />
          <div className="lv-vignette" />
          <div className="lv-scan-line" />
          <ParticleField />

          {/* CAMADA 1: ShirtIntro (PNG) */}
          <div
            className="lv-intro-layer"
            style={{
              opacity: showIntro ? 1 : 0,
              pointerEvents: showIntro ? 'auto' : 'none',
            }}
          >
            <ShirtIntro scrollProgress={progress} />
          </div>

          {/* CAMADA 2: Flash Overlay */}
          <FlashOverlay intensity={flashIntensity} />

          {/* CAMADA 2.5: Lens Flare Overlay */}
          <LensFlareOverlay scrollProgress={progress} />

          {/* CAMADA 3: Canvas 3D */}
          <div
            className="lv-canvas-layer"
            style={{ opacity: show3D ? 1 : 0 }}
          >
            <Canvas
              shadows
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 0.8,
                powerPreference: 'high-performance',
              }}
              camera={{ position: [0, 0.5, 13], fov: 25 }}
            >
              <Suspense fallback={null}>
                <StageEnvironment />
                <CameraRig scrollProgress={progress} />
                <CinematicLighting flashIntensity={flashIntensity} />
                <HeroShirt scrollProgress={progress} />
              </Suspense>
              <ContactShadows
                position={[0, -3.5, 0]}
                opacity={0.3}
                scale={10}
                blur={3}
                far={3}
                color="#000000"
              />
            </Canvas>
          </div>

          {/* CAMADA 4: Legendas + CTA */}
          <div className="lv-text-layer">
            <DesignCaption
              caption={activeCaption}
              isVisible={activeCaption !== null && !showCTA}
            />
            <FinalCTA isVisible={showCTA} />
          </div>

          {/* CAMADA 5: Indicador de Progresso */}
          {show3D && !showCTA && (
            <ScrollProgressIndicator progress={progress} />
          )}

        </div>
      </div>
    </section>
  )
}

useGLTF.preload('/CamisaCrow.glb')