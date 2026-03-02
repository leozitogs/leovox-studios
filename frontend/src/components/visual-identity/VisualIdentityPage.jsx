import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import IntroSection from './sections/IntroSection';
import LogofolioSection from './sections/LogofolioSection';
import CaseStudySection from './sections/CaseStudySection';
import CreativeProcessSection from './sections/CreativeProcessSection';
import MockupGallerySection from './sections/MockupGallerySection';
import './VisualIdentityPage.css';

gsap.registerPlugin(ScrollTrigger);

export default function VisualIdentityPage() {
  const pageRef = useRef(null);

  useEffect(() => {
    // Refresh ScrollTrigger after all sections mount
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timeout);
      // Clean up all ScrollTrigger instances created within this page
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars?.id?.startsWith('vi-')) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <section
      ref={pageRef}
      id="identidades-visuais"
      className="vi-page"
    >
      {/* 1.0 - Intro / Hero */}
      <IntroSection />

      {/* 2.0 - Logofolio */}
      <LogofolioSection />

      {/* 3.0 - Estudo de Caso: Célula Israel */}
      <CaseStudySection />

      {/* 4.0 - O Processo Criativo */}
      <CreativeProcessSection />

      {/* 5.0 - Galeria de Mockups */}
      <MockupGallerySection />
    </section>
  );
}
