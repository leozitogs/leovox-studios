import './App.css'
import Header from './components/Header'
import HeroImproved from './components/HeroImproved'
import ProjectShowcase from './components/ProjectShowcase'
import Projects from './components/Projects'
import Services from './components/Services'
import BrandShowcase from './components/BrandShowcase'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import WhatsAppFloat from './components/WhatsAppFloat'
import CustomCursorAdvanced from './components/CustomCursorAdvanced'

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <CustomCursorAdvanced />
      <ScrollProgress />
      <Header />
      <main>
        <HeroImproved />
        <ProjectShowcase />
        <Projects />
        <Services />
        <BrandShowcase />
        <About />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}

export default App

