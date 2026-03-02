/**
 * ExpertiseShowcase.jsx
 * V17: Functional Links (Clickable Cards)
 */

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import './ExpertiseShowcase.css'

// ============================================================================
// DADOS (Agora com Links)
// ============================================================================
const cardData = [
  {
    id: 'camisas',
    title: 'Design de Camisas',
    tag: 'Vestuário 3D',
    description: 'Modelagem realista pronta para confecção.',
    bgImage: '/portfolio/cards/design-camisas.png',
    floatElement: '/portfolio/cards/elements/camisa-float.png',
    href: '/servicos/design-camisas', // Link de destino
  },
  {
    id: 'identidade',
    title: 'Identidade Visual',
    tag: 'Branding',
    description: 'Sistemas visuais que marcam presença.',
    bgImage: '/portfolio/cards/identidade-visual.png',
    floatElement: '/portfolio/cards/elements/logo-float.png',
    href: '/servicos/identidade-visual',
  },
  {
    id: 'web',
    title: 'Web Design',
    tag: 'Development',
    description: 'Performance extrema e animações fluidas.',
    bgImage: '/portfolio/cards/web-design.png',
    floatElement: '/portfolio/cards/elements/phone-float.png',
    href: '/servicos/web-design',
  },
  {
    id: 'social',
    title: 'Social Media',
    tag: 'Marketing',
    description: 'Criativos que param o scroll no feed.',
    bgImage: '/portfolio/cards/posts-diversos.png',
    floatElement: '/portfolio/cards/elements/frog-float.png',
    href: '/servicos/social-media',
  },
]

// ============================================================================
// COMPONENTE CARD (Agora é um Link <a>)
// ============================================================================
const ParallaxCard = ({ data, index }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.1 };

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), springConfig);

  const imgX = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]), springConfig);
  const imgY = useSpring(useTransform(y, [-0.5, 0.5], [-20, 20]), springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / rect.width) - 0.5;
    const yPct = (mouseY / rect.height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const imageAnimation = {
    opacity: isHovered ? 1 : 0,
    scale: isHovered ? 1.15 : 0.5,
    filter: isHovered ? 'blur(0px)' : 'blur(10px)',
    y: isHovered ? -40 : 20,
  };
  
  const revealTransition = { type: "spring", stiffness: 300, damping: 20 };

  return (
    <motion.a
      href={data.href} // Transforma o card em link funcional
      ref={ref}
      className="parallax-card-wrapper group cursor-pointer block" // block para comportar layout
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      // Remove o underline padrão de links
      style={{ textDecoration: 'none' }}
    >
      {/* 1. GLOW LAYER (Luz Esférica Traseira) */}
      <motion.div 
        className="card-glow"
        style={{
            rotateX, 
            rotateY,
        }} 
      />

      {/* 2. FUNDO DO CARD */}
      <motion.div
        className="card-body"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div 
          className="card-bg-texture"
          style={{ backgroundImage: `url(${data.bgImage})` }} 
          animate={{
            opacity: isHovered ? 0.15 : 0.6,
            scale: isHovered ? 1.1 : 1,
            filter: isHovered ? 'blur(2px)' : 'blur(0px)'
          }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>

      {/* 3. IMAGEM 3D POPOUT */}
      <motion.div 
        className="popout-wrapper"
        style={{
            rotateX, 
            rotateY,
            transformStyle: "preserve-3d",
        }}
      >
         <motion.img
            src={data.floatElement}
            alt={data.title}
            className="parallax-image-popout"
            style={{ x: imgX, y: imgY, z: 50 }}
            animate={imageAnimation}
            transition={revealTransition}
          />
      </motion.div>

      {/* 4. CONTEÚDO */}
      <motion.div 
        className="content-layer"
        style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
        }}
      >
        <div className="card-overlay" />

        <div className="card-info">
          <span className="inline-block text-[#00ff41] text-[10px] font-bold tracking-widest uppercase mb-2 opacity-80">
            {data.tag}
          </span>
          
          <h3 className="text-2xl font-black text-white uppercase italic leading-none">
            {data.title}
          </h3>

          <div className="reveal-text">
            <p className="text-gray-400 text-sm leading-snug pt-2">
              {data.description}
            </p>
          </div>
        </div>
      </motion.div>

    </motion.a>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const ExpertiseShowcase = () => {
  return (
    <section 
      id="expertise"
      className="relative py-28 bg-[#050505] overflow-hidden"
    >
      <div className="grid-floor" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff41] opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4 opacity-70"
          >
            <div className="h-[2px] w-6 bg-[#00ff41]" />
            <span className="text-white text-xs font-bold uppercase tracking-[0.2em]">
              Leovox Studios
            </span>
            <div className="h-[2px] w-6 bg-[#00ff41]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6"
          >
            DO INVISÍVEL AO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-gray-600">
              INESQUECÍVEL.
            </span>
          </motion.h2>

          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Soluções digitais de alta performance para quem lidera o jogo.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {cardData.map((card, index) => (
            <ParallaxCard key={card.id} data={card} index={index} />
          ))}
        </div>

      </div>
    </section>
  )
}

export default ExpertiseShowcase