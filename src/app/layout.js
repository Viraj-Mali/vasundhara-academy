import '@/styles/globals.css';
import AuthProvider from '@/components/AuthProvider';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

export const metadata = {
  title: {
    default: 'Vasundhara Academy, Akole — CBSE School | Grades 1-10',
    template: '%s | Vasundhara Academy',
  },
  description:
    "Abhinav Education Society's Vasundhara Academy — a premier CBSE-affiliated school in Akole, Ahmednagar, offering quality education from Grade 1 to 10. Expert Abacus & SOF Olympiad winners.",
  keywords: [
    'Vasundhara Academy',
    'CBSE school Akole',
    'Abhinav Education Society',
    'school in Ahmednagar',
    'CBSE school Maharashtra',
    'best school Akole',
    'CBSE affiliation 1130637',
    'school Akole Ahmednagar',
    'Vasundhara Academy fees',
    'admission Akole school',
  ],
  authors: [{ name: 'Vasundhara Academy' }],
  creator: 'Abhinav Education Society, Akole',
  publisher: 'Vasundhara Academy',
  metadataBase: new URL('https://vasundharaacademy.edu.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Vasundhara Academy, Akole — CBSE School | Grades 1-10',
    description: 'Premier CBSE-affiliated school in Akole, Ahmednagar. Quality education from Grade 1-10 with expert faculty, modern infrastructure, and holistic development.',
    url: 'https://vasundharaacademy.edu.in',
    siteName: 'Vasundhara Academy',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vasundhara Academy, Akole - CBSE School',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vasundhara Academy, Akole — CBSE School',
    description: 'Premier CBSE-affiliated school in Akole. Quality education Grade 1-10.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code', // Add after Google Search Console setup
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'School',
  name: 'Vasundhara Academy',
  alternateName: "Abhinav Education Society's Vasundhara Academy",
  url: 'https://vasundharaacademy.edu.in',
  logo: 'https://vasundharaacademy.edu.in/images/logo.png',
  image: 'https://vasundharaacademy.edu.in/images/og-image.jpg',
  description: 'Premier CBSE-affiliated school in Akole, Ahmednagar offering quality education from Grade 1 to 10.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Dhamangaon Awari Road',
    addressLocality: 'Akole',
    addressRegion: 'Maharashtra',
    postalCode: '422601',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 19.5281872,
    longitude: 74.0017772,
  },
  telephone: '+91-98819-45960',
  email: 'vasundhara.academy2016@gmail.com',
  foundingDate: '2016',
  founder: {
    '@type': 'Organization',
    name: 'Abhinav Education Society, Akole',
  },
  sameAs: [],
  areaServed: {
    '@type': 'Place',
    name: 'Akole, Ahmednagar, Maharashtra',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
