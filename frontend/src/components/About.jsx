import { motion } from 'framer-motion'
import { Palette, Monitor, Smartphone, Lightbulb, Users, Zap } from 'lucide-react'

const About = () => {
  const skills = [
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Design Gráfico",
      description: "Criação de identidades visuais, logos e materiais gráficos impactantes para fortalecer sua marca"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "UI/UX Design",
      description: "Design de experiências digitais intuitivas e centradas no usuário para web e mobile"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Marketing Digital",
      description: "Estratégias visuais para redes sociais, tráfego pago e campanhas publicitárias eficazes"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Camisas de Jogos",
      description: "Especialista em uniformes esportivos para jogos interescolares com design único e impactante"
    }
  ]

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
    <section id="about" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Texto sobre */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="leovox-text-gradient">Sobre Mim</span>
            </h2>
            <div className="space-y-6 text-gray-300 text-lg">
              <p>
                Sou <span className="text-primary font-semibold">Leonardo Gonçalves</span>, estou cursando bacharelado em 
                <span className="text-primary font-semibold"> Ciência da Computação</span> pela Universidade Federal de Pernambuco 
                e trabalho como <span className="text-primary font-semibold">Designer Gráfico freelancer</span> há aproximadamente 4 anos.
              </p>
              <p>
                Criador da <span className="text-primary font-semibold">Leovox Studios</span>, uma marca que nasceu da vontade de unir 
                <span className="text-primary font-semibold"> tecnologia, design e criatividade</span> em um só espaço.
              </p>
              <p>
                Tenho uma paixão por transformar ideias em algo visualmente impactante, explorando uma estética ousada e elegante, 
                marcada pela força e originalidade da identidade Leovox. Acredito que a 
                <span className="text-primary font-semibold"> tecnologia e a arte caminham lado a lado</span>, e meu objetivo é 
                construir projetos que transmitam tanto inovação quanto personalidade.
              </p>
              <p>
                Faço projetos de <span className="text-primary font-semibold">marketing digital e tráfego pago, social media, 
                criação de logos e identidade visual, postagens e propagandas, camisas de jogos, cartazes</span>, dentre outros 
                projetos relacionados a <span className="text-primary font-semibold">UX/UI e criação visual</span>.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <div className="flex flex-wrap gap-4">
                {['Photoshop', 'Illustrator', 'Figma', 'After Effects', 'InDesign', 'Sketch'].map((tool, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-black border border-primary/30 text-primary rounded-lg text-sm font-medium hover:border-primary/60 transition-colors duration-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-black p-6 rounded-lg border border-gray-800 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{skill.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{skill.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { number: "50+", label: "Projetos Concluídos" },
            { number: "30+", label: "Clientes Satisfeitos" },
            { number: "4+", label: "Anos de Experiência" },
            { number: "100%", label: "Dedicação" }
          ].map((stat, index) => (
            <motion.div 
              key={index} 
              className="group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl md:text-4xl font-bold leovox-text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default About

