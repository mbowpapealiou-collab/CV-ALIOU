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

export default function App() {
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar onOpenContact={scrollToContact} />

      {/* Main Content Sections */}
      <main>
        <Hero
          onOpenContact={scrollToContact}
          onDownloadCV={() => setIsCVModalOpen(true)}
        />
        <About />
        <Skills />
        <Projects />
        <ContactForm />
      </main>

      {/* Footer */}
      <Footer />

      {/* CV Modal Preview & Print */}
      <CVModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
      />
    </div>
  );
}

