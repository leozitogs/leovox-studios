import { Heart } from 'lucide-react'
import logo from '../assets/1.png'

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Leovox" className="h-8 w-auto" />
              <span className="text-xl font-bold leovox-text-gradient">LEOVOX</span>
            </div>
            <p className="text-gray-400">
              Designer gráfico especializado em criar experiências visuais únicas 
              que conectam marcas e pessoas.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-400 hover:text-primary transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#projects" className="text-gray-400 hover:text-primary transition-colors">
                  Projetos
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-primary transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-primary transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="text-white font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Design Gráfico</li>
              <li className="text-gray-400">Identidade Visual</li>
              <li className="text-gray-400">Web Design</li>
              <li className="text-gray-400">UI/UX Design</li>
              <li className="text-gray-400">Branding</li>
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Leovox. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm flex items-center">
              Feito com <Heart className="h-4 w-4 mx-1 text-primary" /> por Leovox
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

