import React, { useState } from 'react';
import { PageView, ServiceType } from '../types';
import { 
  Mail, 
  Building2, 
  User, 
  Briefcase, 
  Globe, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Sparkles,
  Send
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: PageView) => void;
  onOpenConsultation: () => void;
}

const SERVICE_OPTIONS: ServiceType[] = [
  'Accessibility Audit',
  'Remediation Support',
  'VPAT / ACR',
  'Accessibility Consulting',
  'Legal Accessibility Guidance',
  'Ongoing Accessibility Testing',
  'Agency Partnership'
];

const SCOPE_OPTIONS = [
  'Single Website or Web Application (1-5 Core User Flows)',
  'Enterprise Multi-Product Digital Ecosystem',
  'Native iOS / Android Mobile Suite',
  'Design System / UI Component Library',
  'VPAT / ACR Conformance Report for Procurement',
  'Urgent Legal / Demand Letter Assessment',
  'Ongoing Accessibility Testing Retainer'
];

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onOpenConsultation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    jobTitle: '',
    url: '',
    serviceNeeded: SERVICE_OPTIONS[0],
    projectScope: SCOPE_OPTIONS[0],
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Please provide a valid work email address.';
    }
    if (!formData.company.trim()) errs.company = 'Please enter your organization or company name.';
    if (!formData.jobTitle.trim()) errs.jobTitle = 'Please specify your job title.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-10">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <Mail className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Get in Touch</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto">
          Start Your Accessibility Conversation
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Connect with our certified accessibility consultants to discuss your product, target standards, and remediation roadmap.
        </p>
      </section>

      {/* Main Grid: Form (7 cols) + Direct Booking & Info (5 cols) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Thank You for Reaching Out
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  We have received your project inquiry. A senior accessibility consultant will review your details and reply within 1 business day.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        company: '',
                        jobTitle: '',
                        url: '',
                        serviceNeeded: SERVICE_OPTIONS[0],
                        projectScope: SCOPE_OPTIONS[0],
                        message: ''
                      });
                    }}
                    className="text-xs text-teal-700 font-bold hover:underline"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Request a Custom Consultation
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 mb-1">
                      Your Name <span className="text-rose-600" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. David Miller"
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm ${errors.name ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 bg-white'} focus:ring-2 focus:ring-teal-600`}
                    />
                    {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 mb-1">
                      Work Email <span className="text-rose-600" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="dmiller@enterprise.com"
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm ${errors.email ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 bg-white'} focus:ring-2 focus:ring-teal-600`}
                    />
                    {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-company" className="block text-xs font-bold text-slate-700 mb-1">
                      Company / Organization <span className="text-rose-600" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Corp"
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm ${errors.company ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 bg-white'} focus:ring-2 focus:ring-teal-600`}
                    />
                    {errors.company && <p className="text-xs text-rose-600 mt-1">{errors.company}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-title" className="block text-xs font-bold text-slate-700 mb-1">
                      Job Title <span className="text-rose-600" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-title"
                      type="text"
                      required
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      placeholder="e.g. Head of Engineering, PM"
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm ${errors.jobTitle ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 bg-white'} focus:ring-2 focus:ring-teal-600`}
                    />
                    {errors.jobTitle && <p className="text-xs text-rose-600 mt-1">{errors.jobTitle}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-url" className="block text-xs font-bold text-slate-700 mb-1">
                    Website or Application URL
                  </label>
                  <input
                    id="contact-url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://app.yourproduct.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-service" className="block text-xs font-bold text-slate-700 mb-1">
                      Service Needed <span className="text-rose-600" aria-hidden="true">*</span>
                    </label>
                    <select
                      id="contact-service"
                      value={formData.serviceNeeded}
                      onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value as ServiceType })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600"
                    >
                      {SERVICE_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-scope" className="block text-xs font-bold text-slate-700 mb-1">
                      Approximate Project Scope
                    </label>
                    <select
                      id="contact-scope"
                      value={formData.projectScope}
                      onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600"
                    >
                      {SCOPE_OPTIONS.map((sc) => (
                        <option key={sc} value={sc}>{sc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 mb-1">
                    Message / Project Details
                  </label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your digital product, compliance timeline, or specific challenges..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Request a Consultation</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Info & Direct Scheduling Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Instant Calendar Booking Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-4">
              <div className="p-3 w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Calendar className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-white">Prefer to Book Directly?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Skip the back-and-forth email scheduling. Select an available 30-minute time slot directly on our calendar.
              </p>
              <button
                type="button"
                onClick={onOpenConsultation}
                className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                Open Scheduling Calendar
              </button>
            </div>

            {/* Coverage & Operating Hours */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">Consulting Coverage</h3>
              
              <div className="space-y-3 text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Serving US & European Clients</strong>
                    <span>Cross-timezone support (US Eastern/Pacific & Central European Time).</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Response Time</strong>
                    <span>All inquiries receive a response within 1 business day.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Confidentiality & NDAs</strong>
                    <span>We execute mutual NDAs before reviewing proprietary staging repositories.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
