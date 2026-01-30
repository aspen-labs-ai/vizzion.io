import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="py-16 px-6 bg-bg-tertiary border-t border-border-default">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Image 
                src="/vizzion-logo.png" 
                alt="Vizzion" 
                width={120} 
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-text-secondary leading-relaxed">
              Transform how customers shop with visual customization.
            </p>
          </div>
          
          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Product</h4>
            <div className="space-y-3">
              <Link href="#how-it-works" className="block text-text-secondary hover:text-accent transition-colors">
                How It Works
              </Link>
              <Link href="#industries" className="block text-text-secondary hover:text-accent transition-colors">
                Industries
              </Link>
              <Link href="#pricing" className="block text-text-secondary hover:text-accent transition-colors">
                Pricing
              </Link>
            </div>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Company</h4>
            <div className="space-y-3">
              <Link href="#" className="block text-text-secondary hover:text-accent transition-colors">
                About
              </Link>
              <Link href="#" className="block text-text-secondary hover:text-accent transition-colors">
                Blog
              </Link>
              <Link href="#" className="block text-text-secondary hover:text-accent transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Legal</h4>
            <div className="space-y-3">
              <Link href="#" className="block text-text-secondary hover:text-accent transition-colors">
                Privacy
              </Link>
              <Link href="#" className="block text-text-secondary hover:text-accent transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-default text-center text-text-tertiary">
          <p>&copy; 2025 Vizzion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
