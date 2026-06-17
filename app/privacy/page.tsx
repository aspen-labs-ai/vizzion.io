import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '@/components/legal/LegalPage';
import { getCanonicalUrl } from '@/lib/seo/canonical';
import { LEGAL, SERVICE_PROVIDER_CATEGORIES } from '@/lib/legal/config';

export const metadata: Metadata = {
  title: 'Privacy Policy | Vizzion',
  description:
    'How Vizzion collects, uses, shares, and protects personal information across our website, dashboard, and embeddable visualization widget.',
  alternates: {
    canonical: getCanonicalUrl('/privacy'),
  },
  openGraph: {
    title: 'Privacy Policy | Vizzion',
    description:
      'How Vizzion collects, uses, shares, and protects personal information across our website, dashboard, and embeddable visualization widget.',
    url: '/privacy',
  },
};

const privacyEmailLink = (
  <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>
);

const sections: LegalSection[] = [
  {
    id: 'overview',
    title: 'Overview and scope',
    body: (
      <>
        <p>
          This Privacy Policy explains how {LEGAL.legalEntityName} (“Vizzion,”
          “we,” “us,” or “our”) collects, uses, and shares information in
          connection with our websites at{' '}
          <a href={LEGAL.siteUrl}>{LEGAL.siteDomain}</a> and{' '}
          <a href={LEGAL.appUrl}>app.{LEGAL.siteDomain}</a>, our customer
          dashboard, and the embeddable visualization widget that our business
          customers place on their own websites (together, the “Service”).
        </p>
        <p>
          Vizzion serves two groups of people: the businesses that subscribe to
          Vizzion (“Customers”) and the visitors who use a Customer’s widget to
          preview a product or service on a photo they upload (“End Users”).
          This policy describes our practices for both.{' '}
          <a href="#roles">The next section</a> explains an important
          distinction in our responsibilities.
        </p>
      </>
    ),
  },
  {
    id: 'roles',
    title: 'Our role: service provider vs. controller',
    body: (
      <>
        <p>
          The widget is embedded on websites operated by our Customers (for
          example, a roofing, solar, landscaping, or auto-styling company). When
          an End User uploads a photo and submits an email through that widget,
          the Customer decides why the information is collected and how they will
          use it to follow up.
        </p>
        <p>
          For that End-User information, the Customer acts as the party
          responsible for the data (a “controller” under laws such as the GDPR,
          or a “business” under U.S. state privacy laws), and Vizzion acts as
          their service provider or processor — we handle the information on the
          Customer’s behalf and under our agreement with them. As a result:
        </p>
        <ul>
          <li>
            If you are an End User and want to access, correct, or delete the
            information you submitted through a widget, the fastest route is
            usually to contact the business whose website you used. You may also
            contact us (see <a href="#contact">How to contact us</a>) and we
            will assist, including by forwarding your request to the relevant
            Customer.
          </li>
          <li>
            We also act as a controller in our own right for certain
            information — for example, Customer account data, security and
            abuse-prevention data, aggregate analytics, and the operation and
            improvement of the Service.
          </li>
          <li>
            Customers are responsible for providing their own privacy notices
            to, and obtaining any required consents from, their End Users.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'information-we-collect',
    title: 'Information we collect',
    body: (
      <>
        <h3>Information you provide</h3>
        <ul>
          <li>
            <strong>Email address.</strong> End Users may be asked to enter an
            email address to receive or reveal a visualization. Customers
            provide an email address to create and sign in to an account.
          </li>
          <li>
            <strong>Photos and images.</strong> End Users upload a photo (for
            example, of a home, room, yard, vehicle, or boat) to generate a
            visualization. See <a href="#photos">Photos and images you upload</a>.
          </li>
          <li>
            <strong>Selections.</strong> The product, material, color, or style
            options an End User chooses.
          </li>
          <li>
            <strong>Account and business details.</strong> For Customers:
            business or company name, brand assets such as a logo and brand
            color, a reply-to email address, and the materials or products you
            configure.
          </li>
          <li>
            <strong>Communications.</strong> If you contact us, complete a form,
            or request support, we collect the information you include (such as
            your name, email, industry, and message).
          </li>
        </ul>

        <h3>Information collected automatically</h3>
        <p>When you use the Service, we and our providers automatically collect:</p>
        <ul>
          <li>
            <strong>Device and usage data,</strong> such as your browser type
            and user-agent, the page on which the widget is displayed, and the
            referring page.
          </li>
          <li>
            <strong>A hashed IP address.</strong> We hash IP addresses with a
            secret value before storing them in connection with widget sessions;
            we do not store the raw IP address. (A raw IP address is necessarily
            transmitted to our infrastructure and security providers to deliver
            the Service and run the verification challenge.)
          </li>
          <li>
            <strong>Session identifiers</strong> stored in your browser’s session
            storage so the widget functions during a single visit.
          </li>
          <li>
            <strong>Product-analytics events</strong> describing how the widget
            is used (for example, that a photo was uploaded or a visualization
            was requested), and limited file metadata such as a file’s size and
            name.
          </li>
        </ul>

        <h3>Information we do not request</h3>
        <p>
          The widget does not request your name, phone number, or postal
          address, and it has no field for them. Please do not enter sensitive
          personal information into the email field. Note that a photo you choose
          to upload may itself reveal information — see the next section.
        </p>
      </>
    ),
  },
  {
    id: 'photos',
    title: 'Photos and images you upload',
    body: (
      <>
        <p>Photos are central to the Service, so they deserve special attention.</p>
        <ul>
          <li>
            <strong>What we do with them.</strong> We store the photo you upload,
            process it to create your visualization (see{' '}
            <a href="#image-processing">How visualizations are generated</a>),
            store the resulting visualization, and — where applicable — email the
            result to the address you provide.
          </li>
          <li>
            <strong>Images may depict people or property.</strong> A photo of a
            home, yard, room, vehicle, or boat may reveal information about a
            property or its location, and a photo may include people. You should
            upload a photo only if you are permitted to do so. Some Customers use
            the widget for body-related previews; you must be {LEGAL.minimumAge}+
            and should upload a photo only of yourself or of someone who has
            agreed.
          </li>
          <li>
            <strong>Photo metadata.</strong> Image files can contain embedded
            metadata (for example, the date, device, or location where the photo
            was taken). We do not use this metadata to identify you, and the copy
            of your image used to generate the visualization is re-encoded in a
            way that typically removes it. If you prefer not to share metadata,
            you can remove it before uploading.
          </li>
          <li>
            <strong>Retention.</strong> Uploaded photos and generated previews
            are kept only for a limited time — see{' '}
            <a href="#retention">How long we keep information</a>.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How we use information',
    body: (
      <>
        <p>We use information to:</p>
        <ul>
          <li>
            <strong>Provide the Service</strong> — process your photo, generate
            and deliver your visualization, and operate the widget and dashboard.
          </li>
          <li>
            <strong>Route and manage leads</strong> on behalf of the Customer
            whose widget you used.
          </li>
          <li>
            <strong>Communicate with you</strong> — send your visualization,
            respond to inquiries, and send Customers service and account
            messages.
          </li>
          <li>
            <strong>Maintain security and prevent abuse</strong> — including
            rate-limiting, bot detection, and investigating misuse.
          </li>
          <li>
            <strong>Measure and improve the Service</strong> — understand
            aggregate usage, fix problems, and develop features.
          </li>
          <li>
            <strong>Comply with law</strong> — meet legal obligations and enforce
            our <a href={LEGAL.siteUrl + '/terms'}>Terms of Service</a>.
          </li>
        </ul>
        <p>
          We do not sell your personal information. We use your photos only to
          generate your visualization and operate the Service — for example, we
          do not use your photos to build or train unrelated products. Some
          processing is carried out by trusted service providers acting on our
          behalf (see <a href="#sharing">How we share information</a>).
        </p>
      </>
    ),
  },
  {
    id: 'image-processing',
    title: 'How visualizations are generated',
    body: (
      <>
        <p>
          Your visualization is created using automated image-processing
          technology. When you submit a photo, it is processed together with the
          options you selected to produce an edited image that previews the
          product or service. Some of this processing may be performed with the
          help of trusted service providers acting on our behalf.
        </p>
        <div className="legal-callout">
          <p>
            This processing is automated, and the visualization is an
            approximation generated by software. It is not a photograph of a real
            result and may differ from how a product or service would actually
            look. This automated processing does not make any decision that
            produces legal or similarly significant effects about you.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'How we share information',
    body: (
      <>
        <p>
          We share information only as described here. We do not sell your
          personal information, and we do not share it for cross-context
          behavioral advertising.
        </p>
        <ul>
          <li>
            <strong>With the Customer whose widget you used.</strong> End-User
            submissions (such as email, selections, and the generated
            visualization) are made available to that business in their dashboard
            so they can follow up with you.
          </li>
          <li>
            <strong>With service providers (subprocessors).</strong> We use
            trusted vendors to run the Service. They may process personal
            information only to provide services to us and are bound by
            confidentiality and data-protection obligations.
          </li>
          <li>
            <strong>For legal and safety reasons.</strong> To comply with law,
            enforce our agreements, or protect the rights, safety, and security
            of Vizzion, our users, or the public.
          </li>
          <li>
            <strong>In a business transfer.</strong> If Vizzion is involved in a
            merger, acquisition, financing, or sale of assets, information may be
            transferred as part of that transaction, subject to this policy.
          </li>
          <li>
            <strong>With your direction or consent.</strong> When you ask us to
            share information or otherwise agree.
          </li>
        </ul>
        <p>
          We work with the following categories of service providers, which may
          be located in the United States or elsewhere:
        </p>
        <table>
          <thead>
            <tr>
              <th>Category of provider</th>
              <th>What they help us do</th>
            </tr>
          </thead>
          <tbody>
            {SERVICE_PROVIDER_CATEGORIES.map((provider) => (
              <tr key={provider.category}>
                <td>{provider.category}</td>
                <td>{provider.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          We choose providers that agree to protect personal information and to
          use it only to provide services to us. Business customers who need a
          specific list of the providers we use can request one, under a data
          processing addendum, at{' '}
          <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and similar technologies',
    body: (
      <>
        <h3>The embedded widget</h3>
        <p>
          The widget uses your browser’s session storage to hold a temporary
          session identifier so it can function during your visit. It does not
          set advertising cookies, and its requests to our servers are made
          without cookies. If a verification challenge is shown to prevent abuse,
          our security provider may set its own cookies or storage governed by
          its policies.
        </p>
        <h3>Our websites and dashboard</h3>
        <p>
          On {LEGAL.siteDomain} we use a small number of cookies and similar
          technologies, including a third-party product-analytics tool that helps
          us understand aggregate usage, and — in the Customer dashboard —
          strictly necessary cookies to keep you signed in and remember
          preferences.
        </p>
        <h3>Your choices</h3>
        <p>
          Most browsers let you block or delete cookies and clear session
          storage. Some browsers offer a Global Privacy Control (GPC) signal;
          where required, we treat a GPC signal as a request to opt out of any
          “sale” or “sharing” as those terms are defined by applicable law (note
          that we do not sell or share personal information for advertising).
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep information',
    body: (
      <>
        <p>
          We keep personal information only as long as needed for the purposes
          described in this policy, unless a longer period is required or
          permitted by law.
        </p>
        <ul>
          <li>
            <strong>Uploaded photos</strong> are retained for up to{' '}
            {LEGAL.retention.uploadsDays} days and then deleted from active
            storage.
          </li>
          <li>
            <strong>Generated visualizations and shareable preview links</strong>{' '}
            are retained for approximately {LEGAL.retention.previewsDays} days;
            preview links expire and stop working after that period.
          </li>
          <li>
            <strong>Lead and account records</strong> are retained for as long as
            the relevant Customer maintains their account or as needed to provide
            the Service, after which they are deleted or de-identified. Customers
            can delete leads from their dashboard.
          </li>
          <li>
            <strong>Backups and logs</strong> may persist for a limited
            additional period before being overwritten.
          </li>
        </ul>
        <p>
          You can ask us to delete information sooner — see{' '}
          <a href="#your-rights">Your privacy rights and choices</a>.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'How we protect information',
    body: (
      <p>
        We use technical and organizational measures designed to protect personal
        information, including encryption in transit, access controls, private
        storage for uploaded photos and generated images (served only through
        time-limited links), hashing of IP addresses, and abuse-prevention
        controls. No method of transmission or storage is completely secure, so
        we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your privacy rights and choices',
    body: (
      <>
        <p>Depending on where you live, you may have the right to:</p>
        <ul>
          <li>access the personal information we hold about you;</li>
          <li>correct inaccurate information;</li>
          <li>delete your information;</li>
          <li>receive a copy in a portable format;</li>
          <li>
            opt out of the “sale” or “sharing” of personal information or certain
            profiling (we do not sell or share personal information);
          </li>
          <li>withdraw consent where processing is based on consent; and</li>
          <li>not be discriminated against for exercising your rights.</li>
        </ul>
        <h3>How to exercise your rights</h3>
        <p>
          <strong>End Users:</strong> because the business that operates the
          widget is usually responsible for your submission, contact that
          business first; you may also email us at {privacyEmailLink} and we will
          assist and coordinate with the Customer.{' '}
          <strong>Customers and website visitors:</strong> email{' '}
          {privacyEmailLink}. We will verify your request (for example, by
          confirming control of the email address involved) before acting, and we
          will respond within the time required by applicable law. You may use an
          authorized agent where the law permits.
        </p>
      </>
    ),
  },
  {
    id: 'us-states',
    title: 'U.S. state privacy rights',
    body: (
      <>
        <p>
          If you are a resident of California or another U.S. state with a
          comprehensive privacy law (such as Virginia, Colorado, Connecticut,
          Utah, Texas, Oregon, and others), you have the rights described above,
          subject to certain exceptions.
        </p>
        <ul>
          <li>
            <strong>Categories we collect:</strong> identifiers (such as email
            and hashed IP), internet or network activity (such as usage events
            and the referring page), visual information (the photos you upload
            and the visualizations generated), and, when you provide them, your
            communications and account details.
          </li>
          <li>
            <strong>Sources, purposes, and disclosures</strong> are described in{' '}
            <a href="#information-we-collect">Information we collect</a>,{' '}
            <a href="#how-we-use">How we use information</a>, and{' '}
            <a href="#sharing">How we share information</a>.
          </li>
          <li>
            <strong>Sale or sharing:</strong> we do not sell personal information
            and do not share it for cross-context behavioral advertising.
          </li>
          <li>
            <strong>Sensitive information:</strong> a photo that depicts a person
            may, in some cases, be treated as sensitive personal information; we
            use it only to provide the visualization you requested and do not use
            it to infer characteristics about you.
          </li>
          <li>
            <strong>Appeals:</strong> if we deny your request, you may appeal by
            replying to our decision. You may also contact your state attorney
            general with concerns.
          </li>
        </ul>
        <p>
          <strong>California “Shine the Light”:</strong> you may request
          information about disclosures of personal information to third parties
          for their own direct marketing. We do not make such disclosures.
        </p>
      </>
    ),
  },
  {
    id: 'gdpr',
    title: 'Users in the EEA, United Kingdom, and Switzerland',
    body: (
      <>
        <p>Where the GDPR or UK GDPR applies:</p>
        <ul>
          <li>
            <strong>Controller and processor.</strong> For information submitted
            through a Customer’s widget, the Customer is typically the controller
            and Vizzion is the processor (see{' '}
            <a href="#roles">Our role</a>). For our own websites and accounts,
            Vizzion is the controller.
          </li>
          <li>
            <strong>Legal bases.</strong> We rely on performance of a contract
            (to provide the Service you request); legitimate interests (to
            secure, operate, measure, and improve the Service, balanced against
            your rights); consent (where required, such as certain cookies — you
            may withdraw it at any time); and compliance with legal obligations.
          </li>
          <li>
            <strong>Additional rights.</strong> You may object to or restrict
            certain processing and lodge a complaint with your local supervisory
            authority.
          </li>
          <li>
            <strong>Transfers.</strong> We are based in the United States and use
            providers there; see{' '}
            <a href="#transfers">International data transfers</a>.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'transfers',
    title: 'International data transfers',
    body: (
      <p>
        We operate in the United States, and our service providers are primarily
        located in the United States. If you access the Service from outside the
        United States, your information will be transferred to and processed in
        the United States and other countries, which may not provide the same
        level of data protection as your home jurisdiction. Where required, we
        rely on appropriate safeguards (such as the European Commission’s
        Standard Contractual Clauses) for these transfers. Contact us for more
        information.
      </p>
    ),
  },
  {
    id: 'children',
    title: 'Children’s privacy',
    body: (
      <p>
        The Service is intended for adults and is not directed to children. We do
        not knowingly collect personal information from children under 13 (or the
        minimum age required in your jurisdiction). You must be at least{' '}
        {LEGAL.minimumAge} years old to upload a photo, particularly a photo that
        depicts a person. If you believe a child has provided us personal
        information, contact us at {privacyEmailLink} and we will take appropriate
        steps to delete it.
      </p>
    ),
  },
  {
    id: 'third-party',
    title: 'Third-party websites and businesses',
    body: (
      <p>
        The widget appears on websites operated by our Customers, and
        visualizations may be emailed or shared as links. Those Customer
        websites, and any other third-party sites or services you reach through
        links, have their own privacy practices that we do not control. We
        encourage you to review the privacy notice of the business whose widget
        you used and of any website you visit.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this Privacy Policy',
    body: (
      <p>
        We may update this Privacy Policy from time to time. When we make
        material changes, we will update the “Last updated” date at the top and,
        where appropriate, provide additional notice. Your continued use of the
        Service after an update takes effect means you accept the revised policy.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'How to contact us',
    body: (
      <>
        <p>
          If you have questions or requests regarding this Privacy Policy or your
          personal information, contact us:
        </p>
        <ul>
          <li>Email: {privacyEmailLink}</li>
          <li>
            Or use the contact form at{' '}
            <a href={LEGAL.contactPath}>our website</a>
          </li>
          {LEGAL.mailingAddress ? <li>Mail: {LEGAL.mailingAddress}</li> : null}
        </ul>
        <p>
          We will respond as required by applicable law. If you are an End User,
          remember that the business operating the widget you used may also be
          able to help with your request.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <p>
          Vizzion lets businesses add a visualization widget to their website so
          their customers can upload a photo and see a realistic preview of a
          product or service before sharing their contact information. This
          Privacy Policy explains what we collect, how we use and share it, how
          long we keep it, and the choices and rights you have.
        </p>
      }
      sections={sections}
    />
  );
}
