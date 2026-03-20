import Link from 'next/link';
import '@/styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Column 1: Logo & About */}
        <div className="footer-col">
          <div className="footer-logo">
            <img src="/images/logo.png" alt="Vasundhara Academy" className="footer-logo-img" />
            <div className="footer-logo-text">
              <span className="footer-logo-name">Vasundhara Academy</span>
              <span className="footer-logo-sub">CBSE • Akole</span>
            </div>
          </div>
          <p className="footer-desc">
            Abhinav Education Society&apos;s Vasundhara Academy — nurturing young minds through
            quality CBSE education, holistic development, and values-driven learning.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            <a href="https://wa.me/919881945960" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link href="/about">About Us</Link>
          <Link href="/academics">Academics</Link>
          <Link href="/admissions">Admissions</Link>
          <Link href="/facilities">Facilities</Link>
          <Link href="/events">Events</Link>
          <Link href="/stories">Stories</Link>
          <Link href="/why-vasundhara">Why Vasundhara</Link>
        </div>

        {/* Column 3: Contact */}
        <div className="footer-col footer-contact">
          <h4>Contact Us</h4>
          <p>
            <i className="fas fa-map-marker-alt"></i>
            Dhamangaon Awari Road, Akole,<br />
            Tal. Akole, Dist. Ahmednagar,<br />
            PIN–422601, Maharashtra
          </p>
          <p><i className="fas fa-phone"></i> +91 98819 45960</p>
          <p><i className="fas fa-envelope"></i> vasundhara.academy2016@gmail.com</p>
        </div>

        {/* Column 4: Important */}
        <div className="footer-col">
          <h4>Important</h4>
          <Link href="/disclosures">Public Disclosures</Link>
          <Link href="/comprehensive-info">Committees</Link>
          <Link href="/student-section">Student Section</Link>
          <Link href="/alumni">Alumni</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/enquire">Enquire Now</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Vasundhara Academy, Akole. All rights reserved.
          | CBSE Affiliation No: 1130637 | Reg. No: MAHA/2143/ANR
        </p>
        <div className="footer-bottom-links">
          <Link href="/disclosures">Privacy Policy</Link>
          <Link href="/disclosures">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
