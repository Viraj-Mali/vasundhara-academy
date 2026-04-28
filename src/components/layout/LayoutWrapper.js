'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NotificationBanner from '@/components/layout/NotificationBanner';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';
import ScrollToTop from '@/components/ui/ScrollToTop';
import ScrollReveal from '@/components/ui/ScrollReveal';
import '@/styles/animations.css';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="header-wrapper">
        <NotificationBanner />
        <Navbar />
      </header>
      <main>{children}</main>
      <Footer />
      <WhatsAppWidget />
      <ScrollToTop />
      <ScrollReveal />
    </>
  );
}
