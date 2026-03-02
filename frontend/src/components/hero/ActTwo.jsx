/**
 * ActTwo.jsx — Ato 2: Descida (Scroll 25% – 40%)
 * 
 * Transição puramente cinematográfica conectando o ambiente etéreo
 * do céu com o mundo tangível e profissional do Ato 3.
 * A câmera efetivamente "desce" das nuvens para o solo.
 * 
 * Elementos:
 * - Fundo transitando de azul para off-white (#f8f9fa)
 * - Nuvens se dissipando com blur progressivo
 * - Parallax invertido (elementos do céu sobem, novos sobem de baixo)
 * - Partículas verdes se dispersando
 * - Linhas geométricas sutis aparecendo
 * 
 * @param {Object} props
 * @param {number} props.progress - Progresso normalizado do Ato 2 (0-1)
 * @param {boolean} props.isActive - Se o ato está visível/ativo
 */

import React from 'react';
import { motion } from 'framer-motion';

/* ============================================================================
 * Partículas de dispersão (verdes, se afastando)
 * ============================================================================ */
const DispersionParticles = ({ progress }) => {
  const particles = React.useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      startX: 50 + (Math.random() - 0.5) * 30,
      startY: 50 + (Math.random() - 0.5) * 30,
      endX: Math.random() * 100,
      endY: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 0.5,
    }));
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {particles.map((particle) => {
        const adjustedProgress = Math.max(0, Math.min(1, (progress - particle.delay) / (1 - particle.delay)));
        const x = particle.startX + (particle.endX - particle.startX) * adjustedProgress;
        const y = particle.startY + (particle.endY - particle.startY) * adjustedProgress;
        const opacity = Math.max(0, 1 - adjustedProgress * 1.5);

        return (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              backgroundColor: '#00ff41',
              opacity: opacity * 0.6,
              boxShadow: '0 0 6px rgba(0, 255, 65, 0.4)',
              transition: 'opacity 0.1s ease',
            }}
          />
        );
      })}
    </div>
  );
};

/* ============================================================================
 * Linhas geométricas que aparecem de baixo
 * ============================================================================ */
const GeometricLines = ({ progress }) => {
  const lineOpacity = Math.max(0, Math.min(1, (progress - 0.4) / 0.6));

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: lineOpacity,
      }}
    >
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {/* Linhas geométricas sutis */}
        <line x1="100" y1="800" x2="300" y2="600" stroke="rgba(0, 255, 65, 0.08)" strokeWidth="1" />
        <line x1="400" y1="800" x2="500" y2="650" stroke="rgba(0, 255, 65, 0.06)" strokeWidth="1" />
        <line x1="700" y1="800" x2="900" y2="620" stroke="rgba(0, 255, 65, 0.08)" strokeWidth="1" />
        <line x1="1000" y1="800" x2="1100" y2="680" stroke="rgba(0, 255, 65, 0.06)" strokeWidth="1" />
        
        {/* Formas geométricas abstratas */}
        <rect x="200" y="650" width="60" height="60" rx="8" fill="none" stroke="rgba(0, 255, 65, 0.06)" strokeWidth="1" transform={`rotate(15 230 680)`} />
        <circle cx="800" cy="700" r="30" fill="none" stroke="rgba(0, 255, 65, 0.05)" strokeWidth="1" />
        <polygon points="600,680 620,720 580,720" fill="none" stroke="rgba(0, 255, 65, 0.06)" strokeWidth="1" />
      </svg>
    </div>
  );
};

/* ============================================================================
 * ActTwo — Componente Principal
 * ============================================================================ */
const ActTwo = ({ progress = 0, isActive = true }) => {
  const p = Math.min(1, Math.max(0, progress));

  // Transição de cor do fundo: azul → off-white
  // Início: cor do céu (azul claro), Fim: off-white (#f8f9fa)
  const bgR = Math.round(104 + p * (248 - 104)); // 68 → f8
  const bgG = Math.round(184 + p * (249 - 184)); // b8 → f9
  const bgB = Math.round(215 + p * (250 - 215)); // d7 → fa
  const bgColor = `rgb(${bgR}, ${bgG}, ${bgB})`;

  // Efeito de blur progressivo (simulando travessia das nuvens)
  const blurAmount = p < 0.3
    ? p / 0.3 * 8
    : p < 0.7
      ? 8
      : 8 * (1 - (p - 0.7) / 0.3);

  // Nuvens residuais se movendo para cima
  const cloudY = -p * 120;
  const cloudOpacity = Math.max(0, 1 - p * 1.5);

  // Texto de transição sutil
  const transitionTextOpacity = p > 0.5 && p < 0.9
    ? Math.min(1, (p - 0.5) / 0.2) * Math.max(0, 1 - (p - 0.7) / 0.2)
    : 0;

  return (
    <div
      className="hero-act hero-act-two"
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
      {/* Nuvens residuais se dissipando */}
      <div
        className="hero-act-two-clouds"
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${cloudY}px)`,
          opacity: cloudOpacity,
          filter: `blur(${blurAmount}px)`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        {/* Formas de nuvens abstratas */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '300px',
            height: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 50%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30%',
            right: '15%',
            width: '250px',
            height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 50%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '40%',
            width: '350px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 50%, transparent 70%)',
          }}
        />
      </div>

      {/* Partículas verdes se dispersando */}
      <DispersionParticles progress={p} />

      {/* Linhas geométricas aparecendo de baixo */}
      <GeometricLines progress={p} />

      {/* Grain sutil aparecendo */}
      <div
        className="hero-act-two-grain"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          pointerEvents: 'none',
          opacity: p * 0.05,
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />
    </div>
  );
};

export default ActTwo;
