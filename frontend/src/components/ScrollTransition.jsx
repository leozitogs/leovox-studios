/* ScrollTransition.jsx */
// Transição cinematográfica gradual entre Hero e Portfólio
// Inspirado em landonorris.com com animações fluidas e suaves

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollTransition.css';

// Importar assets do hero
import leovox3D from '../assets/Leovox3D.png';
import leovoxType from '../assets/brand/Leovox_head.svg';

gsap.registerPlugin(ScrollTrigger);

const ScrollTransition = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const isologo3DRef = useRef(null);
  const leovoxSVGRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const isologo3D = isologo3DRef.current;
    const leovoxSVG = leovoxSVGRef.current;
    const overlay = overlayRef.current;

    // Criar timeline com ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5, // Suavidade máxima
        pin: content,
        pinSpacing: false,
        anticipatePin: 1,
      },
    });

    // Animação do overlay (escurece gradualmente)
    tl.to(overlay, {
      opacity: 1,
      duration: 1,
      ease: 'power2.inOut',
    }, 0);

    // Animação do isologo 3D (move para direita e diminui)
    tl.to(isologo3D, {
      x: '40vw',
      y: '-10vh',
      scale: 0.4,
      duration: 1,
      ease: 'power2.inOut',
    }, 0);

    // Animação do SVG Leovox (move para direita e diminui)
    tl.to(leovoxSVG, {
      x: '35vw',
      y: '-10vh',
      scale: 0.35,
      opacity: 0.3,
      duration: 1,
      ease: 'power2.inOut',
    }, 0);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="scroll-transition-container" ref={containerRef}>
      <div className="scroll-transition-content" ref={contentRef}>
        {/* Overlay escuro com textura spectral gradient verde */}
        <div className="scroll-transition-overlay" ref={overlayRef} />

        {/* Isologo 3D */}
        <div className="scroll-transition-isologo" ref={isologo3DRef}>
          <img src={leovox3D} alt="Leovox 3D" />
        </div>

        {/* SVG Leovox */}
        <div className="scroll-transition-svg" ref={leovoxSVGRef}>
          <img src={leovoxType} alt="Leovox" />
        </div>
      </div>
    </section>
  );
};

export default ScrollTransition;
