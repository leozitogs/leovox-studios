/**
 * ActFive.jsx — Ato 5: Showcase (Scroll 78% – 100%)
 * 
 * O ato final apresenta os trabalhos em um ambiente escuro, tecnológico
 * e alinhado à estética e-sports da marca Leovox. Cards com dark
 * glassmorphism exibem projetos de destaque.
 * 
 * Elementos:
 * - Fundo preto (#0a0a0a) com partículas verdes e grid de circuito
 * - Grid de projetos com dark glassmorphism
 * - Logomarca completa reapresentada
 * - Links de redes sociais
 * - CTA final: "Vamos trabalhar juntos?"
 * 
 * @param {Object} props
 * @param {number} props.progress - Progresso normalizado do Ato 5 (0-1)
 * @param {boolean} props.isActive - Se o ato está visível/ativo
 */

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import CircuitGrid from './CircuitGrid';

import logoLeovox from '../../assets/brand/LogoLeovoxverde.svg';

/* ============================================================================
 * DADOS DOS PROJETOS DE DESTAQUE
 * ============================================================================ */
const FEATURED_PROJECTS = [
  {
    id: 1,
    title: 'Camisas Jogos Escolares',
    description: 'Design completo de uniformes esportivos para competições interescolares.',
    tags: ['Design Gráfico', 'Branding', 'Estamparia'],
    image: '/portfolio/camisas-jogos.jpg',
    color: '#00ff41',
  },
  {
    id: 2,
    title: 'Identidade Visual Crow',
    description: 'Identidade visual completa para marca de e-sports.',
    tags: ['Branding', 'Logo', 'Social Media'],
    image: '/portfolio/crow-brand.jpg',
    color: '#00ff41',
  },
  {
    id: 3,
    title: 'Social Media Campaigns',
    description: 'Criação de conteúdo visual para redes sociais de múltiplos clientes.',
    tags: ['Social Media', 'Design', 'Marketing'],
    image: '/portfolio/social-media.jpg',
    color: '#00ff41',
  },
  {
    id: 4,
    title: 'Bandeiras & Flâmulas',
    description: 'Design de bandeiras e flâmulas para equipes e eventos.',
    tags: ['Design', 'Estamparia', 'Eventos'],
    image: '/portfolio/bandeiras.jpg',
    color: '#00ff41',
  },
];

/* ============================================================================
 * REDES SOCIAIS
 * ============================================================================ */
const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/leovoxstudios',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/5581984539741',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: 'Email',
    url: 'mailto:studiosleovox@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 7L2 7" />
      </svg>
    ),
  },
];

/* ============================================================================
 * ProjectCard — Card de projeto com dark glassmorphism
 * ============================================================================ */
const ProjectCard = ({ project, index, isVisible }) => {
  const staggerDelay = index * 0.15;

  return (
    <GlassCard
      variant="dark"
      className="hero-project-card"
      style={{
        padding: 0,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.6,
        delay: staggerDelay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        scale: 1.03,
        borderColor: 'rgba(0, 255, 65, 0.4)',
        boxShadow: '0 0 30px rgba(0, 255, 65, 0.15), 0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Thumbnail com overlay */}
      <div className="hero-project-card-thumb">
        <div
          className="hero-project-card-thumb-bg"
          style={{
            background: `linear-gradient(135deg, rgba(0, 255, 65, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)`,
          }}
        />
        <div className="hero-project-card-thumb-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="hero-project-card-content">
        <h3 className="hero-project-card-title">{project.title}</h3>
        <p className="hero-project-card-desc">{project.description}</p>
        <div className="hero-project-card-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="hero-project-card-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

/* ============================================================================
 * Partículas verdes energéticas (fundo do Ato 5)
 * ============================================================================ */
const EnergyParticles = ({ opacity }) => {
  const particles = React.useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      speed: 0.3 + Math.random() * 1.2,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        opacity,
      }}
    >
      {particles.map((particle) => (
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
            boxShadow: '0 0 4px rgba(0, 255, 65, 0.5)',
          }}
          animate={{
            y: [0, -15, 0, 10, 0],
            x: [0, 8, 0, -6, 0],
            opacity: [0.2, 0.6, 0.3, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + particle.speed * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};

/* ============================================================================
 * ActFive — Componente Principal
 * ============================================================================ */
const ActFive = ({ progress = 0, isActive = true }) => {
  const p = Math.min(1, Math.max(0, progress));

  // Grid de projetos visível
  const gridVisible = p > 0.1;
  const gridOpacity = p < 0.1
    ? 0
    : Math.min(1, (p - 0.1) / 0.2);

  // Encerramento (logo + socials + CTA)
  const closingOpacity = p < 0.6
    ? 0
    : Math.min(1, (p - 0.6) / 0.2);

  // Circuito progress
  const circuitProgress = Math.min(1, p * 1.2);

  const handleContactClick = useCallback(() => {
    // Força desbloqueio do scroll (compatibilidade com Header)
    document.body.style.overflow = '';
    window.dispatchEvent(new CustomEvent('hero-force-unlock'));

    requestAnimationFrame(() => {
      document.body.style.overflow = '';
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }, []);

  return (
    <div
      className="hero-act hero-act-five"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: '#0a0a0a',
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      {/* Grid de circuito animado */}
      <CircuitGrid opacity={0.8} progress={circuitProgress} />

      {/* Partículas verdes energéticas */}
      <EnergyParticles opacity={0.6} />

      {/* Conteúdo principal scrollável */}
      <div
        className="hero-act-five-content"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          gap: '3rem',
        }}
      >
        {/* Título da seção */}
        <motion.div
          className="hero-act-five-header"
          style={{
            opacity: gridOpacity,
            textAlign: 'center',
          }}
        >
          <h2 className="hero-act-five-title">
            Projetos em <span className="hero-text-green">Destaque</span>
          </h2>
          <p className="hero-act-five-subtitle">
            Uma seleção dos trabalhos mais recentes e impactantes
          </p>
        </motion.div>

        {/* Grid de Projetos */}
        <div
          className="hero-act-five-grid"
          style={{
            opacity: gridOpacity,
            transition: 'opacity 0.5s ease',
          }}
        >
          {FEATURED_PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isVisible={gridVisible}
            />
          ))}
        </div>

        {/* Encerramento: Logo + Socials + CTA */}
        <motion.div
          className="hero-act-five-closing"
          style={{
            opacity: closingOpacity,
            transition: 'opacity 0.5s ease',
          }}
        >
          {/* Logo completa */}
          <div className="hero-act-five-logo">
            <img
              src={logoLeovox}
              alt="Leovox Studios"
              className="hero-act-five-logo-img"
            />
          </div>

          {/* Redes sociais */}
          <div className="hero-act-five-socials">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-act-five-social-link"
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* CTA Final */}
          <div className="hero-act-five-cta-wrapper">
            <button
              className="hero-cta-final"
              onClick={handleContactClick}
            >
              Vamos trabalhar juntos?
            </button>
          </div>
        </motion.div>
      </div>

      {/* Grain animado */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 6,
          pointerEvents: 'none',
          opacity: 0.1,
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />
    </div>
  );
};

export default ActFive;
