import { motion } from 'framer-motion'
import { useState } from 'react'

const BrandShowcase = () => {
  const [activeVariant, setActiveVariant] = useState(0)
  
  const brandVariants = [
    {
      id: 'complete',
      name: 'Logo Completo',
      image: '/1.png',
      description: 'Versão principal com personagem e tipografia'
    },
    {
      id: 'text',
      name: 'Tipografia',
      image: '/3.png',
      description: 'Logotipo isolado com gradiente característico'
    },
    {
      id: 'initials',
      name: 'Iniciais LX',
      image: '/5.png',
      description: 'Versão simplificada para aplicações menores'
    },
    {
      id: 'character',
      name: 'Personagem',
      image: '/9.png',
      description: 'Mascote da marca com identidade única'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="leovox-text-gradient">Identidade Leovox Studios</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Uma marca que une tecnologia, design e a força visual do universo anime em uma identidade única e impactante
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Showcase Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-800 to-black rounded-2xl p-12 border border-primary/20 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-primary rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                    }}
                  />
                ))}
              </div>

              {/* Logo Display */}
              <div className="relative z-10 flex items-center justify-center h-80">
                <motion.img
                  key={activeVariant}
                  src={brandVariants[activeVariant].image}
                  alt={brandVariants[activeVariant].name}
                  className="max-w-full max-h-full object-contain"
                  initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200
                  }}
                />
              </div>

              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>

            {/* Brand Info */}
            <motion.div
              key={activeVariant}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                {brandVariants[activeVariant].name}
              </h3>
              <p className="text-gray-400">
                {brandVariants[activeVariant].description}
              </p>
            </motion.div>
          </motion.div>

          {/* Controls and Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Variações da Marca
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  A identidade visual da Leovox Studios foi desenvolvida para ser versátil e impactante, 
                  combinando elementos do universo anime com design moderno e tecnológico.
                </p>
              </div>

              {/* Variant Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {brandVariants.map((variant, index) => (
                  <motion.button
                    key={variant.id}
                    onClick={() => setActiveVariant(index)}
                    className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                      activeVariant === index
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-gray-700 bg-gray-800/50 hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-semibold text-white mb-1">
                      {variant.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {variant.description}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Brand Attributes */}
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                <h4 className="text-xl font-bold text-white mb-4">Atributos da Marca</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-primary font-semibold mb-1">Cores Principais</div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 border-2 border-white/20"></div>
                      <div className="w-6 h-6 rounded-full bg-black border-2 border-white/20"></div>
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300"></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-primary font-semibold mb-1">Estilo</div>
                    <div className="text-gray-300 text-sm">Angular, Moderno, Anime</div>
                  </div>
                  <div>
                    <div className="text-primary font-semibold mb-1">Personalidade</div>
                    <div className="text-gray-300 text-sm">Ousado, Inovador, Único</div>
                  </div>
                  <div>
                    <div className="text-primary font-semibold mb-1">Aplicação</div>
                    <div className="text-gray-300 text-sm">Digital, Impressa, 3D</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Brand Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl p-12 border border-primary/20">
            <h3 className="text-3xl font-bold text-white mb-6">
              A História por Trás da Marca
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
              A Leovox Studios nasceu da paixão por unir <span className="text-primary font-semibold">tecnologia e arte</span> em 
              uma identidade visual única. Inspirada no universo anime e na estética cyberpunk, a marca representa a 
              <span className="text-primary font-semibold"> força criativa</span> e a <span className="text-primary font-semibold">inovação tecnológica</span> que 
              definem cada projeto. O personagem mascote simboliza a personalidade ousada e a energia criativa que 
              impulsiona todos os trabalhos da Leovox Studios.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default BrandShowcase

