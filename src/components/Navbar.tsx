import React, { useState, useEffect, useRef } from 'react';
import { PageView } from '../types';
import { Logo } from './Logo';
import { 
  ShieldCheck, 
  Calendar, 
  Menu, 
  X, 
  ChevronDown, 
  FileText, 
  Code2, 
  FileCheck2, 
  Scale, 
  Sparkles,
  Contrast,
  Type,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenConsultation: (trigger?: React.MouseEvent | HTMLElement) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  largeText: boolean;
  onToggleLargeText: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenConsultation,
  highContrast,
  onToggleHighContrast,
  largeText,
  onToggleLargeText
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [toolbarAnnouncement, setToolbarAnnouncement] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleToggleContrast = () => {
    onToggleHighContrast();
    setToolbarAnnouncement(highContrast ? 'High contrast mode disabled.' : 'High contrast mode enabled: Pure black background, white text, high contrast yellow links and borders.');
  };

  const handleToggleTextSize = () => {
    onToggleLargeText();
    setToolbarAnnouncement(largeText ? 'Default text spacing and size restored.' : 'Text size enlarged (1.25x) and WCAG 1.4.12 text spacing enabled: Line height at least 1.5x, paragraph spacing at least 2x, letter spacing at least 0.12x, word spacing at least 0.16x.');
  };

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesDropdownOpen(false);
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          mobileToggleRef.current?.focus();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setServicesDropdownOpen(false);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      mobileToggleRef.current?.focus();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 transition-colors duration-200 shadow-sm">
      {/* Skip to Main Content Link for Keyboard Accessibility (WCAG 2.4.1) */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:font-bold focus:rounded-md focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
      >
        Skip to main content
      </a>

      {/* Live Region for Accessibility Toolbar Mode Announcements (WCAG 4.1.3) */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {toolbarAnnouncement}
      </div>

      {/* Accessibility Toolbar */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-1.5 text-xs text-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-teal-800 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>WCAG 2.2 AA Compliant Architecture</span>
            </span>
            <span className="hidden md:inline text-slate-400" aria-hidden="true">|</span>
            <span className="hidden md:inline text-slate-700 font-medium">Expert Manual & Assistive Tech Testing</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleContrast}
              aria-pressed={highContrast}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors border focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 ${
                highContrast 
                  ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold shadow-sm' 
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:text-slate-900 font-semibold'
              }`}
              title="Toggle WCAG AAA High Contrast Display Mode (pure black background, pure white text, high contrast accents)"
            >
              <Contrast className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
              <span>{highContrast ? 'High Contrast: ON' : 'High Contrast'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleTextSize}
              aria-pressed={largeText}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors border focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 ${
                largeText 
                  ? 'bg-teal-700 text-white border-teal-800 font-bold shadow-sm' 
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:text-slate-900 font-semibold'
              }`}
              title="Toggle Text Resize (1.25x) & WCAG 1.4.12 Spacing (1.5x line height, 2x paragraph spacing, 0.12x tracking, 0.16x word spacing)"
            >
              <Type className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
              <span>{largeText ? 'Text Size & Spacing: ON' : 'Text Size & Spacing'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo / Brand Name */}
          <div className="flex items-center">
            <button 
              type="button"
              onClick={() => handleNavClick('home')}
              className="flex items-center text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg p-1 transition-transform active:scale-95"
              aria-label="InclusiveTest - Digital Access. For All. Homepage"
            >
              <Logo variant="horizontal" size="md" />
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'home' 
                  ? 'text-teal-700 bg-teal-50 font-semibold' 
                  : 'text-slate-600 hover:text-teal-600 hover:bg-slate-100/70'
              }`}
              aria-current={currentPage === 'home' ? 'page' : undefined}
            >
              Home
            </button>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    setServicesDropdownOpen(true);
                  }
                }}
                aria-expanded={servicesDropdownOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  ['services', 'audits', 'remediation', 'vpat', 'legal'].includes(currentPage)
                    ? 'text-teal-700 bg-teal-50 font-semibold'
                    : 'text-slate-600 hover:text-teal-600 hover:bg-slate-100/70'
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-teal-600' : 'text-slate-400'}`} aria-hidden="true" />
              </button>

              {servicesDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  role="menu"
                  aria-label="Services Submenu"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavClick('services')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                  >
                    <div className="p-2 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors mt-0.5">
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-teal-700">All Consulting Services</div>
                      <div className="text-xs text-slate-500">Overview of our full capabilities</div>
                    </div>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavClick('audits')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                  >
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors mt-0.5">
                      <FileCheck2 className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-teal-700">Accessibility Audits</div>
                      <div className="text-xs text-slate-500">Manual & assistive tech WCAG audits</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavClick('remediation')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                  >
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors mt-0.5">
                      <Code2 className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-teal-700">Remediation Support</div>
                      <div className="text-xs text-slate-500">Code patterns & developer pairing</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavClick('vpat')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                  >
                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors mt-0.5">
                      <FileText className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-teal-700">VPAT / ACR Reports</div>
                      <div className="text-xs text-slate-500">Enterprise procurement conformance</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavClick('legal')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                  >
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors mt-0.5">
                      <Scale className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-teal-700">Legal Accessibility Guidance</div>
                      <div className="text-xs text-slate-500">Technical risk reduction & prioritization</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleNavClick('report-preview')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'report-preview' 
                  ? 'text-teal-700 bg-teal-50 font-semibold' 
                  : 'text-slate-600 hover:text-teal-600 hover:bg-slate-100/70'
              }`}
              aria-current={currentPage === 'report-preview' ? 'page' : undefined}
            >
              Live Sample Report
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('about')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'about' 
                  ? 'text-teal-700 bg-teal-50 font-semibold' 
                  : 'text-slate-600 hover:text-teal-600 hover:bg-slate-100/70'
              }`}
              aria-current={currentPage === 'about' ? 'page' : undefined}
            >
              About
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('resources')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'resources' 
                  ? 'text-teal-700 bg-teal-50 font-semibold' 
                  : 'text-slate-600 hover:text-teal-600 hover:bg-slate-100/70'
              }`}
              aria-current={currentPage === 'resources' ? 'page' : undefined}
            >
              Resources & Guides
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'contact' 
                  ? 'text-teal-700 bg-teal-50 font-semibold' 
                  : 'text-slate-600 hover:text-teal-600 hover:bg-slate-100/70'
              }`}
              aria-current={currentPage === 'contact' ? 'page' : undefined}
            >
              Contact
            </button>
          </nav>

          {/* Primary Action Button */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => onOpenConsultation(e.currentTarget)}
              id="header-book-consultation-btn"
              className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 outline-none transition-all inline-flex items-center gap-2 shadow-sm active:scale-95"
            >
              <Calendar className="w-4 h-4 text-teal-400" aria-hidden="true" />
              <span>Book a Consultation</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              id="mobile-header-book-btn"
              onClick={(e) => onOpenConsultation(e.currentTarget)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs shadow-sm hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 transition-colors"
              aria-label="Book Consultation"
            >
              Book
            </button>

            <button
              type="button"
              ref={mobileToggleRef}
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu - Scrollable at 200%+ zoom with keyboard focus auto-scroll (WCAG 1.4.4 & 2.4.7) */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation-menu"
          ref={mobileMenuRef}
          role="region"
          aria-label="Mobile Navigation Menu"
          className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-8 space-y-2 overflow-y-auto max-h-[calc(100vh-6.5rem)] max-h-[calc(100dvh-6.5rem)] shadow-2xl overscroll-contain animate-in slide-in-from-top duration-200 focus:outline-none"
        >
          {/* Mobile Accessibility Controls */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 mb-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Accessibility Controls</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleToggleContrast}
                aria-pressed={highContrast}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-bold border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                  highContrast 
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm' 
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Contrast className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                <span>{highContrast ? 'Contrast: ON' : 'High Contrast'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleTextSize}
                aria-pressed={largeText}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-bold border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                  largeText 
                    ? 'bg-teal-700 text-white border-teal-800 shadow-sm' 
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Type className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                <span>{largeText ? 'Spacing: ON' : 'Text Spacing'}</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNavClick('home')}
            onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'nearest', behavior: 'smooth' })}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 scroll-my-1 ${
              currentPage === 'home' ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </button>

          <div className="border-t border-slate-100 pt-2 pb-1">
            <div className="px-3.5 py-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Services</div>
            <button
              type="button"
              onClick={() => handleNavClick('services')}
              onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'nearest', behavior: 'smooth' })}
              className="w-full text-left px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 scroll-my-1"
            >
              <span>All Consulting Services</span>
              <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('audits')}
              onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'nearest', behavior: 'smooth' })}
              className="w-full text-left px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between pl-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 scroll-my-1"
            >
              <span>Accessibility Audits</span>
              <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('remediation')}
              onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'nearest', behavior: 'smooth' })}
              className="w-full text-left px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between pl-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 scroll-my-1"
            >
              <span>Remediation Support</span>
              <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('vpat')}
              onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'nearest', behavior: 'smooth' })}
              className="w-full text-left px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between pl-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 scroll-my-1"
            >
              <span>VPAT / ACR Reports</span>
              <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('legal')}
              onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'nearest', behavior: 'smooth' })}
              className="w-full text-left px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between pl-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 scroll-my-1"
            >
              <span>Legal Accessibility Guidance</span>
              <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleNavClick('report-preview')}
            onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'nearest', behavior: 'smooth' })}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 scroll-my-1 ${
              currentPage === 'report-preview' ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Live Sample Report
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('about')}
            onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'nearest', behavior: 'smooth' })}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 scroll-my-1 ${
              currentPage === 'about' ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            About InclusiveTest
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('resources')}
            onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'nearest', behavior: 'smooth' })}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 scroll-my-1 ${
              currentPage === 'resources' ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Resources & Guides
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'nearest', behavior: 'smooth' })}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 scroll-my-1 ${
              currentPage === 'contact' ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Contact
          </button>

          <div className="pt-3">
            <button
              type="button"
              onClick={(e) => {
                setMobileMenuOpen(false);
                onOpenConsultation(mobileToggleRef.current || e.currentTarget);
              }}
              onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'nearest', behavior: 'smooth' })}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 transition-colors scroll-my-1 active:scale-95"
            >
              <Calendar className="w-4 h-4 text-teal-400" aria-hidden="true" />
              <span>Book a Consultation</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
