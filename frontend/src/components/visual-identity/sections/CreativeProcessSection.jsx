import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { creativeProcess } from '../../../data/projects';

gsap.registerPlugin(ScrollTrigger);

export default function CreativeProcessSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // Calculate how far to scroll horizontally
      const getScrollAmount = () => {
        return -(track.scrollWidth - window.innerWidth + 100);
      };

      // Horizontal scroll animation
      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          id: 'vi-process-horizontal',
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.abs(getScrollAmount())}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Update progress bar
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });

      // Animate cards as they come into view
      cardsRef.current.filter(Boolean).forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0.3, scale: 0.92, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              id: `vi-process-card-${i}`,
              trigger: card,
              containerAnimation: tween,
              start: 'left 80%',
              end: 'left 40%',
              scrub: true,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="vi-process">
      <div className="vi-process-header">
        <h2 className="vi-section-title">O Processo Criativo</h2>
        <p className="vi-section-subtitle">
          Da ideia à entrega — cada etapa é pensada para construir marcas com
          significado e impacto.
        </p>
      </div>

      <div className="vi-process-track-wrapper">
        <div ref={trackRef} className="vi-process-track">
          {creativeProcess.map((step, index) => (
            <div
              key={step.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="vi-process-card liquid-glass"
            >
              <div className="vi-process-card-number">
                {String(step.id).padStart(2, '0')}
              </div>
              <h3 className="vi-process-card-title">{step.title}</h3>
              <p className="vi-process-card-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="vi-process-progress">
        <div className="vi-process-progress-bar">
          <div ref={progressRef} className="vi-process-progress-fill" />
        </div>
      </div>
    </div>
  );
}
