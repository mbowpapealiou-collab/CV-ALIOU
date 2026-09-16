import React, { useRef, useState } from 'react';
import { ArrowRight, Download, CheckCircle, Sparkles, MapPin, Briefcase, ExternalLink, HardDrive, Camera, RotateCcw, MessageSquare } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { useProfilePhoto } from '../utils/photoStorage';

interface HeroProps {
  onOpenContact: () => void;
  onDownloadCV: () => void;
  onOpenDrive?: () => void;
  onOpenWhatsApp?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenContact,
  onDownloadCV,
  onOpenDrive,
  onOpenWhatsApp
}) => {
  const { photoUrl, isCustom, uploadPhoto, resetPhoto } = useProfilePhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const ok = await uploadPhoto(file);
        if (ok) {
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
        }
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

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
              {onOpenWhatsApp && (
                <button
                  onClick={onOpenWhatsApp}
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium hover:underline"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp: {personalInfo.phone}</span>
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenDrive || (() => window.open(personalInfo.googleDriveProjectsUrl, '_blank'))}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
              >
                <HardDrive className="w-4 h-4" />
                <span>Consulter mes projets sur Drive</span>
              </button>

              <button
                onClick={onDownloadCV}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-all hover:text-white"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Mon CV (PDF & Aperçu)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Card with Photo & Upload feature */}
          <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center lg:justify-end">
            <div className="relative w-80 sm:w-96">
              {/* Outer Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600 to-sky-500 opacity-20 blur-xl"></div>
              
              {/* Profile Card Container */}
              <div className="relative w-full rounded-3xl bg-gradient-to-b from-slate-800/95 to-slate-900/95 p-6 border border-slate-700/80 shadow-2xl backdrop-blur-md">
                
                {/* Photo showcase with Upload Overlay */}
                <div className="relative w-full h-72 rounded-2xl overflow-hidden mb-5 border border-slate-700 shadow-inner bg-slate-950 group">
                  <img
                    src={photoUrl}
                    alt="Aliou Mbow"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Top badges */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Profil Officiel
                  </div>

                  {uploadSuccess && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-lg animate-bounce">
                      Photo mise à jour !
                    </div>
                  )}

                  {/* Hover Upload overlay */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <label
                      htmlFor="hero-photo-input"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-transform hover:scale-105"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{isUploading ? 'Chargement...' : 'Changer la photo'}</span>
                    </label>

                    {isCustom && (
                      <button
                        onClick={resetPhoto}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition-colors"
                        title="Restaurer la photo d'origine"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Rétablir photo originale</span>
                      </button>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    id="hero-photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Name overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent p-4">
                    <div className="text-white font-bold text-lg">Aliou Mbow</div>
                    <div className="text-xs text-blue-300 font-medium">Management & Marketing Digital</div>
                  </div>
                </div>

                {/* Card middle info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Photo de profil personnalisable :</span>
                    <label
                      htmlFor="hero-photo-input"
                      className="cursor-pointer text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 hover:underline"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Uploader une photo</span>
                    </label>
                  </div>

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


