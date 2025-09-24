import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const CustomCursorAdvanced = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState('default')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    // Add event listeners for interactive elements
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], .cursor-pointer, input, textarea')
      
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => setCursorVariant('hover'))
        el.addEventListener('mouseleave', () => setCursorVariant('default'))
      })
    }

    document.addEventListener('mousemove', updateMousePosition)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    
    // Add listeners after a short delay to ensure DOM is ready
    setTimeout(addHoverListeners, 100)

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Neon effect on buttons when hovering */}
      <style jsx global>{`
        a:hover, button:hover, [role="button"]:hover, .cursor-pointer:hover {
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.5), 0 0 40px rgba(0, 255, 65, 0.3) !important;
          transition: box-shadow 0.3s ease !important;
        }
      `}</style>
    </>
  )
}

export default CustomCursorAdvanced

