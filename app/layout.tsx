import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://vizzion.io'),
  title: 'Vizzion — Product Visualization Widget for Lead Generation',
  description: 'Turn website visitors into qualified leads. Customers upload a photo and see your product on their actual property, vehicle, or body. Exclusive leads from your own website traffic.',
  openGraph: {
    type: 'website',
    siteName: 'Vizzion',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Vizzion",
              "url": "https://vizzion.io",
              "description":
                "Product visualization widget for businesses that sell visual transformations. Customers upload a photo and see what products or services look like on their actual property, vehicle, or body.",
              "sameAs": [],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "sales",
                "url": "https://vizzion.io/get-started",
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
              "name": "Vizzion",
              "url": "https://vizzion.io",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
