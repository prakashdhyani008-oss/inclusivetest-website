import React, { useState, useEffect } from 'react';
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
  onBookWithScope: (service: ServiceType, trigger?: React.MouseEvent | HTMLElement) => void;
}

export const AccessibilityCheckerWidget: React.FC<AccessibilityCheckerWidgetProps> = ({ onBookWithScope }) => {
  const [digitalAssetType, setDigitalAssetType] = useState<'webapp' | 'mobile' | 'enterprise' | 'designsystem'>('webapp');
  const [targetStandard, setTargetStandard] = useState<'wcag22' | 'section508' | 'en301549' | 'all'>('wcag22');
  const [teamStage, setTeamStage] = useState<'pre-audit' | 'remediating' | 'procurement-vpat' | 'legal-notice'>('pre-audit');
  const [dynamicAnnouncement, setDynamicAnnouncement] = useState<string>('');

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

  // Announce dynamic recommendation changes to assistive technology (WCAG 4.1.3)
  useEffect(() => {
    setDynamicAnnouncement(`Recommended solution updated: ${rec.title}. Estimated timeline: ${rec.timeline}. Deliverable: ${rec.keyDeliverable}`);
  }, [digitalAssetType, targetStandard, teamStage]);

  const assetOptions = [
    { id: 'webapp', label: 'Web Application / SaaS' },
    { id: 'enterprise', label: 'Multi-Product Enterprise' },
    { id: 'mobile', label: 'Native iOS & Android App' },
    { id: 'designsystem', label: 'Design System / UI Library' }
  ];

  const standardOptions = [
    { id: 'wcag22', label: 'WCAG 2.2 AA (Gold Standard)' },
    { id: 'section508', label: 'Section 508 (US Gov / VPAT)' },
    { id: 'en301549', label: 'EN 301 549 (EU Mandate / EAA)' },
    { id: 'all', label: 'International (Global Scope)' }
  ];

  const stageOptions = [
    { id: 'pre-audit', label: 'Major Release or Baseline Discovery' },
    { id: 'procurement-vpat', label: 'Enterprise Buyer Requesting VPAT / ACR' },
    { id: 'remediating', label: 'Need Hands-on Developer Code Fixes' },
    { id: 'legal-notice', label: 'Regulatory Inquiry / Risk Prioritization' }
  ];

  // WAI-ARIA Radio Group arrow-key navigation pattern (WCAG 2.1.1)
  const handleRadioKeyDown = (
    e: React.KeyboardEvent,
    currentId: string,
    options: Array<{ id: string; label: string }>,
    setter: (id: any) => void
  ) => {
    const currentIndex = options.findIndex(o => o.id === currentId);
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % options.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = options.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    setter(options[nextIndex].id);
    const nextElem = document.getElementById(`opt-${options[nextIndex].id}`);
    nextElem?.focus();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
      {/* Live Region for Dynamic Strategy Planner Announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {dynamicAnnouncement}
      </div>

      <div className="bg-slate-900 text-white p-5 sm:p-8 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Scope & Strategy Planner</span>
        </div>
        <h2 id="scope-planner-heading" className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white break-words">
          Find the Right Accessibility Engagement for Your Team
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
          Select your product profile to view recommended testing depth, assistive technology matrix, and expected timeline. Use Arrow keys to navigate options.
        </p>
      </div>

      <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Selectors (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Question 1: Digital Asset Type */}
          <fieldset className="border-0 p-0 m-0 space-y-2">
            <legend id="legend-asset-type" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. What type of digital ecosystem are you testing?
            </legend>
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2.5" role="radiogroup" aria-labelledby="legend-asset-type">
              {assetOptions.map(opt => {
                const isSelected = digitalAssetType === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`opt-${opt.id}`}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setDigitalAssetType(opt.id as any)}
                    onKeyDown={(e) => handleRadioKeyDown(e, digitalAssetType, assetOptions, setDigitalAssetType)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all min-h-[44px] flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 text-teal-950 ring-2 ring-teal-600 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="break-words">{opt.label}</span>
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2 ${
                      isSelected ? 'border-teal-600 bg-teal-600' : 'border-slate-400 bg-white'
                    }`} aria-hidden="true">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Question 2: Target Standard */}
          <fieldset className="border-0 p-0 m-0 space-y-2">
            <legend id="legend-target-standard" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. What is your primary compliance or benchmark target?
            </legend>
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-labelledby="legend-target-standard">
              {standardOptions.map(std => {
                const isSelected = targetStandard === std.id;
                return (
                  <button
                    key={std.id}
                    id={`opt-${std.id}`}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setTargetStandard(std.id as any)}
                    onKeyDown={(e) => handleRadioKeyDown(e, targetStandard, standardOptions, setTargetStandard)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all min-h-[44px] flex flex-col justify-center items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 text-teal-950 ring-2 ring-teal-600 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="break-words leading-tight">{std.label}</span>
                    <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center mt-1.5 ${
                      isSelected ? 'border-teal-600 bg-teal-600' : 'border-slate-400 bg-white'
                    }`} aria-hidden="true">
                      {isSelected && <span className="w-1 h-1 rounded-full bg-white" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Question 3: Current Stage */}
          <fieldset className="border-0 p-0 m-0 space-y-2">
            <legend id="legend-milestone-stage" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              3. What is your immediate milestone or operational trigger?
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup" aria-labelledby="legend-milestone-stage">
              {stageOptions.map(stg => {
                const isSelected = teamStage === stg.id;
                return (
                  <button
                    key={stg.id}
                    id={`opt-${stg.id}`}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setTeamStage(stg.id as any)}
                    onKeyDown={(e) => handleRadioKeyDown(e, teamStage, stageOptions, setTeamStage)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all min-h-[44px] flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 text-teal-950 ring-2 ring-teal-600 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="break-words">{stg.label}</span>
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2 ${
                      isSelected ? 'border-teal-600 bg-teal-600' : 'border-slate-400 bg-white'
                    }`} aria-hidden="true">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Recommended Package Card (5 cols) */}
        <div 
          className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col justify-between space-y-4"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-200">
                Recommended Solution
              </span>
              <ShieldCheck className="w-5 h-5 text-teal-600" aria-hidden="true" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              {rec.title}
            </h3>

            <div className="space-y-3 pt-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-700 font-bold block mb-0.5">Estimated Timeline:</span>
                <span className="text-slate-900 font-semibold">{rec.timeline}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-700 font-bold block mb-0.5">Assistive Technology Testing Matrix:</span>
                <span className="text-slate-900 font-semibold">{rec.assistiveSuite}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-700 font-bold block mb-0.5">Key Deliverable:</span>
                <span className="text-slate-900 font-semibold">{rec.keyDeliverable}</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={(e) => onBookWithScope(rec.service, e.currentTarget)}
              aria-label={`Book consultation for ${rec.title}`}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
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
