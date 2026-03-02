/**
 * CircuitGrid.jsx — Grid de Circuito Animado
 * 
 * Renderiza linhas de circuito verdes animadas no fundo escuro,
 * usado nos Atos 4 e 5 para criar a atmosfera tecnológica/e-sports.
 * As linhas são desenhadas progressivamente via stroke-dasharray.
 * 
 * @param {Object} props
 * @param {number} [props.opacity=1] - Opacidade geral
 * @param {number} [props.progress=0] - Progresso do desenho (0-1)
 * @param {string} [props.className] - Classes CSS adicionais
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/* ============================================================================
 * Gerador de caminhos SVG para o circuito
 * Cria um padrão de linhas que lembra um circuito impresso / matrix
 * ============================================================================ */
const generateCircuitPaths = () => {
  // Caminhos pré-definidos para consistência visual
  return [
    // Linhas horizontais principais
    { d: 'M0 200 H300 L320 220 H500', delay: 0 },
    { d: 'M100 400 H250 L270 380 H450 L470 400 H600', delay: 0.2 },
    { d: 'M0 600 H200 L220 580 H380', delay: 0.4 },
    { d: 'M500 300 H700 L720 320 H900 L920 300 H1100', delay: 0.1 },
    { d: 'M600 500 H800 L820 520 H1000', delay: 0.3 },
    
    // Linhas verticais
    { d: 'M300 0 V150 L320 170 V300', delay: 0.15 },
    { d: 'M700 100 V250 L680 270 V400', delay: 0.25 },
    { d: 'M500 200 V350 L520 370 V500 L500 520 V650', delay: 0.35 },
    { d: 'M200 300 V450 L220 470 V600', delay: 0.45 },
    { d: 'M900 0 V200 L880 220 V350', delay: 0.5 },
    
    // Conexões diagonais
    { d: 'M400 150 L450 200 H550 L600 250', delay: 0.2 },
    { d: 'M150 350 L200 400 V450 L250 500', delay: 0.3 },
    { d: 'M750 250 L800 300 H850 L900 350 V400', delay: 0.4 },
    
    // Nós (pequenos quadrados nos cruzamentos)
    { d: 'M295 195 H305 V205 H295 Z', delay: 0, isNode: true },
    { d: 'M495 345 H505 V355 H495 Z', delay: 0.35, isNode: true },
    { d: 'M695 245 H705 V255 H695 Z', delay: 0.25, isNode: true },
    { d: 'M395 145 H405 V155 H395 Z', delay: 0.2, isNode: true },
    { d: 'M195 445 H205 V455 H195 Z', delay: 0.45, isNode: true },
    { d: 'M895 195 H905 V205 H895 Z', delay: 0.5, isNode: true },
  ];
};

const CircuitGrid = ({
  opacity = 1,
  progress = 0,
  className = '',
}) => {
  const paths = useMemo(() => generateCircuitPaths(), []);

  return (
    <div
      className={`hero-circuit-grid ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity: opacity * 0.2,
        transition: 'opacity 0.5s ease',
      }}
    >
      <svg
        viewBox="0 0 1100 700"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {paths.map((path, index) => {
          const isNode = path.isNode;
          const pathLength = isNode ? 40 : 800;
          const dashOffset = pathLength * (1 - Math.min(1, Math.max(0, (progress - path.delay) / (1 - path.delay))));

          return (
            <motion.path
              key={index}
              d={path.d}
              fill={isNode ? 'rgba(0, 255, 65, 0.4)' : 'none'}
              stroke="rgba(0, 255, 65, 0.6)"
              strokeWidth={isNode ? 0.5 : 1}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={pathLength}
              strokeDashoffset={dashOffset}
              style={{
                filter: 'drop-shadow(0 0 2px rgba(0, 255, 65, 0.3))',
                transition: 'stroke-dashoffset 0.3s ease',
              }}
            />
          );
        })}
      </svg>

      {/* Grid de fundo sutil */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent calc(8vw - 1px),
              rgba(0, 255, 65, 0.04) calc(8vw - 1px),
              rgba(0, 255, 65, 0.04) 8vw
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent calc(8vw - 1px),
              rgba(0, 255, 65, 0.04) calc(8vw - 1px),
              rgba(0, 255, 65, 0.04) 8vw
            )
          `,
          maskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 60%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 60%, transparent 85%)',
          opacity: progress,
        }}
      />
    </div>
  );
};

export default CircuitGrid;
