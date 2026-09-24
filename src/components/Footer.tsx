import React from 'react';
import { ArrowUp, Linkedin, Mail, HardDrive, Phone, Shield, Camera } from 'lucide-react';
import { usePortfolioContent } from '../utils/contentStorage';
import { useProfilePhoto } from '../utils/photoStorage';

interface FooterProps {
  isAdmin?: boolean;
  onOpenAdmin?: (tab?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ isAdmin, onOpenAdmin }) => {
  const { personalInfo } = usePortfolioContent();
  const { photoUrl } = useProfilePhoto();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash && window.location.hash !== '#admin') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Name with synchronized photo */}
          <div className="flex items-center gap-3">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Aliou Mbow"
                className="w-10 h-10 rounded-full object-cover object-top border-2 border-orange-500/60 shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 shadow-sm flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <span className="text-[11px] font-black text-amber-400">AM</span>
                </div>
              </div>
            )}
            <div>
              <span className="text-white font-semibold block text-sm">
                {personalInfo.name}
              </span>
              <span className="text-xs text-amber-400/90 block">
                {personalInfo.role}
              </span>
            </div>
          </div>

          {/* Copyright & Discreet Admin Access for Aliou */}
          <div className="text-xs text-slate-500 text-center flex flex-col items-center justify-center gap-1.5">
            <span>© {new Date().getFullYear()} {personalInfo.name}. Management Informatisé des Organisations.</span>
            {onOpenAdmin && (
              <button
                onClick={() => onOpenAdmin('photos')}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-orange-400 transition-colors cursor-pointer py-0.5 px-2 rounded hover:bg-slate-900 text-[11px]"
                title="Espace Administrateur (Gestion des photos & contenus)"
              >
                <Shield className="w-3 h-3 text-orange-500/70" />
                <span>Espace Admin</span>
              </button>
            )}
          </div>

          {/* Socials & Back to top */}
          <div className="flex items-center gap-3">
            <a
              href={personalInfo.googleDriveProjectsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-orange-400 border border-slate-800 transition-colors"
              title="Google Drive Projets"
            >
              <HardDrive className="w-4 h-4" />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-orange-400 border border-slate-800 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/221783333175"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors"
              title="WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-orange-400 border border-slate-800 transition-colors"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-orange-400 border border-slate-800 transition-colors ml-2 cursor-pointer"
              title="Retour en haut"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};

