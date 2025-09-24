import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const ShirtViewer3DSimple = ({ title, description }) => {
  const [isPaused, setIsPaused] = useState(false)
  const [currentAngle, setCurrentAngle] = useState(0)

  // Rotação automática usando CSS e JavaScript
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentAngle(prev => (prev + 1) % 360)
      }, 50) // 50ms para rotação suave
      
      return () => clearInterval(interval)
    }
  }, [isPaused])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl border border-primary/20 overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-2xl hover:shadow-primary/10"
    >
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <h3 className="text-2xl font-bold text-white mb-3 leovox-text-gradient">
            {title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {description}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative w-full h-96 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden backdrop-blur-sm border border-gray-700/50 flex items-center justify-center"
          style={{ 
            background: 'radial-gradient(circle at center, rgba(0,255,65,0.05) 0%, rgba(0,0,0,0.8) 70%)'
          }}
        >
          {/* Container da camisa com perspectiva 3D */}
          <div 
            className="relative transition-transform duration-75 ease-linear"
            style={{
              transform: `perspective(1000px) rotateY(${currentAngle}deg) rotateX(5deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Camisa principal */}
            <div className="relative">
              <img
                src="/MKPcrow.png"
                alt="Camisa Crow - Frente"
                className="w-48 h-56 object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 20px 40px rgba(0, 255, 65, 0.2))'
                }}
              />
              
              {/* Sombra projetada */}
              <div 
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black/30 rounded-full blur-md"
                style={{
                  transform: `translateX(-50%) scaleX(${0.8 + Math.sin(currentAngle * Math.PI / 180) * 0.2})`
                }}
              />
            </div>
          </div>

          {/* Efeito de brilho rotativo */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent pointer-events-none"
            style={{
              transform: `rotate(${currentAngle}deg)`,
              transformOrigin: 'center'
            }}
          />

          {/* Partículas flutuantes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/40 rounded-full"
                style={{
                  left: `${20 + (i * 15)}%`,
                  top: `${30 + Math.sin(i) * 20}%`,
                }}
                animate={{
                  y: [-10, -30, -10],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          {/* Overlay com instruções */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute top-4 left-4 text-primary text-sm font-medium opacity-70 bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm"
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎽 Visualização 3D Otimizada
            </motion.span>
          </motion.div>

          {/* Controle de pausa */}
          <div className="absolute top-4 right-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPaused(!isPaused)}
              className={`p-3 rounded-lg backdrop-blur-sm transition-all duration-300 ${
                isPaused 
                  ? 'bg-black/30 text-gray-400 border border-gray-600/30' 
                  : 'bg-primary/20 text-primary border border-primary/30'
              }`}
              title={isPaused ? 'Retomar rotação' : 'Pausar rotação'}
            >
              {isPaused ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
              )}
            </motion.button>
          </div>

          {/* Indicador de ângulo */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-300">{Math.round(currentAngle)}°</span>
              </div>
            </div>
          </div>

          {/* Indicador de performance */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-gray-300">Performance Otimizada</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Informações técnicas com animação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-6 pt-6 border-t border-gray-700/50"
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
              <span className="text-gray-400 block mb-1">Tecnologia</span>
              <span className="text-primary font-medium">CSS 3D Transform</span>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
              <span className="text-gray-400 block mb-1">Performance</span>
              <span className="text-green-400 font-medium">Ultra Leve</span>
            </div>
          </div>
          
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-4 h-1 bg-gradient-to-r from-primary via-blue-400 to-purple-500 rounded-full"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ShirtViewer3DSimple;

