// ============================================================================
// App.jsx — Leovox Studios Portfolio (ATUALIZADO com Hero Section v2)
//
// INSTRUÇÕES DE INTEGRAÇÃO:
// 1. Substitua o import de HeroRefined pelo HeroSection
// 2. Substitua <HeroRefined /> por <HeroSection />
// 3. O restante do App permanece idêntico
// ============================================================================

import './App.css'
import ExpertiseShowcase from './components/ExpertiseShowcase'
import HeaderLandoStyle from './components/HeaderLandoStyle'
// import HeroRefined from './components/HeroRefined'  // ← REMOVER
import HeroSection from './components/hero/HeroSection'  // ← NOVO
import Services from './components/Services'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursorAdvanced from './components/CustomCursorAdvanced'
import ScrollProgress from './components/ScrollProgress'
import CinematicShirtShowcase from './components/CinematicShirtShowcase'
// import VisualIdentityPage from './components/visual-identity/VisualIdentityPage'

function App() {
  return (
    <div className="App">
      <CustomCursorAdvanced />
      <ScrollProgress />
      
      {/* Header adaptativo — lê CSS variable --hero-bg-dark da Hero */}
      <HeaderLandoStyle />
      
      <main>
        {/* HERO SECTION v2 — "Das Nuvens à Realidade" */}
        <HeroSection />
        
        {/* Expertise Showcase */}
        <ExpertiseShowcase />

        {/* Visualização 3D Cinematográfica de Camisas */}
        <CinematicShirtShowcase />
        
        {/* Identidades Visuais */}
        

        {/* Seções complementares */}
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
