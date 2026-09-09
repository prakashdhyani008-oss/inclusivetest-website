import React from 'react';
import { PageView, ServiceType } from '../types';
import { servicesData } from '../data/servicesData';
import { standardsData, standardsDistinctionNote } from '../data/standardsData';
import { 
  testingSteps, 
  whyChooseUsFeatures, 
  businessValuePoints, 
  whoWeHelpAudience, 
  agencyPartnershipDetails,
  aboutCompanyStory 
} from '../data/companyData';
import { resourcesArticles } from '../data/resourcesData';
import { InteractiveReportViewer } from '../components/InteractiveReportViewer';
import { AccessibilityCheckerWidget } from '../components/AccessibilityCheckerWidget';
import { 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  FileCheck2, 
  Code2, 
  FileText, 
  Scale, 
  Users, 
  Sparkles, 
  Monitor, 
  Smartphone, 
  Eye, 
  Keyboard, 
  Volume2, 
  Search, 
  ExternalLink,
  ChevronRight,
  Workflow,
  Check
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
  onOpenConsultation: () => void;
  onBookWithService: (service: ServiceType) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenConsultation,
  onBookWithService
}) => {
  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'audits': return <FileCheck2 className="w-6 h-6 text-blue-400" aria-hidden="true" />;
      case 'remediation': return <Code2 className="w-6 h-6 text-emerald-400" aria-hidden="true" />;
      case 'vpat': return <FileText className="w-6 h-6 text-purple-400" aria-hidden="true" />;
      case 'legal': return <Scale className="w-6 h-6 text-amber-400" aria-hidden="true" />;
      default: return <ShieldCheck className="w-6 h-6 text-teal-400" aria-hidden="true" />;
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32">
      
      {/* 1. HERO SECTION (SaaS Landing / Split Layout) */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:py-20 bg-slate-50 border-b border-slate-200" aria-labelledby="hero-heading">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }} aria-hidden="true" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Digital Accessibility Audits & Consulting</span>
              </div>

              <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                From Compliance <br className="hidden sm:inline" />to <span className="text-teal-600">True Inclusion.</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                We test the difference. Expert accessibility auditing, remediation support, and consulting to build digital experiences that work for everyone.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  id="hero-primary-cta"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-teal-600 text-white text-base font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600"
                >
                  <Calendar className="w-5 h-5" aria-hidden="true" />
                  <span>Book a Consultation</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-700 border border-slate-200 bg-white hover:bg-slate-100 hover:shadow-sm transition-all"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" aria-hidden="true" />
                </button>
              </div>

              {/* Assistive Tech Logos / Row */}
              <div className="pt-8 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">
                  EXPERT TESTING ACROSS ASSISTIVE TECH
                </span>
                <div className="flex flex-wrap gap-8 items-center text-sm font-mono font-bold text-slate-500">
                  <span className="hover:text-slate-800 transition-colors">NVDA</span>
                  <span className="hover:text-slate-800 transition-colors">JAWS</span>
                  <span className="hover:text-slate-800 transition-colors">VOICEOVER</span>
                  <span className="hover:text-slate-800 transition-colors">TALKBACK</span>
                </div>
              </div>
            </div>

            {/* Right Split Column: 4 Core Services in Modern SaaS Dark Panel (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 p-8 sm:p-10 rounded-3xl flex flex-col justify-center shadow-2xl border border-slate-800 text-white space-y-4">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <span className="font-bold text-teal-400 uppercase tracking-wider text-[11px]">
                    Core Capabilities
                  </span>
                  <button 
                    type="button"
                    onClick={() => onNavigate('report-preview')}
                    className="text-xs text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1 font-sans"
                  >
                    <span>View Sample Report</span>
                    <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Card 1: Accessibility Audits */}
                  <button
                    type="button"
                    onClick={() => onNavigate('audits')}
                    className="text-left group bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 hover:border-teal-500/50 hover:bg-slate-800 transition-all"
                  >
                    <div className="text-white font-bold text-sm mb-1.5 flex items-center gap-2 group-hover:text-teal-300 transition-colors">
                      <span className="w-2 h-2 rounded-full bg-teal-400" aria-hidden="true" />
                      <span>Audits</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Comprehensive WCAG 2.2 assessments using manual testing & screen readers.
                    </p>
                  </button>

                  {/* Card 2: Remediation Support */}
                  <button
                    type="button"
                    onClick={() => onNavigate('remediation')}
                    className="text-left group bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 hover:border-teal-500/50 hover:bg-slate-800 transition-all"
                  >
                    <div className="text-white font-bold text-sm mb-1.5 flex items-center gap-2 group-hover:text-teal-300 transition-colors">
                      <span className="w-2 h-2 rounded-full bg-blue-400" aria-hidden="true" />
                      <span>Remediation</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Code-level guidance & ARIA recommendations for engineering teams.
                    </p>
                  </button>

                  {/* Card 3: VPAT / ACR */}
                  <button
                    type="button"
                    onClick={() => onNavigate('vpat')}
                    className="text-left group bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 hover:border-teal-500/50 hover:bg-slate-800 transition-all"
                  >
                    <div className="text-white font-bold text-sm mb-1.5 flex items-center gap-2 group-hover:text-teal-300 transition-colors">
                      <span className="w-2 h-2 rounded-full bg-purple-400" aria-hidden="true" />
                      <span>VPAT / ACR</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Detailed Conformance Reports to communicate product maturity.
                    </p>
                  </button>

                  {/* Card 4: Legal Guidance */}
                  <button
                    type="button"
                    onClick={() => onNavigate('legal')}
                    className="text-left group bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 hover:border-teal-500/50 hover:bg-slate-800 transition-all"
                  >
                    <div className="text-white font-bold text-sm mb-1.5 flex items-center gap-2 group-hover:text-teal-300 transition-colors">
                      <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
                      <span>Legal Risk</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Technical expertise to prioritize barriers and reduce exposure.
                    </p>
                  </button>
                </div>

                {/* Bottom interactive widget badge */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <span>WCAG 2.1 & 2.2 AA Specialists</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 font-mono text-[10px] border border-teal-800">
                    Human-Verified
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUST / EXPERTISE SECTION (Going beyond automated scans) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="expertise-heading">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>The Reality of Digital Accessibility</span>
          </div>
          <h2 id="expertise-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Accessibility Expertise That Goes Beyond Automated Scans
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Automated tools are valuable for catching baseline syntax, but algorithms cannot identify the majority of real-world accessibility barriers. Our certified specialists evaluate your product through real human interaction and assistive technologies.
          </p>
        </div>

        {/* Comparison Grid: What Automated Misses vs What InclusiveTest Tests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Automated Scanners Box */}
          <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Automated Scanners Only</span>
                <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">~30% WCAG Coverage</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">What Automated Scans Catch</h3>
              <p className="text-sm text-slate-600">Automated tools test static code attributes against fixed rules. While helpful for baseline diagnostics, they cannot evaluate usability or context.</p>
              
              <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-500" />
                  <span>Missing &lt;img alt&gt; attribute tags (syntax check)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-500" />
                  <span>Static CSS color contrast failures in simple text</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-500" />
                  <span>Duplicate HTML element ID attributes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-500" />
                  <span>Missing &lt;html lang&gt; language declarations</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 italic">
              *Cannot verify if alt text makes sense, if modals trap focus, or if screen readers speak correctly.
            </div>
          </div>

          {/* InclusiveTest Manual & Assistive Tech Box */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">InclusiveTest Comprehensive Evaluation</span>
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">100% WCAG AA & Real Assistive Testing</span>
              </div>
              <h3 className="text-xl font-bold text-white">What Our Human Specialists Test</h3>
              <p className="text-sm text-slate-300">We inspect interactive user flows, keyboard paths, screen reader announcements, and dynamic state changes that algorithms miss.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>Expert manual testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>Full keyboard navigation & traps</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>Screen-reader audio verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>ARIA & semantic state analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>Dynamic focus management in SPAs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>Responsive & 400% zoom reflow</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>Fix validation & code reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>Automated baseline regression scans</span>
                </div>
              </div>
            </div>

            {/* Assistive Tech Stack Badges */}
            <div className="mt-8 pt-4 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-2">
                Assistive Technologies Tested in Our Lab:
              </span>
              <div className="flex flex-wrap gap-2">
                {['NVDA (Windows)', 'JAWS (Windows)', 'VoiceOver (macOS/iOS)', 'TalkBack (Android)', 'Switch Controls', 'Voice Control'].map(tech => (
                  <span key={tech} className="px-2.5 py-1 rounded-md bg-slate-800 text-teal-300 text-xs font-semibold border border-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. SERVICES SECTION (4 Premium Service Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="services-heading">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Comprehensive Solutions</span>
          </div>
          <h2 id="services-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Accessibility Services Built Around Your Digital Experience
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            From in-depth diagnostic audits to hands-on front-end remediation and formal VPAT reporting, we support your product at every stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-slate-900 text-white group-hover:scale-105 transition-transform shadow-md">
                    {getServiceIcon(service.id)}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {service.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm font-semibold text-teal-800 mt-1">
                    {service.tagline}
                  </p>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Key includes list */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    What's Included:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {service.includes.slice(0, 4).map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="leading-snug">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate(service.id as any)}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 group-hover:text-teal-800 hover:underline"
                >
                  <span>{service.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onBookWithService(service.title as ServiceType)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm"
                >
                  Consult on this
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHY INCLUSIVETEST (6 Feature Blocks) */}
      <section className="bg-slate-900 text-white py-20 border-y border-slate-800" aria-labelledby="why-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>The InclusiveTest Advantage</span>
            </div>
            <h2 id="why-heading" className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Organizations Choose InclusiveTest
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              We position your organization for sustainable accessibility success through deep technical craftsmanship and human-led evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUsFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950 px-2.5 py-1 rounded border border-teal-900">
                      0{idx + 1}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{feat.badge}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ACCESSIBILITY STANDARDS WE WORK WITH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="standards-heading">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            <Scale className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Regulatory & Technical Benchmarks</span>
          </div>
          <h2 id="standards-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Accessibility Standards We Work With
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            The applicable standard depends on your product distribution, market, industry, and contractual requirements.
          </p>
        </div>

        {/* Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {standardsData.map((std) => (
            <div
              key={std.id}
              className="bg-white p-7 rounded-3xl border border-slate-200 shadow-md space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-bold bg-teal-100 text-teal-900 px-3 py-1 rounded-md">
                    {std.code}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{std.jurisdiction}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">{std.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{std.summary}</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block">Applicability:</span>
                  <span className="text-slate-800">{std.applicability}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Legal Context:</span>
                  <span className="text-slate-800">{std.legalContext}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Standards Distinction Education Callout */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl flex-shrink-0">
            <Scale className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">{standardsDistinctionNote.headline}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {standardsDistinctionNote.explanation}
            </p>
          </div>
        </div>
      </section>

      {/* 6. OUR TESTING APPROACH (6-Step Visual Process) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="approach-heading">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            <Workflow className="w-3.5 h-3.5" aria-hidden="true" />
            <span>End-to-End Delivery</span>
          </div>
          <h2 id="approach-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            From Discovery to Remediation — We Stay With You Through the Process.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Our structured 6-step testing lifecycle ensures your team receives actionable findings, hands-on fix recipes, and definitive verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testingSteps.map((step) => (
            <div
              key={step.step}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-teal-500 transition-colors space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-teal-400 font-extrabold text-base flex items-center justify-center font-mono shadow">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-sm font-semibold text-teal-800">{step.summary}</p>
                <p className="text-xs text-slate-600 leading-relaxed pt-2">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. LIVE INTERACTIVE REPORT VIEWER COMPONENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Interactive Sample Report Section">
        <InteractiveReportViewer onOpenConsultation={onOpenConsultation} />
      </section>

      {/* 8. BUSINESS VALUE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="business-value-heading">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Strategic ROI</span>
          </div>
          <h2 id="business-value-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Accessibility Is More Than Compliance
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Accessible digital experiences create broader market reach, improve overall usability for all customers, and streamline enterprise software procurement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessValuePoints.map((item, i) => (
            <div
              key={i}
              className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. SCOPE ESTIMATOR & READINESS TOOL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Accessibility Scope Planner">
        <AccessibilityCheckerWidget onBookWithScope={onBookWithService} />
      </section>

      {/* 10. WHO WE HELP (Enterprises, SaaS, Agencies, Product Teams, Gov) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="who-we-help-heading">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            <Users className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Tailored Engagement Models</span>
          </div>
          <h2 id="who-we-help-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for Modern Engineering & Product Organizations
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Whether you manage an enterprise digital portfolio or build a high-growth SaaS platform, we tailor our testing to your workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whoWeHelpAudience.map((aud, i) => (
            <div
              key={i}
              className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:border-teal-500 transition-colors space-y-3"
            >
              <h3 className="text-xl font-bold text-slate-900">{aud.segment}</h3>
              <p className="text-xs font-semibold text-teal-800">{aud.tagline}</p>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">{aud.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. AGENCY PARTNERSHIP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="agency-heading">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold">
              <span>Your Accessibility Partner Behind the Scenes</span>
            </div>
            
            <h2 id="agency-heading" className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {agencyPartnershipDetails.headline}
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              {agencyPartnershipDetails.subheadline}
            </p>

            {/* Partnership Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {agencyPartnershipDetails.model.map((m, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-teal-400 font-mono font-bold block mb-1">Phase 0{idx + 1}</span>
                  <div className="text-sm font-bold text-white">{m.phase}</div>
                  <div className="text-xs text-slate-400 mt-1">{m.desc}</div>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-xs text-slate-300">
              {agencyPartnershipDetails.benefits.map((b, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => onBookWithService('Agency Partnership')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <span>Partner With InclusiveTest</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 12. EDUCATIONAL RESOURCES TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="resources-teaser-heading">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-2">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Educational Knowledge Base</span>
            </div>
            <h2 id="resources-teaser-heading" className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Insights on Digital Accessibility
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('resources')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 hover:underline"
          >
            <span>View All Guides & Articles</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resourcesArticles.slice(0, 3).map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                    {art.category}
                  </span>
                  <span className="text-slate-400">{art.readTime}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">By {art.author.name}</span>
                <button
                  type="button"
                  onClick={() => onNavigate('resources')}
                  className="text-xs font-bold text-teal-700 group-hover:text-teal-900 flex items-center gap-1"
                >
                  <span>Read Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 13. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" aria-labelledby="final-cta-heading">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Start Building for Everyone</span>
          </div>

          <h2 id="final-cta-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Ready to Make Your Digital Experience More Accessible?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Whether you're starting your accessibility journey or improving an existing product, InclusiveTest can help you identify barriers, prioritize remediation, and validate improvements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={onOpenConsultation}
              id="final-book-consultation-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-base shadow-lg transition-all active:scale-95"
            >
              <Calendar className="w-5 h-5" aria-hidden="true" />
              <span>Book an Accessibility Consultation</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-base transition-colors"
            >
              <span>Contact InclusiveTest</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
