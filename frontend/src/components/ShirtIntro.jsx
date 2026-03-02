import { motion } from 'framer-motion'
import './CinematicShirtShowcase.css'

// Ajuste os caminhos conforme a estrutura do seu projeto
import imgCrow from '../assets/Camisas/CamisaCrow.png'
import imgStorm from '../assets/Camisas/CamisaStorm.png'
import imgElectra from '../assets/Camisas/CamisaElectra.png'
import imgMDG from '../assets/Camisas/CamisaMDG.png'
import imgBlue from '../assets/Camisas/CamisaBlue.png'

/**
 * ShirtIntro — Tela estática de apresentação (PNG)
 *
 * Recebe `scrollProgress` do pai (CinematicShirtShowcase).
 * Vive DENTRO do sticky-master via lv-intro-layer (position: absolute).
 * A transição para o 3D é controlada pelo pai via opacity.
 *
 * Cena 1 (Intro) ocupa 0%–15% do scroll global.
 * O parallax e fade-out acontecem nesse intervalo.
 */
export default function ShirtIntro({ scrollProgress = 0 }) {
  // Normaliza: 0–15% do scroll global → 0–1 (alinhado com PHASES.TRANSITION)
  const t = Math.min(scrollProgress / 0.15, 1)

  // Parallax
  const titleY = -t * 100
  const titleOpacity = Math.max(0, 1 - t * 2.5)
  const crowY = -t * 35
  const crowScale = 1 + t * 0.4
  const sideX = t * 120
  const sideOpacity = Math.max(0, 1 - t * 3)
  const bgY = -t * 150

  return (
    <div className="lv-intro-container">
      <div className="lv-intro-content">

        {/* TÍTULO HERO */}
        <motion.div
          className="lv-intro-hero-text"
          style={{
            transform: `translateY(${titleY}%)`,
            opacity: titleOpacity,
          }}
        >
          <h1>LEOVOX</h1>
          <h2>SPORTSWEAR</h2>
          <p>Onde o Design encontra a Performance.</p>
        </motion.div>

        {/* CAMADA DE FUNDO */}
        <motion.div
          className="lv-floating-shirt shirt-electra"
          style={{
            transform: `translate(-50%, -50%) translateY(${bgY}%)`,
            opacity: sideOpacity * 0.5,
          }}
        >
          <img src={imgElectra} alt="Camisa Electra" />
        </motion.div>

        <motion.div
          className="lv-floating-shirt shirt-blue"
          style={{
            transform: `translate(-50%, -50%) translateY(${bgY}%)`,
            opacity: sideOpacity * 0.5,
          }}
        >
          <img src={imgBlue} alt="Camisa Blue" />
        </motion.div>

        {/* CAMADA MÉDIA */}
        <motion.div
          className="lv-floating-shirt shirt-storm"
          style={{
            transform: `translate(-50%, -50%) translate(${-sideX}%, ${crowY}%)`,
            opacity: sideOpacity * 0.9,
          }}
        >
          <img src={imgStorm} alt="Camisa Storm" />
        </motion.div>

        <motion.div
          className="lv-floating-shirt shirt-mdg"
          style={{
            transform: `translate(-50%, -50%) translate(${sideX}%, ${crowY}%)`,
            opacity: sideOpacity * 0.9,
          }}
        >
          <img src={imgMDG} alt="Camisa MDG" />
        </motion.div>

        {/* CAMADA FRENTE — Camisa Principal */}
        <motion.div
          className="lv-floating-shirt shirt-crow-center"
          style={{
            transform: `translate(-50%, -50%) translateY(${crowY}%) scale(${crowScale})`,
          }}
        >
          <img src={imgCrow} alt="Camisa Crow" />
        </motion.div>

        {/* Indicador de Scroll */}
        {titleOpacity > 0.3 && (
          <div
            className="lv-scroll-indicator"
            style={{ opacity: titleOpacity }}
          >
            <span>ROLE PARA INICIAR A EXPERIÊNCIA</span>
            <div className="arrow-down">↓</div>
          </div>
        )}

      </div>

      {/* Gradiente inferior */}
      <div className="lv-intro-gradient" />
    </div>
  )
}