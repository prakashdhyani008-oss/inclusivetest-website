import React, { useState, useEffect } from 'react';
import { PageView, ServiceType } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ContactPage } from './pages/ContactPage';
import { ReportPreviewPage } from './pages/ReportPreviewPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [selectedServiceForConsultation, setSelectedServiceForConsultation] = useState<ServiceType>('Accessibility Audit');
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Synchronize High Contrast mode with document root and body (WCAG AAA & 1.4.11)
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
      document.body.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
      document.body.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  // Synchronize Text Spacing & Sizing mode with document root and body (WCAG 1.4.12 & 1.4.4)
  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add('text-spacing-mode');
      document.body.classList.add('text-spacing-mode');
    } else {
      document.documentElement.classList.remove('text-spacing-mode');
      document.body.classList.remove('text-spacing-mode');
    }
  }, [largeText]);

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Announce page changes to screen readers (WCAG 4.1.3)
    const titles: Record<PageView, string> = {
      'home': 'Home — InclusiveTest Accessibility Consulting',
      'services': 'Services Overview — InclusiveTest',
      'audits': 'Accessibility Audits — InclusiveTest',
      'remediation': 'Remediation Support — InclusiveTest',
      'vpat': 'VPAT & Accessibility Conformance Reporting — InclusiveTest',
      'legal': 'Legal Accessibility Guidance — InclusiveTest',
      'about': 'About Us — InclusiveTest',
      'resources': 'Accessibility Resources & Knowledge Base — InclusiveTest',
      'contact': 'Contact & Inquiries — InclusiveTest',
      'report-preview': 'Live Sample Accessibility Report — InclusiveTest'
    };
    const newTitle = titles[page] || 'InclusiveTest';
    document.title = newTitle;
    setAnnouncement(`Navigated to ${newTitle}`);
  };

  const handleOpenConsultation = (trigger?: React.MouseEvent | HTMLElement) => {
    let targetEl: HTMLElement | null = null;
    if (trigger && 'currentTarget' in trigger && trigger.currentTarget instanceof HTMLElement) {
      targetEl = trigger.currentTarget;
    } else if (trigger && 'target' in trigger && trigger.target instanceof HTMLElement) {
      targetEl = (trigger.target as HTMLElement).closest('button, a') || (trigger.target as HTMLElement);
    } else if (trigger instanceof HTMLElement) {
      targetEl = trigger;
    } else if (document.activeElement instanceof HTMLElement) {
      targetEl = document.activeElement;
    }
    setTriggerElement(targetEl);
    setConsultationModalOpen(true);
  };

  const handleOpenConsultationWithService = (service: ServiceType, trigger?: React.MouseEvent | HTMLElement) => {
    let targetEl: HTMLElement | null = null;
    if (trigger && 'currentTarget' in trigger && trigger.currentTarget instanceof HTMLElement) {
      targetEl = trigger.currentTarget;
    } else if (trigger && 'target' in trigger && trigger.target instanceof HTMLElement) {
      targetEl = (trigger.target as HTMLElement).closest('button, a') || (trigger.target as HTMLElement);
    } else if (trigger instanceof HTMLElement) {
      targetEl = trigger;
    } else if (document.activeElement instanceof HTMLElement) {
      targetEl = document.activeElement;
    }
    setTriggerElement(targetEl);
    setSelectedServiceForConsultation(service);
    setConsultationModalOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-150 ${
      highContrast ? 'bg-black text-white high-contrast-mode' : 'bg-slate-50 text-slate-900'
    } ${largeText ? 'text-lg text-spacing-mode' : 'text-base'}`}>
      
      {/* ARIA Live Region for Screen Reader Page Transitions */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Main Page Content - Made inert when modal dialog is open (WCAG 2.4.3 & aria-modal) */}
      <div 
        className="flex-1 flex flex-col"
        inert={consultationModalOpen ? true : undefined}
        aria-hidden={consultationModalOpen}
      >
        {/* Primary Accessible Navigation Bar */}
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenConsultation={handleOpenConsultation}
          highContrast={highContrast}
          onToggleHighContrast={() => setHighContrast(!highContrast)}
          largeText={largeText}
          onToggleLargeText={() => setLargeText(!largeText)}
        />

        {/* Main Content Landmark with Unique ID for Skip Link (WCAG 2.4.1) */}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {currentPage === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onOpenConsultation={handleOpenConsultation}
              onBookWithService={handleOpenConsultationWithService}
            />
          )}

          {(currentPage === 'services' || currentPage === 'audits' || currentPage === 'remediation' || currentPage === 'vpat' || currentPage === 'legal') && (
            <ServicesPage
              initialServiceId={currentPage === 'services' ? undefined : currentPage}
              onNavigate={handleNavigate}
              onOpenConsultation={handleOpenConsultation}
              onBookWithService={handleOpenConsultationWithService}
            />
          )}

          {currentPage === 'about' && (
            <AboutPage
              onNavigate={handleNavigate}
              onOpenConsultation={handleOpenConsultation}
            />
          )}

          {currentPage === 'resources' && (
            <ResourcesPage
              onNavigate={handleNavigate}
              onOpenConsultation={handleOpenConsultation}
            />
          )}

          {currentPage === 'contact' && (
            <ContactPage
              onNavigate={handleNavigate}
              onOpenConsultation={handleOpenConsultation}
            />
          )}

          {currentPage === 'report-preview' && (
            <ReportPreviewPage
              onNavigate={handleNavigate}
              onOpenConsultation={handleOpenConsultation}
            />
          )}
        </main>

        {/* Accessible Footer */}
        <Footer
          onNavigate={handleNavigate}
          onOpenConsultation={handleOpenConsultation}
        />
      </div>

      {/* Integrated 4-Step Consultation Booking Experience */}
      <ConsultationModal
        isOpen={consultationModalOpen}
        onClose={() => setConsultationModalOpen(false)}
        initialService={selectedServiceForConsultation}
        triggerElement={triggerElement}
      />

    </div>
  );
}
