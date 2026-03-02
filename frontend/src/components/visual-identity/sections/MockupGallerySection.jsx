import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { galleryMockups } from '../../../data/projects';

gsap.registerPlugin(ScrollTrigger);

export default function MockupGallerySection() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Cinematic reveal: each mockup fades in with a 3D-like perspective shift
      itemsRef.current.filter(Boolean).forEach((item, i) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 80,
            scale: 0.88,
            rotateX: 8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              id: `vi-gallery-item-${i}`,
              trigger: item,
              start: 'top 90%',
              end: 'top 50%',
              scrub: 0.5,
            },
          }
        );
      });

      // Parallax background effect
      gsap.fromTo(
        section,
        { backgroundPositionY: '0%' },
        {
          backgroundPositionY: '30%',
          ease: 'none',
          scrollTrigger: {
            id: 'vi-gallery-bg-parallax',
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="vi-gallery">
      <div className="vi-gallery-header">
        <h2 className="vi-section-title">Galeria de Mockups</h2>
        <p className="vi-section-subtitle">
          Veja como as identidades visuais ganham vida em aplicações reais —
          do digital ao impresso.
        </p>
      </div>

      <div
        className="vi-gallery-grid"
        style={{ perspective: '1200px' }}
      >
        {galleryMockups.map((mockup, index) => (
          <div
            key={mockup.id}
            ref={(el) => (itemsRef.current[index] = el)}
            className="vi-gallery-item"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <img
              src={mockup.src}
              alt={mockup.label}
              loading="lazy"
            />
            <div className="vi-gallery-item-label">{mockup.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
