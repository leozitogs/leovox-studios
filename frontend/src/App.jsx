import './App.css'
import './components/HeroRefined.css'
import HeaderLandoStyle from './components/HeaderLandoStyle'
import HeroRefined from './components/HeroRefined'
import ProjectShowcase from './components/ProjectShowcase'
import Projects from './components/Projects'
import Services from './components/Services'
import BrandShowcase from './components/BrandShowcase'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursorAdvanced from './components/CustomCursorAdvanced'
import ScrollProgress from './components/ScrollProgress'

function App() {
  return (
    <div className="App">
      <CustomCursorAdvanced />
      <ScrollProgress />
      
      {/* Header adaptativo que muda de cor */}
      <HeaderLandoStyle />
      
      <main>
        {/* Hero com animação cinematográfica (paleta branca) */}
        <HeroRefined />
        
        {/* Outras seções */}
        <ProjectShowcase />
        <Projects />
        <Services />
        <BrandShowcase />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
