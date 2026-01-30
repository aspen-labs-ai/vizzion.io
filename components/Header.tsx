'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-secondary/95 backdrop-blur-sm border-b border-border-default">
      <div className="max-w-[1400px] mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-4 group">
          <Image 
            src="/vizzion-logo.png" 
            alt="Vizzion" 
            width={140} 
            height={45}
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <div className="text-2xl font-bold text-text-primary tracking-tight">
            VIZZION.IO
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <Link 
            href="#how-it-works" 
            className="text-text-secondary hover:text-accent transition-colors duration-250 font-medium"
          >
            How It Works
          </Link>
          <Link 
            href="#industries" 
            className="text-text-secondary hover:text-accent transition-colors duration-250 font-medium"
          >
            Industries
          </Link>
          <Link 
            href="#dashboard" 
            className="text-text-secondary hover:text-accent transition-colors duration-250 font-medium"
          >
            Dashboard
          </Link>
          <Link 
            href="#pricing" 
            className="text-text-secondary hover:text-accent transition-colors duration-250 font-medium"
          >
            Pricing
          </Link>
          <Link 
            href="#signup" 
            className="inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold rounded-lg bg-accent text-primary hover:bg-accent-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-accent-glow"
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
          <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>
      
      {/* Mobile Navigation Drawer */}
      <div 
        className={`md:hidden fixed top-[81px] right-0 bottom-0 w-72 bg-bg-secondary border-l border-border-default shadow-xl transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <nav className="flex flex-col p-6 gap-4">
          <Link 
            href="#how-it-works" 
            className="py-3 text-text-secondary hover:text-accent transition-colors"
            onClick={closeMobileMenu}
          >
            How It Works
          </Link>
          <Link 
            href="#industries" 
            className="py-3 text-text-secondary hover:text-accent transition-colors"
            onClick={closeMobileMenu}
          >
            Industries
          </Link>
          <Link 
            href="#dashboard" 
            className="py-3 text-text-secondary hover:text-accent transition-colors"
            onClick={closeMobileMenu}
          >
            Dashboard
          </Link>
          <Link 
            href="#pricing" 
            className="py-3 text-text-secondary hover:text-accent transition-colors"
            onClick={closeMobileMenu}
          >
            Pricing
          </Link>
          <Link 
            href="#signup" 
            className="py-3 px-6 text-center font-semibold rounded-lg bg-accent text-primary hover:bg-accent-hover transition-all mt-4"
            onClick={closeMobileMenu}
          >
            Get Started
          </Link>
        </nav>
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm top-[81px]"
          onClick={closeMobileMenu}
        />
      )}
    </header>
  );
}
