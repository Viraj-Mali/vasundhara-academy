'use client';
import { useEffect } from 'react';

/**
 * ScrollReveal — auto-applies 'revealed' class to elements
 * with class 'reveal', 'reveal-left', 'reveal-right', 'reveal-scale', 'reveal-stagger'
 * when they enter the viewport.
 * 
 * Add this component once in your layout/wrapper.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger';
    const elements = document.querySelectorAll(selectors);
    elements.forEach((el) => observer.observe(el));

    // Re-observe when new elements appear (for client-side navigation)
    const mutationObserver = new MutationObserver(() => {
      const newElements = document.querySelectorAll(selectors);
      newElements.forEach((el) => {
        if (!el.classList.contains('revealed')) {
          observer.observe(el);
        }
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null; // This component renders nothing
}
