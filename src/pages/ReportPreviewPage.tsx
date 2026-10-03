import React from 'react';
import { PageView } from '../types';
import { InteractiveReportViewer } from '../components/InteractiveReportViewer';
import { 
  FileCheck2, 
  Calendar, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2,
  Code2,
  Layers,
  FileCode
} from 'lucide-react';

interface ReportPreviewPageProps {
  onNavigate: (page: PageView) => void;
  onOpenConsultation: (trigger?: React.MouseEvent | HTMLElement) => void;
}

export const ReportPreviewPage: React.FC<ReportPreviewPageProps> = ({
  onNavigate,
  onOpenConsultation
}) => {
  return (
    <div className="space-y-16 py-10">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <FileCode className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Interactive Audit Sample</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto">
          Reports Your Development Team Can Actually Use
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Explore our interactive audit deliverable. Every finding provides engineering-grade precision: exact WCAG mappings, reproduction checklists, screen reader audio expectations, and copy-pasteable code fixes.
        </p>
      </section>

      {/* Interactive Report Component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveReportViewer onOpenConsultation={onOpenConsultation} />
      </section>

      {/* Deliverable Specifications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Standard Deliverables Included in Every InclusiveTest Audit
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-sm text-slate-900 block">1. Executive Summary & Scoring</span>
              <p className="leading-relaxed">High-level conformance benchmark for executives, VP of Engineering, and compliance officers highlighting macro risk and overall WCAG percentage.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-sm text-slate-900 block">2. Sprint-Ready Jira / GitHub Backlog</span>
              <p className="leading-relaxed">Direct CSV/JSON exports formatted for Jira, Azure DevOps, and GitHub Issues with severity tags, reproduction steps, and WCAG criteria.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-sm text-slate-900 block">3. Code-Level Remediation Recipes</span>
              <p className="leading-relaxed">Framework-tailored code patterns (React, Vue, Web Components) with WAI-ARIA 1.2 compliant focus management and semantic HTML structures.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">Ready to audit your web application or mobile ecosystem?</span>
            <button
              type="button"
              onClick={(e) => onOpenConsultation(e.currentTarget)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book an Audit Strategy Call</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
