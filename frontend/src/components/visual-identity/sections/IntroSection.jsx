import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useEasterEgg from '../../../hooks/useEasterEgg';

gsap.registerPlugin(ScrollTrigger);

export default function IntroSection() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const orbsRef = useRef([]);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Easter egg hook
  const { mascotRef, eyeLeftRef, eyeRightRef, isFollowing, handleMascotClick } =
    useEasterEgg();

  // Mouse parallax for background orbs
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate orbs based on mouse position
  useEffect(() => {
    orbsRef.current.forEach((orb, i) => {
      if (!orb) return;
      const factor = (i + 1) * 30;
      gsap.to(orb, {
        x: (mousePos.x - 0.5) * factor,
        y: (mousePos.y - 0.5) * factor,
        duration: 1.2,
        ease: 'power2.out',
      });
    });
  }, [mousePos]);

  // Text reveal animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Animate each word
      const wordInners = section.querySelectorAll('.word-inner');
      gsap.to(wordInners, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.3,
      });

      // Animate subtitle
      gsap.to(subRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 1,
      });

      // Animate scroll indicator
      gsap.to(scrollIndicatorRef.current, {
        opacity: 1,
        duration: 0.6,
        delay: 1.5,
      });

      // Parallax on scroll
      gsap.to(section.querySelector('.vi-intro-content'), {
        yPercent: -20,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          id: 'vi-intro-parallax',
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const headlineWords = ['Marcas', 'que', 'contam', 'histórias.'];

  return (
    <div ref={sectionRef} className="vi-intro">
      {/* Background orbs */}
      <div className="vi-intro-bg">
        <div
          ref={(el) => (orbsRef.current[0] = el)}
          className="vi-intro-bg-orb"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(0,255,65,0.15) 0%, transparent 70%)',
            top: '10%',
            left: '20%',
          }}
        />
        <div
          ref={(el) => (orbsRef.current[1] = el)}
          className="vi-intro-bg-orb"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(57,255,20,0.1) 0%, transparent 70%)',
            bottom: '20%',
            right: '15%',
          }}
        />
        <div
          ref={(el) => (orbsRef.current[2] = el)}
          className="vi-intro-bg-orb"
          style={{
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(0,200,65,0.08) 0%, transparent 70%)',
            top: '50%',
            left: '60%',
          }}
        />
      </div>

      {/* Content */}
      <div className="vi-intro-content">
        {/* Mascot / Isologo with Easter Egg */}
        <div
          ref={mascotRef}
          className="vi-mascot-wrapper"
          onClick={handleMascotClick}
          style={{ marginBottom: '2rem' }}
        >
          <img
            src="/mockups/logomarca_estrela_isologo.svg"
            alt="Leovox Isologo"
            style={{
              width: '80px',
              height: '80px',
              filter: 'brightness(0) invert(1)',
              opacity: 0.7,
            }}
          />
          {/* Eyes for Easter Egg */}
          <div
            ref={eyeLeftRef}
            className="vi-mascot-eye"
            style={{
              top: '38%',
              left: '35%',
              opacity: isFollowing ? 1 : 0,
            }}
          />
          <div
            ref={eyeRightRef}
            className="vi-mascot-eye"
            style={{
              top: '38%',
              left: '55%',
              opacity: isFollowing ? 1 : 0,
            }}
          />
        </div>

        <h1 ref={headlineRef} className="vi-intro-headline">
          {headlineWords.map((word, i) => (
            <span key={i} className="word" style={{ marginRight: '0.3em' }}>
              <span
                className={`word-inner ${
                  i === 0 || i === 3 ? 'gradient-text' : ''
                }`}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <p ref={subRef} className="vi-intro-sub">
          Criamos identidades visuais que transcendem o estético — cada marca é
          uma narrativa visual estratégica, desenhada para conectar, inspirar e
          permanecer.
        </p>

        <div ref={scrollIndicatorRef} className="vi-scroll-indicator">
          <span>Explore</span>
          <div className="vi-scroll-line" />
        </div>
      </div>
    </div>
  );
}
