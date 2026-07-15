import '@/styles/about.css';
import '@/styles/social-media.css';

const socialLinks = [
  {
    name: 'YouTube',
    icon: 'fab fa-youtube',
    text: 'Watch our school videos, events, and updates on YouTube.',
    button: 'Open YouTube',
    url: 'https://youtube.com/@vasundharaacademyakole1701?si=ySycXGkIP8PRDkji',
  },
  {
    name: 'Instagram',
    icon: 'fab fa-instagram',
    text: 'Follow our latest school updates and activities on Instagram.',
    button: 'Open Instagram',
    url: 'https://www.instagram.com/vasundhara_academy?igsh=MThkYmN6OWpxa3J3OA==',
  },
];

export const metadata = {
  title: 'Social Media | Vasundhara Academy Akole',
  description: 'Connect with Vasundhara Academy on our official YouTube and Instagram platforms.',
};

export default function SocialMediaPage() {
  return (
    <>
      <section className="page-hero page-hero-building">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Social Media</h1>
          <p className="page-hero-desc">
            Connect with Vasundhara Academy on our official social media platforms.
          </p>
        </div>
      </section>

      <section className="social-media-section">
        <div className="container text-center">
          <span className="section-tag"><i className="fas fa-minus"></i> Follow Us</span>
          <h2 className="section-title">Official Social Media Platforms</h2>
        </div>

        <div className="social-media-grid">
          {socialLinks.map((item) => (
            <article key={item.name} className="social-media-card">
              <div className="social-media-icon">
                <i className={item.icon}></i>
              </div>
              <h3>{item.name}</h3>
              <p>{item.text}</p>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <i className="fas fa-external-link-alt"></i>
                {item.button}
              </a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
