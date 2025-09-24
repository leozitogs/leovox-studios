import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [trails, setTrails] = useState([])
  const [cursorVariant, setCursorVariant] = useState('default')

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      
      // Adicionar trilha com efeito de partículas
      setTrails(prev => [
        ...prev.slice(-15), // Manter mais pontos para efeito mais suave
        { 
          x: e.clientX + (Math.random() - 0.5) * 10, 
          y: e.clientY + (Math.random() - 0.5) * 10, 
          id: Date.now() + Math.random(),
          size: Math.random() * 3 + 1
        }
      ])
    }

    const handleMouseDown = () => {
      setIsClicking(true)
      setCursorVariant('clicking')
    }
    
    const handleMouseUp = () => {
      setIsClicking(false)
      setCursorVariant(isHovering ? 'hovering' : 'default')
    }

    const handleMouseEnter = (e) => {
      setIsHovering(true)
      const element = e.target
      
      if (element.tagName === 'BUTTON' || element.closest('button')) {
        setCursorVariant('button')
      } else if (element.tagName === 'A' || element.closest('a')) {
        setCursorVariant('link')
      } else {
        setCursorVariant('hovering')
      }
    }
    
    const handleMouseLeave = () => {
      setIsHovering(false)
      setCursorVariant('default')
    }

    // Adicionar listeners para elementos interativos
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select')
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    window.addEventListener('mousemove', updatePosition)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [isHovering])

  // Limpar trilhas antigas
  useEffect(() => {
    const interval = setInterval(() => {
      setTrails(prev => prev.filter(trail => Date.now() - trail.id < 800))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const getCursorStyles = () => {
    switch (cursorVariant) {
      case 'hovering':
        return {
          scale: 1.5,
          backgroundColor: 'rgba(0, 255, 65, 0.8)',
          mixBlendMode: 'difference'
        }
      case 'clicking':
        return {
          scale: 0.8,
          backgroundColor: 'rgba(255, 0, 128, 0.9)',
          mixBlendMode: 'difference'
        }
      case 'button':
        return {
          scale: 2,
          backgroundColor: 'rgba(0, 212, 255, 0.6)',
          mixBlendMode: 'difference'
        }
      case 'link':
        return {
          scale: 1.8,
          backgroundColor: 'rgba(255, 0, 128, 0.7)',
          mixBlendMode: 'difference'
        }
      default:
        return {
          scale: 1,
          backgroundColor: 'rgba(0, 255, 65, 0.8)',
          mixBlendMode: 'difference'
        }
    }
  }

  return (
    <>
      {/* Cursor principal com animações */}
      <motion.div
        className="fixed w-5 h-5 rounded-full pointer-events-none z-[9999]"
        style={{
          left: position.x - 10,
          top: position.y - 10,
        }}
        animate={getCursorStyles()}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
      />

      {/* Anel externo do cursor */}
      <motion.div
        className="fixed border-2 border-primary/40 rounded-full pointer-events-none z-[9998]"
        style={{
          left: position.x - 20,
          top: position.y - 20,
        }}
        animate={{
          width: isHovering ? 50 : 40,
          height: isHovering ? 50 : 40,
          opacity: isClicking ? 0.3 : 0.6,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      />
      
      {/* Trilhas do cursor com efeito de partículas */}
      {trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          className="fixed bg-primary rounded-full pointer-events-none z-[9997]"
          style={{
            left: trail.x - trail.size / 2,
            top: trail.y - trail.size / 2,
            width: trail.size,
            height: trail.size,
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ 
            opacity: 0, 
            scale: 0,
            y: trail.y - 20
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Efeito de clique */}
      {isClicking && (
        <motion.div
          className="fixed border-4 border-primary rounded-full pointer-events-none z-[9996]"
          style={{
            left: position.x - 25,
            top: position.y - 25,
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 50, height: 50, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      )}
    </>
  )
}

export default CustomCursor

