'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import '@/styles/whatsapp.css';

export default function WhatsAppWidget({ phoneNumber = '919881945960', message = 'Hello! I have a query regarding admissions.' }) {
  const [showBubble, setShowBubble] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const timerRef = useRef(null);

  const startLoop = useCallback(() => {
    if (hasInteracted) return;

    // 1. Show Typing
    setIsTyping(true);
    setShowBubble(true);

    // 2. After 2s, show actual message
    timerRef.current = setTimeout(() => {
      setIsTyping(false);
      
      // 3. After 12s, hide bubble
      timerRef.current = setTimeout(() => {
        setShowBubble(false);
        
        // 4. Wait 30s before repeating
        timerRef.current = setTimeout(() => {
          startLoop();
        }, 30000);

      }, 12000);
    }, 2000);
  }, [hasInteracted]);

  useEffect(() => {
    // Initial delay before first appearance
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
      startLoop();
    }, 3000);

    return () => {
      clearTimeout(initialTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startLoop]);

  const handleClose = (e) => {
    e.stopPropagation();
    setShowBubble(false);
    setHasInteracted(true); // Stops the loop for this session
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setHasInteracted(true);
    setShowBubble(false);
  };

  if (!isVisible) return null;

  return (
    <div className="wa-widget-container">
      {showBubble && (
        <div className="wa-bubble">
          <button className="wa-close" onClick={handleClose} aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
          <div className="wa-bubble-header">
            <div className="wa-avatar" style={{ position: 'relative' }}>
              <i className="fas fa-user-graduate"></i>
              <div className="wa-status-dot"></div>
            </div>
            <div className="wa-bubble-info">
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy)', display: 'block' }}>Admissions Office</span>
              <span style={{ fontSize: '0.65rem', color: '#25D366', fontWeight: 600 }}>
                {isTyping ? 'Typing...' : 'Online'}
              </span>
            </div>
          </div>
          
          {isTyping ? (
            <div className="wa-typing">
              <span></span><span></span><span></span>
            </div>
          ) : (
            <p className="wa-bubble-text">
              <strong>Hi there! 👋</strong>
              How can we help you with your 2026-27 admission queries today?
            </p>
          )}
        </div>
      )}
      
      <button className="wa-button" onClick={handleClick} aria-label="Chat on WhatsApp">
        <i className="fab fa-whatsapp"></i>
        <div className="wa-pulse"></div>
      </button>
    </div>
  );
}
