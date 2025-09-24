import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { motion } from 'framer-motion'

// Componente da camisa 3D
function ShirtModel({ isPaused, ...props }) {
  const meshRef = useRef()
  const { scene } = useGLTF('/CamisaCrow.glb')
  
  // Rotação automática
  useFrame((state, delta) => {
    if (meshRef.current && !isPaused) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <primitive 
      ref={meshRef} 
      object={scene} 
      scale={[1.5, 1.5, 1.5]} 
      position={[0, -0.5, 0]}
      {...props} 
    />
  )
}

// Componente de loading
function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-primary font-medium">Carregando modelo 3D...</p>
      </div>
    </div>
  )
}

const ShirtViewer3D = ({ title, description }) => {
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
          {/* Canvas 3D */}
          <Canvas
            camera={{ position: [0, 0, 4], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
            onCreated={() => setIsLoading(false)}
          >
            <Suspense fallback={null}>
              {/* Iluminação */}
              <ambientLight intensity={0.4} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <pointLight position={[-10, -10, -10]} intensity={0.3} color="#00ff41" />
              
              {/* Ambiente */}
              <Environment preset="studio" />
              
              {/* Modelo da camisa */}
              <ShirtModel isPaused={isPaused} />
              
              {/* Sombras */}
              <ContactShadows 
                position={[0, -1.4, 0]} 
                opacity={0.4} 
                scale={10} 
                blur={1.5} 
                far={4.5} 
              />
              
              {/* Controles de órbita (opcional - pode ser desabilitado) */}
              <OrbitControls 
                enablePan={false}
                enableZoom={false}
                minPolarAngle={Math.PI / 2.2}
                maxPolarAngle={Math.PI / 1.8}
                autoRotate={!isPaused}
                autoRotateSpeed={2}
              />
            </Suspense>
          </Canvas>

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
              <Loader />
            </div>
          )}

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
              🎽 Arraste para rotacionar • Scroll para zoom
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

          {/* Indicador de qualidade */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-300">Modelo 3D Carregado</span>
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
              <span className="text-primary font-medium">Three.js + GLB</span>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
              <span className="text-gray-400 block mb-1">Interação</span>
              <span className="text-primary font-medium">360° + Zoom</span>
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

// Preload do modelo GLB
useGLTF.preload('/CamisaCrow.glb')

export default ShirtViewer3D;

