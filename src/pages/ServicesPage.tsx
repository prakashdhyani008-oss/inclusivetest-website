import React, { useState, useEffect } from 'react';
import { PageView, ServiceType } from '../types';
import { servicesData } from '../data/servicesData';
import { AccessibilityCheckerWidget } from '../components/AccessibilityCheckerWidget';
import { 
  FileCheck2, 
  Code2, 
  FileText, 
  Scale, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Keyboard, 
  Volume2, 
  Layers,
  HelpCircle
} from 'lucide-react';

interface ServicesPageProps {
  initialServiceId?: string;
  onNavigate: (page: PageView) => void;
  onOpenConsultation: () => void;
  onBookWithService: (service: ServiceType) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  initialServiceId,
  onNavigate,
  onOpenConsultation,
  onBookWithService
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || servicesData[0].id
  );

  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialServiceId]);

  const activeService = servicesData.find(s => s.id === selectedServiceId) || servicesData[0];

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'audits': return <FileCheck2 className="w-5 h-5 text-blue-400" aria-hidden="true" />;
      case 'remediation': return <Code2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />;
      case 'vpat': return <FileText className="w-5 h-5 text-purple-400" aria-hidden="true" />;
      case 'legal': return <Scale className="w-5 h-5 text-amber-400" aria-hidden="true" />;
      default: return <ShieldCheck className="w-5 h-5 text-teal-400" aria-hidden="true" />;
    }
  };

  return (
    <div className="space-y-20 sm:space-y-28 py-10">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <Layers className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Professional Accessibility Services</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto">
          Accessibility Services Built Around Your Digital Experience
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          We combine certified manual testing, real assistive technology verification, and hands-on developer remediation support to ensure your digital products work for everyone.
        </p>

        {/* Quick Service Selector Pills */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-3" role="tablist" aria-label="Service Categories">
          {servicesData.map((service) => {
            const isSelected = service.id === selectedServiceId;
            return (
              <button
                key={service.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedServiceId(service.id)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 border shadow-sm ${
                  isSelected 
                    ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-teal-500 shadow-md' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {getServiceIcon(service.id)}
                <span>{service.title}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Service Detailed Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Service Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-8 sm:p-12 border-b border-slate-800">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {activeService.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">InclusiveTest Capability</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {activeService.title}
              </h2>

              <p className="text-lg text-teal-300 font-semibold">
                {activeService.tagline}
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {activeService.fullDescription}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onBookWithService(activeService.title as ServiceType)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span>Book Consultation for {activeService.title}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('report-preview')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700"
                >
                  <span>View Sample Deliverable</span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Service Details Grid */}
          <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: What We Include & Methodologies (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" aria-hidden="true" />
                  <span>What's Included in This Engagement</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeService.includes.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-teal-600" aria-hidden="true" />
                  <span>Testing Methodology & Process</span>
                </h3>
                <div className="space-y-2.5">
                  {activeService.methodology.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
                      <span className="w-5 h-5 rounded-md bg-slate-900 text-teal-400 font-mono font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed font-medium">{m}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Assistive Tech & Tangible Outcomes (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Tangible Outcomes Card */}
              <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-900 block">
                  Expected Business & Technical Outcomes
                </span>
                <ul className="space-y-2.5 text-xs text-teal-950">
                  {activeService.outcomes.map((out, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                      <span className="leading-snug font-medium">{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assistive Tech Tested */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
                  Assistive Technologies Verified
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeService.assistiveTech.map((tech, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Standards Covered */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider block">
                  Standards Benchmarked:
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeService.standardsCovered.map((std, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-white text-slate-800 font-semibold border border-slate-300">
                      {std}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Scope Estimator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AccessibilityCheckerWidget onBookWithScope={onBookWithService} />
      </section>

    </div>
  );
};
