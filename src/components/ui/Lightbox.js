'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Lightbox component for photo gallery
 * 
 * Usage:
 *   <Lightbox images={[{url, title}]} startIndex={0} onClose={() => {}} />
 */
export default function Lightbox({ images = [], startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const overlayRef = useRef(null);

  const prev = useCallback(() => setIndex(i => (i > 0 ? i - 1 : images.length - 1)), [images.length]);
  const next = useCallback(() => setIndex(i => (i < images.length - 1 ? i + 1 : 0)), [images.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  if (!images.length) return null;
  const current = images[index];

  return (
    <div className="lightbox-overlay" onClick={onClose} ref={overlayRef}>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <img src={current.url} alt={current.title || `Photo ${index + 1}`} />
      </div>

      <button className="lightbox-close" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>

      {images.length > 1 && (
        <>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); next(); }}>
            <i className="fas fa-chevron-right"></i>
          </button>
          <span className="lightbox-counter">{index + 1} / {images.length}</span>
        </>
      )}

      {current.title && <p className="lightbox-caption">{current.title}</p>}
    </div>
  );
}
