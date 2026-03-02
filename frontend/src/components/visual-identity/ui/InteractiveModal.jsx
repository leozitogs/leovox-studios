import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function InteractiveModal({ project, onClose }) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <motion.div
      className="vi-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="vi-modal-content"
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 40 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className="vi-modal-close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>

        {/* Logo display area */}
        <div className="vi-modal-logo-area">
          <motion.img
            src={project.imagePath}
            alt={`Logo ${project.name}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{
              filter: 'brightness(0) invert(1)',
            }}
          />
        </div>

        {/* Mockup carousel */}
        {project.mockups && project.mockups.length > 0 && (
          <div className="vi-modal-carousel">
            {project.mockups.map((mockup, index) => (
              <motion.div
                key={index}
                className="vi-modal-carousel-item"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              >
                <img
                  src={mockup}
                  alt={`Mockup ${index + 1}`}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
