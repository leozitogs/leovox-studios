import { motion } from 'framer-motion'
import { 
  Palette, 
  TrendingUp, 
  Share2, 
  Shirt, 
  Target, 
  Users, 
  Zap,
  Eye,
  BarChart3,
  MessageCircle,
  Calendar,
  Award
} from 'lucide-react'

const Services = () => {
  const scrollToContact = (serviceTitle) => {
    // Scroll para a seção de contato
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
      
      // Aguarda um pouco para o scroll completar e então preenche os campos
      setTimeout(() => {
        const subjectField = document.getElementById('subject')
        const messageField = document.getElementById('message')
        
        if (subjectField) {
          subjectField.value = `Orçamento - ${serviceTitle}`
          // Dispara evento para React reconhecer a mudança
          const event = new Event('input', { bubbles: true })
          subjectField.dispatchEvent(event)
        }
        
        if (messageField) {
          const message = `Olá! Tenho interesse no serviço "${serviceTitle}" e gostaria de receber um orçamento personalizado. Poderia me enviar mais informações sobre valores, prazos e processo de trabalho?\n\nAguardo seu retorno!\n\nObrigado(a).`
          messageField.value = message
          // Dispara evento para React reconhecer a mudança
          const event = new Event('input', { bubbles: true })
          messageField.dispatchEvent(event)
        }
      }, 1000)
    }
  }
  const services = [
    {
      id: 'logo-basica',
      icon: <Palette className="h-12 w-12" />,
      title: "Logo Básica",
      subtitle: "Solução rápida e eficaz",
      description: "Logo básica ou tipografia básica em PNG para quem precisa de uma solução rápida e profissional.",
      features: [
        "Logo ou tipografia em PNG",
        "1 conceito desenvolvido",
        "Até 2 revisões incluídas",
        "Entrega em até 3 dias úteis",
        "Arquivo em alta resolução",
        "Suporte pós-entrega"
      ],
      process: [
        "Briefing rápido",
        "Desenvolvimento do conceito",
        "Revisões necessárias",
        "Entrega final"
      ],
      price: "A partir de R$ 50",
      duration: "2-3 dias"
    },
    {
      id: 'identidade-visual',
      icon: <Palette className="h-12 w-12" />,
      title: "Identidade Visual Completa",
      subtitle: "Criação completa de marca",
      description: "Desenvolvimento de identidade visual completa, desde a concepção do conceito até a aplicação em todos os materiais da marca.",
      features: [
        "Criação de logotipo único e memorável",
        "Paleta de cores estratégica",
        "Tipografia personalizada",
        "Manual de identidade visual",
        "Aplicações em diversos materiais",
        "Versões adaptadas para digital e impresso"
      ],
      process: [
        "Briefing e pesquisa de mercado",
        "Desenvolvimento de conceitos",
        "Refinamento e aprovação",
        "Criação do manual da marca"
      ],
      price: "A partir de R$ 200",
      duration: "7-15 dias"
    },
    {
      id: 'trafego-pago',
      icon: <TrendingUp className="h-12 w-12" />,
      title: "Tráfego Pago & Marketing Digital",
      subtitle: "Estratégias que convertem",
      description: "Criação de materiais visuais para campanhas de tráfego pago, estratégia de marketing e análise de leads que geram resultados mensuráveis.",
      features: [
        "Criativos para Facebook e Instagram Ads",
        "Banners para Google Ads",
        "Landing pages otimizadas",
        "Estratégia de marketing digital",
        "Análise de leads e conversões",
        "Relatórios de performance"
      ],
      process: [
        "Análise do público-alvo",
        "Desenvolvimento da estratégia",
        "Criação de criativos",
        "Monitoramento e otimização"
      ],
      price: "A partir de R$ 200",
      duration: "7-15 dias"
    },
    {
      id: 'social-media',
      icon: <Share2 className="h-12 w-12" />,
      title: "Social Media",
      subtitle: "Presença digital marcante",
      description: "Criação de conteúdo visual para redes sociais que engaja, converte e fortalece a presença digital da sua marca.",
      features: [
        "Posts para feed do Instagram",
        "Stories animados e estáticos",
        "Capas para destaques",
        "Posts para Facebook e LinkedIn",
        "Carrosséis informativos",
        "Templates personalizados"
      ],
      process: [
        "Planejamento de conteúdo",
        "Criação dos materiais",
        "Agendamento estratégico",
        "Monitoramento e ajustes"
      ],
      price: "A partir de R$ 100/semana",
      duration: "Serviço contínuo"
    },
    {
      id: 'camisas-jogos',
      icon: <Shirt className="h-12 w-12" />,
      title: "Camisas de Jogos Interescolares",
      subtitle: "Uniformes que inspiram vitória",
      description: "Design especializado em uniformes esportivos para jogos interescolares, combinando identidade única com funcionalidade.",
      features: [
        "Design exclusivo e personalizado",
        "Cores e elementos da instituição",
        "Tipografia esportiva impactante",
        "Elementos gráficos únicos",
        "Adaptação para diferentes modalidades",
        "Mockups 3D realistas"
      ],
      process: [
        "Briefing com a instituição",
        "Pesquisa de referências",
        "Desenvolvimento do conceito",
        "Apresentação em 3D"
      ],
      price: "A partir de R$ 135",
      duration: "5-10 dias"
    },
    {
      id: 'diversos',
      icon: <Palette className="h-12 w-12" />,
      title: "Diversos",
      subtitle: "Artes independentes e materiais gráficos",
      description: "Criação de artes separadas e independentes, cartazes, pôsteres informativos e diversos materiais gráficos personalizados.",
      features: [
        "Cartazes e pôsteres informativos",
        "Artes para eventos e campanhas",
        "Materiais gráficos diversos",
        "Flyers e panfletos",
        "Banners digitais",
        "Artes para impressão"
      ],
      process: [
        "Briefing do projeto",
        "Desenvolvimento da arte",
        "Revisões e ajustes",
        "Entrega nos formatos solicitados"
      ],
      price: "A partir de R$ 20",
      duration: "3-7 dias"
    }
  ]

  const plans = [
    {
      name: "Plano Básico",
      icon: <Target className="h-8 w-8" />,
      price: "R$ 100",
      period: "/semana",
      description: "Ideal para pequenos negócios",
      features: [
        "2 posts para feed",
        "1 story por dia",
        "1 capa de destaque",
        "Planejamento semanal",
        "Suporte via WhatsApp"
      ],
      popular: false
    },
    {
      name: "Plano Profissional",
      icon: <Zap className="h-8 w-8" />,
      price: "R$ 175",
      period: "/semana",
      description: "Para empresas em crescimento",
      features: [
        "3 posts para feed",
        "2 stories por dia",
        "2 capas de destaques",
        "1 carrossel informativo",
        "Planejamento estratégico",
        "Relatórios semanais",
        "Suporte prioritário"
      ],
      popular: true
    },
    {
      name: "Plano Premium",
      icon: <Award className="h-8 w-8" />,
      price: "R$ 300",
      period: "/semana",
      description: "Solução completa",
      features: [
        "5 posts para feed",
        "Stories ilimitados",
        "Capas personalizadas",
        "Carrosséis e vídeos",
        "Gestão completa das redes",
        "Relatórios detalhados",
        "Consultoria estratégica",
        "Suporte 24/7"
      ],
      popular: false
    }
  ]

  return (
    <section id="services" className="py-20 bg-black">
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
            <span className="leovox-text-gradient">Meus Serviços</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Soluções completas em design gráfico e marketing digital para elevar sua marca ao próximo nível
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="flex items-start gap-6 mb-6">
                <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-primary font-medium">{service.subtitle}</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">{service.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    O que inclui:
                  </h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-gray-400 text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Processo:
                  </h4>
                  <ul className="space-y-2">
                    {service.process.map((step, idx) => (
                      <li key={idx} className="text-gray-400 text-sm flex items-start gap-2">
                        <span className="text-primary font-bold text-xs mt-1">{idx + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-700">
                <div>
                  <div className="text-primary font-bold text-lg">{service.price}</div>
                  <div className="text-gray-400 text-sm">{service.duration}</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-300"
                  onClick={() => scrollToContact(service.title)}
                >
                  Solicitar Orçamento
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Media Plans */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="leovox-text-gradient">Planos de Social Media</span>
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Escolha o plano ideal para gerenciar suas redes sociais com conteúdo de qualidade e estratégia profissional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-8 border transition-all duration-300 flex flex-col h-full ${
                  plan.popular 
                    ? 'border-primary shadow-2xl shadow-primary/20 scale-105' 
                    : 'border-gray-700 hover:border-primary/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-black px-4 py-2 rounded-full text-sm font-bold">
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="text-primary mb-4 flex justify-center">
                    {plan.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 mt-auto ${
                    plan.popular
                      ? 'bg-primary text-black hover:bg-primary/90'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                  onClick={() => scrollToContact(plan.name)}
                >
                  Escolher Plano
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl p-12 border border-primary/20"
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Pronto para transformar sua marca?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Entre em contato e vamos conversar sobre como posso ajudar a elevar sua presença digital e criar uma identidade visual marcante.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-300"
              onClick={() => window.open('https://wa.me/qr/GFY7443T2HVOD1', '_blank')}
            >
              <MessageCircle className="inline-block mr-2 h-5 w-5" />
              Falar no WhatsApp
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors duration-300"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calendar className="inline-block mr-2 h-5 w-5" />
              Agendar Reunião
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services

