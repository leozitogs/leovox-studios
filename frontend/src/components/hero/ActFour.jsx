/**
 * ActFour.jsx — Ato 4: Transformação (Scroll 65% – 78%)
 * 
 * Ponte dramática transicionando do ambiente limpo e pessoal do "Sobre Mim"
 * para a atmosfera energética e tecnológica do showcase de projetos.
 * A luz dá lugar à escuridão.
 * 
 * Elementos:
 * - Fundo escurecendo progressivamente (off-white → preto #0a0a0a)
 * - Linhas de circuito verdes se desenhando animadamente
 * - Tipografia "LEOVOX" como marca d'água semi-transparente
 * - Texto de ponte: "O que eu construo"
 * - Partículas verdes retornando densas
 * 
 * @param {Object} props
 * @param {number} props.progress - Progresso normalizado do Ato 4 (0-1)
 * @param {boolean} props.isActive - Se o ato está visível/ativo
 */

import React from 'react';
import { motion } from 'framer-motion';
import CircuitGrid from './CircuitGrid';

import leovoxType from '../../assets/brand/Leovox_type.svg';

/* ============================================================================
 * Partículas verdes densas retornando
 * ============================================================================ */
const DenseParticles = ({ progress }) => {
  const particles = React.useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      speed: 0.5 + Math.random() * 1.5,
      delay: Math.random(),
    }));
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 3,
      }}
    >
      {particles.map((particle) => {
        const adjustedProgress = Math.max(0, Math.min(1, (progress - particle.delay * 0.5) / (1 - particle.delay * 0.5)));
        const opacity = adjustedProgress * 0.5;
        const yOffset = Math.sin(Date.now() * 0.001 * particle.speed + particle.id) * 5;

        return (
          <motion.div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              backgroundColor: '#00ff41',
              opacity: opacity,
              boxShadow: '0 0 4px rgba(0, 255, 65, 0.5)',
            }}
            animate={{
              y: [0, -10, 0, 8, 0],
              x: [0, 5, 0, -3, 0],
            }}
            transition={{
              duration: 3 + particle.speed,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          />
        );
      })}
    </div>
  );
};

/* ============================================================================
 * ActFour — Componente Principal
 * ============================================================================ */
const ActFour = ({ progress = 0, isActive = true }) => {
  const p = Math.min(1, Math.max(0, progress));

  // Transição de cor do fundo: off-white (#f5f5f7) → preto (#0a0a0a)
  const bgR = Math.round(245 - p * (245 - 10));
  const bgG = Math.round(245 - p * (245 - 10));
  const bgB = Math.round(247 - p * (247 - 10));
  const bgColor = `rgb(${bgR}, ${bgG}, ${bgB})`;

  // Marca d'água LEOVOX
  const watermarkOpacity = p < 0.2
    ? 0
    : p < 0.5
      ? (p - 0.2) / 0.3 * 0.08
      : 0.08;

  // Texto de ponte "O que eu construo"
  const bridgeTextOpacity = p < 0.4
    ? 0
    : p < 0.6
      ? (p - 0.4) / 0.2
      : p > 0.85
        ? Math.max(0, 1 - (p - 0.85) / 0.15)
        : 1;

  // Cor do texto de ponte (transita de escuro para branco)
  const textBrightness = Math.min(1, p * 1.5);
  const textR = Math.round(26 + textBrightness * (255 - 26));
  const textG = Math.round(26 + textBrightness * (255 - 26));
  const textB = Math.round(26 + textBrightness * (255 - 26));
  const bridgeTextColor = `rgb(${textR}, ${textG}, ${textB})`;

  // Circuito progress
  const circuitProgress = Math.max(0, Math.min(1, (p - 0.15) / 0.85));
  const circuitOpacity = p < 0.15 ? 0 : Math.min(1, (p - 0.15) / 0.3);

  return (
    <div
      className="hero-act hero-act-four"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: bgColor,
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      {/* Grid de circuito verde animado */}
      <CircuitGrid
        opacity={circuitOpacity}
        progress={circuitProgress}
      />

      {/* Marca d'água LEOVOX */}
      <div
        className="hero-act-four-watermark"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: watermarkOpacity,
        }}
      >
        <img
          src={leovoxType}
          alt=""
          aria-hidden="true"
          style={{
            width: '90%',
            maxWidth: '1200px',
            height: 'auto',
            filter: p > 0.5
              ? 'brightness(0) invert(1)'
              : `brightness(0) opacity(${0.5 + p})`,
            transition: 'filter 0.3s ease',
          }}
        />
      </div>

      {/* Partículas verdes densas */}
      <DenseParticles progress={p} />

      {/* Texto de ponte: "O que eu construo" */}
      <div
        className="hero-act-four-bridge"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        <motion.h2
          className="hero-act-four-bridge-text"
          style={{
            opacity: bridgeTextOpacity,
            color: bridgeTextColor,
            transition: 'opacity 0.3s ease, color 0.3s ease',
          }}
        >
          <span className="hero-bridge-line">O que eu</span>
          <span className="hero-bridge-line hero-bridge-line--green">construo</span>
        </motion.h2>
      </div>

      {/* Grain animado (intensifica no escuro) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 6,
          pointerEvents: 'none',
          opacity: p * 0.12,
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />
    </div>
  );
};

export default ActFour;
