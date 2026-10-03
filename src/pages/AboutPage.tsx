import React from 'react';
import { PageView } from '../types';
import { aboutCompanyStory } from '../data/companyData';
import { Logo } from '../components/Logo';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Award, 
  Eye, 
  Terminal, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  Users,
  CheckCircle2,
  Workflow
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageView) => void;
  onOpenConsultation: (trigger?: React.MouseEvent | HTMLElement) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenConsultation }) => {
  return (
    <div className="space-y-20 sm:space-y-28 py-10">
      
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="flex justify-center mb-2">
          <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-200 inline-flex items-center justify-center">
            <Logo variant="stacked" size="xl" showTagline={true} />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <HeartHandshake className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Our Mission & Team</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto">
          {aboutCompanyStory.headline}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          InclusiveTest helps organizations identify, understand, and remediate digital accessibility barriers so they can build products that work seamlessly for everyone.
        </p>
      </section>

      {/* Story & Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why We Founded InclusiveTest
            </h2>
            <p>
              InclusiveTest was founded by accessibility engineers and usability specialists who noticed a fundamental flaw in the industry: organizations were buying automated scanning tools that generated hundreds of false alarms, while critical keyboard traps, screen reader failures, and broken single-page applications went completely undetected.
            </p>
            <p>
              We believe that accessibility is not a legal liability checklist or an automated overlay widget. True accessibility is an essential facet of software craftsmanship, engineering quality, and human-centered design.
            </p>
            <p>
              Our specialists work side-by-side with product managers, QA leaders, and front-end developers to transform complex WCAG criteria into sprint-ready, copy-pasteable code fixes.
            </p>

            <div className="pt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={(e) => onOpenConsultation(e.currentTarget)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>Schedule a Strategy Session</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Technical Standards Credibility</span>
            </div>

            <h3 className="text-xl font-bold text-white">Our Engineering Principles</h3>

            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span><strong>Zero False Positives:</strong> Every reported finding is verified through real assistive technology reproduction.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span><strong>Developer Enablement:</strong> We deliver actionable code patterns for React, Vue, Web Components, and HTML5.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span><strong>No Fear-Based Marketing:</strong> We focus on business value, user usability, and pragmatic engineering execution.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span><strong>No Accessibility Overlays:</strong> We reject third-party plugin overlays and advocate for native accessible code.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-100 py-16 sm:py-20 border-y border-slate-200" aria-labelledby="values-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 id="values-heading" className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Core Values
            </h2>
            <p className="text-sm text-slate-600">
              The fundamental beliefs guiding every audit, recommendation, and consultation we conduct.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutCompanyStory.coreValues.map((val, idx) => (
              <div key={idx} className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 font-bold text-xs flex items-center justify-center font-mono">
                  0{idx + 1}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{val.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assistive Tech Testing Lab */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800">
          <div className="max-w-3xl space-y-4 mb-8">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Assistive Technology Lab</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Real Devices. Real Assistive Tools. Real Experience.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We maintain a dedicated hardware and software testing lab running standard and specialized assistive environments across Windows, macOS, iOS, and Android.
            </p>
          </div>

          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 list-none p-0 m-0" aria-label="Assistive technologies tested in lab">
            <li className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-mono font-bold text-teal-400">NVDA 2024+</span>
              <div className="text-sm font-bold text-white">Windows 11</div>
              <div className="text-[11px] text-slate-400">Chrome, Edge & Firefox</div>
            </li>

            <li className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-mono font-bold text-blue-400">JAWS 2024</span>
              <div className="text-sm font-bold text-white">Windows Enterprise</div>
              <div className="text-[11px] text-slate-400">Chrome & Edge</div>
            </li>

            <li className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-mono font-bold text-purple-400">VoiceOver</span>
              <div className="text-sm font-bold text-white">macOS Sonoma & iOS 17+</div>
              <div className="text-[11px] text-slate-400">Safari & WebKit Engine</div>
            </li>

            <li className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-400">TalkBack</span>
              <div className="text-sm font-bold text-white">Android 14+</div>
              <div className="text-[11px] text-slate-400">Google Chrome Mobile</div>
            </li>
          </ul>
        </div>
      </section>

    </div>
  );
};
