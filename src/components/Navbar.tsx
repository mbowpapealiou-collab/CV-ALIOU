import React, { useState, useEffect } from 'react';
import { Menu, X, Send, Linkedin, MessageSquare } from 'lucide-react';
import { usePortfolioContent } from '../utils/contentStorage';
import { useProfilePhoto } from '../utils/photoStorage';

interface NavbarProps {
  onOpenContact: () => void;
  onOpenWhatsApp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenContact, 
  onOpenWhatsApp,
}) => {
  const { personalInfo } = usePortfolioContent();
  const { photoUrl } = useProfilePhoto();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Strip any hash from the URL to keep the address bar clean (e.g. www.cvaliou.com without /#hero)
    if (window.location.hash && window.location.hash !== '#admin') {
      window.history.replaceState(null, '', window.location.pathname);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    // Keep the address bar clean without /#hero or hash suffix
    if (window.location.hash && window.location.hash !== '#admin') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const navLinks = [
    { name: 'Accueil', targetId: 'hero' },
    { name: 'Profil', targetId: 'about' },
    { name: 'Compétences', targetId: 'skills' },
    { name: 'Projets Drive', targetId: 'projects' },
    { name: 'Contact', targetId: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand with photo */}
        <a 
          href="#hero" 
          onClick={(e) => handleNavClick(e, 'hero')}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="relative">
            <img
              src={photoUrl}
              alt="Aliou Mbow"
              className="w-11 h-11 rounded-full object-cover object-top ring-2 ring-orange-500/80 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Disponible" />
          </div>
          <div>
            <span className="font-semibold text-slate-100 text-lg tracking-tight block group-hover:text-orange-300 transition-colors">
              {personalInfo.name}
            </span>
            <span className="text-xs text-amber-400 font-medium tracking-wide block">
              Management & Marketing Digital
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1.5 rounded-full border border-slate-700/60 backdrop-blur-sm">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={(e) => handleNavClick(e, link.targetId)}
              className="px-3.5 py-1.5 text-xs lg:text-sm text-slate-300 hover:text-orange-400 hover:bg-slate-700/50 rounded-full transition-colors font-medium cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-2.5">
          {onOpenWhatsApp && (
            <button
              onClick={onOpenWhatsApp}
              className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium border border-emerald-500/20 cursor-pointer"
              title="Téléphone & WhatsApp : +221 78 333 31 75"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          )}

          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-300 hover:text-orange-400 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4 text-orange-400" />
            <span>LinkedIn</span>
          </a>

          <button
            onClick={onOpenContact}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-lg shadow-md shadow-orange-500/25 transition-all hover:shadow-orange-500/40 cursor-pointer active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Me Contacter</span>
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          {onOpenWhatsApp && (
            <button
              onClick={onOpenWhatsApp}
              className="p-2 text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
              title="WhatsApp"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white bg-slate-800/60 rounded-lg border border-slate-700"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/98 backdrop-blur-md border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={(e) => handleNavClick(e, link.targetId)}
                className="w-full text-left px-3 py-2 text-slate-200 hover:text-orange-400 hover:bg-slate-800 rounded-lg text-base font-medium cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {onOpenWhatsApp && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWhatsApp();
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp : +221 78 333 31 75</span>
              </button>
            )}
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-200 bg-slate-800 rounded-lg"
            >
              <Linkedin className="w-4 h-4 text-orange-400" />
              <span>Profil LinkedIn</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Me Contacter</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};



