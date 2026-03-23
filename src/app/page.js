import Link from 'next/link';
import '@/styles/homepage.css';
import StatCounter from '@/components/ui/StatCounter';

export const metadata = {
  title: 'Vasundhara Academy, Akole — CBSE School | Grades 1-10',
};

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-particles" id="hero-particles"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-award"></i>
            CBSE Affiliated — Affiliation No. 1130637
          </div>
          <h1>
            <span className="hero-society">Abhinav Education Society&apos;s</span>
            <span className="hero-title">Vasundhara Academy</span>
            <span className="hero-tagline">|| विद्याधनं सर्वधनं प्रधानम् ||</span>
          </h1>
          <p className="hero-subtitle">
            Where tradition meets innovation — empowering young minds from Grade 1 to 10
            with CBSE curriculum excellence in the heart of Akole, Maharashtra.
          </p>
          <div className="hero-btns">
            <Link href="/admissions/apply" className="btn btn-primary btn-lg">
              <i className="fas fa-graduation-cap"></i> Admissions 2026-27
            </Link>
            <Link href="/about" className="btn btn-secondary btn-lg">
              <i className="fas fa-play-circle"></i> Explore More
            </Link>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll to explore</span>
          <div className="hero-scroll-line"></div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="stats-bar">
        <div className="stats-inner">
          <div className="stat-item">
            <span className="stat-number"><StatCounter target={500} /></span><span className="stat-suffix">+</span>
            <span className="stat-label">Happy Students</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number"><StatCounter target={50} /></span><span className="stat-suffix">+</span>
            <span className="stat-label">Expert Faculty</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number"><StatCounter target={15} /></span><span className="stat-suffix">+</span>
            <span className="stat-label">Years of Excellence</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number"><StatCounter target={100} /></span><span className="stat-suffix">%</span>
            <span className="stat-label">Board Results</span>
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section className="about-section">
        <div className="about-inner">
          <div className="about-images">
            <div className="about-img-main">
              <img src="/images/school-photo-3.jpg" alt="Vasundhara Academy students" width="800" height="600" loading="lazy" />
            </div>
            <div className="about-img-accent">
              <img src="/images/school-photo-1.jpg" alt="Student achievements" width="400" height="300" loading="lazy" />
            </div>
            <div className="about-badge">
              <i className="fas fa-trophy"></i>
              <span>Award<br />Winning</span>
            </div>
          </div>
          <div className="about-text">
            <span className="section-tag"><i className="fas fa-minus"></i> About Us</span>
            <h2 className="section-title">Building Tomorrow&apos;s Leaders Today</h2>
            <p className="about-desc">
              Vasundhara Academy, under the aegis of Abhinav Education Society, is a premier
              CBSE-affiliated institution in Akole, Ahmednagar. We believe in nurturing every
              child&apos;s potential through a balanced blend of academics, sports, and co-curricular activities.
            </p>
            <p className="about-desc">
              Our students consistently excel in national-level competitions including Expert Abacus
              State Level Examinations and SOF Olympiads, bringing laurels to the school.
            </p>
            <div className="about-features">
              <div className="about-feature"><i className="fas fa-check-circle"></i><span>CBSE Curriculum</span></div>
              <div className="about-feature"><i className="fas fa-check-circle"></i><span>Experienced Faculty</span></div>
              <div className="about-feature"><i className="fas fa-check-circle"></i><span>Smart Classrooms</span></div>
              <div className="about-feature"><i className="fas fa-check-circle"></i><span>Holistic Development</span></div>
            </div>
            <Link href="/about" className="btn btn-primary">
              <i className="fas fa-arrow-right"></i> Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag"><i className="fas fa-minus"></i> Why Choose Us</span>
            <h2 className="section-title">Why Vasundhara Academy Stands Apart</h2>
          </div>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-book-open"></i></div>
            <h3>CBSE Curriculum</h3>
            <p>Comprehensive CBSE-aligned education with a focus on conceptual learning and critical thinking skills.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-chalkboard-teacher"></i></div>
            <h3>Expert Faculty</h3>
            <p>Dedicated and highly qualified teachers who go beyond textbooks to inspire lifelong learning.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-laptop-code"></i></div>
            <h3>Modern Infrastructure</h3>
            <p>Smart classrooms, well-equipped science and computer labs, and a comprehensive library.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-running"></i></div>
            <h3>Holistic Development</h3>
            <p>Sports, arts, abacus training, olympiad prep, and co-curricular activities for all-round growth.</p>
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS ── */}
      <section className="achievements-section">
        <div className="container text-center">
          <span className="section-tag" style={{ color: 'var(--gold)' }}>
            <i className="fas fa-minus"></i> Achievements
          </span>
          <h2 className="section-title light">Our Pride &amp; Glory</h2>
          <div className="achievements-grid">
            <div className="achievement-card">
              <img src="/images/school-photo-1.jpg" alt="Expert Abacus Achievement" width="400" height="320" loading="lazy" />
              <div className="achievement-overlay">
                <h3>Expert Abacus Competition</h3>
                <p>State Level Winners 2026</p>
              </div>
            </div>
            <div className="achievement-card">
              <img src="/images/school-photo-2.jpg" alt="SOF Olympiad Achievement" width="400" height="320" loading="lazy" />
              <div className="achievement-overlay">
                <h3>SOF Olympiad</h3>
                <p>Multiple Award Winners</p>
              </div>
            </div>
            <div className="achievement-card">
              <img src="/images/school-photo-3.jpg" alt="Academic Excellence" width="400" height="320" loading="lazy" />
              <div className="achievement-overlay">
                <h3>Academic Excellence</h3>
                <p>Outstanding Board Results</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Testimonials</span>
          <h2 className="section-title">What Parents Say</h2>
          <div className="testimonials-wrapper">
            <div className="testimonials-track">
              {/* Original Set */}
              <div className="testimonial-card">
                <div className="testimonial-quote"><i className="fas fa-quote-left"></i></div>
                <p>“Vasundhara Academy has been a blessing for our child. The teachers are incredibly dedicated and the CBSE curriculum is delivered with excellence.”</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">RS</div>
                  <div>
                    <strong>Rajesh Sharma</strong>
                    <span>Parent of Class 7 Student</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-quote"><i className="fas fa-quote-left"></i></div>
                <p>“My daughter won at the state-level Abacus competition. The school&apos;s focus on co-curricular activities alongside academics is remarkable.”</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">PD</div>
                  <div>
                    <strong>Priya Deshmukh</strong>
                    <span>Parent of Class 5 Student</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-quote"><i className="fas fa-quote-left"></i></div>
                <p>“The infrastructure and teaching methodology at Vasundhara Academy are at par with the best schools in the district.”</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">AK</div>
                  <div>
                    <strong>Amit Kulkarni</strong>
                    <span>Parent of Class 3 Student</span>
                  </div>
                </div>
              </div>
              {/* Duplicate Set for Loop */}
              <div className="testimonial-card">
                <div className="testimonial-quote"><i className="fas fa-quote-left"></i></div>
                <p>“Vasundhara Academy has been a blessing for our child. The teachers are incredibly dedicated and the CBSE curriculum is delivered with excellence.”</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">RS</div>
                  <div>
                    <strong>Rajesh Sharma</strong>
                    <span>Parent of Class 7 Student</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-quote"><i className="fas fa-quote-left"></i></div>
                <p>“My daughter won at the state-level Abacus competition. The school&apos;s focus on co-curricular activities alongside academics is remarkable.”</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">PD</div>
                  <div>
                    <strong>Priya Deshmukh</strong>
                    <span>Parent of Class 5 Student</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-content">
            <h2>Admissions Open for 2026-27</h2>
            <p>Give your child the best start with CBSE education. Limited seats available.</p>
          </div>
          <div className="cta-btns">
            <Link href="/admissions/apply" className="btn btn-navy btn-lg">
              <i className="fas fa-file-alt"></i> Apply Now
            </Link>
            <Link href="/contact" className="btn btn-outline btn-lg" style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}>
              <i className="fas fa-phone"></i> Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
