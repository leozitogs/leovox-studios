import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Instagram, Linkedin, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', null

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      // Remove a mensagem de status após 5 segundos
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      info: "studiosleovox@gmail.com",
      link: "mailto:studiosleovox@gmail.com"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Telefone",
      info: "+55 (81) 98453-9741",
      link: "tel:+5581984539741"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Localização",
      info: "Recife, PE",
      link: "#"
    }
  ]

  const socialLinks = [
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      url: "#",
      color: "hover:text-pink-500"
    },
    {
      name: "Behance",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.5 4.5h3.5c1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5H6.5v-7zm0 9h4c2.21 0 4 1.79 4 4s-1.79 4-4 4h-4v-8zm8.5-6h5v1h-5v-1z"/>
        </svg>
      ),
      url: "#",
      color: "hover:text-blue-500"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      url: "#",
      color: "hover:text-blue-600"
    },
    {
      name: "Dribbble",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.5 6H14.8c-.3-1.2-.7-2.3-1.2-3.3 1.8.7 3.2 2.1 3.9 3.3zM12 4c.6 0 1.1.1 1.6.3-.4.9-.8 1.9-1.1 2.9-.3-1-.7-2-1.1-2.9.5-.2 1-.3 1.6-.3zm-1.5.3c-.4.9-.8 1.9-1.1 2.9-.3-1-.7-2-1.1-2.9.7-.2 1.4-.2 2.2 0zm-2.7.9c-.5 1-1 2.1-1.2 3.3H4.5c.7-1.2 2.1-2.6 3.3-3.3zM4.2 9.5h2.9c-.1.8-.1 1.6 0 2.5H4.2c-.3-.8-.3-1.7 0-2.5zm.3 4h2.6c.3 1.2.7 2.3 1.2 3.3-1.2-.7-2.6-2.1-3.3-3.3h-.5zm4.7 4.2c.4-.9.8-1.9 1.1-2.9.3 1 .7 2 1.1 2.9-.7.2-1.4.2-2.2 0zm2.7-.9c.5-1 1-2.1 1.2-3.3h2.6c-.7 1.2-2.1 2.6-3.3 3.3h-.5zm4.6-4.8h-2.9c.1-.8.1-1.6 0-2.5h2.9c.3.8.3 1.7 0 2.5z"/>
        </svg>
      ),
      url: "#",
      color: "hover:text-pink-400"
    }
  ]

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="leovox-text-gradient">Vamos Conversar</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Tem um projeto em mente? Vamos transformar suas ideias em realidade
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informações de Contato */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Entre em Contato</h3>
              <p className="text-gray-400 mb-8">
                Estou sempre aberto a discutir novos projetos, oportunidades criativas ou parcerias. 
                Vamos criar algo incrível juntos!
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-primary/50 transition-all duration-300 group"
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{item.title}</h4>
                    <p className="text-gray-400">{item.info}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="pt-8">
              <h4 className="text-white font-semibold mb-4">Me siga nas redes sociais</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-gray-900 rounded-lg border border-gray-800 hover:border-primary/50 text-gray-400 ${social.color} transition-all duration-300`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Formulário de Contato */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gray-900 p-8 rounded-lg border border-gray-800"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors duration-300"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors duration-300"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-white font-medium mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors duration-300"
                  placeholder="Assunto da mensagem"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-white font-medium mb-2">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors duration-300 resize-none"
                  placeholder="Conte-me sobre seu projeto..."
                />
              </div>
              
              {/* Mensagens de Status */}
              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg flex items-center gap-3 ${
                    submitStatus === 'success' 
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                      : 'bg-red-500/20 border border-red-500/30 text-red-400'
                  }`}
                >
                  {submitStatus === 'success' ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Mensagem enviada com sucesso! Retornarei em breve.</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5" />
                      <span>Erro ao enviar mensagem. Tente novamente ou entre em contato diretamente.</span>
                    </>
                  )}
                </motion.div>
              )}
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 ${
                  isSubmitting 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-black hover:bg-primary/90'
                }`}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                <Send className="h-5 w-5" />
                <span>{isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact

