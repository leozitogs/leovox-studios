/**
 * HeaderLandoStyle.jsx — Leovox Studios
 * Header refatorado pixel-perfect conforme imagem de referência.
 *
 * Features:
 * - Logo SVG importado de assets/brand/LeovoxHeader.svg
 * - Nav centralizada: Intro · Projects · Services · Contact me
 * - Botão "Contact Me" com efeito Liquid Glass (backdrop-filter + gradiente)
 * - Animação de entrada em cascata (Framer Motion)
 * - Scroll: header fica ligeiramente mais opaco/comprimido ao rolar
 * - Responsivo: nav colapsa em menu hambúrguer no mobile
 *
 * Fontes no index.html:
 * <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap" rel="stylesheet">
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeovoxLogo from "../assets/brand/LeovoxHeader.svg";

/* ══════════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════════ */
const NAV_LINKS = [
  { label: "Intro",      href: "#intro" },
  { label: "Projects",   href: "#projects" },
  { label: "Services",   href: "#services" },
  { label: "Contact me", href: "#contact" },
];

/* ══════════════════════════════════════════════════
   LIQUID GLASS BUTTON
   Efeito: backdrop-filter blur + gradiente especular
   branco + borda inner glow
══════════════════════════════════════════════════ */
function LiquidGlassButton({ children, href, onClick }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={onClick}
      className="lv-hdr-btn"
      aria-label={typeof children === "string" ? children : "Contact Me"}
    >
      {/* Camada de reflexo especular (pseudo não funciona bem em React, usamos div) */}
      <span className="lv-hdr-btn-gloss" aria-hidden="true" />
      <span className="lv-hdr-btn-label">{children}</span>
    </Tag>
  );
}

/* ══════════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════════ */
export default function HeaderLandoStyle() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [activeLink,   setActiveLink]   = useState("Intro");

  /* Detecta scroll para compactar o header */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ════════════ ESTILOS ════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap');

        /* ── Wrapper do header ── */
        .lv-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(20px, 3.5vw, 56px);
          height: 72px;
          transition: height 0.35s ease, background 0.35s ease, backdrop-filter 0.35s ease;

          /* Totalmente transparente — sem fundo, sem borda */
          background: transparent;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border-bottom: none;
        }

        /* Scrolled: mantém transparente, apenas leve blur sem cor */
        .lv-header.scrolled {
          height: 60px;
          background: transparent;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border-bottom: none;
        }

        /* ── Logo ── */
        .lv-logo-wrap {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          cursor: pointer;
          text-decoration: none;
        }
        .lv-logo-wrap img,
        .lv-logo-wrap svg {
          /* Altura responsiva; o viewBox do SVG é 1440×810 */
          height: clamp(36px, 4.5vw, 52px);
          width: auto;
          /* SVG original é cinza #8a8788, deixamos claro */
          filter: brightness(1.35) contrast(0.9);
          transition: filter 0.25s ease, transform 0.25s ease;
        }
        .lv-logo-wrap:hover img,
        .lv-logo-wrap:hover svg {
          filter: brightness(1.6) contrast(1) drop-shadow(0 0 8px rgba(25,188,0,0.25));
          transform: scale(1.03);
        }

        /* ── Nav central ── */
        .lv-nav {
          display: flex;
          align-items: center;
          gap: clamp(16px, 2.5vw, 40px);
          list-style: none;
          margin: 0;
          padding: 0;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .lv-nav-link {
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          font-size: clamp(13px, 1.05vw, 15.5px);
          color: rgba(195, 195, 195, 0.80);
          text-decoration: none;
          letter-spacing: 0.02em;
          padding: 4px 2px;
          position: relative;
          transition: color 0.22s ease;
          white-space: nowrap;
        }
        .lv-nav-link::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: #19bc00;
          box-shadow: 0 0 6px rgba(25,188,0,0.6);
          transition: width 0.3s ease;
        }
        .lv-nav-link:hover,
        .lv-nav-link.active {
          color: rgba(240, 240, 240, 0.95);
        }
        .lv-nav-link:hover::after,
        .lv-nav-link.active::after {
          width: 100%;
        }

        /* ══════════════════════════════════════════
           LIQUID GLASS BUTTON
           Técnica:
           1. base: background glass (rgba + blur)
           2. ::before: gradiente especular branco
              simulando reflexo de luz
           3. borda: gradiente de borda com brilho
           4. sombra interna + externa
        ══════════════════════════════════════════ */
        .lv-hdr-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 26px;
          border-radius: 999px;
          cursor: pointer;
          text-decoration: none;
          outline: none;
          border: none;
          overflow: hidden;
          flex-shrink: 0;

          /* Glass base */
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);

          /* Borda gradient que simula reflexo de borda */
          box-shadow:
            inset 0  1px 0   rgba(255,255,255,0.28),
            inset 0 -1px 0   rgba(255,255,255,0.06),
            inset 1px 0 0    rgba(255,255,255,0.12),
            inset -1px 0 0   rgba(255,255,255,0.06),
                  0  0  0 1px rgba(255,255,255,0.14),
                  0  4px 24px rgba(0,0,0,0.35),
                  0  0  12px rgba(255,255,255,0.04);

          transition:
            background   0.28s ease,
            box-shadow   0.28s ease,
            transform    0.18s ease;
        }

        /* Reflexo especular — faixa branca diagonal no topo */
        .lv-hdr-btn-gloss {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            140deg,
            rgba(255,255,255,0.22) 0%,
            rgba(255,255,255,0.10) 30%,
            rgba(255,255,255,0.02) 55%,
            transparent 100%
          );
          pointer-events: none;
          transition: opacity 0.25s ease;
        }

        /* Texto do botão */
        .lv-hdr-btn-label {
          position: relative;
          z-index: 1;
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: clamp(12px, 1vw, 14.5px);
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.92);
          white-space: nowrap;
          transition: color 0.22s ease;
        }

        /* Hover state */
        .lv-hdr-btn:hover {
          background: rgba(255, 255, 255, 0.13);
          box-shadow:
            inset 0  1px 0   rgba(255,255,255,0.38),
            inset 0 -1px 0   rgba(255,255,255,0.08),
            inset 1px 0 0    rgba(255,255,255,0.18),
            inset -1px 0 0   rgba(255,255,255,0.08),
                  0  0  0 1px rgba(255,255,255,0.22),
                  0  4px 28px rgba(0,0,0,0.4),
                  0  0  18px rgba(255,255,255,0.08);
          transform: translateY(-1px);
        }
        .lv-hdr-btn:hover .lv-hdr-btn-gloss {
          opacity: 1.4;
        }
        .lv-hdr-btn:hover .lv-hdr-btn-label {
          color: rgba(255,255,255,1);
        }

        /* Active press */
        .lv-hdr-btn:active {
          transform: translateY(0px) scale(0.98);
        }

        /* ── Hambúrguer (mobile) ── */
        .lv-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          z-index: 1010;
        }
        .lv-hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: rgba(200,200,200,0.85);
          border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .lv-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .lv-hamburger.open span:nth-child(2) { opacity: 0; }
        .lv-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Mobile nav drawer ── */
        .lv-mobile-nav {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 28px;
          background: rgba(5,5,7,0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .lv-mobile-nav a {
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: clamp(22px, 6vw, 34px);
          color: rgba(220,220,220,0.9);
          text-decoration: none;
          transition: color 0.22s;
        }
        .lv-mobile-nav a:hover { color: #19bc00; }

        /* ── Responsivo ── */
        @media (max-width: 767px) {
          .lv-nav          { display: none; }
          .lv-hamburger    { display: flex; }
          .lv-hdr-desktop-btn { display: none; }
        }
        @media (min-width: 768px) {
          .lv-hamburger    { display: none; }
          .lv-mobile-nav   { display: none !important; }
        }
      `}</style>

      {/* ════════════════════════════════════════
          HEADER
      ════════════════════════════════════════ */}
      <header className={`lv-header${scrolled ? " scrolled" : ""}`}>

        {/* ── Logo ── */}
        <motion.a
          href="#"
          className="lv-logo-wrap"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Leovox Studios — Início"
        >
          <img
            src={LeovoxLogo}
            alt="Leovox Studios"
            draggable="false"
          />
        </motion.a>

        {/* ── Nav central (desktop) ── */}
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Navegação principal"
        >
          <ul className="lv-nav">
            {NAV_LINKS.map((link, i) => (
              <motion.li
                key={link.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + i * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <a
                  href={link.href}
                  className={`lv-nav-link${activeLink === link.label ? " active" : ""}`}
                  onClick={() => setActiveLink(link.label)}
                >
                  {link.label}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.nav>

        {/* ── Botão Liquid Glass (desktop) ── */}
        <motion.div
          className="lv-hdr-desktop-btn"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <LiquidGlassButton href="#contact">Contact Me</LiquidGlassButton>
          </motion.div>
        </motion.div>

        {/* ── Hambúrguer (mobile) ── */}
        <button
          className={`lv-hamburger${mobileOpen ? " open" : ""}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>

      </header>

      {/* ── Mobile Nav Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lv-mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: i * 0.06 }}
                onClick={() => {
                  setActiveLink(link.label);
                  setMobileOpen(false);
                }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.28 }}
            >
              <LiquidGlassButton href="#contact" onClick={() => setMobileOpen(false)}>
                Contact Me
              </LiquidGlassButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}