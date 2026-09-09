import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  Layers, 
  Scale, 
  ShieldCheck, 
  Terminal,
  Calendar
} from 'lucide-react';
import { ServiceType } from '../types';

interface AccessibilityCheckerWidgetProps {
  onBookWithScope: (service: ServiceType) => void;
}

export const AccessibilityCheckerWidget: React.FC<AccessibilityCheckerWidgetProps> = ({ onBookWithScope }) => {
  const [digitalAssetType, setDigitalAssetType] = useState<'webapp' | 'mobile' | 'enterprise' | 'designsystem'>('webapp');
  const [targetStandard, setTargetStandard] = useState<'wcag22' | 'section508' | 'en301549' | 'all'>('wcag22');
  const [teamStage, setTeamStage] = useState<'pre-audit' | 'remediating' | 'procurement-vpat' | 'legal-notice'>('pre-audit');

  const getRecommendation = () => {
    if (teamStage === 'procurement-vpat') {
      return {
        service: 'VPAT / ACR' as ServiceType,
        title: 'VPAT 2.5 Edition & Conformance Evaluation',
        timeline: '2–3 Weeks Evaluation & Report Issuance',
        assistiveSuite: 'VoiceOver, NVDA, JAWS & Keyboard Traversal',
        keyDeliverable: 'Formal Accessibility Conformance Report (ACR) for procurement approval.'
      };
    }
    if (teamStage === 'remediating') {
      return {
        service: 'Remediation Support' as ServiceType,
        title: 'Developer-Led Remediation Support & Pairing',
        timeline: 'Sprint-Aligned Engineering Sprints',
        assistiveSuite: 'AOM, DevTools Accessibility Tree, Screen Reader Simulation',
        keyDeliverable: 'PR code reviews, accessible UI token guidance, and fix validation.'
      };
    }
    if (teamStage === 'legal-notice') {
      return {
        service: 'Legal Accessibility Guidance' as ServiceType,
        title: 'Technical Accessibility Risk Assessment & Roadmap',
        timeline: 'Rapid 5-Day Priority Diagnostic',
        assistiveSuite: 'Full Assistive Tech Matrix Across Core Workflows',
        keyDeliverable: 'Defensible milestone remediation plan and barrier prioritization matrix.'
      };
    }
    return {
      service: 'Accessibility Audit' as ServiceType,
      title: 'Full Baseline WCAG 2.1 / 2.2 AA Manual & Assistive Tech Audit',
      timeline: '2–4 Weeks (Depending on Journey Complexity)',
      assistiveSuite: 'NVDA, JAWS, VoiceOver (iOS/macOS), TalkBack (Android)',
      keyDeliverable: 'Sprint-ready Jira/GitHub backlog findings with code fixes and zero false positives.'
    };
  };

  const rec = getRecommendation();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
      <div className="bg-slate-900 text-white p-6 sm:p-8 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Scope & Strategy Planner</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Find the Right Accessibility Engagement for Your Team
        </h3>
        <p className="text-sm text-slate-300 mt-1 max-w-xl">
          Select your product profile to view recommended testing depth, assistive technology matrix, and expected timeline.
        </p>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Selectors (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Question 1: Digital Asset Type */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              1. What type of digital ecosystem are you testing?
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'webapp', label: 'Web Application / SaaS' },
                { id: 'enterprise', label: 'Multi-Product Enterprise' },
                { id: 'mobile', label: 'Native iOS & Android App' },
                { id: 'designsystem', label: 'Design System / UI Library' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDigitalAssetType(opt.id as any)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    digitalAssetType === opt.id
                      ? 'border-teal-600 bg-teal-50 text-teal-950 ring-2 ring-teal-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                  aria-pressed={digitalAssetType === opt.id}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Target Standard */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              2. What is your primary compliance or benchmark target?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'wcag22', label: 'WCAG 2.2 AA (Gold Standard)' },
                { id: 'section508', label: 'Section 508 (US Gov / VPAT)' },
                { id: 'en301549', label: 'EN 301 549 (EU Mandate / EAA)' },
                { id: 'all', label: 'International (Global Scope)' }
              ].map(std => (
                <button
                  key={std.id}
                  type="button"
                  onClick={() => setTargetStandard(std.id as any)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                    targetStandard === std.id
                      ? 'border-teal-600 bg-teal-50 text-teal-950 ring-2 ring-teal-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                  aria-pressed={targetStandard === std.id}
                >
                  {std.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Current Stage */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              3. What is your immediate milestone or operational trigger?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'pre-audit', label: 'Major Release or Baseline Discovery' },
                { id: 'procurement-vpat', label: 'Enterprise Buyer Requesting VPAT / ACR' },
                { id: 'remediating', label: 'Need Hands-on Developer Code Fixes' },
                { id: 'legal-notice', label: 'Regulatory Inquiry / Risk Prioritization' }
              ].map(stg => (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => setTeamStage(stg.id as any)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    teamStage === stg.id
                      ? 'border-teal-600 bg-teal-50 text-teal-950 ring-2 ring-teal-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                  aria-pressed={teamStage === stg.id}
                >
                  {stg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Package Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider bg-teal-100 px-2.5 py-0.5 rounded-full">
                Recommended Solution
              </span>
              <ShieldCheck className="w-5 h-5 text-teal-600" aria-hidden="true" />
            </div>

            <h4 className="text-xl font-bold text-slate-900 leading-snug">
              {rec.title}
            </h4>

            <div className="space-y-3 pt-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold block mb-0.5">Estimated Timeline:</span>
                <span className="text-slate-800 font-semibold">{rec.timeline}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold block mb-0.5">Assistive Technology Testing Matrix:</span>
                <span className="text-slate-800 font-semibold">{rec.assistiveSuite}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold block mb-0.5">Key Deliverable:</span>
                <span className="text-slate-800 font-semibold">{rec.keyDeliverable}</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={() => onBookWithScope(rec.service)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>Book Consultation for This Scope</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
