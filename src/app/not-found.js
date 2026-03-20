import Link from 'next/link';
import '@/styles/about.css';

export default function NotFound() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #0a1628 0%, #0f2040 40%, #162d50 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem',
    }}>
      {/* Decorative elements */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(212,168,83,0.03)', filter: 'blur(60px)' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(212,168,83,0.04)', filter: 'blur(80px)' }}></div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
        {/* 404 Number */}
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(6rem, 15vw, 10rem)',
          fontWeight: 800,
          background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: '1rem',
        }}>
          404
        </h1>

        {/* Icon */}
        <div style={{
          width: '80px', height: '80px', margin: '0 auto 1.5rem',
          borderRadius: '50%', background: 'rgba(212,168,83,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid rgba(212,168,83,0.2)',
        }}>
          <i className="fas fa-compass" style={{ fontSize: '2rem', color: 'var(--gold)' }}></i>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.8rem',
          color: 'var(--white)',
          marginBottom: '0.8rem',
        }}>
          Page Not Found
        </h2>

        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '1rem',
          lineHeight: 1.7,
          marginBottom: '2rem',
        }}>
          Oops! The page you&apos;re looking for seems to have wandered off.
          Let&apos;s get you back on track.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary btn-lg">
            <i className="fas fa-home"></i> Go Home
          </Link>
          <Link href="/contact" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'var(--white)' }}>
            <i className="fas fa-envelope"></i> Contact Us
          </Link>
        </div>

        {/* Quick links */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Popular Pages
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { href: '/about', label: 'About Us', icon: 'fas fa-school' },
              { href: '/admissions', label: 'Admissions', icon: 'fas fa-user-graduate' },
              { href: '/academics', label: 'Academics', icon: 'fas fa-book-open' },
              { href: '/contact', label: 'Contact', icon: 'fas fa-phone' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                color: 'var(--gold)', fontSize: '0.82rem', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                transition: 'opacity 0.3s',
              }}>
                <i className={link.icon} style={{ fontSize: '0.7rem' }}></i> {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
