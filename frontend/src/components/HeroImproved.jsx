import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowDown, Sparkles, Zap, Palette, Star, Hexagon, Triangle } from 'lucide-react'

const HeroImproved = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY } = useScroll()
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    setIsVisible(true)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const floatingElements = [
    { icon: Sparkles, delay: 0, x: -20, y: -30, color: 'text-yellow-400' },
    { icon: Zap, delay: 0.5, x: 30, y: -20, color: 'text-blue-400' },
    { icon: Palette, delay: 1, x: -30, y: 20, color: 'text-purple-400' },
    { icon: Star, delay: 1.5, x: 40, y: 30, color: 'text-pink-400' },
    { icon: Hexagon, delay: 2, x: -40, y: -10, color: 'text-green-400' },
    { icon: Triangle, delay: 2.5, x: 20, y: -40, color: 'text-red-400' },
  ]

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  return (
    <motion.section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black"
      style={{ opacity }}
    >
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Animated Background Shapes */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{
          x: mousePosition.x,
          y: mousePosition.y
        }}
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-primary/30 rounded-lg"
            style={{
              width: `${Math.random() * 80 + 30}px`,
              height: `${Math.random() * 80 + 30}px`,
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.8, 0.2],
              borderRadius: ['10px', '50%', '10px'],
            }}
            transition={{
              duration: 10 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      {/* Floating Icons with Advanced Animations */}
      <AnimatePresence>
        {isVisible && floatingElements.map((element, index) => {
          const IconComponent = element.icon
          return (
            <motion.div
              key={index}
              className={`absolute ${element.color} opacity-60`}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ 
                opacity: [0, 1, 0.7, 1, 0],
                scale: [0, 1.2, 0.8, 1.1, 0],
                rotate: [0, 180, 360],
                x: [element.x, element.x + 20, element.x - 10, element.x],
                y: [element.y, element.y - 30, element.y + 10, element.y],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: element.delay,
                ease: "easeInOut"
              }}
              style={{
                left: `${50 + element.x}%`,
                top: `${50 + element.y}%`,
                transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`
              }}
            >
              <IconComponent className="h-8 w-8" />
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        className="container mx-auto px-4 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y: y1 }}
      >
        {/* Animated Logo/Brand */}
        <motion.div
          variants={textVariants}
          className="mb-8"
        >
          <motion.div
            className="inline-block"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.5 }
            }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-4 relative">
              <motion.span 
                className="leovox-text-gradient inline-block"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                LEOVOX
              </motion.span>
              
              {/* Glowing effect */}
              <motion.div
                className="absolute inset-0 leovox-text-gradient blur-xl opacity-50"
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                LEOVOX
              </motion.div>
            </h1>
          </motion.div>
        </motion.div>

        {/* Subtitle with Typewriter Effect */}
        <motion.div
          variants={textVariants}
          className="mb-8"
        >
          <motion.h2 
            className="text-2xl md:text-4xl text-gray-300 mb-6 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.5, duration: 2, ease: "easeInOut" }}
              className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-primary"
            >
              Designer Gráfico & Especialista em Identidade Visual
            </motion.span>
          </motion.h2>
        </motion.div>

        {/* Description */}
        <motion.div
          variants={textVariants}
          className="mb-12"
        >
          <motion.p 
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            Transformo ideias em designs impactantes. Especialista em camisas de jogos interescolares, 
            identidade visual e branding que conecta marcas aos seus públicos.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={textVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.a
            href="#projects"
            className="group relative px-8 py-4 bg-primary text-black font-semibold rounded-lg overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0, 255, 65, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.5, duration: 0.6 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary to-green-400"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              Ver Meus Projetos
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowDown className="h-5 w-5 rotate-[-90deg]" />
              </motion.div>
            </span>
          </motion.a>

          <motion.a
            href="#contact"
            className="group px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-black transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              borderColor: "#00ff41",
              boxShadow: "0 0 30px rgba(0, 255, 65, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.7, duration: 0.6 }}
          >
            <span className="flex items-center gap-2">
              Entre em Contato
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
            </span>
          </motion.a>
        </motion.div>


      </motion.div>

      {/* Ambient Light Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x}% ${50 + mousePosition.y}%, rgba(0,255,65,0.1) 0%, transparent 50%)`
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.section>
  )
}

export default HeroImproved

