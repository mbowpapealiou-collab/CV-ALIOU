import React from 'react';
import { ArrowRight, Download, CheckCircle, Sparkles, MapPin, Briefcase, ExternalLink, FolderGit2 } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

interface HeroProps {
  onOpenContact: () => void;
  onDownloadCV: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact, onDownloadCV }) => {
  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background subtle mesh gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

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
              <span className="font-medium">{personalInfo.availability}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-none">
              Bonjour, je suis <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                {personalInfo.name}
              </span>
            </h1>

            <p className="mt-3 text-lg sm:text-xl font-semibold text-blue-400">
              {personalInfo.role}
            </p>

            <p className="mt-1 text-sm sm:text-base text-slate-300 font-medium">
              {personalInfo.specialties}
            </p>

            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {personalInfo.bio}
            </p>

            {/* Location & Details */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-400" />
                {personalInfo.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                Université Iba Der Thiam de Thiès
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href={personalInfo.googleDriveProjectsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
              >
                <span>Voir mes projets (Google Drive)</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={onDownloadCV}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-all hover:text-white"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Mon CV (PDF & Aperçu)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Card with Photo */}
          <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center lg:justify-end">
            <div className="relative w-80 sm:w-96">
              {/* Outer Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600 to-sky-500 opacity-20 blur-xl"></div>
              
              {/* Profile Card Container */}
              <div className="relative w-full rounded-3xl bg-gradient-to-b from-slate-800/95 to-slate-900/95 p-6 border border-slate-700/80 shadow-2xl backdrop-blur-md">
                
                {/* Photo showcase */}
                <div className="relative w-full h-72 rounded-2xl overflow-hidden mb-5 border border-slate-700 shadow-inner bg-slate-950">
                  <img
                    src="/photo.jpg"
                    alt="Aliou Mbow"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Profil Officiel
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent p-4">
                    <div className="text-white font-bold text-lg">Aliou Mbow</div>
                    <div className="text-xs text-blue-300 font-medium">Management & Marketing Digital</div>
                  </div>
                </div>

                {/* Card middle info */}
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Gestion d'activité commerciale (Intellia), conception de bases de données (Access) et stratégie de communication digitale.
                  </p>

                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {['MIO 3e Année', 'Marketing Digital', 'Microsoft Access', 'Gestion Commerciale', 'Coordination'].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card bottom footer */}
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                    Dakar & Thiès, Sénégal
                  </span>
                  <button
                    onClick={onOpenContact}
                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
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
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm text-center shadow-sm"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-white bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
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

