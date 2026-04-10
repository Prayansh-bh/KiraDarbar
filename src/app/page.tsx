import { Metadata } from 'next';
import HomeClient from './page-client';

export const metadata: Metadata = {
  title: "KiraDarbar — Tenant Legal Protection India | Legal Notice ₹799",
  description: "Fight back against illegal evictions and deposit theft. KiraDarbar sends lawyer-signed legal notices for ₹799 and protects Indian tenants' rights.",
  alternates: {
    canonical: 'https://kiradarbar.in',
  },
  openGraph: {
    title: "KiraDarbar — Tenant Legal Protection India",
    description: "Fight back against illegal evictions and deposit theft.",
    url: 'https://kiradarbar.in',
    images: [{ url: 'https://kiradarbar.in/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_IN',
    type: 'website',
  }
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KiraDarbar',
    url: 'https://kiradarbar.in',
    logo: 'https://kiradarbar.in/logo.png',
    description: "India's first B2C SaaS platform for tenant rights, legal notices, and agreement reviews.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressCountry: 'IN'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
