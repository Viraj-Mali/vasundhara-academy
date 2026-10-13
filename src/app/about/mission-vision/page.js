import '@/styles/about.css';
import './mission-vision.css';

export const metadata = {
  title: 'Mission, Vision & Values | Vasundhara Academy Akole',
  description: 'Our mission is to provide accessible, affordable and holistic education to the students of the hilly and tribal areas, focusing on academic excellence, character development, and environmental awareness.',
};

export default function MissionVisionPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Our Mission &amp; Vision</h1>
          <p className="page-hero-desc">The guiding principles that shape our educational journey at Vasundhara Academy.</p>
        </div>
      </section>

      <main className="mission-vision-section">
        <div className="mission-vision-container">

          {/* Vision Section */}
          <section className="mv-block" aria-labelledby="vision-heading">
            <h2 id="vision-heading" className="mv-heading">Our Vision</h2>
            <p className="mv-text">
              Empowering the marginalized communities of the hilly and tribal areas through quality education,
              bridging the gap between rural and urban opportunities, and fostering a culture of inclusivity,
              innovation, and sustainability.
            </p>
          </section>

          {/* Mission Section */}
          <section className="mv-block" aria-labelledby="mission-heading">
            <h2 id="mission-heading" className="mv-heading">Our Mission</h2>
            <p className="mv-text">
              Our mission is to provide accessible, affordable and holistic education to the students of the
              hilly and tribal areas focusing on:
            </p>
            <ul className="mission-list">
              <li>Academic excellence and critical thinking</li>
              <li>Character development and values-based education</li>
              <li>Skill development and entrepreneurship</li>
              <li>Cultural preservation and exchange</li>
              <li>Encourage experimentation and scientific attitude</li>
              <li>Environmental awareness and conservation</li>
            </ul>
          </section>

        </div>
      </main>
    </>
  );
}
