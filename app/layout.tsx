import type { Metadata } from 'next';
import Script from 'next/script';
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
    <html lang="en">
      <body>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","vhtqb8ecoj");`}
        </Script>
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
