'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const industries = [
  { name: 'Roofing', slug: 'roofing', image: '/images/industries/roofing.png' },
  { name: 'Siding', slug: 'siding', image: '/images/industries/siding.png' },
  { name: 'Solar Panels', slug: 'solar', image: '/images/industries/solar.png' },
  { name: 'Windows & Doors', slug: 'windows-doors', image: '/images/industries/windows-doors.png' },
  { name: 'Decking', slug: 'decking', image: '/images/industries/decking.png' },
  { name: 'Flooring', slug: 'flooring', image: '/images/industries/flooring.png' },
  { name: 'Countertops', slug: 'countertops', image: '/images/industries/countertops.png' },
  { name: 'Garage Doors', slug: 'garage-doors', image: '/images/industries/garage-doors.png' },
  { name: 'Fencing', slug: 'fencing', image: '/images/industries/fencing.png' },
  { name: 'Gutters', slug: 'gutters', image: '/images/industries/gutters.png' },
  { name: 'Shutters', slug: 'shutters', image: '/images/industries/shutters.png' },
  { name: 'Driveways & Pavement', slug: 'driveways', image: '/images/industries/driveways.png' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileIndustriesOpen(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIndustriesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIndustriesOpen(false);
    }, 200);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (industriesOpen) setIndustriesOpen(false);
        if (mobileMenuOpen) closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen, industriesOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
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
            href="/#how-it-works"
            className="text-text-secondary hover:text-accent transition-colors duration-250 font-medium"
          >
            How It Works
          </Link>

          {/* Industries with Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="/industries"
              className="text-text-secondary hover:text-accent transition-colors duration-250 font-medium inline-flex items-center gap-1"
            >
              Industries
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${industriesOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Mega Dropdown */}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-200 ${
                industriesOpen
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="bg-bg-secondary rounded-xl border border-border-default shadow-xl w-[640px] overflow-hidden">
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-1">
                    {industries.map((industry) => (
                      <Link
                        key={industry.slug}
                        href={`/industries/${industry.slug}`}
                        className="group/item flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-tertiary transition-colors"
                        onClick={() => setIndustriesOpen(false)}
                      >
                        {/* Industry image — fades from left */}
                        <div className="relative w-16 h-10 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={industry.image}
                            alt={industry.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg-secondary/60 group-hover/item:to-bg-tertiary/60" />
                        </div>

                        <span className="text-sm text-text-secondary group-hover/item:text-text-primary font-medium transition-colors">
                          {industry.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border-default px-4 py-3 bg-bg-tertiary/50">
                  <Link
                    href="/industries"
                    className="text-xs text-text-tertiary hover:text-accent transition-colors"
                    onClick={() => setIndustriesOpen(false)}
                  >
                    View all industries →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/#dashboard"
            className="text-text-secondary hover:text-accent transition-colors duration-250 font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/#pricing"
            className="text-text-secondary hover:text-accent transition-colors duration-250 font-medium"
          >
            Pricing
          </Link>
          <Link
            href="/#signup"
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
        className={`md:hidden fixed top-[81px] right-0 bottom-0 w-72 bg-bg-secondary border-l border-border-default shadow-xl transform transition-transform duration-300 overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <nav className="flex flex-col p-6 gap-1">
          <Link
            href="/#how-it-works"
            className="py-3 text-text-secondary hover:text-accent transition-colors"
            onClick={closeMobileMenu}
          >
            How It Works
          </Link>

          {/* Mobile Industries Accordion */}
          <button
            className="py-3 text-text-secondary hover:text-accent transition-colors flex items-center justify-between w-full text-left"
            onClick={() => setMobileIndustriesOpen(!mobileIndustriesOpen)}
          >
            Industries
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${mobileIndustriesOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileIndustriesOpen && (
            <div className="pl-4 space-y-1 mb-2">
              {industries.map((industry) => (
                <Link
                  key={industry.slug}
                  href={`/industries/${industry.slug}`}
                  className="flex items-center gap-3 py-2 text-sm text-text-tertiary hover:text-text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  <div className="relative w-10 h-7 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={industry.image}
                      alt={industry.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {industry.name}
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/#dashboard"
            className="py-3 text-text-secondary hover:text-accent transition-colors"
            onClick={closeMobileMenu}
          >
            Dashboard
          </Link>
          <Link
            href="/#pricing"
            className="py-3 text-text-secondary hover:text-accent transition-colors"
            onClick={closeMobileMenu}
          >
            Pricing
          </Link>
          <Link
            href="/#signup"
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
