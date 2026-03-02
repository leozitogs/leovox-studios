import { useRef, useState } from 'react';

/**
 * LiquidGlassCard — Componente reutilizável de card com efeito Liquid Glass.
 *
 * Implementa o efeito de glassmorphism com backdrop-filter e uma sutil
 * refração baseada na posição do mouse (tilt 3D).
 *
 * Props:
 * - children: conteúdo do card
 * - className: classes CSS adicionais
 * - onClick: handler de clique
 * - style: estilos inline adicionais
 */
export default function LiquidGlassCard({
  children,
  className = '',
  onClick,
  style = {},
  ...props
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Tilt range: -8 to 8 degrees
    setTilt({
      x: (y - 0.5) * -16,
      y: (x - 0.5) * 16,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className={`liquid-glass ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform: isHovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px) scale(1.01)`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg)',
        transition: isHovered
          ? 'transform 0.1s ease-out, box-shadow 0.4s ease, border-color 0.4s ease'
          : 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease, border-color 0.4s ease',
      }}
      {...props}
    >
      {/* Subtle glass shine overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: isHovered
            ? `radial-gradient(circle at ${((tilt.y + 8) / 16) * 100}% ${
                ((tilt.x + 8) / 16) * 100
              }%, rgba(255,255,255,0.06) 0%, transparent 60%)`
            : 'none',
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
          zIndex: 1,
        }}
      />
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  );
}
