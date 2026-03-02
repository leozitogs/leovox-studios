/**
 * TechOrbit.jsx — Ícones de Tecnologias Flutuantes
 * 
 * Renderiza ícones de tecnologias em pequenos círculos de vidro
 * que flutuam organicamente ao redor de um elemento central.
 * Usado nos Atos 1 (orbitando o emblema) e 3 (orbitando o card).
 * 
 * @param {Object} props
 * @param {'light'|'dark'|'sky'} [props.variant='light'] - Variante visual
 * @param {number} [props.opacity=1] - Opacidade geral
 * @param {string} [props.className] - Classes CSS adicionais
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/* ============================================================================
 * Dados das tecnologias com ícones SVG inline
 * ============================================================================ */
const TECH_ITEMS = [
  {
    name: 'React',
    color: '#61DAFB',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    name: 'Figma',
    color: '#F24E1E',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4zm0-20C5.8 4 4 5.8 4 8s1.8 4 4 4h4V4H8zm0 8c-2.2 0-4 1.8-4 4s1.8 4 4 4h4v-8H8zm8-8h-4v8h4c2.2 0 4-1.8 4-4s-1.8-4-4-4zm0 12a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
  },
  {
    name: 'Three.js',
    color: '#ffffff',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M3 1.5l18 10.5L3 22.5V1.5zm2 3.5v15l13-7.5L5 5z" />
      </svg>
    ),
  },
  {
    name: 'Python',
    color: '#3776AB',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M11.9 1C6.4 1 6.8 3.3 6.8 3.3v2.4h5.3v.7H4.5S1 6 1 11.5s3 5.3 3 5.3h1.8v-2.5s-.1-3 3-3h5.2s2.8 0 2.8-2.8V4.3S17.3 1 11.9 1zm-3 1.9a.9.9 0 110 1.8.9.9 0 010-1.8z" />
        <path d="M12.1 23c5.5 0 5.1-2.3 5.1-2.3v-2.4h-5.3v-.7h7.6S23 18 23 12.5s-3-5.3-3-5.3h-1.8v2.5s.1 3-3 3H10s-2.8 0-2.8 2.8v4.2S6.7 23 12.1 23zm3-1.9a.9.9 0 110-1.8.9.9 0 010 1.8z" />
      </svg>
    ),
  },
  {
    name: 'TypeScript',
    color: '#3178C6',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <rect x="2" y="2" width="20" height="20" rx="2" fill="currentColor" opacity="0.2" />
        <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="bold" fill="currentColor">TS</text>
      </svg>
    ),
  },
  {
    name: 'Blender',
    color: '#F5792A',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12.5 17a5 3 0 100-6 5 3 0 000 6z" opacity="0.3" />
        <circle cx="12.5" cy="14" r="1.5" />
        <path d="M2 12l8-6v3.5h4L6 16l2-4H2z" />
      </svg>
    ),
  },
];

/* ============================================================================
 * Posições orbitais pré-calculadas (distribuição circular)
 * ============================================================================ */
const getOrbitalPositions = (count, radiusX = 45, radiusY = 40) => {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return {
      x: `calc(50% + ${Math.cos(angle) * radiusX}%)`,
      y: `calc(50% + ${Math.sin(angle) * radiusY}%)`,
      delay: i * 0.15,
    };
  });
};

const TechOrbit = ({
  variant = 'light',
  opacity = 1,
  className = '',
}) => {
  const positions = useMemo(() => getOrbitalPositions(TECH_ITEMS.length), []);

  const getGlassStyle = (index) => {
    const isSky = variant === 'sky';
    const isLight = variant === 'light';

    return {
      background: isSky
        ? 'rgba(255, 255, 255, 0.15)'
        : isLight
          ? 'rgba(255, 255, 255, 0.35)'
          : 'rgba(0, 255, 65, 0.1)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      border: isSky
        ? '1px solid rgba(255, 255, 255, 0.25)'
        : isLight
          ? '1px solid rgba(255, 255, 255, 0.5)'
          : '1px solid rgba(0, 255, 65, 0.2)',
      borderRadius: '50%',
      width: '56px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isSky ? '#ffffff' : isLight ? '#1a1a1a' : TECH_ITEMS[index].color,
      boxShadow: isSky
        ? '0 4px 12px rgba(0, 0, 0, 0.15)'
        : isLight
          ? '0 4px 12px rgba(0, 0, 0, 0.06)'
          : `0 4px 12px rgba(0, 0, 0, 0.2), 0 0 8px ${TECH_ITEMS[index].color}22`,
    };
  };

  return (
    <div
      className={`hero-tech-orbit ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity,
        transition: 'opacity 0.5s ease',
      }}
    >
      {TECH_ITEMS.map((tech, index) => (
        <motion.div
          key={tech.name}
          className="hero-tech-orbit-item"
          style={{
            position: 'absolute',
            left: positions[index].x,
            top: positions[index].y,
            transform: 'translate(-50%, -50%)',
            ...getGlassStyle(index),
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -8, 0, 6, 0],
            x: [0, 4, 0, -4, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: positions[index].delay },
            scale: { duration: 0.5, delay: positions[index].delay, type: 'spring' },
            y: {
              duration: 4 + index * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: positions[index].delay,
            },
            x: {
              duration: 5 + index * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: positions[index].delay + 0.5,
            },
          }}
          title={tech.name}
        >
          {tech.icon}
        </motion.div>
      ))}
    </div>
  );
};

export default TechOrbit;
