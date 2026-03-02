import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { caseStudy } from '../../../data/projects';

gsap.registerPlugin(ScrollTrigger);

export default function CaseStudySection() {
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const variationsRef = useRef(null);
  const mockupsRef = useRef([]);
  const brandingRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Hero parallax reveal
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            id: 'vi-case-hero',
            trigger: heroRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Logo variations stagger
      const variationCards = variationsRef.current?.querySelectorAll(
        '.vi-case-variation-card'
      );
      if (variationCards) {
        gsap.fromTo(
          variationCards,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              id: 'vi-case-variations',
              trigger: variationsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Mockups parallax reveal
      mockupsRef.current.filter(Boolean).forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 + i * 10, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              id: `vi-case-mockup-${i}`,
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Branding assets parallax
      brandingRef.current.filter(Boolean).forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              id: `vi-case-branding-${i}`,
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="vi-case-study vi-section">
      <h2 className="vi-section-title">Estudo de Caso</h2>
      <p className="vi-section-subtitle">
        Uma imersão completa no processo de criação da identidade visual da
        Célula Israel.
      </p>

      <div className="vi-case-container">
        {/* Hero: Logo + Description */}
        <div ref={heroRef} className="vi-case-hero">
          <div className="vi-case-logo-main">
            <img
              src={caseStudy.logo}
              alt="Célula Israel Logo"
            />
          </div>
          <div className="vi-case-info">
            <p>{caseStudy.description}</p>
            <div className="vi-case-colors">
              {caseStudy.colors.map((color) => (
                <div key={color.hex} className="vi-case-color-swatch">
                  <div
                    className="vi-case-color-circle"
                    style={{ background: color.hex }}
                  />
                  <span className="vi-case-color-label">
                    {color.name}
                    <br />
                    {color.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logo Variations */}
        <div ref={variationsRef} className="vi-case-variations">
          {caseStudy.logoVariations.map((variation) => (
            <div
              key={variation.label}
              className="vi-case-variation-card liquid-glass"
            >
              <img src={variation.src} alt={variation.label} loading="lazy" />
              <span>{variation.label}</span>
            </div>
          ))}
        </div>

        {/* Branding Assets */}
        <h3
          className="vi-section-title"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginTop: '3rem' }}
        >
          Branding
        </h3>
        <div className="vi-case-mockups-grid" style={{ marginBottom: '4rem' }}>
          {caseStudy.brandingAssets.map((asset, i) => (
            <div
              key={i}
              ref={(el) => (brandingRef.current[i] = el)}
              className="vi-case-mockup-item"
            >
              <img src={asset} alt={`Branding ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>

        {/* Mockups */}
        <h3
          className="vi-section-title"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginTop: '3rem' }}
        >
          Aplicações
        </h3>
        <div className="vi-case-mockups-grid">
          {caseStudy.mockups.map((mockup, i) => (
            <div
              key={i}
              ref={(el) => (mockupsRef.current[i] = el)}
              className="vi-case-mockup-item"
            >
              <img src={mockup} alt={`Mockup ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
