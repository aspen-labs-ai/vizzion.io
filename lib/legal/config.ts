/**
 * Single source of truth for the facts used across the Terms of Service and
 * Privacy Policy pages. Keeping these in one place ensures both documents stay
 * consistent (same entity name, dates, contacts, and jurisdiction).
 *
 * ──────────────────────────────────────────────────────────────────────────
 * Optional follow-up: add a registered `mailingAddress` below to further
 * strengthen the documents (not required, omitted cleanly when null).
 * ──────────────────────────────────────────────────────────────────────────
 */

export const LEGAL = {
  /** Public-facing brand / operating name. */
  brandName: 'Vizzion',

  /** Formal registered entity that operates Vizzion. */
  legalEntityName: 'Aspen Labs, LLC',

  /** Canonical marketing site + the app/widget origin. */
  siteUrl: 'https://vizzion.io',
  appUrl: 'https://app.vizzion.io',
  siteDomain: 'vizzion.io',

  /** Dates shown at the top of both documents. */
  effectiveDate: 'June 17, 2026',
  lastUpdated: 'June 17, 2026',

  /** Single contact address for all inquiries (privacy, legal, support, sales). */
  contactEmail: 'trey@vizzion.io',
  privacyEmail: 'trey@vizzion.io',
  legalEmail: 'trey@vizzion.io',
  supportEmail: 'trey@vizzion.io',
  salesEmail: 'trey@vizzion.io',
  /** General fallback contact that already exists on the site. */
  contactPath: '/#signup',

  /** Optional registered business address. Leave null to omit the address line. */
  mailingAddress: null as string | null,

  /** Governing law + dispute venue. */
  governingLawState: 'Florida',

  /** Minimum age to use the Service / submit a photo. */
  minimumAge: 18,

  /** Calendar days an end user has to opt out of arbitration after first accepting. */
  arbitrationOptOutDays: 30,

  /** Retention windows reflected in the product today. */
  retention: {
    /** Original uploaded photos. */
    uploadsDays: 30,
    /** Generated visualization previews + shareable preview links. */
    previewsDays: 7,
  },
} as const;

/**
 * Categories of service providers that may process personal information on
 * Vizzion's behalf. We intentionally disclose by category (which satisfies
 * CCPA/CPRA and GDPR) rather than naming specific vendors, to avoid exposing
 * proprietary implementation details. A specific, named list can be provided
 * to business customers under a data processing addendum on request.
 */
export const SERVICE_PROVIDER_CATEGORIES: ReadonlyArray<{
  category: string;
  purpose: string;
}> = [
  {
    category: 'Cloud hosting, database, and storage providers',
    purpose:
      'Operate the Service and securely store accounts, uploaded photos, and generated visualizations',
  },
  {
    category: 'Image-processing providers',
    purpose: 'Help generate your visualization from the photo you upload',
  },
  {
    category: 'Email delivery providers',
    purpose: 'Send transactional emails, such as delivering your visualization',
  },
  {
    category: 'Security and abuse-prevention providers',
    purpose: 'Detect and prevent fraud, abuse, and automated attacks',
  },
  {
    category: 'Analytics providers',
    purpose: 'Help us understand aggregate usage of our website and the Service',
  },
  {
    category: 'Communication and workflow providers',
    purpose: 'Process website inquiries and internal notifications',
  },
];
