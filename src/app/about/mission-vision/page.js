import Link from 'next/link';
import '@/styles/about.css';

export const metadata = {
  title: 'Mission, Vision & Values | Vasundhara Academy Akole',
  description: 'Our mission is to empower marginalized communities through quality education, bridging the rural-urban gap with innovation and inclusivity at Vasundhara Academy Akole.',
};

export default function MissionVisionPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Our Mission & Vision</h1>
          <p className="page-hero-desc">The guiding principles that shape our educational journey at Vasundhara Academy.</p>
        </div>
      </section>
    </>
  );
}
