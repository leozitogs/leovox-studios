/**
 * GlassCard.jsx — Componente Reutilizável de Glassmorphism
 * 
 * Card com efeito de vidro fosco (glassmorphism) usado nos Atos 3 e 5.
 * Suporta variantes light (fundo claro) e dark (fundo escuro).
 * 
 * @param {Object} props
 * @param {'light'|'dark'} [props.variant='light'] - Variante visual
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {Object} [props.style] - Estilos inline adicionais
 * @param {React.ReactNode} props.children - Conteúdo do card
 */

import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({
  variant = 'light',
  className = '',
  style = {},
  children,
  ...motionProps
}) => {
  const isLight = variant === 'light';

  const baseStyle = {
    background: isLight
      ? 'rgba(255, 255, 255, 0.25)'
      : 'rgba(0, 255, 65, 0.05)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: isLight
      ? '1px solid rgba(255, 255, 255, 0.4)'
      : '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '24px',
    boxShadow: isLight
      ? '0 8px 32px rgba(0, 0, 0, 0.08)'
      : '0 8px 32px rgba(0, 0, 0, 0.3)',
    ...style,
  };

  return (
    <motion.div
      className={`hero-glass-card hero-glass-card--${variant} ${className}`}
      style={baseStyle}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

/* ============================================================================
 * GlassCardMini — Mini-card de vidro para métricas e ícones
 * ============================================================================ */
export const GlassCardMini = ({
  variant = 'light',
  className = '',
  style = {},
  children,
  ...motionProps
}) => {
  const isLight = variant === 'light';

  const baseStyle = {
    background: isLight
      ? 'rgba(255, 255, 255, 0.3)'
      : 'rgba(0, 255, 65, 0.08)',
    backdropFilter: 'blur(12px) saturate(150%)',
    WebkitBackdropFilter: 'blur(12px) saturate(150%)',
    border: isLight
      ? '1px solid rgba(255, 255, 255, 0.5)'
      : '1px solid rgba(0, 255, 65, 0.2)',
    borderRadius: '16px',
    boxShadow: isLight
      ? '0 4px 16px rgba(0, 0, 0, 0.06)'
      : '0 4px 16px rgba(0, 0, 0, 0.2)',
    ...style,
  };

  return (
    <motion.div
      className={`hero-glass-card-mini hero-glass-card-mini--${variant} ${className}`}
      style={baseStyle}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
