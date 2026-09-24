import React from 'react';
import { Download, CheckCircle, MapPin, Briefcase, HardDrive, MessageSquare, Camera, Sparkles } from 'lucide-react';
import { usePortfolioContent } from '../utils/contentStorage';
import { useProfilePhoto } from '../utils/photoStorage';

interface HeroProps {
  onOpenContact: () => void;
  onDownloadCV: () => void;
  onOpenDrive?: () => void;
  onOpenWhatsApp?: () => void;
  isAdmin?: boolean;
  onOpenAdmin?: (tab?: any) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenContact,
  onDownloadCV,
  onOpenDrive,
  onOpenWhatsApp,
  isAdmin,
  onOpenAdmin,
}) => {
  const { personalInfo } = usePortfolioContent();
  const { photoUrl } = useProfilePhoto();

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background warm orange & amber mesh gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Left Column: Text & CTAs */}
          <div className="flex-1 text-center lg:text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 mb-6 text-xs text-slate-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-emerald-400">{personalInfo.availability}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Bonjour, je suis <br />
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                {personalInfo.name}
              </span>
            </h1>

            <p className="mt-3 text-base sm:text-xl font-bold text-orange-400">
              {personalInfo.role}
            </p>

            <p className="mt-1 text-xs sm:text-base text-amber-200/90 font-medium">
              {personalInfo.specialties}
            </p>

            <p className="mt-4 text-sm sm:text-lg text-slate-300/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {personalInfo.bio}
            </p>

            {/* Location & Details */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                {personalInfo.location}
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                Université Iba Der Thiam de Thiès
              </span>
              {onOpenWhatsApp && (
                <button
                  onClick={onOpenWhatsApp}
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium hover:underline p-1 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>WhatsApp: {personalInfo.phone}</span>
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={onOpenDrive || (() => window.open(personalInfo.googleDriveProjectsUrl, '_blank'))}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] text-sm sm:text-base min-h-[48px] cursor-pointer"
              >
                <HardDrive className="w-4 h-4 shrink-0" />
                <span>Consulter mes projets sur Drive</span>
              </button>

              <button
                onClick={onDownloadCV}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-orange-500/40 transition-all hover:text-orange-300 text-sm sm:text-base min-h-[48px] cursor-pointer"
              >
                <Download className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Mon CV (PDF & Aperçu)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Card with Photo */}
          <div className="w-full max-w-sm flex justify-center lg:justify-end">
            <div className="relative w-full">
              {/* Outer Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 opacity-20 blur-xl"></div>
              
              {/* Profile Card Container */}
              <div className="relative w-full rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 p-5 sm:p-6 border border-slate-800 shadow-2xl backdrop-blur-md">
                
                {/* Photo showcase */}
                <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden mb-4 border border-orange-500/30 shadow-inner bg-slate-950 group">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Aliou Mbow"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950/40 p-6 text-center select-none">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 p-1 shadow-xl shadow-orange-500/25 mb-3 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                            AM
                          </span>
                        </div>
                      </div>
                      <div className="text-base font-bold text-white mb-0.5">Aliou Mbow</div>
                      <div className="text-xs text-orange-400 font-medium">Management & Marketing Digital</div>
                    </div>
                  )}
                  
                  {/* Top badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-orange-500/40 text-amber-400 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Profil Certifié
                  </div>

                  {/* Name overlay (displayed when photoUrl exists) */}
                  {photoUrl && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4">
                      <div className="text-white font-bold text-lg sm:text-xl">Aliou Mbow</div>
                      <div className="text-xs text-amber-300 font-medium">Management & Marketing Digital</div>
                    </div>
                  )}
                </div>

                {/* Visitor Action Bar */}
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-400" />
                      <span>Licence 3 — Management Informatisé (MIO)</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Université Iba Der Thiam de Thiès — UFR Sciences Économiques et Sociales
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {onOpenWhatsApp && (
                      <button
                        onClick={onOpenWhatsApp}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    )}
                    <button
                      onClick={onDownloadCV}
                      className="flex-1 py-2 px-3 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-orange-400" />
                      <span>Voir le CV</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    Gestion d'activité commerciale (Intellia), conception de bases de données (Access) et stratégie de communication digitale.
                  </p>

                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {['MIO 3e Année', 'Marketing Digital', 'Microsoft Access', 'Gestion Commerciale', 'Coordination'].map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] sm:text-xs px-2.5 py-1 rounded-md bg-orange-950/20 text-orange-300 border border-orange-500/20 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card bottom footer */}
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Briefcase className="w-3.5 h-3.5 text-orange-400" />
                    Dakar & Thiès, Sénégal
                  </span>
                  <button
                    onClick={onOpenContact}
                    className="text-orange-400 hover:text-orange-300 font-medium hover:underline cursor-pointer"
                  >
                    Me contacter &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Stats Strip */}
        <div className="mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {personalInfo.stats.map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm text-center shadow-sm hover:border-orange-500/30 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="mt-1 text-xs sm:text-sm text-slate-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};


