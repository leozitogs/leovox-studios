import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence } from 'framer-motion';
import projects from '../../../data/projects';
import InteractiveModal from '../ui/InteractiveModal';

gsap.registerPlugin(ScrollTrigger);

export default function LogofolioSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Stagger reveal cards on scroll
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        {
          opacity: 0,
          y: 60,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            id: 'vi-logofolio-reveal',
            trigger: section,
            start: 'top 75%',
            end: 'center center',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="vi-logofolio vi-section">
      <h2 className="vi-section-title">Logofolio</h2>
      <p className="vi-section-subtitle">
        Uma curadoria de marcas criadas com propósito, estratégia e obsessão
        pelo detalhe.
      </p>

      <div className="vi-logofolio-grid">
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="vi-logo-card liquid-glass"
            onClick={() => setSelectedProject(project)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setSelectedProject(project);
            }}
          >
            <img
              src={project.imagePath}
              alt={`Logo ${project.name}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <InteractiveModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
