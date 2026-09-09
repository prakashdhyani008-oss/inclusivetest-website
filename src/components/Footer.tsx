import React from 'react';
import { PageView } from '../types';
import { 
  ShieldCheck, 
  Mail, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  Globe2, 
  Scale 
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenConsultation }) => {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 text-sm" aria-label="Site Footer">
      
      {/* Top Banner with Brand Tagline */}
      <div className="border-b border-slate-200 py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
              Test. Remediate. Include.
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              InclusiveTest — Building Digital Experiences for Everyone.
            </h2>
          </div>
          <button
            type="button"
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>Book an Accessibility Consultation</span>
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Commitment (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Inclusive<span className="text-teal-600">Test</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              InclusiveTest helps organizations identify, understand, and remediate digital accessibility barriers through expert testing, actionable remediation support, and accessibility consulting.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Engineered for WCAG 2.1 & 2.2 AA / AAA Standards</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Globe2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Assistive Tech: NVDA, JAWS, VoiceOver, TalkBack</span>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Consulting Services
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('audits')}
                  className="hover:text-teal-700 transition-colors text-slate-600 text-left"
                >
                  Accessibility Audits
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('remediation')}
                  className="hover:text-teal-700 transition-colors text-slate-600 text-left"
                >
                  Remediation Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('vpat')}
                  className="hover:text-teal-700 transition-colors text-slate-600 text-left"
                >
                  VPAT / ACR Conformance
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('legal')}
                  className="hover:text-teal-700 transition-colors text-slate-600 text-left"
                >
                  Legal Accessibility Guidance
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-teal-700 transition-colors text-slate-600 text-left"
                >
                  Agency Partnerships
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Resources & Insights
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('report-preview')}
                  className="hover:text-teal-700 transition-colors text-slate-600 text-left flex items-center gap-1"
                >
                  <span>Interactive Sample Report</span>
                  <ArrowUpRight className="w-3 h-3 text-teal-600" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('resources')}
                  className="hover:text-teal-700 transition-colors text-slate-600 text-left"
                >
                  Why Automated Testing Isn't Enough
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('resources')}
                  className="hover:text-teal-700 transition-colors text-slate-600 text-left"
                >
                  WCAG 2.2 Guidelines Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('resources')}
                  className="hover:text-teal-700 transition-colors text-slate-600 text-left"
                >
                  Keyboard Testing Protocol
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('resources')}
                  className="hover:text-teal-700 transition-colors text-slate-600 text-left"
                >
                  Understanding VPAT 2.5
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Standards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Company
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-teal-700 transition-colors text-slate-600 text-left"
                >
                  About InclusiveTest
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-teal-700 transition-colors text-slate-600 text-left"
                >
                  Our Core Values
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-teal-700 transition-colors text-slate-600 text-left"
                >
                  Contact & Inquiries
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="hover:text-teal-700 transition-colors text-teal-700 font-semibold text-left"
                >
                  Schedule Strategy Call
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-10 p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-3">
          <Scale className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong className="text-slate-900">Legal & Conformance Notice:</strong> InclusiveTest provides technical accessibility testing, code remediation guidance, and objective conformance evaluations against standards such as WCAG 2.1, WCAG 2.2, Section 508, and EN 301 549. InclusiveTest is a technology consultancy and does not provide formal legal representation or legal advice. Legal questions regarding statutory compliance should be directed to qualified legal counsel.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} InclusiveTest Consulting Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Accessibility Conformance Statement (WCAG 2.2 AA)</span>
            <span>Privacy Policy</span>
            <span>Terms of Consulting</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
