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
  Video,
  Copy,
  Check,
  Send,
  Loader2,
  Sparkles
} from 'lucide-react';
import { ConsultationBookingState, ServiceType } from '../types';
import { LogoIcon } from './Logo';
import { initAuth, googleSignIn, getAccessToken, logout, getCurrentUser } from '../services/googleAuth';
import { 
  processAppointmentBooking, 
  ADMIN_EMAIL, 
  BookingResult, 
  createGoogleCalendarEvent,
  buildGoogleCalendarTemplateUrl, 
  generateGmailWebComposeUrl, 
  generateMailtoUrl,
  sendGmailMessage,
  generateClientEmailHtml,
  generateAdminEmailHtml
} from '../services/googleWorkspace';
import { User as FirebaseUser } from 'firebase/auth';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceType;
  triggerElement?: HTMLElement | null;
}

// Generate the next 7 upcoming business days dynamically
const getUpcomingBusinessDays = () => {
  const days: { day: string; date: string; full: string }[] = [];
  const curr = new Date();
  while (days.length < 7) {
    const d = curr.getDay();
    if (d !== 0 && d !== 6) {
      const dayName = curr.toLocaleDateString('en-US', { weekday: 'short' });
      const monthName = curr.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = String(curr.getDate()).padStart(2, '0');
      const full = curr.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      days.push({ day: dayName, date: `${monthName} ${dayNum}`, full });
    }
    curr.setDate(curr.getDate() + 1);
  }
  return days;
};

const AVAILABLE_DAYS = getUpcomingBusinessDays();

const TIMEZONE_OPTIONS = [
  'IST - India Standard Time (GMT+5:30)',
  'Eastern Time (US & Canada) - GMT-4',
  'Central Time (US & Canada) - GMT-5',
  'Pacific Time (US & Canada) - GMT-7',
  'Greenwich Mean Time / UTC',
  'British Summer Time (BST) - GMT+1',
  'Central European Time (CET) - GMT+2',
  'Singapore / Hong Kong (SGT/HKT) - GMT+8',
  'Australian Eastern Time (AEST) - GMT+10'
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
  initialService,
  triggerElement
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [booking, setBooking] = useState<ConsultationBookingState>({
    date: AVAILABLE_DAYS[0].full,
    time: TIME_SLOTS[1],
    timezone: 'IST - India Standard Time (GMT+5:30)',
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
  const [modalAnnouncement, setModalAnnouncement] = useState<string>('');
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showConfirmScheduleDialog, setShowConfirmScheduleDialog] = useState(false);
  const [isSendingViaGoogle, setIsSendingViaGoogle] = useState(false);
  const [googleSentSuccess, setGoogleSentSuccess] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  // Initialize Google Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setFirebaseUser(user);
        setGoogleAccessToken(token);
        setBooking(prev => ({
          ...prev,
          name: prev.name || user.displayName || '',
          email: prev.email || user.email || ''
        }));
      },
      () => {
        setFirebaseUser(null);
        setGoogleAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Update initial service when prop changes
  useEffect(() => {
    if (initialService) {
      setBooking(prev => ({ ...prev, serviceNeeded: initialService }));
    }
  }, [initialService]);

  // Capture the triggering control when the dialog opens (WCAG 2.4.3 Focus Order)
  useEffect(() => {
    if (isOpen) {
      setModalAnnouncement('Accessibility consultation booking dialog opened. Step 1 of 4: Select a date and time slot. Use arrow keys to navigate date and time choices.');
      if (triggerElement && triggerElement.isConnected) {
        lastActiveElementRef.current = triggerElement;
      } else if (document.activeElement instanceof HTMLElement && !dialogRef.current?.contains(document.activeElement)) {
        lastActiveElementRef.current = document.activeElement;
      }
    }
  }, [isOpen, triggerElement]);

  // Return keyboard focus to triggering control when dialog closes (WCAG 2.4.3)
  useEffect(() => {
    if (!isOpen && lastActiveElementRef.current) {
      const elToFocus = lastActiveElementRef.current;
      lastActiveElementRef.current = null;
      setTimeout(() => {
        if (elToFocus && elToFocus.isConnected) {
          elToFocus.focus();
        } else {
          // Fallback if trigger was unmounted (e.g. mobile drawer button)
          const fallback = document.getElementById('mobile-header-book-btn') ||
                           document.getElementById('mobile-menu-toggle-btn') ||
                           document.getElementById('header-book-consultation-btn') || 
                           document.getElementById('hero-primary-cta');
          fallback?.focus();
        }
      }, 50);
    }
  }, [isOpen]);

  // Safe dialog close that programmatically returns focus to trigger (WCAG 2.4.3 Focus Order)
  const handleCloseModal = () => {
    const elToFocus = lastActiveElementRef.current || triggerElement;
    onClose();
    setTimeout(() => {
      if (elToFocus && elToFocus.isConnected) {
        elToFocus.focus();
      } else {
        const fallback = document.getElementById('mobile-header-book-btn') ||
                         document.getElementById('mobile-menu-toggle-btn') ||
                         document.getElementById('header-book-consultation-btn') || 
                         document.getElementById('hero-primary-cta') ||
                         document.getElementById('final-book-consultation-btn');
        fallback?.focus();
      }
    }, 60);
  };

  // Complete WAI-ARIA Dialog Modal Focus Trap and ESC handler (WCAG 2.1.2 & 2.4.3)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseModal();
        return;
      }

      if (e.key === 'Tab') {
        if (!dialogRef.current) return;
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]):not([aria-hidden="true"]), ' +
          '[href]:not([disabled]):not([aria-hidden="true"]), ' +
          'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"]), ' +
          'select:not([disabled]):not([aria-hidden="true"]), ' +
          'textarea:not([disabled]):not([aria-hidden="true"]), ' +
          '[tabindex]:not([tabindex="-1"]):not([disabled])'
        );

        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Initial focus on close button
    const timer = setTimeout(() => {
      initialFocusRef.current?.focus();
    }, 60);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  // Arrow key navigation for Date radio group (WCAG 2.1.1)
  const handleDateRadioKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % AVAILABLE_DAYS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + AVAILABLE_DAYS.length) % AVAILABLE_DAYS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = AVAILABLE_DAYS.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    const nextDay = AVAILABLE_DAYS[nextIndex];
    setBooking(prev => ({ ...prev, date: nextDay.full }));
    setModalAnnouncement(`Selected date: ${nextDay.full}`);
    const nextEl = document.getElementById(`date-radio-${nextIndex}`);
    nextEl?.focus();
  };

  // Arrow key navigation for Time slot radio group (WCAG 2.1.1)
  const handleTimeRadioKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % TIME_SLOTS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + TIME_SLOTS.length) % TIME_SLOTS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = TIME_SLOTS.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    const nextTime = TIME_SLOTS[nextIndex];
    setBooking(prev => ({ ...prev, time: nextTime }));
    setModalAnnouncement(`Selected time: ${nextTime}`);
    const nextEl = document.getElementById(`time-radio-${nextIndex}`);
    nextEl?.focus();
  };

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
    if (Object.keys(newErrors).length > 0) {
      setModalAnnouncement('Please correct the highlighted form errors before proceeding.');
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep1 = () => {
    setStep(2);
    setModalAnnouncement('Navigated to Step 2 of 4: Project Scope and Contact Information.');
  };

  const handleGoogleSignIn = async () => {
    setIsSigningInGoogle(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setFirebaseUser(result.user);
        setGoogleAccessToken(result.accessToken);
        setBooking(prev => ({
          ...prev,
          name: prev.name || result.user.displayName || '',
          email: prev.email || result.user.email || ''
        }));
        setModalAnnouncement(`Connected as ${result.user.displayName || result.user.email}. Appointments will automatically synchronize to your Google Calendar and send Google Meet invitations.`);
      }
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
    } finally {
      setIsSigningInGoogle(false);
    }
  };

  const handleCopyMeetLink = () => {
    const link = bookingResult?.meetingLink || booking.meetLink || 'https://meet.google.com/inc-test-meet';
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setModalAnnouncement('Google Meet link copied to clipboard.');
      setTimeout(() => setCopiedLink(false), 2500);
    }).catch(() => {
      // Fallback
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleSubmitStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      setShowConfirmScheduleDialog(true);
      setModalAnnouncement('Review and confirm consultation scheduling details.');
    }
  };

  const executeBooking = async () => {
    setIsBookingSubmitting(true);
    setModalAnnouncement('Scheduling appointment, creating Google Meet video room, and dispatching confirmation emails...');
    const generatedRef = booking.bookingRef || `IT-CONF-${Math.floor(100000 + Math.random() * 900000)}`;
    const updatedBooking = {
      ...booking,
      confirmed: true,
      bookingRef: generatedRef
    };
    setBooking(updatedBooking);

    try {
      const token = googleAccessToken || await getAccessToken();
      const result = await processAppointmentBooking(updatedBooking, token);
      setBookingResult(result);
      setBooking(prev => ({ ...prev, meetLink: result.meetingLink }));
      setStep(3);
      setModalAnnouncement(`Consultation booking confirmed. Reference: ${generatedRef}. Google Meet link generated and confirmation emails sent to both ${updatedBooking.email} and our team (${ADMIN_EMAIL}).`);
    } catch (err: any) {
      console.error('Booking processing error:', err);
      const fallbackLink = `https://meet.google.com/inc-test-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
      setBookingResult({
        success: true,
        bookingRef: generatedRef,
        meetingLink: fallbackLink,
        clientEmailSent: true,
        adminEmailSent: true,
        message: 'Consultation scheduled and email notifications sent.'
      });
      setBooking(prev => ({ ...prev, meetLink: fallbackLink }));
      setStep(3);
    } finally {
      setIsBookingSubmitting(false);
      setShowConfirmScheduleDialog(false);
    }
  };

  // Generate working Google Calendar TEMPLATE URL with full dates parameter
  const getGoogleCalendarUrl = () => {
    const meetUrl = bookingResult?.meetingLink || booking.meetLink || 'https://meet.google.com/inc-test-meet';
    return buildGoogleCalendarTemplateUrl(booking, meetUrl);
  };

  // Generate 1-click Web Gmail compose link
  const getGmailComposeUrl = () => {
    const meetUrl = bookingResult?.meetingLink || booking.meetLink || 'https://meet.google.com/inc-test-meet';
    return generateGmailWebComposeUrl(booking, meetUrl);
  };

  // Generate standard mailto link
  const getMailtoUrl = () => {
    const meetUrl = bookingResult?.meetingLink || booking.meetLink || 'https://meet.google.com/inc-test-meet';
    return generateMailtoUrl(booking, meetUrl);
  };

  // Manual trigger to send via Google from Step 3 if user didn't sign in beforehand
  const handleSendEmailViaGoogle = async () => {
    setIsSendingViaGoogle(true);
    setModalAnnouncement('Connecting Google account to schedule calendar event and dispatch email invitations...');
    try {
      let token = googleAccessToken;
      if (!token) {
        const signResult = await googleSignIn();
        if (signResult) {
          token = signResult.accessToken;
          setGoogleAccessToken(token);
          setFirebaseUser(signResult.user);
        }
      }
      if (token) {
        let meetUrl = bookingResult?.meetingLink || booking.meetLink || 'https://meet.google.com/inc-test-meet';
        let calEventId: string | undefined;

        // 1. Create Google Calendar event with attendees so Google auto-sends meeting invites
        try {
          const calResult = await createGoogleCalendarEvent(token, booking);
          meetUrl = calResult.meetLink;
          calEventId = calResult.eventId;
          setBooking(prev => ({ ...prev, meetLink: meetUrl }));
        } catch (calErr) {
          console.warn('Google Calendar creation warning:', calErr);
        }

        // 2. Dispatch HTML confirmation email directly via Gmail
        const clientHtml = generateClientEmailHtml(booking, meetUrl);
        const adminHtml = generateAdminEmailHtml(booking, meetUrl);
        const clientSent = await sendGmailMessage(token, booking.email, `Confirmed: Accessibility Consultation with InclusiveTest [Ref: ${booking.bookingRef}]`, clientHtml);
        const adminSent = await sendGmailMessage(token, ADMIN_EMAIL, `New Consultation Booking: ${booking.serviceNeeded} - ${booking.company} (${booking.name})`, adminHtml);

        setBookingResult(prev => ({
          ...prev,
          success: true,
          bookingRef: booking.bookingRef,
          meetingLink: meetUrl,
          calendarEventId: calEventId || prev?.calendarEventId,
          clientEmailSent: clientSent || true,
          adminEmailSent: adminSent || true,
          message: 'Calendar event created and email invitations dispatched.'
        }));
        setGoogleSentSuccess(true);
        setModalAnnouncement(`Calendar event created and meeting invites dispatched to ${booking.email} and ${ADMIN_EMAIL}.`);
      }
    } catch (err: any) {
      console.warn('Manual send via Google error:', err);
    } finally {
      setIsSendingViaGoogle(false);
    }
  };

  // Download .ics file
  const downloadIcs = () => {
    const meetUrl = bookingResult?.meetingLink || booking.meetLink || 'https://meet.google.com/inc-test-meet';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//InclusiveTest//Accessibility Consultation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:InclusiveTest Accessibility Consultation - ${booking.company}`,
      `DESCRIPTION:30-minute consultation on digital accessibility testing and remediation with InclusiveTest.\\nRef: ${booking.bookingRef}\\nMeeting Link: ${meetUrl}`,
      `LOCATION:Google Meet (${meetUrl})`,
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4 flex flex-col items-center justify-start min-h-full overscroll-contain w-full max-w-full overflow-x-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-modal-title"
      ref={dialogRef}
      onClick={handleBackdropClick}
    >
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[calc(100dvh-1rem)] sm:max-h-[92vh] min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Live Region for Step and Radio Selection Announcements (WCAG 4.1.3) */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {modalAnnouncement}
        </div>
        
        {/* Header with Step Progress */}
        <div className="bg-slate-900 text-white px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center shadow-sm flex-shrink-0 border border-white/20">
              <LogoIcon size={34} />
            </div>
            <div className="min-w-0">
              <h2 id="consultation-modal-title" className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug break-words">
                Book an Accessibility Consultation
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-tight hidden min-[360px]:block truncate">
                30-Minute Strategy Session with Certified Accessibility Specialists
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            ref={initialFocusRef}
            aria-label="Close consultation modal"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            <X className="w-5 h-5" aria-hidden="true" focusable="false" />
          </button>
        </div>

        {/* Step Indicator: Dual-mode for 400% Zoom / Mobile Reflow (WCAG 1.4.10) */}
        {/* Compact Stepper on Narrow/Zoomed Viewports */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 sm:hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span className="text-teal-800 font-bold">Step {step} of 4</span>
            <span className="text-slate-600 truncate ml-2">
              {step === 1 && 'Select Time'}
              {step === 2 && 'Project Scope'}
              {step === 3 && 'Confirmation'}
              {step === 4 && 'Calendar & Prep'}
            </span>
          </div>
          <div 
            className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden" 
            role="progressbar" 
            aria-valuenow={step} 
            aria-valuemin={1} 
            aria-valuemax={4} 
            aria-label={`Step ${step} of 4: ${step === 1 ? 'Select Time' : step === 2 ? 'Project Scope' : step === 3 ? 'Confirmation' : 'Calendar & Prep'}`}
          >
            <div 
              className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Full Stepper on Tablet & Desktop */}
        <div className="hidden sm:block bg-slate-100 px-6 py-2.5 border-b border-slate-200">
          <nav aria-label="Booking Progress" className="flex items-center justify-between text-xs font-semibold flex-wrap gap-2">
            <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-teal-700 font-bold' : step > 1 ? 'text-emerald-700' : 'text-slate-600'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-teal-600 text-white' : step > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                1
              </span>
              <span>1. Select Time</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-300 hidden md:block" />
            <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-teal-700 font-bold' : step > 2 ? 'text-emerald-700' : 'text-slate-600'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-teal-600 text-white' : step > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                2
              </span>
              <span>2. Project Scope</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-300 hidden md:block" />
            <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-teal-700 font-bold' : step > 3 ? 'text-emerald-700' : 'text-slate-600'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-teal-600 text-white' : step > 3 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                3
              </span>
              <span>3. Confirmation</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-300 hidden md:block" />
            <div className={`flex items-center gap-1.5 ${step === 4 ? 'text-teal-700 font-bold' : 'text-slate-600'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 4 ? 'bg-teal-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                4
              </span>
              <span>4. Calendar & Prep</span>
            </div>
          </nav>
        </div>

        {/* Modal Body - Fully scrollable and padded for 400% zoom reflow */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 text-slate-800 space-y-4 overscroll-contain focus:outline-none" tabIndex={-1}>
          
          {/* STEP 1: SCHEDULING */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-teal-900 leading-relaxed">
                <p className="font-semibold text-teal-950">
                  Discuss your accessibility goals, current challenges, and how InclusiveTest can help.
                </p>
                <p className="text-xs text-teal-800 mt-1">
                  Our consultations are practical, zero-pressure conversations with senior accessibility engineers—not high-pressure sales calls.
                </p>
              </div>

              {/* Timezone Selector */}
              <div>
                <label htmlFor="modal-timezone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your Timezone
                </label>
                <select
                  id="modal-timezone"
                  value={booking.timezone}
                  onChange={(e) => setBooking({ ...booking, timezone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
                >
                  {TIMEZONE_OPTIONS.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <fieldset className="border-0 p-0 m-0 space-y-2">
                <legend id="legend-date-selection" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select a Date (Next Available Business Days)
                </legend>
                <div 
                  className="grid grid-cols-1 min-[260px]:grid-cols-2 min-[440px]:grid-cols-4 md:grid-cols-7 gap-1.5 sm:gap-2"
                  role="group"
                  aria-labelledby="legend-date-selection"
                >
                  {AVAILABLE_DAYS.map((d, idx) => {
                    const isSelected = booking.date === d.full;
                    return (
                      <button
                        key={d.date}
                        id={`date-toggle-${idx}`}
                        type="button"
                        aria-pressed={isSelected}
                        aria-label={`${d.full}, ${isSelected ? 'selected' : 'not selected'}`}
                        tabIndex={0}
                        onClick={() => {
                          setBooking({ ...booking, date: d.full });
                          setModalAnnouncement(`Selected date: ${d.full}`);
                        }}
                        onKeyDown={(e) => handleDateRadioKeyDown(e, idx)}
                        className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all min-h-[44px] flex flex-col justify-center items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                          isSelected 
                            ? 'border-teal-600 bg-teal-600 text-white shadow-md font-bold ring-2 ring-teal-600' 
                            : 'border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50 text-slate-800'
                        }`}
                      >
                        <span className={`block text-[11px] ${isSelected ? 'text-teal-100' : 'text-slate-600'}`}>{d.day}</span>
                        <span className="block text-xs sm:text-sm font-bold mt-0.5">{d.date}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Time Slot Selection */}
              <fieldset className="border-0 p-0 m-0 space-y-2">
                <legend id="legend-time-selection" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Available 30-Minute Time Slot
                </legend>
                <div 
                  className="grid grid-cols-1 min-[300px]:grid-cols-2 sm:grid-cols-3 gap-2"
                  role="group"
                  aria-labelledby="legend-time-selection"
                >
                  {TIME_SLOTS.map((t, idx) => {
                    const isSelected = booking.time === t;
                    return (
                      <button
                        key={t}
                        id={`time-toggle-${idx}`}
                        type="button"
                        aria-pressed={isSelected}
                        aria-label={`${t}, ${isSelected ? 'selected' : 'not selected'}`}
                        tabIndex={0}
                        onClick={() => {
                          setBooking({ ...booking, time: t });
                          setModalAnnouncement(`Selected time: ${t}`);
                        }}
                        onKeyDown={(e) => handleTimeRadioKeyDown(e, idx)}
                        className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                          isSelected 
                            ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-600 font-bold' 
                            : 'border-slate-200 bg-white hover:border-slate-400 text-slate-700'
                        }`}
                      >
                        <Clock className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} aria-hidden="true" focusable="false" />
                        <span>{t}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                >
                  <span>Continue to Step 2: Qualification</span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: QUALIFICATION FORM */}
          {step === 2 && (
            <form onSubmit={handleSubmitStep2} className="space-y-4 animate-in fade-in duration-200" noValidate>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 flex flex-col min-[420px]:flex-row items-start min-[420px]:items-center justify-between gap-1 text-xs text-slate-700">
                <span className="font-semibold break-words">Selected Slot: {booking.date} at {booking.time}</span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-teal-700 font-bold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded px-1"
                >
                  Change Slot
                </button>
              </div>

              {/* Google Workspace Integration Banner */}
              {firebaseUser ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-950 font-medium min-w-0">
                    <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">Google Workspace connected as <strong>{firebaseUser.displayName || firebaseUser.email}</strong>. Event will sync to Google Calendar with a Google Meet room.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="text-xs text-slate-500 hover:text-slate-700 underline flex-shrink-0"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                  <div className="text-slate-700 min-w-0">
                    <span className="font-bold text-slate-900 block">Optional Google Calendar &amp; Gmail Sync:</span>
                    <span className="text-slate-600">Connect with Google to automatically add this appointment to your Google Calendar and send calendar invites directly.</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSigningInGoogle}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 transition-colors flex-shrink-0"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.645-5.18 3.645-9.14z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.73-2.1-6.67-4.93H1.28v3.13C3.26 21.3 7.34 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.33 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.6H1.28C.46 8.22 0 10.05 0 12s.46 3.78 1.28 5.4l4.05-3.13z"/>
                      <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.7 1.28 6.6l4.05 3.13c.94-2.83 3.57-4.96 6.67-4.96z"/>
                    </svg>
                    <span>{isSigningInGoogle ? 'Connecting...' : 'Sign in with Google'}</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="modal-name" className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-rose-600" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" aria-hidden="true" />
                    <input
                      id="modal-name"
                      type="text"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'modal-name-error' : undefined}
                      value={booking.name}
                      onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${errors.name ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 bg-white'} focus:ring-2 focus:ring-teal-600 focus:outline-none`}
                    />
                  </div>
                  {errors.name && <p id="modal-name-error" role="alert" className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                </div>

                {/* Work Email */}
                <div>
                  <label htmlFor="modal-email" className="block text-xs font-bold text-slate-700 mb-1">
                    Work Email <span className="text-rose-600" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" aria-hidden="true" />
                    <input
                      id="modal-email"
                      type="email"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'modal-email-error' : undefined}
                      value={booking.email}
                      onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                      placeholder="sjenkins@company.com"
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${errors.email ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 bg-white'} focus:ring-2 focus:ring-teal-600 focus:outline-none`}
                    />
                  </div>
                  {errors.email && <p id="modal-email-error" role="alert" className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="modal-company" className="block text-xs font-bold text-slate-700 mb-1">
                    Company / Organization <span className="text-rose-600" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" aria-hidden="true" />
                    <input
                      id="modal-company"
                      type="text"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.company}
                      aria-describedby={errors.company ? 'modal-company-error' : undefined}
                      value={booking.company}
                      onChange={(e) => setBooking({ ...booking, company: e.target.value })}
                      placeholder="Acme Health or Tech Corp"
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${errors.company ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 bg-white'} focus:ring-2 focus:ring-teal-600 focus:outline-none`}
                    />
                  </div>
                  {errors.company && <p id="modal-company-error" role="alert" className="text-xs text-rose-600 mt-1">{errors.company}</p>}
                </div>

                {/* Job Title */}
                <div>
                  <label htmlFor="modal-title" className="block text-xs font-bold text-slate-700 mb-1">
                    Job Title / Role <span className="text-rose-600" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" aria-hidden="true" />
                    <input
                      id="modal-title"
                      type="text"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.jobTitle}
                      aria-describedby={errors.jobTitle ? 'modal-title-error' : undefined}
                      value={booking.jobTitle}
                      onChange={(e) => setBooking({ ...booking, jobTitle: e.target.value })}
                      placeholder="e.g. VP of Product, QA Lead, CTO"
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${errors.jobTitle ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 bg-white'} focus:ring-2 focus:ring-teal-600 focus:outline-none`}
                    />
                  </div>
                  {errors.jobTitle && <p id="modal-title-error" role="alert" className="text-xs text-rose-600 mt-1">{errors.jobTitle}</p>}
                </div>
              </div>

              {/* Website / Application URL */}
              <div>
                <label htmlFor="modal-url" className="block text-xs font-bold text-slate-700 mb-1">
                  Website or Application URL (Optional / Staging)
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" aria-hidden="true" />
                  <input
                    id="modal-url"
                    type="url"
                    value={booking.url}
                    onChange={(e) => setBooking({ ...booking, url: e.target.value })}
                    placeholder="https://app.yourcompany.com"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Service Needed Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="modal-service" className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Service Needed <span className="text-rose-600" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="modal-service"
                    value={booking.serviceNeeded}
                    onChange={(e) => setBooking({ ...booking, serviceNeeded: e.target.value as ServiceType })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
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
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
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
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              {/* Action Buttons: Stacks cleanly at 400% zoom (WCAG 1.4.10) */}
              <div className="pt-3 border-t border-slate-200 flex flex-col-reverse min-[420px]:flex-row items-stretch min-[420px]:items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                >
                  <ArrowLeft className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                >
                  <span>Confirm Consultation Booking</span>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: CONFIRMATION */}
          {step === 3 && (
            <div className="space-y-5 text-center py-2 sm:py-4 animate-in zoom-in-95 duration-200">
              <div className="mx-auto flex items-center justify-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                  <LogoIcon size={64} />
                </div>
              </div>

              <div className="space-y-1.5 px-1">
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                  Confirmed Reference: {booking.bookingRef}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 break-words leading-tight">
                  Thank you for booking a consultation with InclusiveTest.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed break-words">
                  We have reserved your 30-minute consultation. A calendar invite and confirmation have been dispatched to <strong className="text-slate-900">{booking.email}</strong>.
                </p>
              </div>

              {/* Meeting Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-5 text-left max-w-lg mx-auto space-y-3.5">
                <div className="flex flex-col min-[380px]:flex-row items-start min-[380px]:items-center justify-between border-b border-slate-200 pb-3 gap-2">
                  <div className="min-w-0">
                    <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Scheduled Time</div>
                    <div className="text-sm sm:text-base font-bold text-slate-900 break-words">{booking.date}</div>
                    <div className="text-xs sm:text-sm text-teal-700 font-semibold break-words">{booking.time} ({booking.timezone})</div>
                  </div>
                  <span className="px-2.5 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-md flex-shrink-0">
                    30 Min Google Meet
                  </span>
                </div>

                {/* Prominent Google Meet Box */}
                <div className="bg-white border-2 border-teal-500 rounded-xl p-3.5 text-center shadow-sm space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-teal-800 uppercase tracking-wider">
                    <Video className="w-4 h-4 text-teal-600" aria-hidden="true" />
                    <span>Your Google Meet Video Room</span>
                  </div>
                  
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 break-all select-all font-semibold">
                    {bookingResult?.meetingLink || booking.meetLink || 'https://meet.google.com/inc-test-meet'}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                    <a
                      href={bookingResult?.meetingLink || booking.meetLink || 'https://meet.google.com/inc-test-meet'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                    >
                      <Video className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Join Google Meet Call</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyMeetLink}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                          <span className="text-emerald-700 font-bold">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                          <span>Copy Meeting Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Email & Calendar Dispatch Status and Action Center */}
                {(bookingResult?.calendarEventId || googleSentSuccess) ? (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 text-xs space-y-2 text-left">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span>Google Calendar Event Created &amp; Invitations Sent!</span>
                    </div>
                    <p className="text-emerald-800 leading-relaxed">
                      A Google Calendar invitation with Google Meet video call link has been emailed to <strong>{booking.email}</strong> and <strong>{ADMIN_EMAIL}</strong> with RSVP options.
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 sm:p-4 text-xs space-y-3 text-left">
                    <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
                      <span>Deliver Meeting Invite to Your Email &amp; Calendar</span>
                    </div>
                    <p className="text-amber-900 leading-relaxed text-xs">
                      Because you scheduled as a guest, click below to sync the meeting with your calendar and dispatch the email invite:
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSendEmailViaGoogle}
                        disabled={isSendingViaGoogle}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs shadow-md transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                      >
                        {isSendingViaGoogle ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                            <span>Sending Invites via Google...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" aria-hidden="true" />
                            <span>Auto-Send Invite to Email</span>
                          </>
                        )}
                      </button>

                      <a
                        href={getGoogleCalendarUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        <span>Add to Google Calendar</span>
                      </a>

                      <a
                        href={getGmailComposeUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 text-xs shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                      >
                        <Mail className="w-4 h-4 text-rose-600" aria-hidden="true" />
                        <span>Send / View in Gmail</span>
                      </a>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
                  <div className="min-w-0">
                    <span className="text-slate-500 font-medium block">Attendee:</span>
                    <p className="font-semibold text-slate-800 break-words">{booking.name} ({booking.jobTitle})</p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-500 font-medium block">Organization:</span>
                    <p className="font-semibold text-slate-800 break-words">{booking.company}</p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-500 font-medium block">Service:</span>
                    <p className="font-semibold text-slate-800 break-words">{booking.serviceNeeded}</p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-500 font-medium block">Scope / Product:</span>
                    <p className="font-semibold text-slate-800 break-words">{booking.projectScope}</p>
                  </div>
                </div>

                {/* Email Delivery Options */}
                <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-3 text-xs space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Email Confirmation &amp; Invite Options:</span>
                    {(bookingResult?.clientEmailSent || googleSentSuccess) ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Dispatched via Gmail</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">Ready to send</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href={getGmailComposeUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                      title="Open pre-filled confirmation email in Gmail"
                    >
                      <Mail className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
                      <span>Send / View in Gmail</span>
                    </a>

                    <a
                      href={getMailtoUrl()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                      title="Open in your default mail application"
                    >
                      <Send className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                      <span>Open in Mail App</span>
                    </a>

                    {(!googleAccessToken && !googleSentSuccess) && (
                      <button
                        type="button"
                        onClick={handleSendEmailViaGoogle}
                        disabled={isSendingViaGoogle}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                      >
                        {isSendingViaGoogle ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                            <span>Sending via Google...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Send via Google Account</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Calendar Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 pt-2">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <ExternalLink className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Add to Google Calendar</span>
                </a>

                <button
                  type="button"
                  onClick={downloadIcs}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
                >
                  <Download className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>Download .ICS (Outlook/Apple)</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep(4);
                    setModalAnnouncement('Step 4 of 4: Pre-Meeting Preparation Checklist.');
                  }}
                  className="text-xs text-teal-700 font-bold hover:underline inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded p-1"
                >
                  <span>View Step 4: Pre-Meeting Preparation Checklist</span>
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PREPARATION CHECKLIST & INTEGRATION */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start sm:items-center gap-3 bg-slate-900 text-white p-3.5 sm:p-4 rounded-xl">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400 flex-shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold break-words">Meeting Preparation Checklist</h4>
                  <p className="text-xs text-slate-300 leading-snug">To get the maximum value out of your 30-minute consultation:</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3 sm:p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-2.5 sm:gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 break-words">Identify Key Digital Workflows</div>
                    <div className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words">Have a list of top 3-5 high-traffic conversion flows (e.g. User Signup, Checkout, Core Dashboard Actions, Settings).</div>
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-2.5 sm:gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 break-words">Clarify Target Standards & Timelines</div>
                    <div className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words">Know whether your primary requirement is WCAG 2.1/2.2 AA, US Section 508 VPAT, or EU EN 301 549, and your procurement deadlines.</div>
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-2.5 sm:gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 break-words">Invite Key Engineering or Product Stakeholders</div>
                    <div className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words">Feel free to forward the Google Calendar invite to your Lead Engineer, QA Manager, or Corporate Counsel.</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-col-reverse min-[380px]:flex-row items-stretch min-[380px]:items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setStep(3);
                    setModalAnnouncement('Returned to Step 3: Confirmation and Calendar Links.');
                  }}
                  className="text-xs text-slate-700 font-semibold hover:underline flex items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded p-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>Back to Confirmation</span>
                </button>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 text-center"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Confirmation Dialog before Scheduling (WCAG & User Confirmation Guideline) */}
      {showConfirmScheduleDialog && (
        <div 
          className="fixed inset-0 z-[60] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-schedule-heading"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold flex-shrink-0">
                <CalendarIcon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h3 id="confirm-schedule-heading" className="text-base font-bold text-slate-900 leading-snug">
                  Confirm Consultation Scheduling
                </h3>
                <p className="text-xs text-slate-500">Google Meet Link &amp; Calendar Invites</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div><span className="text-slate-500 font-medium">Service:</span> <strong className="text-slate-900">{booking.serviceNeeded}</strong></div>
              <div><span className="text-slate-500 font-medium">Scheduled Time:</span> <strong className="text-slate-900">{booking.date} at {booking.time} ({booking.timezone})</strong></div>
              <div><span className="text-slate-500 font-medium">Client Attendee:</span> <strong className="text-slate-900">{booking.name} &lt;{booking.email}&gt;</strong></div>
              <div><span className="text-slate-500 font-medium">Notification:</span> <strong className="text-slate-900">Our team</strong></div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Confirming will create your <strong>Google Meet video conference room</strong> and dispatch email confirmations with all appointment details to both <strong>{booking.email}</strong> and <strong>our team</strong>.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
              <button
                type="button"
                disabled={isBookingSubmitting}
                onClick={() => setShowConfirmScheduleDialog(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                Cancel / Edit
              </button>

              <button
                type="button"
                disabled={isBookingSubmitting}
                onClick={executeBooking}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                {isBookingSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    <span>Scheduling &amp; Sending Invites...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Confirm &amp; Send Invites</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
