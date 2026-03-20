import Link from 'next/link';
import '@/styles/about.css';

export const metadata = { title: "Mission & Vision" };

export default function MissionVisionPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Our Mission & Vision</h1>
          <p className="page-hero-desc">The guiding principles that shape our educational journey at Vasundhara Academy.</p>
        </div>
      </section>

      <section className="message-section">
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          {/* Vision */}
          <div className="message-content">
            <span className="section-tag"><i className="fas fa-minus"></i> Our Vision</span>
            <h2>Shaping the Future</h2>
            <div className="message-text">
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--navy)', lineHeight: 1.8 }}>
                &quot;Empowering the marginalized communities of the hilly and tribal areas through quality education,
                bridging the gap between rural and urban opportunities, and fostering a culture of inclusivity,
                innovation, and sustainability.&quot;
              </p>
            </div>
            <div className="message-quote">
              &quot;|| विद्याधनं सर्वधनं प्रधानम् ||&quot;<br/>
              <small style={{ fontStyle: 'normal', color: 'var(--gray-500)' }}>
                — The wealth of knowledge is the greatest of all wealth.
              </small>
            </div>
          </div>

          {/* Mission */}
          <div className="message-content" style={{ marginTop: '3rem' }}>
            <span className="section-tag"><i className="fas fa-minus"></i> Our Mission</span>
            <h2>Our Commitment</h2>
            <div className="message-text">
              <p>
                Our mission is to provide accessible, affordable and holistic education to the students of the hilly
                and tribal areas focusing on:
              </p>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem' }}>
                <li style={{ listStyle: 'disc', marginBottom: '0.8rem' }}>
                  Academic excellence and critical thinking
                </li>
                <li style={{ listStyle: 'disc', marginBottom: '0.8rem' }}>
                  Character development and values-based education
                </li>
                <li style={{ listStyle: 'disc', marginBottom: '0.8rem' }}>
                  Skill development and entrepreneurship
                </li>
                <li style={{ listStyle: 'disc', marginBottom: '0.8rem' }}>
                  Cultural preservation and exchange
                </li>
                <li style={{ listStyle: 'disc', marginBottom: '0.8rem' }}>
                  Encourage experimentation and scientific attitude
                </li>
                <li style={{ listStyle: 'disc', marginBottom: '0.8rem' }}>
                  Environmental awareness and conservation
                </li>
              </ul>
            </div>
          </div>

          {/* Society Info */}
          <div className="message-content" style={{ marginTop: '3rem' }}>
            <span className="section-tag"><i className="fas fa-minus"></i> Managing Body</span>
            <h2>Abhinav Shikshan Sanstha, Akole</h2>
            <div className="message-text">
              <p>
                Vasundhara Academy is an initiative of <strong>Abhinav Shikshan Sanstha (Abhinav Education Society), Akole</strong>,
                dedicated to providing quality CBSE education in the hilly and tribal region of Akole, Ahmednagar district, Maharashtra.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
