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
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [announcement, setAnnouncement] = useState('');

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

  const handleOpenConsultationWithService = (service: ServiceType) => {
    setSelectedServiceForConsultation(service);
    setConsultationModalOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-150 ${
      highContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
    } ${largeText ? 'text-lg' : 'text-base'}`}>
      
      {/* ARIA Live Region for Screen Reader Page Transitions */}
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      {/* Primary Accessible Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenConsultation={() => setConsultationModalOpen(true)}
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
            onOpenConsultation={() => setConsultationModalOpen(true)}
            onBookWithService={handleOpenConsultationWithService}
          />
        )}

        {(currentPage === 'services' || currentPage === 'audits' || currentPage === 'remediation' || currentPage === 'vpat' || currentPage === 'legal') && (
          <ServicesPage
            initialServiceId={currentPage === 'services' ? undefined : currentPage}
            onNavigate={handleNavigate}
            onOpenConsultation={() => setConsultationModalOpen(true)}
            onBookWithService={handleOpenConsultationWithService}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            onOpenConsultation={() => setConsultationModalOpen(true)}
          />
        )}

        {currentPage === 'resources' && (
          <ResourcesPage
            onNavigate={handleNavigate}
            onOpenConsultation={() => setConsultationModalOpen(true)}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onNavigate={handleNavigate}
            onOpenConsultation={() => setConsultationModalOpen(true)}
          />
        )}

        {currentPage === 'report-preview' && (
          <ReportPreviewPage
            onNavigate={handleNavigate}
            onOpenConsultation={() => setConsultationModalOpen(true)}
          />
        )}
      </main>

      {/* Accessible Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenConsultation={() => setConsultationModalOpen(true)}
      />

      {/* Integrated 4-Step Consultation Booking Experience */}
      <ConsultationModal
        isOpen={consultationModalOpen}
        onClose={() => setConsultationModalOpen(false)}
        initialService={selectedServiceForConsultation}
      />

    </div>
  );
}
