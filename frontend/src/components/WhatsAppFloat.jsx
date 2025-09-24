import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const WhatsAppFloat = () => {
  const whatsappUrl = "https://wa.me/qr/GFY7443T2HVOD1"

  const handleClick = () => {
    window.open(whatsappUrl, '_blank')
  }

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg z-50 hover:scale-110 transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{ 
        y: [0, -10, 0],
      }}
      transition={{
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      style={{
        boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)'
      }}
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </motion.button>
  )
}

export default WhatsAppFloat

