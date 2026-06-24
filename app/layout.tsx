import type { Metadata } from 'next';
import { Inter, Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google';
import ClarityAnalytics from '@/components/ClarityAnalytics';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-inter', display: 'swap' });
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-bricolage', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://vizzion.io'),
  title: 'Vizzion — Product Visualization Widget for Lead Generation',
  description: 'Turn website visitors into qualified leads. Customers upload a photo and see your product on their actual property, vehicle, or body. Exclusive leads from your own website traffic.',
  openGraph: {
    type: 'website',
    siteName: 'Vizzion',
    locale: 'en_US',
    images: [
      {
        url: '/images/vizzion-og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vizzion — Product Visualization Widget for Lead Generation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/vizzion-logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/vizzion-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable} ${jetbrains.variable}`}>
      <body>
        <ClarityAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://vizzion.io/#organization",
              "name": "Vizzion",
              "url": "https://vizzion.io",
              "description":
                "Product visualization widget for businesses that sell visual transformations. Customers upload a photo and see what products or services look like on their actual property, vehicle, or body.",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "sales",
                "url": "https://vizzion.io/#signup",
              },
              "offers": {
                "@type": "Offer",
                "description":
                  "Free tier available. Premium plans based on visualization volume.",
                "price": "0",
                "priceCurrency": "USD",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://vizzion.io/#website",
              "name": "Vizzion",
              "url": "https://vizzion.io",
              "publisher": { "@id": "https://vizzion.io/#organization" },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
