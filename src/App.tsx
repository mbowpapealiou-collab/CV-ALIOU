/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  const [adminInitialTab, setAdminInitialTab] = useState<'photos' | 'projects' | 'experiences' | 'profile' | 'education' | 'drive' | 'security'>('photos');
  const [driveFolderId, setDriveFolderId] = useState<string | undefined>(undefined);

  const handleOpenAdmin = (tab?: 'photos' | 'projects' | 'experiences' | 'profile' | 'education' | 'drive' | 'security') => {
    if (tab) {
      setAdminInitialTab(tab);
    } else {
      setAdminInitialTab('photos');
    }
    setIsAdminModalOpen(true);
  };

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aliou_is_admin') === 'true';
    } catch {
      return false;
    }
  });

  // Secret URL listener for Aliou Mbow (#admin or /admin) and keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const checkSecretAdmin = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        hash === '#admin' ||
        hash === '#/admin' ||
        hash.includes('admin') ||
        search.includes('admin') ||
        path.endsWith('/admin')
      ) {
        setIsAdminModalOpen(true);
        // Clear secret trigger from the address bar to keep it confidential
        if (window.history.replaceState) {
          const cleanUrl = window.location.pathname + (window.location.search.replace(/[?&]admin[=1]?/gi, ''));
          window.history.replaceState(null, '', cleanUrl || '/');
        } else {
          window.location.hash = '';
        }
      }
    };

    // Check on initial load
    checkSecretAdmin();

    // Listen to hash changes (e.g. if the user appends #admin in the URL)
    window.addEventListener('hashchange', checkSecretAdmin);

    // Discreet shortcut (Ctrl+Shift+A or Cmd+Shift+A or Alt+A) for owner convenience
    const handleKeyDown = (e: KeyboardEvent) => {
      const isKeyA = e.key === 'A' || e.key === 'a' || e.code === 'KeyA';
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if ((isCtrlOrCmd && e.shiftKey && isKeyA) || (e.altKey && isKeyA)) {
        e.preventDefault();
        e.stopPropagation();
        setIsAdminModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('hashchange', checkSecretAdmin);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-slate-950">
      {/* Navigation Header with hashless smooth scroll & admin indicator */}
      <Navbar
        onOpenContact={scrollToContact}
        onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
        isAdmin={isAdmin}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Content Sections — Fully visible to all visitors as originally intended */}
      <main>
        <Hero
          onOpenContact={scrollToContact}
          onDownloadCV={() => setIsCVModalOpen(true)}
          onOpenDrive={() => handleOpenDriveModal()}
          onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
          isAdmin={isAdmin}
          onOpenAdmin={handleOpenAdmin}
        />
        <About />
        <Skills />
        <Projects
          onOpenDriveModal={handleOpenDriveModal}
          isAdmin={isAdmin}
          onOpenAdmin={handleOpenAdmin}
        />
        <ContactForm onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)} />
      </main>

      {/* Footer with discreet admin access */}
      <Footer
        isAdmin={isAdmin}
        onOpenAdmin={handleOpenAdmin}
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
        initialTab={adminInitialTab}
      />
    </div>
  );
}

