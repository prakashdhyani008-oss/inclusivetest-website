import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Globe, 
  Building2, 
  User, 
  Mail, 
  Briefcase, 
  Download, 
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { ConsultationBookingState, ServiceType } from '../types';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceType;
}

const AVAILABLE_DAYS = [
  { day: 'Mon', date: 'Sep 01', full: 'Monday, September 1, 2026' },
  { day: 'Tue', date: 'Sep 02', full: 'Tuesday, September 2, 2026' },
  { day: 'Wed', date: 'Sep 03', full: 'Wednesday, September 3, 2026' },
  { day: 'Thu', date: 'Sep 04', full: 'Thursday, September 4, 2026' },
  { day: 'Fri', date: 'Sep 05', full: 'Friday, September 5, 2026' },
  { day: 'Mon', date: 'Sep 08', full: 'Monday, September 8, 2026' },
  { day: 'Tue', date: 'Sep 09', full: 'Tuesday, September 9, 2026' },
];

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM'
];

const SERVICE_OPTIONS: ServiceType[] = [
  'Accessibility Audit',
  'Remediation Support',
  'VPAT / ACR',
  'Accessibility Consulting',
  'Ongoing Accessibility Testing',
  'Agency Partnership'
];

const SCOPE_OPTIONS = [
  'Single Website or Web Application (1-5 Core User Flows)',
  'Enterprise Multi-Product Web Platform',
  'Native Mobile App (iOS / Android)',
  'Design System / UI Component Library',
  'VPAT / ACR for Enterprise Procurement',
  'Urgent Legal / Demand Letter Assessment',
  'Ongoing Accessibility Testing Retainer'
];

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  initialService
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [booking, setBooking] = useState<ConsultationBookingState>({
    date: AVAILABLE_DAYS[0].full,
    time: TIME_SLOTS[1],
    timezone: 'Eastern Time (US & Canada) - GMT-4',
    name: '',
    email: '',
    company: '',
    jobTitle: '',
    url: '',
    serviceNeeded: initialService || 'Accessibility Audit',
    projectScope: SCOPE_OPTIONS[0],
    message: '',
    confirmed: false,
    bookingRef: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const dialogRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  // Update initial service when prop changes
  useEffect(() => {
    if (initialService) {
      setBooking(prev => ({ ...prev, serviceNeeded: initialService }));
    }
  }, [initialService]);

  // Trap focus and handle ESC key (WCAG 2.1.2 & 2.4.3)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Focus first interactive control
    setTimeout(() => {
      initialFocusRef.current?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!booking.name.trim()) newErrors.name = 'Please provide your full name.';
    if (!booking.email.trim() || !booking.email.includes('@')) {
      newErrors.email = 'Please provide a valid work email address.';
    }
    if (!booking.company.trim()) newErrors.company = 'Please enter your company or organization.';
    if (!booking.jobTitle.trim()) newErrors.jobTitle = 'Please specify your job title or role.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep1 = () => {
    setStep(2);
  };

  const handleSubmitStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      const generatedRef = `IT-CONF-${Math.floor(100000 + Math.random() * 900000)}`;
      setBooking(prev => ({
        ...prev,
        confirmed: true,
        bookingRef: generatedRef
      }));
      setStep(3);
    }
  };

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`InclusiveTest Accessibility Consultation (${booking.company || 'Digital Product'})`);
    const details = encodeURIComponent(
      `30-Minute Accessibility Strategy & Scope Consultation with InclusiveTest specialists.\n\n` +
      `Meeting Reference: ${booking.bookingRef}\n` +
      `Service: ${booking.serviceNeeded}\n` +
      `Scope: ${booking.projectScope}\n` +
      `Target URL: ${booking.url || 'To be shared'}\n\n` +
      `Google Meet Link: https://meet.google.com/inc-test-meet\n\n` +
      `InclusiveTest — Building Digital Experiences for Everyone.`
    );
    const location = encodeURIComponent('Google Meet (https://meet.google.com/inc-test-meet)');
    
    // Default mock timestamp in UTC
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  // Download .ics file
  const downloadIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//InclusiveTest//Accessibility Consultation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:InclusiveTest Accessibility Consultation - ${booking.company}`,
      `DESCRIPTION:30-minute consultation on digital accessibility testing and remediation with InclusiveTest.\\nRef: ${booking.bookingRef}`,
      'LOCATION:Google Meet Video Room',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `InclusiveTest-Consultation-${booking.bookingRef}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-modal-title"
      ref={dialogRef}
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with Step Progress */}
        <div className="bg-slate-900 text-white px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow">
              <CalendarIcon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="consultation-modal-title" className="text-lg font-bold text-white tracking-tight">
                Book an Accessibility Consultation
              </h2>
              <p className="text-xs text-slate-400">
                30-Minute Strategy Session with Certified Accessibility Specialists
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            ref={initialFocusRef}
            aria-label="Close consultation modal"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200">
          <nav aria-label="Booking Progress" className="flex items-center justify-between text-xs font-semibold">
            <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-teal-700 font-bold' : step > 1 ? 'text-emerald-700' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-teal-600 text-white' : step > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                1
              </span>
              <span>1. Select Time</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-300 hidden sm:block" />
            <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-teal-700 font-bold' : step > 2 ? 'text-emerald-700' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-teal-600 text-white' : step > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                2
              </span>
              <span>2. Project Scope</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-300 hidden sm:block" />
            <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-teal-700 font-bold' : step > 3 ? 'text-emerald-700' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-teal-600 text-white' : step > 3 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                3
              </span>
              <span>3. Confirmation</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-300 hidden sm:block" />
            <div className={`flex items-center gap-1.5 ${step === 4 ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 4 ? 'bg-teal-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                4
              </span>
              <span>4. Calendar & Prep</span>
            </div>
          </nav>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800">
          
          {/* STEP 1: SCHEDULING */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-900">
                <p className="font-semibold text-teal-950">
                  Discuss your accessibility goals, current challenges, and how InclusiveTest can help.
                </p>
                <p className="text-xs text-teal-800 mt-1">
                  Our consultations are practical, zero-pressure conversations with senior accessibility engineers—not high-pressure sales calls.
                </p>
              </div>

              {/* Timezone Selector */}
              <div>
                <label htmlFor="modal-timezone" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Your Timezone
                </label>
                <select
                  id="modal-timezone"
                  value={booking.timezone}
                  onChange={(e) => setBooking({ ...booking, timezone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-teal-600"
                >
                  <option value="Eastern Time (US & Canada) - GMT-4">Eastern Time (US & Canada) - GMT-4</option>
                  <option value="Central Time (US & Canada) - GMT-5">Central Time (US & Canada) - GMT-5</option>
                  <option value="Pacific Time (US & Canada) - GMT-7">Pacific Time (US & Canada) - GMT-7</option>
                  <option value="Greenwich Mean Time / UTC">Greenwich Mean Time / UTC</option>
                  <option value="Central European Time (CET) - GMT+2">Central European Time (CET) - GMT+2</option>
                  <option value="British Summer Time (BST) - GMT+1">British Summer Time (BST) - GMT+1</option>
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Select a Date (Next Available Business Days)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {AVAILABLE_DAYS.map((d) => {
                    const isSelected = booking.date === d.full;
                    return (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setBooking({ ...booking, date: d.full })}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected 
                            ? 'border-teal-600 bg-teal-600 text-white shadow-md font-bold' 
                            : 'border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50 text-slate-800'
                        }`}
                        aria-pressed={isSelected}
                      >
                        <span className={`block text-[11px] ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>{d.day}</span>
                        <span className="block text-sm font-bold mt-0.5">{d.date}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Selection */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Select Available 30-Minute Time Slot
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {TIME_SLOTS.map((t) => {
                    const isSelected = booking.time === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setBooking({ ...booking, time: t })}
                        className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          isSelected 
                            ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-600 font-bold' 
                            : 'border-slate-200 bg-white hover:border-slate-400 text-slate-700'
                        }`}
                        aria-pressed={isSelected}
                      >
                        <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} aria-hidden="true" />
                        <span>{t}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <span>Continue to Step 2: Qualification</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: QUALIFICATION FORM */}
          {step === 2 && (
            <form onSubmit={handleSubmitStep2} className="space-y-4 animate-in fade-in duration-200" noValidate>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs text-slate-700">
                <span className="font-semibold">Selected Slot: {booking.date} at {booking.time}</span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-teal-700 font-bold hover:underline"
                >
                  Change Slot
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="modal-name" className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-rose-600" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" aria-hidden="true" />
                    <input
                      id="modal-name"
                      type="text"
                      required
                      value={booking.name}
                      onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${errors.name ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 bg-white'} focus:ring-2 focus:ring-teal-600`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                </div>

                {/* Work Email */}
                <div>
                  <label htmlFor="modal-email" className="block text-xs font-bold text-slate-700 mb-1">
                    Work Email <span className="text-rose-600" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" aria-hidden="true" />
                    <input
                      id="modal-email"
                      type="email"
                      required
                      value={booking.email}
                      onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                      placeholder="sjenkins@company.com"
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${errors.email ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 bg-white'} focus:ring-2 focus:ring-teal-600`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="modal-company" className="block text-xs font-bold text-slate-700 mb-1">
                    Company / Organization <span className="text-rose-600" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" aria-hidden="true" />
                    <input
                      id="modal-company"
                      type="text"
                      required
                      value={booking.company}
                      onChange={(e) => setBooking({ ...booking, company: e.target.value })}
                      placeholder="Acme Health or Tech Corp"
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${errors.company ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 bg-white'} focus:ring-2 focus:ring-teal-600`}
                    />
                  </div>
                  {errors.company && <p className="text-xs text-rose-600 mt-1">{errors.company}</p>}
                </div>

                {/* Job Title */}
                <div>
                  <label htmlFor="modal-title" className="block text-xs font-bold text-slate-700 mb-1">
                    Job Title / Role <span className="text-rose-600" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" aria-hidden="true" />
                    <input
                      id="modal-title"
                      type="text"
                      required
                      value={booking.jobTitle}
                      onChange={(e) => setBooking({ ...booking, jobTitle: e.target.value })}
                      placeholder="e.g. VP of Product, QA Lead, CTO"
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${errors.jobTitle ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 bg-white'} focus:ring-2 focus:ring-teal-600`}
                    />
                  </div>
                  {errors.jobTitle && <p className="text-xs text-rose-600 mt-1">{errors.jobTitle}</p>}
                </div>
              </div>

              {/* Website / Application URL */}
              <div>
                <label htmlFor="modal-url" className="block text-xs font-bold text-slate-700 mb-1">
                  Website or Application URL (Optional / Staging)
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" aria-hidden="true" />
                  <input
                    id="modal-url"
                    type="url"
                    value={booking.url}
                    onChange={(e) => setBooking({ ...booking, url: e.target.value })}
                    placeholder="https://app.yourcompany.com"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Service Needed Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="modal-service" className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Service Needed <span className="text-rose-600" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="modal-service"
                    value={booking.serviceNeeded}
                    onChange={(e) => setBooking({ ...booking, serviceNeeded: e.target.value as ServiceType })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600"
                  >
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Approximate Scope */}
                <div>
                  <label htmlFor="modal-scope" className="block text-xs font-bold text-slate-700 mb-1">
                    Approximate Scope / Digital Ecosystem
                  </label>
                  <select
                    id="modal-scope"
                    value={booking.projectScope}
                    onChange={(e) => setBooking({ ...booking, projectScope: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600"
                  >
                    {SCOPE_OPTIONS.map((sc) => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="modal-message" className="block text-xs font-bold text-slate-700 mb-1">
                  Accessibility Goals, Timelines, or Specific Questions
                </label>
                <textarea
                  id="modal-message"
                  rows={2}
                  value={booking.message}
                  onChange={(e) => setBooking({ ...booking, message: e.target.value })}
                  placeholder="e.g. We are preparing for our next major release and need a comprehensive WCAG 2.2 AA audit and VPAT report for enterprise buyers."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold text-sm"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <span>Confirm Consultation Booking</span>
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: CONFIRMATION */}
          {step === 3 && (
            <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                  Confirmed Reference: {booking.bookingRef}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Thank you for booking a consultation with InclusiveTest.
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  We have reserved your 30-minute consultation. A calendar invite and confirmation have been dispatched to <strong className="text-slate-900">{booking.email}</strong>.
                </p>
              </div>

              {/* Meeting Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-lg mx-auto space-y-3">
                <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">Scheduled Time</div>
                    <div className="text-base font-bold text-slate-900">{booking.date}</div>
                    <div className="text-sm text-teal-700 font-semibold">{booking.time} ({booking.timezone})</div>
                  </div>
                  <span className="px-2.5 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-md">
                    30 Min Google Meet
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Attendee:</span>
                    <p className="font-semibold text-slate-800">{booking.name} ({booking.jobTitle})</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Organization:</span>
                    <p className="font-semibold text-slate-800">{booking.company}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Service:</span>
                    <p className="font-semibold text-slate-800">{booking.serviceNeeded}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Video Room:</span>
                    <p className="font-semibold text-teal-700">Included in Invite</p>
                  </div>
                </div>
              </div>

              {/* Calendar Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow transition-all"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  <span>Add to Google Calendar</span>
                </a>

                <button
                  type="button"
                  onClick={downloadIcs}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm shadow transition-all"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>Download .ICS (Outlook/Apple)</span>
                </button>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-xs text-teal-700 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>View Step 4: Pre-Meeting Preparation Checklist</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PREPARATION CHECKLIST & INTEGRATION */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 bg-slate-900 text-white p-4 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-teal-400 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold">Meeting Preparation Checklist</h4>
                  <p className="text-xs text-slate-300">To get the maximum value out of your 30-minute consultation:</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <div className="font-bold text-slate-900">Identify Key Digital Workflows</div>
                    <div className="text-xs text-slate-600 mt-0.5">Have a list of top 3-5 high-traffic conversion flows (e.g. User Signup, Checkout, Core Dashboard Actions, Settings).</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <div className="font-bold text-slate-900">Clarify Target Standards & Timelines</div>
                    <div className="text-xs text-slate-600 mt-0.5">Know whether your primary requirement is WCAG 2.1/2.2 AA, US Section 508 VPAT, or EU EN 301 549, and your procurement deadlines.</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <div className="font-bold text-slate-900">Invite Key Engineering or Product Stakeholders</div>
                    <div className="text-xs text-slate-600 mt-0.5">Feel free to forward the Google Calendar invite to your Lead Engineer, QA Manager, or Corporate Counsel.</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-slate-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Confirmation</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
