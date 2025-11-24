import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import leovoxHead from '../assets/brand/Leovox_head.svg'
import { Zap } from 'lucide-react' // Ícone de raio

const HeaderLandoStyle = () => {
  // ============================================================================
  // DETECÇÃO DE MUDANÇA DE COR DO HERO VIA CSS VARIABLE
  // Sincronizado com HeroRefined via --hero-bg-dark (0 → 1)
  // ============================================================================
  const [heroBgDark, setHeroBgDark] = useState(0)

  useEffect(() => {
    const checkHeroBgDark = () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--hero-bg-dark')
        .trim()
      
      const numValue = parseFloat(value) || 0
      setHeroBgDark(numValue)
    }

    // Checa a cada frame para transição suave
    let rafId
    const loop = () => {
      checkHeroBgDark()
      rafId = requestAnimationFrame(loop)
    }
    
    rafId = requestAnimationFrame(loop)
    
    return () => cancelAnimationFrame(rafId)
  }, [])

  // ============================================================================
  // CORES DINÂMICAS BASEADAS NO SINALIZADOR
  // ============================================================================
  
  // Logo: preto → branco
  const logoFilter = `invert(${heroBgDark})`
  
  // Botão sempre verde neon
  const ctaBgColor = '#1abc01'
  
  // Borda do botão: preto → verde
  const ctaBorderColor = heroBgDark > 0.5 
    ? `rgba(161, 245, 156, 1, ${0.5 + heroBgDark * 0.5})` 
    : 'rgba(0, 0, 0, 1)'
  
  // Texto do botão: sempre preto
  const ctaTextColor = 'rgba(0, 0, 0, 1)'
  
  // Sombra do botão: preta → verde
  const ctaShadow = heroBgDark > 0.5
    ? `0 5px 0 0 rgba(161, 245, 156, 1, ${0.5 + heroBgDark * 0.5})`
    : '0 5px 0 0 rgba(0, 0, 0, 1)'

  const handleContactClick = () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[60]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background sempre transparente (SEM blur escuro) */}

      {/* Container principal com margens generosas */}
      <div className="relative mx-auto flex items-center justify-between px-6 py-6 md:px-8 lg:px-12">
        
        {/* Logo à esquerda - SVG Leovox Studios */}
        <div className="flex flex-1 items-center">
          <a href="#home" className="select-none">
            <motion.img 
              src={leovoxHead} 
              alt="Leovox Studios" 
              className="h-[120px] w-auto transition-all duration-300"
              style={{ filter: logoFilter }}
            />
          </a>
        </div>

        {/* Botões à direita */}
        <motion.div 
          className="flex flex-1 items-center justify-end gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Botão "FALE COMIGO" com ícone de raio */}
          <motion.button
            onClick={handleContactClick}
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl px-7 py-3.5 text-sm font-black uppercase tracking-[0.2em] transition-all duration-200 md:px-8 md:py-4 md:text-base"
            style={{
              backgroundColor: ctaBgColor,
              borderWidth: '3px',
              borderStyle: 'solid',
              borderColor: ctaBorderColor,
              color: ctaTextColor,
              boxShadow: ctaShadow,
            }}
            whileHover={{ 
              y: -2,
              transition: { duration: 0.2 }
            }}
            whileTap={{ 
              y: 2,
              transition: { duration: 0.1 }
            }}
          >
            {/* Efeito de brilho no hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            
            {/* Ícone de Raio */}
            <Zap className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 md:h-6 md:w-6" strokeWidth={3} fill="currentColor" />
            <span className="relative font-black">Fale Comigo</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  )
}

export default HeaderLandoStyle
