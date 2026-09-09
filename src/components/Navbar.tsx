import React, { useState, useEffect, useRef } from 'react';
import { PageView } from '../types';
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
  onOpenConsultation: () => void;
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
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
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

      {/* Accessibility Toolbar */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-1.5 text-xs text-slate-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-teal-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>WCAG 2.2 AA Compliant Architecture</span>
            </span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline text-slate-600">Expert Manual & Assistive Tech Testing</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleHighContrast}
              aria-pressed={highContrast}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs transition-colors border ${
                highContrast 
                  ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold shadow-sm' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title="Toggle High Contrast Display Mode"
            >
              <Contrast className="w-3 h-3 text-teal-600" aria-hidden="true" />
              <span>{highContrast ? 'High Contrast: ON' : 'High Contrast'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleLargeText}
              aria-pressed={largeText}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs transition-colors border ${
                largeText 
                  ? 'bg-teal-600 text-white border-teal-700 font-bold shadow-sm' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title="Toggle Larger Body Font Size"
            >
              <Type className="w-3 h-3 text-teal-600" aria-hidden="true" />
              <span>{largeText ? 'Large Font: ON' : 'Text Size'}</span>
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
              className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg p-1"
              aria-label="InclusiveTest Homepage"
            >
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:bg-teal-700 transition-colors">
                <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  Inclusive<span className="text-teal-600">Test</span>
                </span>
                <span className="block text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                  Accessibility Consulting
                </span>
              </div>
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
              onClick={onOpenConsultation}
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
              onClick={onOpenConsultation}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs shadow-sm"
              aria-label="Book Consultation"
            >
              Book
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-xl">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'home' ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </button>

          <div className="border-t border-slate-100 pt-2 pb-1">
            <div className="px-3.5 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">Services</div>
            <button
              type="button"
              onClick={() => handleNavClick('services')}
              className="w-full text-left px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>All Consulting Services</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('audits')}
              className="w-full text-left px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between pl-6"
            >
              <span>Accessibility Audits</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('remediation')}
              className="w-full text-left px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between pl-6"
            >
              <span>Remediation Support</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('vpat')}
              className="w-full text-left px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between pl-6"
            >
              <span>VPAT / ACR Reports</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('legal')}
              className="w-full text-left px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between pl-6"
            >
              <span>Legal Accessibility Guidance</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleNavClick('report-preview')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'report-preview' ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Live Sample Report
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'about' ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            About InclusiveTest
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('resources')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'resources' ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Resources & Guides
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'contact' ? 'text-teal-700 bg-teal-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Contact
          </button>

          <div className="pt-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Book a Consultation</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
