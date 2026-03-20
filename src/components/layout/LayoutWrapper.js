'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NotificationBanner from '@/components/layout/NotificationBanner';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
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
      <NotificationBanner />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <ScrollReveal />
    </>
  );
}
