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

export default function App() {
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [driveFolderId, setDriveFolderId] = useState<string | undefined>(undefined);

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
      {/* Navigation Header */}
      <Navbar
        onOpenContact={scrollToContact}
        onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        <Hero
          onOpenContact={scrollToContact}
          onDownloadCV={() => setIsCVModalOpen(true)}
          onOpenDrive={() => handleOpenDriveModal()}
          onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
        />
        <About />
        <Skills />
        <Projects onOpenDriveModal={handleOpenDriveModal} />
        <ContactForm onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)} />
      </main>

      {/* Footer */}
      <Footer />

      {/* CV Modal Preview & Print */}
      <CVModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
        onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
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
    </div>
  );
}

