import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

// Hook para detectar elementos na viewport
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false)
  const [ref, setRef] = useState(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold }
    )

    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, threshold])

  return [setRef, isInView]
}

// Componente para animações de reveal
export const RevealAnimation = ({ children, direction = 'up', delay = 0, duration = 0.6 }) => {
  const [ref, isInView] = useInView(0.1)

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
      x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
      scale: direction === 'scale' ? 0.8 : 1,
      rotate: direction === 'rotate' ? -10 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotate: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

// Componente para efeito parallax
export const ParallaxElement = ({ children, speed = 0.5, direction = 'vertical' }) => {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, speed * 1000])
  const x = useTransform(scrollY, [0, 1000], [0, direction === 'horizontal' ? speed * 1000 : 0])

  return (
    <motion.div style={{ y: direction === 'vertical' ? y : 0, x: direction === 'horizontal' ? x : 0 }}>
      {children}
    </motion.div>
  )
}

// Componente para animações staggered
export const StaggeredAnimation = ({ children, staggerDelay = 0.1 }) => {
  const [ref, isInView] = useInView(0.1)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {Array.isArray(children) ? 
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        )) :
        <motion.div variants={itemVariants}>
          {children}
        </motion.div>
      }
    </motion.div>
  )
}

// Componente para efeito de máquina de escrever
export const TypewriterEffect = ({ text, speed = 50, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }
    }, currentIndex === 0 ? delay : speed)

    return () => clearTimeout(timer)
  }, [currentIndex, text, speed, delay])

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="border-r-2 border-current ml-1"
      />
    </span>
  )
}

// Componente para contador animado
export const AnimatedCounter = ({ from = 0, to, duration = 2, delay = 0 }) => {
  const [ref, isInView] = useInView(0.5)
  const [count, setCount] = useState(from)

  useEffect(() => {
    if (!isInView) return

    const timer = setTimeout(() => {
      const increment = (to - from) / (duration * 60) // 60fps
      let current = from

      const counter = setInterval(() => {
        current += increment
        if (current >= to) {
          setCount(to)
          clearInterval(counter)
        } else {
          setCount(Math.floor(current))
        }
      }, 1000 / 60)

      return () => clearInterval(counter)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [isInView, from, to, duration, delay])

  return <span ref={ref}>{count}</span>
}

// Componente para progress bar animada
export const AnimatedProgressBar = ({ progress, height = 4, color = 'primary', delay = 0 }) => {
  const [ref, isInView] = useInView(0.5)

  return (
    <div ref={ref} className={`w-full bg-gray-700 rounded-full overflow-hidden`} style={{ height }}>
      <motion.div
        className={`h-full bg-${color} rounded-full`}
        initial={{ width: 0 }}
        animate={isInView ? { width: `${progress}%` } : { width: 0 }}
        transition={{ duration: 1.5, delay, ease: "easeOut" }}
      />
    </div>
  )
}

// Componente para efeito de morphing
export const MorphingShape = ({ shapes, duration = 2 }) => {
  const [currentShape, setCurrentShape] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShape(prev => (prev + 1) % shapes.length)
    }, duration * 1000)

    return () => clearInterval(interval)
  }, [shapes.length, duration])

  return (
    <motion.div
      animate={shapes[currentShape]}
      transition={{ duration: duration * 0.8, ease: "easeInOut" }}
      className="absolute"
    />
  )
}

// Componente para scroll suave
export const SmoothScroll = ({ children }) => {
  const { scrollY } = useScroll()
  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <motion.div style={{ y: smoothScrollY }}>
      {children}
    </motion.div>
  )
}

// Componente para efeito de glitch
export const GlitchEffect = ({ children, intensity = 1, trigger = false }) => {
  return (
    <motion.div
      animate={trigger ? {
        x: [0, -2 * intensity, 2 * intensity, 0],
        filter: [
          'hue-rotate(0deg)',
          `hue-rotate(${90 * intensity}deg)`,
          `hue-rotate(${-90 * intensity}deg)`,
          'hue-rotate(0deg)'
        ],
        textShadow: [
          '0 0 0 transparent',
          `${2 * intensity}px 0 0 #ff0000, ${-2 * intensity}px 0 0 #00ffff`,
          `${-2 * intensity}px 0 0 #ff0000, ${2 * intensity}px 0 0 #00ffff`,
          '0 0 0 transparent'
        ]
      } : {}}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}

// Componente para floating elements
export const FloatingElement = ({ children, amplitude = 10, duration = 3, delay = 0 }) => {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    >
      {children}
    </motion.div>
  )
}

export default {
  RevealAnimation,
  ParallaxElement,
  StaggeredAnimation,
  TypewriterEffect,
  AnimatedCounter,
  AnimatedProgressBar,
  MorphingShape,
  SmoothScroll,
  GlitchEffect,
  FloatingElement
}

