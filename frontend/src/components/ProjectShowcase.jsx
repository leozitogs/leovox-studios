import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Eye, Palette, Megaphone, Calendar } from 'lucide-react'
import ShirtViewer3DImproved from './ShirtViewer3DImproved'

const ProjectShowcase = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 'viewer3d',
      type: 'viewer',
      title: 'Visualizador 3D Interativo',
      description: 'Experiência imersiva para visualização de camisas personalizadas',
      component: <ShirtViewer3DImproved />
    },
    {
      id: 'identidade-visual',
      type: 'content',
      title: 'Identidade Visual',
      description: 'Criação de marcas únicas e impactantes',
      icon: <Palette className="h-12 w-12" />,
      content: {
        title: 'O que é Identidade Visual?',
        text: 'A identidade visual é o conjunto de elementos gráficos que representam visualmente uma marca, empresa ou produto. É através dela que o público reconhece e se conecta com a marca, criando uma impressão duradoura e diferenciada no mercado.',
        features: [
          'Criação de logotipos únicos e memoráveis',
          'Desenvolvimento de paleta de cores estratégica',
          'Definição de tipografia e elementos gráficos',
          'Manual de identidade visual completo',
          'Aplicações em diversos materiais'
        ],
        example: 'Leovox Studios - Uma identidade que une tecnologia e arte'
      }
    },
    {
      id: 'campanha-digital',
      type: 'content',
      title: 'Campanha Digital - E-commerce',
      description: 'Estratégias completas para vendas online',
      icon: <Megaphone className="h-12 w-12" />,
      content: {
        title: 'Campanhas Digitais que Convertem',
        text: 'Desenvolvemos campanhas digitais completas para e-commerce, incluindo tráfego pago, criação de conteúdo e estratégias de divulgação que aumentam suas vendas e fortalecem sua marca no ambiente digital.',
        features: [
          'Gestão de tráfego pago (Google Ads, Facebook Ads)',
          'Criação de conteúdo para redes sociais',
          'Design de materiais promocionais',
          'Estratégias de branding digital',
          'Análise de performance e otimização'
        ],
        example: 'Aumente suas vendas com campanhas que realmente funcionam'
      }
    },
    {
      id: 'social-media',
      type: 'content',
      title: 'Planos de Social Media',
      description: 'Gestão completa das suas redes sociais',
      icon: <Calendar className="h-12 w-12" />,
      content: {
        title: 'Quer saber mais sobre os planos de social media?',
        text: 'Oferecemos planos completos de gestão de redes sociais, desde a criação de conteúdo até o engajamento com seu público. Nossos planos são personalizados para cada tipo de negócio.',
        features: [
          'Criação de conteúdo visual atrativo',
          'Planejamento de posts estratégicos',
          'Gestão de comunidade e engajamento',
          'Relatórios de performance detalhados',
          'Campanhas promocionais direcionadas'
        ],
        cta: 'Conheça nossos planos e serviços'
      }
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="leovox-text-gradient">Conheça os Projetos</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore nossos serviços e descubra como podemos transformar sua marca
          </p>
        </motion.div>

        {/* Showcase Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-primary/20 hover:bg-primary/40 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-primary/30"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-primary/20 hover:bg-primary/40 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-primary/30"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Slides */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-primary/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="min-h-[600px]"
              >
                {slides[currentSlide].type === 'viewer' ? (
                  // 3D Viewer Slide
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold text-white mb-4">
                        {slides[currentSlide].title}
                      </h3>
                      <p className="text-gray-300 text-lg">
                        {slides[currentSlide].description}
                      </p>
                    </div>
                    {slides[currentSlide].component}
                  </div>
                ) : (
                  // Content Slides
                  <div className="p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      {/* Icon and Title */}
                      <div className="text-center lg:text-left">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                          className="text-primary mb-6 flex justify-center lg:justify-start"
                        >
                          {slides[currentSlide].icon}
                        </motion.div>
                        
                        <h3 className="text-4xl font-bold text-white mb-6">
                          {slides[currentSlide].content.title}
                        </h3>
                        
                        <p className="text-gray-300 text-lg leading-relaxed mb-8">
                          {slides[currentSlide].content.text}
                        </p>

                        {slides[currentSlide].content.example && (
                          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
                            <p className="text-primary font-semibold">
                              Exemplo: {slides[currentSlide].content.example}
                            </p>
                          </div>
                        )}

                        {slides[currentSlide].content.cta && (
                          <motion.button
                            onClick={goToServices}
                            className="bg-primary text-black px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {slides[currentSlide].content.cta}
                          </motion.button>
                        )}
                      </div>

                      {/* Features List */}
                      <div className="space-y-4">
                        <h4 className="text-2xl font-bold text-white mb-6">
                          O que incluímos:
                        </h4>
                        {slides[currentSlide].content.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                          >
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            <span className="text-gray-300">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-primary scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectShowcase

