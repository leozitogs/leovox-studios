import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { ArrowDown, Sparkles, Zap, Palette } from 'lucide-react'

const Hero = () => {
  const floatingElements = [
    { icon: Sparkles, delay: 0, x: -20, y: -30 },
    { icon: Zap, delay: 0.5, x: 30, y: -20 },
    { icon: Palette, delay: 1, x: -30, y: 20 },
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-primary/30"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Icons */}
      {floatingElements.map((element, index) => {
        const IconComponent = element.icon;
        return (
          <motion.div
            key={index}
            className="absolute text-primary/20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, element.x, 0],
              y: [0, element.y, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
            style={{
              top: `${20 + index * 20}%`,
              right: `${10 + index * 15}%`,
            }}
          >
            <IconComponent size={32} />
          </motion.div>
        );
      })}

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Animated Title */}
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.span 
              className="leovox-text-gradient block"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              DESIGNER
            </motion.span>
            <motion.span 
              className="leovox-text-gradient block"
              animate={{ 
                backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              GRÁFICO
            </motion.span>
            
            {/* Glowing effect */}
            <motion.div
              className="absolute inset-0 leovox-text-gradient blur-xl opacity-20"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              DESIGNER<br />GRÁFICO
            </motion.div>
          </motion.h1>

          {/* Subtitle with typewriter effect */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 0.8 }}
              className="inline-block overflow-hidden"
              style={{ whiteSpace: 'normal' }}
            >
              Criando experiências visuais únicas que conectam marcas e pessoas através do design inovador
            </motion.span>
          </motion.p>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center gap-8 mb-8 text-sm md:text-base"
          >
            {[
              { number: "50+", label: "Projetos" },
              { number: "3+", label: "Anos" },
              { number: "100%", label: "Satisfação" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="text-2xl md:text-3xl font-bold text-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    delay: 1 + index * 0.1 
                  }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button with enhanced animations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary via-blue-400 to-purple-500 hover:from-primary/90 hover:via-blue-400/90 hover:to-purple-500/90 text-black font-semibold px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-primary/25 transition-all duration-300 border-0"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Ver Meus Projetos
                </motion.span>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="ml-2"
                >
                  <Sparkles size={20} />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center text-gray-400"
            >
              <span className="text-sm mb-2">Role para baixo</span>
              <motion.div
                animate={{ 
                  y: [0, 5, 0],
                  opacity: [0.5, 1, 0.5] 
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowDown size={24} />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Particle effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero

