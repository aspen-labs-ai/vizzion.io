'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';

const CLARITY_PROJECT_ID = 'vhtqb8ecoj';

// The authenticated product is served from the app subdomain in production, and
// from these route prefixes within this codebase. Clarity must never run on
// these surfaces — only on the public marketing site.
const APP_HOSTNAME = 'app.vizzion.io';
const APP_PATH_PREFIXES = ['/dashboard', '/auth'];

function isAppSurface(hostname: string, pathname: string): boolean {
  if (hostname === APP_HOSTNAME) {
    return true;
  }

  return APP_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function ClarityAnalytics() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Defer the host/path decision to the client so the root layout stays
  // statically rendered and we avoid any hydration mismatch. Clarity loads
  // `afterInteractive` regardless, so this adds no meaningful delay.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isAppSurface(window.location.hostname, pathname)) {
    return null;
  }

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_PROJECT_ID}");`}
    </Script>
  );
}
