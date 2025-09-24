import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import logo from '../assets/1.png'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Leovox" className="h-8 w-auto" />
            <span className="text-xl font-bold leovox-text-gradient">LEOVOX</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="nav-link text-white hover:text-primary transition-colors">
              Início
            </a>
            <a href="#projects" className="nav-link text-white hover:text-primary transition-colors">
              Projetos
            </a>
            <a href="#services" className="nav-link text-white hover:text-primary transition-colors">
              Serviços
            </a>
            <a href="#about" className="nav-link text-white hover:text-primary transition-colors">
              Sobre
            </a>
            <a href="#contact" className="nav-link text-white hover:text-primary transition-colors">
              Contato
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
            <div className="flex flex-col space-y-4">
              <a
                href="#home"
                className="text-white hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </a>
              <a
                href="#projects"
                className="text-white hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Projetos
              </a>
              <a
                href="#services"
                className="text-white hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Serviços
              </a>
              <a
                href="#about"
                className="text-white hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </a>
              <a
                href="#contact"
                className="text-white hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header

