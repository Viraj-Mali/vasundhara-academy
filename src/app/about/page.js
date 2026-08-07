import Link from 'next/link';
import '@/styles/about.css';

export const metadata = {
  title: 'About Vasundhara Academy Akole | Best CBSE School in Akole',
  description: 'Learn about Vasundhara Academy, a premier CBSE school in Akole, Maharashtra. Our mission, vision, and commitment to providing quality education and holistic development.',
};

export default function AboutPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero page-hero-building">
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
              Nestled in the serene Pravara River region and surrounded by the majestic foothills of the Sahyadri ranges, Vasundhara Academy, Akole is a center of holistic education rooted in values, and excellence. Established in 2014 and run by Abhinav Shikshan Sanstha, the academy has been committed to providing quality education with a vision of nurturing responsible, confident, and compassionate individuals.
            </p>
            <p>
              Rooted in the rich cultural heritage and natural beauty of Akole, our institution offers an inspiring environment where education flourishes in harmony with nature. At Vasundhara Academy, we believe that education is not merely the acquisition of knowledge but the development of character, creativity, leadership, and social responsibility.
            </p>
            <p>
              With a strong focus on academic excellence, innovative teaching methods, and value-based education, we strive to create a learning atmosphere that empowers every child to realize their fullest potential. Along with scholastic achievement, equal emphasis is given to co-curricular activities, sports, life skills, environmental awareness, and personality development.
            </p>
            <p>
              Guided by dedicated educators and supported by progressive educational practices, Vasundhara Academy continues to shape young minds into future-ready citizens who are intellectually competent, morally strong, and socially sensitive. Inspired by the enduring strength of the Sahyadri mountains and the nurturing flow of the Pravara River, our academy stands as a beacon of learning, discipline, and transformation in the Akole region.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="about-highlights">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> What Defines Us</span>
          <h2 className="section-title">The Pillars of Vasundhara Academy</h2>
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
