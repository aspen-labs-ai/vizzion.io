'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-primary font-['Space_Grotesk']">
          Vizzion
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="#how-it-works" 
            className="text-[var(--color-text-primary)] hover:text-accent transition-colors duration-250"
          >
            How It Works
          </Link>
          <Link 
            href="#industries" 
            className="text-[var(--color-text-primary)] hover:text-accent transition-colors duration-250"
          >
            Industries
          </Link>
          <Link 
            href="#dashboard" 
            className="text-[var(--color-text-primary)] hover:text-accent transition-colors duration-250"
          >
            Dashboard
          </Link>
          <Link 
            href="#pricing" 
            className="text-[var(--color-text-primary)] hover:text-accent transition-colors duration-250"
          >
            Pricing
          </Link>
          <Link 
            href="#" 
            className="inline-flex items-center justify-center gap-2 px-6 py-2 font-['Space_Grotesk'] font-semibold rounded-lg bg-accent text-primary hover:bg-accent-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md"
          >
            Get Started
          </Link>
        </nav>
        
        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
          aria-label="Open mobile menu"
          aria-expanded={mobileMenuOpen}
          onClick={toggleMobileMenu}
        >
          <span className={`w-6 h-0.5 bg-primary transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-primary transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-primary transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>
      
      {/* Mobile Navigation Drawer */}
      <div 
        className={`md:hidden fixed top-[73px] right-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <nav className="flex flex-col p-6 gap-4">
          <Link 
            href="#how-it-works" 
            className="py-3 text-[var(--color-text-primary)] hover:text-accent transition-colors"
            onClick={closeMobileMenu}
          >
            How It Works
          </Link>
          <Link 
            href="#industries" 
            className="py-3 text-[var(--color-text-primary)] hover:text-accent transition-colors"
            onClick={closeMobileMenu}
          >
            Industries
          </Link>
          <Link 
            href="#dashboard" 
            className="py-3 text-[var(--color-text-primary)] hover:text-accent transition-colors"
            onClick={closeMobileMenu}
          >
            Dashboard
          </Link>
          <Link 
            href="#pricing" 
            className="py-3 text-[var(--color-text-primary)] hover:text-accent transition-colors"
            onClick={closeMobileMenu}
          >
            Pricing
          </Link>
          <Link 
            href="#" 
            className="py-3 px-6 text-center font-semibold rounded-lg bg-accent text-primary mt-4"
            onClick={closeMobileMenu}
          >
            Get Started
          </Link>
        </nav>
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/30 top-[73px]"
          onClick={closeMobileMenu}
        />
      )}
    </header>
  );
}
