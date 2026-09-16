/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { CVModal } from './components/CVModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { DriveExplorerModal } from './components/DriveExplorerModal';
import { AdminModal } from './components/AdminModal';

export default function App() {
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [driveFolderId, setDriveFolderId] = useState<string | undefined>(undefined);

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aliou_is_admin') === 'true';
    } catch {
      return false;
    }
  });

  const handleAdminLogin = () => {
    setIsAdmin(true);
    try {
      localStorage.setItem('aliou_is_admin', 'true');
    } catch {
      // ignore
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('aliou_is_admin');
    } catch {
      // ignore
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenDriveModal = (folderId?: string) => {
    setDriveFolderId(folderId);
    setIsDriveModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Header with hashless smooth scroll & admin indicator */}
      <Navbar
        onOpenContact={scrollToContact}
        onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
        isAdmin={isAdmin}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Sections — Fully visible to all visitors as originally intended */}
      <main>
        <Hero
          onOpenContact={scrollToContact}
          onDownloadCV={() => setIsCVModalOpen(true)}
          onOpenDrive={() => handleOpenDriveModal()}
          onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
          isAdmin={isAdmin}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />
        <About />
        <Skills />
        <Projects
          onOpenDriveModal={handleOpenDriveModal}
          isAdmin={isAdmin}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />
        <ContactForm onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)} />
      </main>

      {/* Footer with discreet admin access */}
      <Footer
        isAdmin={isAdmin}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* CV Modal Preview & Print */}
      <CVModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
        onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
        isAdmin={isAdmin}
      />

      {/* WhatsApp and Phone Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />

      {/* Google Drive Projects Explorer Modal */}
      <DriveExplorerModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        initialFolderId={driveFolderId}
      />

      {/* Exclusive Administrator Modal for Aliou Mbow */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdmin}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
      />
    </div>
  );
}

