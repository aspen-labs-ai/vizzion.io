import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-16 px-6 bg-[var(--color-gray-50)] border-t border-[var(--color-border)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold text-[var(--color-primary)] mb-4 font-['Space_Grotesk']">
              Vizzion
            </div>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Transform how customers shop with visual customization.
            </p>
          </div>
          
          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-[var(--color-primary)] mb-4">Product</h4>
            <div className="space-y-3">
              <Link href="#how-it-works" className="block text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                How It Works
              </Link>
              <Link href="#industries" className="block text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                Industries
              </Link>
              <Link href="#pricing" className="block text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                Pricing
              </Link>
            </div>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-[var(--color-primary)] mb-4">Company</h4>
            <div className="space-y-3">
              <Link href="#" className="block text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                About
              </Link>
              <Link href="#" className="block text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                Blog
              </Link>
              <Link href="#" className="block text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-[var(--color-primary)] mb-4">Legal</h4>
            <div className="space-y-3">
              <Link href="#" className="block text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                Privacy
              </Link>
              <Link href="#" className="block text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--color-border)] text-center text-[var(--color-text-muted)]">
          <p>&copy; 2025 Vizzion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
