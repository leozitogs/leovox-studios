import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'

// Componente da camisa 3D otimizado
function ShirtModel({ isPaused, ...props }) {
  const meshRef = useRef()
  const { scene, error } = useGLTF('/CamisaCrow.glb')
  
  // Rotação automática suave
  useFrame((state, delta) => {
    if (meshRef.current && !isPaused) {
      meshRef.current.rotation.y += delta * 0.3 // Rotação mais suave
    }
  })

  if (error) {
    return (
      <Html center>
        <div className="text-red-400 text-center">
          <p>Erro ao carregar modelo 3D</p>
          <p className="text-sm">Usando fallback...</p>
        </div>
      </Html>
    )
  }

  return (
    <primitive 
      ref={meshRef} 
      object={scene} 
      scale={[1.2, 1.2, 1.2]} // Escala otimizada
      position={[0, -1, 0]} // Posição corrigida para melhor enquadramento
      {...props} 
    />
  )
}

// Componente de loading aprimorado
function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4 shadow-lg shadow-primary/20"
        />
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-primary font-medium"
        >
          Carregando modelo 3D...
        </motion.p>
        <div className="mt-2 w-32 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden">
          <motion.div
            animate={{ x: [-128, 128] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
          />
        </div>
      </div>
    </div>
  )
}

// Componente de fallback para quando o modelo não carrega
function FallbackViewer({ shirtImage }) {
  const [currentAngle, setCurrentAngle] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAngle(prev => (prev + 1) % 360)
    }, 50)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center h-full">
      <div 
        className="relative transition-transform duration-75 ease-linear"
        style={{
          transform: `perspective(1000px) rotateY(${currentAngle}deg) rotateX(5deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <img
          src={shirtImage || "/MKPcrow.png"}
          alt="Camisa Crow - Visualização"
          className="w-48 h-56 object-contain drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0, 255, 65, 0.3))'
          }}
        />
        <div 
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black/30 rounded-full blur-md"
          style={{
            transform: `translateX(-50%) scaleX(${0.8 + Math.sin(currentAngle * Math.PI / 180) * 0.2})`
          }}
        />
      </div>
    </div>
  )
}

const ShirtViewer3DImproved = ({ title, description, shirtImage }) => {
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Simular progresso de carregamento
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 200)
      
      return () => clearInterval(interval)
    }
  }, [isLoading])

  const handleModelLoad = () => {
    setIsLoading(false)
    setLoadingProgress(100)
  }

  const handleModelError = () => {
    setHasError(true)
    setIsLoading(false)
  }

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
          className="relative w-full h-96 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden backdrop-blur-sm border border-gray-700/50"
        >
          {/* Canvas 3D ou Fallback */}
          {!hasError ? (
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }} // Câmera otimizada
              style={{ width: '100%', height: '100%' }}
              onCreated={handleModelLoad}
              onError={handleModelError}
              gl={{ 
                antialias: true, 
                alpha: true,
                powerPreference: "high-performance"
              }}
            >
              <Suspense fallback={null}>
                {/* Iluminação aprimorada */}
                <ambientLight intensity={0.6} />
                <directionalLight 
                  position={[5, 5, 5]} 
                  intensity={1.2}
                  castShadow
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                  shadow-camera-far={50}
                  shadow-camera-left={-10}
                  shadow-camera-right={10}
                  shadow-camera-top={10}
                  shadow-camera-bottom={-10}
                />
                <pointLight position={[-5, -5, -5]} intensity={0.4} color="#00ff41" />
                <spotLight 
                  position={[0, 10, 0]} 
                  intensity={0.5} 
                  angle={0.3} 
                  penumbra={1} 
                  color="#ffffff"
                />
                
                {/* Ambiente otimizado */}
                <Environment preset="studio" />
                
                {/* Modelo da camisa */}
                <ShirtModel isPaused={isPaused} />
                
                {/* Sombras aprimoradas */}
                <ContactShadows 
                  position={[0, -1.8, 0]} 
                  opacity={0.6} 
                  scale={8} 
                  blur={2} 
                  far={4} 
                  color="#000000"
                />
                
                {/* Controles otimizados */}
                <OrbitControls 
                  enablePan={false}
                  enableZoom={true}
                  minDistance={3}
                  maxDistance={8}
                  minPolarAngle={Math.PI / 3}
                  maxPolarAngle={Math.PI / 1.5}
                  autoRotate={!isPaused}
                  autoRotateSpeed={1.5}
                  dampingFactor={0.05}
                  enableDamping={true}
                />
              </Suspense>
            </Canvas>
          ) : (
            <FallbackViewer shirtImage={shirtImage} />
          )}

          {/* Loading overlay aprimorado */}
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center"
              >
                <Loader />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay com instruções animado */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute top-4 left-4 text-primary text-sm font-medium bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-primary/20"
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex items-center gap-2"
            >
              <span className="text-lg">🎽</span>
              {hasError ? 'Visualização Otimizada' : 'Arraste para rotacionar • Scroll para zoom'}
            </motion.span>
          </motion.div>

          {/* Controle de pausa aprimorado */}
          <div className="absolute top-4 right-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPaused(!isPaused)}
              className={`p-3 rounded-lg backdrop-blur-sm transition-all duration-300 border ${
                isPaused 
                  ? 'bg-black/40 text-gray-400 border-gray-600/30 hover:border-gray-500/50' 
                  : 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30'
              }`}
              title={isPaused ? 'Retomar rotação' : 'Pausar rotação'}
            >
              <motion.div
                animate={{ rotate: isPaused ? 0 : 360 }}
                transition={{ duration: 2, repeat: isPaused ? 0 : Infinity, ease: "linear" }}
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
              </motion.div>
            </motion.button>
          </div>

          {/* Indicador de qualidade aprimorado */}
          <div className="absolute bottom-4 left-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/20"
            >
              <div className="flex items-center gap-2">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-2 h-2 rounded-full ${hasError ? 'bg-yellow-400' : 'bg-green-400'}`}
                />
                <span className="text-xs text-gray-300">
                  {hasError ? 'Modo Compatibilidade' : 'Modelo 3D Ativo'}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Efeitos visuais adicionais */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Partículas flutuantes */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                style={{
                  left: `${15 + (i * 10)}%`,
                  top: `${20 + Math.sin(i) * 30}%`,
                }}
                animate={{
                  y: [-20, -40, -20],
                  opacity: [0.1, 0.6, 0.1],
                  scale: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 4 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.7,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Informações técnicas com animação aprimorada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-6 pt-6 border-t border-gray-700/50"
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30 hover:border-primary/30 transition-all duration-300"
            >
              <span className="text-gray-400 block mb-1">Tecnologia</span>
              <span className="text-primary font-medium">
                {hasError ? 'CSS 3D + Fallback' : 'Three.js + GLB'}
              </span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30 hover:border-primary/30 transition-all duration-300"
            >
              <span className="text-gray-400 block mb-1">Interação</span>
              <span className="text-primary font-medium">360° + Zoom</span>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
            className="mt-4 h-1 bg-gradient-to-r from-primary via-blue-400 to-purple-500 rounded-full relative overflow-hidden"
          >
            <motion.div
              animate={{ x: [-20, 100, -20] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-white/20 w-8 skew-x-12"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Preload do modelo GLB com tratamento de erro
try {
  useGLTF.preload('/CamisaCrow.glb')
} catch (error) {
  console.warn('Erro ao precarregar modelo 3D:', error)
}

export default ShirtViewer3DImproved;

