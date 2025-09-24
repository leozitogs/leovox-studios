import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import ShirtViewer3DImproved from './ShirtViewer3DImproved'

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const projectCategories = [
    {
      id: 'identidade-visual',
      title: "Identidade Visual",
      description: "Criação de marcas únicas e impactantes",
      projects: [
        {
          title: "Identidade Visual Alhito",
          image: "/portfolio/Identidade Visual/Identidade Visual/Identidade Visual Alhito.jpg",
          description: "Desenvolvimento completo de identidade visual com conceito moderno e impactante."
        },
        {
          title: "Identidade Visual Flame",
          image: "/portfolio/Identidade Visual/Identidade Visual/Identidade Visual Flame.jpg",
          description: "Marca com temática de fogo, transmitindo energia e dinamismo."
        },
        {
          title: "Identidade Visual Papaya",
          image: "/portfolio/Identidade Visual/Identidade Visual/Identidade Visual Papaya.jpg",
          description: "Identidade tropical e vibrante para marca de alimentos."
        },
        {
          title: "Identidade Visual Pako",
          image: "/portfolio/Identidade Visual/Identidade Visual/Identidade Visual Pako.jpg",
          description: "Identidade visual robusta e profissional."
        },
        {
          title: "Identidade Visual Querencia",
          image: "/portfolio/Identidade Visual/Identidade Visual/Identidade Visual Querencia.jpg",
          description: "Marca com conceito rural e autêntico."
        },
        {
          title: "Identidade Visual Inferno",
          image: "/portfolio/Identidade Visual/Identidade Visual/Identidade Visual inferno.jpg",
          description: "Identidade visual com temática intensa e impactante."
        },
        {
          title: "Logo Burguer Chew",
          image: "/portfolio/Identidade Visual/Logo Simples/Logo Burguer Chew.jpg",
          description: "Logo para hamburgueria com conceito jovem e descontraído."
        },
        {
          title: "Logo Dope",
          image: "/portfolio/Identidade Visual/Logo Simples/Logo Dope.jpg",
          description: "Logo moderno e estiloso."
        },
        {
          title: "Logo Saint Mercy",
          image: "/portfolio/Identidade Visual/Logo Simples/Logo saintmercy.jpg",
          description: "Logo elegante e sofisticado."
        },
        {
          title: "Logo Shark",
          image: "/portfolio/Identidade Visual/Logo Simples/Logo Shark.jpg",
          description: "Logo com temática marinha e força."
        }
      ]
    },
    {
      id: 'social-media',
      title: "Social Media e Posts",
      description: "Conteúdo visual para redes sociais",
      projects: [
        {
          title: "Posts Açaí",
          image: "/portfolio/Social Media e Posts/Posts Açaí.jpg",
          description: "Posts promocionais para açaiteria com visual tropical."
        },
        {
          title: "Posts Hambúrguer",
          image: "/portfolio/Social Media e Posts/Posts Hambúrguer.jpg",
          description: "Conteúdo visual apetitoso para hamburgueria."
        },
        {
          title: "Posts Gamer",
          image: "/portfolio/Social Media e Posts/Posts Gamer.jpg",
          description: "Posts com temática gamer e tecnológica."
        },
        {
          title: "Posts Pets",
          image: "/portfolio/Social Media e Posts/Posts Pets.jpg",
          description: "Conteúdo fofo e atrativo para pet shop."
        },
        {
          title: "Posts Burritos",
          image: "/portfolio/Social Media e Posts/Posts Burritos.jpg",
          description: "Posts promocionais para restaurante mexicano."
        },
        {
          title: "Posts Churros",
          image: "/portfolio/Social Media e Posts/Posts Churros.jpg",
          description: "Conteúdo visual para doceria especializada."
        },
        {
          title: "Posts Peixaria",
          image: "/portfolio/Social Media e Posts/Posts Peixaria.jpg",
          description: "Posts para peixaria com foco em frescor."
        }
      ]
    },
    {
      id: 'camisas-jogos',
      title: "Camisas e Jogos Escolares",
      description: "Uniformes esportivos com identidade única",
      projects: [
        {
          title: "Camisa Blue Storm 2024",
          image: "/portfolio/Camisas e Jogos Escolares/Camisas Jogos Escolares/Camisa Blue Storm 2024.jpg",
          description: "Uniforme oficial do time Blue Storm com design moderno."
        },
        {
          title: "Camisa Blue Storm 2023",
          image: "/portfolio/Camisas e Jogos Escolares/Camisas Jogos Escolares/Camisa Blue Storm 2023.jpg",
          description: "Versão anterior do uniforme Blue Storm."
        },
        {
          title: "Camisa Midgard",
          image: "/portfolio/Camisas e Jogos Escolares/Camisas Jogos Escolares/Camisa Midgard.png",
          description: "Design inspirado na mitologia nórdica."
        },
        {
          title: "Camisa Tiger",
          image: "/portfolio/Camisas e Jogos Escolares/Camisas Jogos Escolares/Camisa Tiger.jpg",
          description: "Uniforme com temática felina e cores vibrantes."
        },
        {
          title: "Camisa Carlão",
          image: "/portfolio/Camisas e Jogos Escolares/Camisas Jogos Escolares/Camisa Carlão.jpg",
          description: "Uniforme personalizado com identidade única."
        },
        {
          title: "Camisa Premier",
          image: "/portfolio/Camisas e Jogos Escolares/Camisas Jogos Escolares/Camisa premier.jpg",
          description: "Design premium para competições."
        },
        {
          title: "Camisa Sponsor",
          image: "/portfolio/Camisas e Jogos Escolares/Camisas Jogos Escolares/Camisa sponsor.jpg",
          description: "Uniforme com integração de patrocinadores."
        },
        {
          title: "Regata Extreme",
          image: "/portfolio/Camisas e Jogos Escolares/Regatas/Regata Extreme.png",
          description: "Regata esportiva com design radical."
        },
        {
          title: "Regata Midgard",
          image: "/portfolio/Camisas e Jogos Escolares/Regatas/Regata Midgard.png",
          description: "Regata com temática nórdica."
        },
        {
          title: "Bandeira Blue Storm",
          image: "/portfolio/Camisas e Jogos Escolares/Bandeiras Jogos Escolares/Bandeira Blue Storm.jpg",
          description: "Bandeira oficial do time Blue Storm."
        },
        {
          title: "Bandeira Eagle",
          image: "/portfolio/Camisas e Jogos Escolares/Bandeiras Jogos Escolares/Bandeira Eagle.jpg",
          description: "Bandeira com símbolo da águia."
        },
        {
          title: "Bandeira Midgard",
          image: "/portfolio/Camisas e Jogos Escolares/Bandeiras Jogos Escolares/Bandeira Midgard.jpg",
          description: "Bandeira com temática nórdica."
        },
        {
          title: "Camisa 3rao",
          image: "/portfolio/Camisas e Jogos Escolares/Camisas Regulares/Camisa 3rao.jpg",
          description: "Camisa casual com design moderno."
        },
        {
          title: "Camisa Cachorro do Mangue",
          image: "/portfolio/Camisas e Jogos Escolares/Camisas Regulares/Camisa Cachorro do Mangue.png",
          description: "Design com temática regional."
        },
        {
          title: "Camisa Jardim dos Sabores - Frente",
          image: "/portfolio/Camisas e Jogos Escolares/Camisas Regulares/Frente Jardim dos Sabores.png",
          description: "Frente da camisa para restaurante."
        },
        {
          title: "Camisa Jardim dos Sabores - Trás",
          image: "/portfolio/Camisas e Jogos Escolares/Camisas Regulares/Trás Jardim dos Sabores.png",
          description: "Parte traseira da camisa para restaurante."
        }
      ]
    },
    {
      id: 'cartazes-outros',
      title: "Cartazes e Outros",
      description: "Materiais gráficos diversos",
      projects: [
        {
          title: "Cartaz LA",
          image: "/portfolio/Cartazes e Outros/Cartaz LA.png",
          description: "Cartaz promocional com estética urbana."
        },
        {
          title: "Setembro Amarelo",
          image: "/portfolio/Cartazes e Outros/setembro amarelo.jpg",
          description: "Material de conscientização para campanha de saúde mental."
        },
        {
          title: "Desmatamento",
          image: "/portfolio/Cartazes e Outros/desmatamento.jpg",
          description: "Cartaz de conscientização ambiental."
        }
      ]
    }
  ]

  const openGallery = (category) => {
    setSelectedCategory(category)
    setCurrentImageIndex(0)
  }

  const closeGallery = () => {
    setSelectedCategory(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedCategory) {
      setCurrentImageIndex((prev) => 
        prev === selectedCategory.projects.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (selectedCategory) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedCategory.projects.length - 1 : prev - 1
      )
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="projects" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="leovox-text-gradient">Meus Projetos</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Uma seleção dos meus trabalhos mais recentes e impactantes
          </p>
        </motion.div>

        {/* Categorias de Projetos */}
        {projectCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="leovox-text-gradient">{category.title}</span>
              </h3>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                {category.description}
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {category.projects.map((project, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="project-card bg-black rounded-lg overflow-hidden group"
                  whileHover={{ y: -10 }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button 
                        className="p-3 bg-primary text-black rounded-full hover:bg-primary/90 transition-colors duration-300"
                        onClick={() => openGallery(category)}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Modal de Galeria */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeGallery}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-gray-900 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedCategory.title}</h3>
                  <p className="text-gray-400">{selectedCategory.description}</p>
                </div>
                <button
                  onClick={closeGallery}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Image Display */}
              <div className="relative">
                <div className="aspect-video bg-black flex items-center justify-center">
                  <img
                    src={selectedCategory.projects[currentImageIndex].image}
                    alt={selectedCategory.projects[currentImageIndex].title}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop'
                    }}
                  />
                </div>

                {/* Navigation Arrows */}
                {selectedCategory.projects.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {selectedCategory.projects.length}
                </div>
              </div>

              {/* Image Info */}
              <div className="p-6">
                <h4 className="text-xl font-bold text-white mb-2">
                  {selectedCategory.projects[currentImageIndex].title}
                </h4>
                <p className="text-gray-400">
                  {selectedCategory.projects[currentImageIndex].description}
                </p>
              </div>

              {/* Thumbnails */}
              {selectedCategory.projects.length > 1 && (
                <div className="p-6 pt-0">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedCategory.projects.map((project, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex
                            ? 'border-primary'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects

