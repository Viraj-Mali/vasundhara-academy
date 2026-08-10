'use client';

import { useEffect, useState } from 'react';

export default function HeroBackgroundSlider() {
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    fetch('/api/hero-background-slider', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted || !Array.isArray(data)) return;
        setImages(data.filter((item) => item.image));
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (images.length <= 1) return undefined;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="hero-bg">
      {images.map((item, index) => (
        <div
          key={item.id || item.image}
          className={`hero-bg-slide ${index === activeIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url("${item.image}")` }}
        />
      ))}
    </div>
  );
}
