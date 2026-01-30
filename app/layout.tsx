import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vizzion - Visual Customization Widget for Businesses',
  description: 'Let customers visualize your products on their own images. Embed Vizzion on your website and turn browsers into buyers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
