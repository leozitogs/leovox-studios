import { motion } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'

// ============================================================================
// ATENÇÃO PARA O SEU PROJETO LOCAL:
// Descomente a linha abaixo para usar seu logo original.
import leovoxHead from '../assets/brand/Leovox_head.svg'
// ============================================================================

// Estilos do botão 3D Pushable
import './HeaderButton.css'

// Placeholder para o preview funcionar sem erros de arquivo não encontrado:
// const leovoxHead = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNTAgNTAiPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtc2l6ZT0iMjQiPkxFT1ZPWDwvdGV4dD48L3N2Zz4=`

const HeaderLandoStyle = () => {
  // ============================================================================
  // DETECÇÃO DE MUDANÇA DE COR DO HERO VIA CSS VARIABLE
  // Otimizado: usa RAF com throttle para evitar re-renders excessivos.
  // Só atualiza o state quando o valor muda significativamente (delta > 0.01).
  // ============================================================================
  const [heroBgDark, setHeroBgDark] = useState(0)
  const lastValueRef = useRef(0)

  useEffect(() => {
    let rafId

    const checkHeroBgDark = () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--hero-bg-dark')
        .trim()

      const numValue = parseFloat(value)
      const safeValue = Number.isNaN(numValue) ? 0 : Math.max(0, Math.min(1, numValue))

      // Só atualiza o state se a diferença for perceptível (evita re-renders desnecessários)
      if (Math.abs(safeValue - lastValueRef.current) > 0.01) {
        lastValueRef.current = safeValue
        setHeroBgDark(safeValue)
      }

      rafId = requestAnimationFrame(checkHeroBgDark)
    }

    rafId = requestAnimationFrame(checkHeroBgDark)

    return () => cancelAnimationFrame(rafId)
  }, [])

  // ============================================================================
  // LÓGICA DE CORES — TRANSIÇÃO SUAVE SEM THRESHOLD BINÁRIO
  // Todas as cores são calculadas como gradientes contínuos baseados em heroBgDark.
  // Isso elimina saltos visuais durante a transição do hero.
  // ============================================================================

  const logoFilter = `invert(${heroBgDark})`

  // Cores base do botão (paleta principal #19bc00)
  const mainColor = '#19bc00'
  const edgeColorDark = '#0e7a00'

  // Cor do texto do botão: transição contínua
  // Quando fundo claro (heroBgDark ≈ 0): texto escuro (#0a0a0a) para contraste com verde
  // Quando fundo escuro (heroBgDark ≈ 1): texto branco (#ffffff) para contraste com verde
  const textR = Math.round(10 + heroBgDark * 245)
  const textG = Math.round(10 + heroBgDark * 245)
  const textB = Math.round(10 + heroBgDark * 245)
  const buttonTextColor = `rgb(${textR}, ${textG}, ${textB})`

  // Cor da borda/outline do botão: transição contínua
  // Fundo claro: borda escura para definição
  // Fundo escuro: borda verde luminosa
  const borderR = Math.round(10 + heroBgDark * 15)
  const borderG = Math.round(10 + heroBgDark * 178)
  const borderB = Math.round(10 + heroBgDark * -10)
  const buttonBorderColor = `rgb(${Math.max(0, borderR)}, ${Math.max(0, borderG)}, ${Math.max(0, Math.min(255, borderB))})`

  // Sombra do botão: transição contínua (sem threshold)
  // Fundo claro: sombra escura sutil
  // Fundo escuro: sombra verde brilhante
  const shadowOpacity = 0.2 + heroBgDark * 0.25
  const shadowR = Math.round(0 + heroBgDark * 25)
  const shadowG = Math.round(0 + heroBgDark * 188)
  const shadowB = Math.round(0 + heroBgDark * 0)
  const shadowColor = `rgba(${shadowR}, ${shadowG}, ${shadowB}, ${shadowOpacity.toFixed(2)})`

  // ============================================================================
  // HANDLERS DE NAVEGAÇÃO
  // ============================================================================

  const handleLogoClick = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  // ============================================================================
  // handleContactClick — CORREÇÃO DO BUG DE SCROLL TRAVADO
  //
  // PROBLEMA: O HeroRefined trava o scroll do body (overflow: hidden) enquanto
  // o scrollProgress não atinge 2.0. Quando o botão "ME CONTATE" dispara
  // scrollIntoView(), o navegador tenta rolar mas o body está travado,
  // resultando em página congelada com partículas visíveis sobre o conteúdo.
  //
  // SOLUÇÃO: Antes de navegar, forçamos o desbloqueio do scroll:
  // 1. Setamos scrollProgress para 2.0 (completa a animação do Hero)
  // 2. Disparamos o evento customizado 'hero-force-unlock' para que o Hero
  //    atualize seu state isLocked para false
  // 3. Forçamos body.overflow = '' como fallback imediato
  // 4. Esperamos um frame para o DOM processar, depois fazemos o scrollIntoView
  // ============================================================================
  const handleContactClick = useCallback(() => {
    // 1. Força o desbloqueio do scroll do body imediatamente
    document.body.style.overflow = ''

    // 2. Dispara evento customizado para o Hero desbloquear seu state interno
    //    O HeroRefined escuta esse evento e seta isLocked = false + scrollProgress = 2
    window.dispatchEvent(new CustomEvent('hero-force-unlock'))

    // 3. Aguarda um frame para o DOM processar o desbloqueio, depois navega
    requestAnimationFrame(() => {
      // Fallback: garante que overflow está liberado mesmo se o Hero não respondeu
      document.body.style.overflow = ''

      const contactSection = document.getElementById('contact')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }, [])

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[60]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative mx-auto flex items-center justify-between px-6 py-6 md:px-8 lg:px-12">
        {/* ================================================================
            LOGO À ESQUERDA
            Usa style inline para filter dinâmico (sem <style> tag).
            ================================================================ */}
        <div className="flex flex-1 items-center">
          <div
            onClick={handleLogoClick}
            className="cursor-pointer select-none outline-none border-none ring-0 focus:outline-none"
            tabIndex={-1}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <motion.img
              src={leovoxHead}
              alt="Leovox Studios"
              className="h-[120px] w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: 'none',
                filter: logoFilter,
                background: 'transparent',
                transition: 'filter 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* ================================================================
            BOTÃO 3D PUSHABLE — "ME CONTATE"
            Baseado na referência fornecida pelo usuário.
            Usa style inline para todas as cores dinâmicas,
            eliminando a necessidade de <style> tags com interpolação.
            ================================================================ */}
        <motion.div
          className="flex flex-1 items-center justify-end"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            className="lvx-pushable-btn"
            onClick={handleContactClick}
            aria-label="Ir para seção de contato"
          >
            <span
              className="lvx-pushable-btn__top"
              style={{
                color: buttonTextColor,
                borderColor: buttonBorderColor,
                '--lvx-shadow-color': shadowColor,
              }}
            >
              ME CONTATE
            </span>
          </button>
        </motion.div>
      </div>
    </motion.header>
  )
}

export default HeaderLandoStyle