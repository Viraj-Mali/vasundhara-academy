import Image from 'next/image';
import '@/styles/about.css';
import './mission-vision.css';

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

      <main className="mission-vision-section">
        <div className="mission-vision-container">
          <section className="mission-vision-row" aria-labelledby="vision-heading">
            <div className="mission-vision-image-card">
              <Image
                src="/images/about/vision-image.png"
                alt="Vision of learning and human potential at Vasundhara Academy"
                width={1456}
                height={1084}
                className="mission-vision-image"
                priority
              />
            </div>

            <div className="mission-vision-content">
              <h2 id="vision-heading">VISION</h2>
              <p>
                Vasundhara Academy envisions building a community that provides the foundation for every individual to discover their true human potential and positively contribute to the transformation of society.
              </p>
            </div>
          </section>

          <section className="mission-vision-row mission-row" aria-labelledby="mission-heading">
            <div className="mission-vision-content">
              <h2 id="mission-heading">MISSION</h2>
              <ul className="mission-list">
                <li>Providing an affordable future-oriented academic program that is rigorous and transdisciplinary.</li>
                <li>Ensuring that all activities are rooted in values and ethos of the community.</li>
                <li>Enabling all to cultivate the belief in and the courage to pursue whatever pathway they choose to follow.</li>
                <li>Fostering a spirit of respect for all forms of diversity.</li>
                <li>Providing avenues that facilitate learning and the development of skills and values.</li>
                <li>Supporting opportunities that allow all to grow and become global citizens.</li>
                <li>Creating a compassionate society by encouraging the development of right thought, right words, and right actions.</li>
              </ul>
            </div>

            <div className="mission-vision-image-card">
              <Image
                src="/images/about/mission-image.png"
                alt="Mission of knowledge, creativity, and education at Vasundhara Academy"
                width={1536}
                height={1024}
                className="mission-vision-image"
              />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
