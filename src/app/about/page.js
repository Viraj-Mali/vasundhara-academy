import Link from 'next/link';
import '@/styles/about.css';

export const metadata = {
  title: 'About Us',
  description: 'Learn about Vasundhara Academy, Akole — our mission, vision, leadership, and commitment to CBSE education excellence.',
};

export default function AboutPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">About Vasundhara Academy</h1>
          <p className="page-hero-desc">
            Nurturing excellence, building character, shaping futures since establishment.
          </p>
        </div>
      </section>

      {/* Welcome */}
      <section className="about-welcome">
        <div className="about-welcome-inner">
          <span className="section-tag"><i className="fas fa-minus"></i> Welcome</span>
          <h2 className="section-title">Welcome to Vasundhara Academy, Akole</h2>
          <div className="about-welcome-text">
            <p>
              Vasundhara Academy, a prestigious institution under the Abhinav Education Society
              (Reg. No: MAHA/2143/ANR), is a premier CBSE-affiliated school located in the scenic town
              of Akole, Tal. Akole, Dist. Ahmednagar, Maharashtra. With CBSE Affiliation No. 1130637,
              we offer quality education from Grade 1 through Grade 10.
            </p>
            <p>
              Our academy is committed to providing a holistic learning environment where academic
              excellence goes hand in hand with character building, sports, and creative exploration.
              We believe every child has unique potential, and our mission is to help them discover
              and develop it to the fullest.
            </p>
            <p>
              With state-of-the-art infrastructure, experienced faculty, and a curriculum that
              blends traditional values with modern teaching methodologies, Vasundhara Academy
              stands as a beacon of quality education in the Akole region.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="about-highlights">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> What Defines Us</span>
          <h2 className="section-title">The Pillars of Our Academy</h2>
        </div>
        <div className="highlights-grid">
          <div className="highlight-card">
            <div className="highlight-icon"><i className="fas fa-bullseye"></i></div>
            <h3>Our Vision</h3>
            <p>To be a center of educational excellence that nurtures globally competitive individuals rooted in Indian values and culture.</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon"><i className="fas fa-rocket"></i></div>
            <h3>Our Mission</h3>
            <p>To provide quality CBSE education that develops intellectual curiosity, creativity, and strong moral character in every student.</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon"><i className="fas fa-heart"></i></div>
            <h3>Our Values</h3>
            <p>Excellence, integrity, respect, compassion, and innovation guide every aspect of our educational approach and school culture.</p>
          </div>
        </div>
      </section>

      {/* Quick Links to Sub-pages */}
      <section className="about-highlights" style={{ background: 'var(--white)' }}>
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Explore More</span>
          <h2 className="section-title">Learn More About Us</h2>
        </div>
        <div className="highlights-grid">
          <Link href="/about/mission-vision" className="highlight-card">
            <div className="highlight-icon"><i className="fas fa-eye"></i></div>
            <h3>Mission & Vision</h3>
            <p>Our guiding principles and future aspirations for student excellence.</p>
          </Link>
          <Link href="/about/president-message" className="highlight-card">
            <div className="highlight-icon"><i className="fas fa-user-tie"></i></div>
            <h3>President&apos;s Message</h3>
            <p>Words of wisdom from our Hon&apos;ble President.</p>
          </Link>
          <Link href="/about/principal-message" className="highlight-card">
            <div className="highlight-icon"><i className="fas fa-chalkboard-teacher"></i></div>
            <h3>Principal&apos;s Message</h3>
            <p>Guidance and vision from our esteemed Principal.</p>
          </Link>
          <Link href="/about/board-of-directors" className="highlight-card">
            <div className="highlight-icon"><i className="fas fa-users"></i></div>
            <h3>Board of Directors</h3>
            <p>Meet the leadership team guiding our institution.</p>
          </Link>
          <Link href="/about/general-info" className="highlight-card">
            <div className="highlight-icon"><i className="fas fa-info-circle"></i></div>
            <h3>General Information</h3>
            <p>School details, affiliation, and contact information.</p>
          </Link>
          <Link href="/about/awards" className="highlight-card">
            <div className="highlight-icon"><i className="fas fa-trophy"></i></div>
            <h3>Awards & Recognition</h3>
            <p>Our achievements and milestones of excellence.</p>
          </Link>
        </div>
      </section>
    </>
  );
}
