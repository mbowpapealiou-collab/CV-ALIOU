import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, Send, Github, Linkedin, Mail } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

interface NavbarProps {
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '#hero' },
    { name: 'À propos', href: '#about' },
    { name: 'Compétences', href: '#skills' },
    { name: 'Projets', href: '#projects' },
    { name: 'Expériences', href: '#experience' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            AM
          </div>
          <div>
            <span className="font-semibold text-slate-100 text-lg tracking-tight block">
              {personalInfo.name}
            </span>
            <span className="text-xs text-blue-400 font-mono tracking-wide block">
              Full Stack Dev
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/40 p-1.5 rounded-full border border-slate-700/60 backdrop-blur-sm">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-full transition-colors font-medium"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <button
            onClick={onOpenContact}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-500/30 transition-all hover:shadow-blue-500/50"
          >
            <Send className="w-4 h-4" />
            <span>Me Contacter</span>
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
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
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-slate-200 hover:bg-slate-800 rounded-lg text-base font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm"
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
