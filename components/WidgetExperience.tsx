import Image from 'next/image';
import { Upload, Mail, Check, Eye } from 'lucide-react';

const STEPS = [
  {
    number: 1,
    title: 'Upload a Photo',
    description:
      'Your customer uploads a photo of their home, vehicle, or body — whatever surface your product transforms. Drag-and-drop or click to browse. Takes seconds.',
    bullets: [
      'Works with any photo from their phone or computer',
      'Instant upload — no waiting, no processing delays',
      'Supports every industry from roofing to boat decking',
    ],
    icon: Upload,
    mockup: 'upload',
  },
  {
    number: 2,
    title: 'Browse Your Catalog',
    description:
      'They pick from your product options — roofing materials, wrap colors, pool designs, whatever you sell. Your catalog, your brand, their choice.',
    bullets: [
      'Showcase your full product line visually',
      'Customers self-qualify by choosing what they want',
      'Fully customizable to match your brand',
    ],
    icon: Eye,
    mockup: 'catalog',
  },
  {
    number: 3,
    title: 'Enter Their Email',
    description:
      'Before seeing the visualization, they provide their email. This is the magic — every single interaction becomes a qualified lead delivered straight to your inbox.',
    bullets: [
      'Email gate before the reveal drives 100% capture rate',
      'Leads arrive pre-qualified and motivated',
      'Syncs automatically with your CRM',
    ],
    icon: Mail,
    mockup: 'email',
  },
  {
    number: 4,
    title: 'See the Result',
    description:
      'They see your product on their actual photo — a before-and-after they can compare side by side. You get a lead who\'s already excited about the result.',
    bullets: [
      'Realistic visualization on their own property',
      'Before/after comparison builds confidence',
      'Leads close faster because they\'ve already seen the outcome',
    ],
    icon: Check,
    mockup: 'result',
  },
];

function UploadMockup() {
  return (
    <div className="bg-bg-secondary rounded-xl border border-border-default p-6 space-y-4">
      <div className="rounded-lg border-2 border-dashed border-border-default bg-bg-tertiary p-8 flex flex-col items-center gap-3">
        <Upload className="w-10 h-10 text-text-tertiary" />
        <p className="text-sm font-medium text-text-secondary">Upload your home photo</p>
        <p className="text-xs text-text-tertiary">Drag & drop or click to browse</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-16 h-12 rounded-lg overflow-hidden relative flex-shrink-0">
          <Image src="/images/demo-house-old-roof.png" alt="Uploaded house" fill className="object-cover" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-xs text-text-secondary">my-house.jpg</p>
          <div className="w-full h-1.5 bg-bg-primary rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full w-full" />
          </div>
        </div>
        <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <Check className="w-3 h-3 text-primary" strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}

function CatalogMockup() {
  const swatches = [
    { label: 'Metal', src: '/images/swatch-metal.png', selected: true },
    { label: 'Shingles', src: '/images/swatch-shingles.png', selected: false },
    { label: 'Spanish Tile', src: '/images/swatch-spanish-tile-v2.png', selected: false },
    { label: 'Wood', src: '/images/swatch-wood.png', selected: false },
  ];

  return (
    <div className="bg-bg-secondary rounded-xl border border-border-default p-6">
      <h5 className="text-sm font-semibold mb-3 text-text-primary">Choose Your Material</h5>
      <div className="grid grid-cols-2 gap-3">
        {swatches.map((s) => (
          <div
            key={s.label}
            className={`relative rounded-lg overflow-hidden ${
              s.selected ? 'border-2 border-accent shadow-accent-glow' : 'border border-border-default'
            }`}
          >
            <div className="relative aspect-[4/3]">
              <Image src={s.src} alt={s.label} fill className="object-cover" />
            </div>
            {s.selected && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
              </div>
            )}
            <div className="bg-bg-tertiary py-1.5 text-center">
              <span className={`text-xs ${s.selected ? 'text-accent font-semibold' : 'text-text-primary'}`}>
                {s.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmailMockup() {
  return (
    <div className="bg-bg-secondary rounded-xl border border-border-default p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Mail className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h5 className="text-sm font-semibold text-text-primary">Almost there!</h5>
          <p className="text-xs text-text-secondary">Enter your email to see your visualization</p>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-text-secondary mb-2">Email Address</label>
        <div className="w-full px-4 py-3.5 bg-bg-tertiary border border-border-default rounded-lg text-sm text-text-primary">
          sarah@example.com
        </div>
      </div>
      <div className="w-full px-5 py-3 bg-accent text-primary text-sm font-semibold rounded-md text-center">
        Reveal Visualization →
      </div>
    </div>
  );
}

function ResultMockup() {
  return (
    <div className="bg-bg-secondary rounded-xl border border-border-default p-6 space-y-4">
      <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden border border-border-default">
        {/* After image (right side) */}
        <div className="absolute inset-0">
          <Image src="/images/demo-house-metal-roof.png" alt="After" fill className="object-cover" />
        </div>
        {/* Before image (left 40%) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: '40%' }}>
          <div className="relative w-full h-full" style={{ width: '250%' }}>
            <Image src="/images/demo-house-old-roof.png" alt="Before" fill className="object-cover" />
          </div>
        </div>
        {/* Slider line */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10" style={{ left: '40%' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-bg-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M8 15l4 4 4-4" />
            </svg>
          </div>
        </div>
        {/* Labels */}
        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-bg-primary/80 backdrop-blur-sm rounded-full text-[10px] font-semibold text-text-primary z-10">
          Before
        </div>
        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-accent/80 backdrop-blur-sm rounded-full text-[10px] font-semibold text-primary z-10">
          After
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3 bg-accent/10 border border-accent/30 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs font-medium text-accent">New Lead Captured</span>
        </div>
        <span className="text-xs text-text-secondary">sarah@example.com</span>
      </div>
    </div>
  );
}

const MOCKUPS: Record<string, React.ComponentType> = {
  upload: UploadMockup,
  catalog: CatalogMockup,
  email: EmailMockup,
  result: ResultMockup,
};

function CheckIcon() {
  return (
    <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function WidgetExperience() {
  return (
    <section
      className="py-24 px-4 sm:px-6 relative overflow-hidden border-t border-accent/10"
      style={{ background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.06) 0%, var(--color-bg-primary) 40%, var(--color-bg-primary) 100%)' }}
    >
      {/* Accent glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16, 185, 129, 0.1) 0%, transparent 70%)' }}
      />
      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-accent text-primary font-semibold text-sm mb-4">
            The Customer Experience
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            What Your Customers See
          </h2>
          <p className="text-xl text-text-secondary">
            Four steps. One qualified lead. Here&apos;s exactly how the widget works on your website.
          </p>
        </div>

        {/* Zigzag Steps */}
        <div className="space-y-16 md:space-y-24">
          {STEPS.map((step, i) => {
            const Mockup = MOCKUPS[step.mockup];
            const isEven = i % 2 === 1;

            return (
              <div
                key={step.number}
                className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
              >
                {/* Mockup */}
                <div className={`${isEven ? 'lg:order-2' : ''}`}>
                  <Mockup />
                </div>

                {/* Text */}
                <div className={`space-y-6 ${isEven ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent text-primary font-bold text-lg flex items-center justify-center flex-shrink-0">
                      {step.number}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-lg text-text-secondary leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-3">
                    {step.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <CheckIcon />
                        <span className="text-text-secondary">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
