import React, { useRef, useState } from 'react';
import { ArrowRight, Download, CheckCircle, Sparkles, MapPin, Briefcase, ExternalLink, HardDrive, Camera, RotateCcw, MessageSquare, Shield, Lock } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { useProfilePhoto } from '../utils/photoStorage';

interface HeroProps {
  onOpenContact: () => void;
  onDownloadCV: () => void;
  onOpenDrive?: () => void;
  onOpenWhatsApp?: () => void;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenContact,
  onDownloadCV,
  onOpenDrive,
  onOpenWhatsApp,
  isAdmin = false,
  onOpenAdmin,
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

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Bonjour, je suis <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                {personalInfo.name}
              </span>
            </h1>

            <p className="mt-3 text-base sm:text-xl font-semibold text-blue-400">
              {personalInfo.role}
            </p>

            <p className="mt-1 text-xs sm:text-base text-slate-300 font-medium">
              {personalInfo.specialties}
            </p>

            <p className="mt-4 text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {personalInfo.bio}
            </p>

            {/* Location & Details */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                {personalInfo.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-400 shrink-0" />
                Université Iba Der Thiam de Thiès
              </span>
              {onOpenWhatsApp && (
                <button
                  onClick={onOpenWhatsApp}
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium hover:underline p-1"
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
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] text-sm sm:text-base min-h-[48px]"
              >
                <HardDrive className="w-4 h-4 shrink-0" />
                <span>Consulter mes projets sur Drive</span>
              </button>

              <button
                onClick={onDownloadCV}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-all hover:text-white text-sm sm:text-base min-h-[48px]"
              >
                <Download className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Mon CV (PDF & Aperçu)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Card with Photo & Upload feature */}
          <div className="w-full max-w-sm flex justify-center lg:justify-end">
            <div className="relative w-full">
              {/* Outer Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600 to-sky-500 opacity-20 blur-xl"></div>
              
              {/* Profile Card Container */}
              <div className="relative w-full rounded-3xl bg-gradient-to-b from-slate-800/95 to-slate-900/95 p-5 sm:p-6 border border-slate-700/80 shadow-2xl backdrop-blur-md">
                
                {/* Photo showcase with direct upload button */}
                <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden mb-4 border border-slate-700 shadow-inner bg-slate-950 group">
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

                  {/* Top Left: Admin Quick Camera Button (Only if Admin) or Admin Login Key */}
                  {isAdmin ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute top-3 left-3 p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/50 backdrop-blur-md shadow-md transition-colors cursor-pointer"
                      title="Changer ma photo de profil (Admin)"
                      aria-label="Changer de photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  ) : (
                    onOpenAdmin && (
                      <button
                        onClick={onOpenAdmin}
                        className="absolute top-3 left-3 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-700/60 backdrop-blur-md transition-colors cursor-pointer opacity-70 hover:opacity-100"
                        title="Espace Administrateur (Aliou Mbow)"
                        aria-label="Espace Administrateur"
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </button>
                    )
                  )}

                  {uploadSuccess && (
                    <div className="absolute top-12 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-lg animate-bounce">
                      Photo mise à jour !
                    </div>
                  )}

                  {/* Name overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-4">
                    <div className="text-white font-bold text-lg sm:text-xl">Aliou Mbow</div>
                    <div className="text-xs text-blue-300 font-medium">Management & Marketing Digital</div>
                  </div>
                </div>

                {/* Photo Action Bar */}
                <div className="space-y-3">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{isUploading ? 'Traitement de la photo...' : 'Uploader ma photo (Admin)'}</span>
                      </button>

                      {isCustom && (
                        <div className="flex items-center justify-between text-xs px-1">
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Photo personnalisée
                          </span>
                          <button
                            onClick={resetPhoto}
                            className="text-slate-400 hover:text-rose-400 inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Rétablir défaut</span>
                          </button>
                        </div>
                      )}

                      {onOpenAdmin && (
                        <button
                          onClick={onOpenAdmin}
                          className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Ouvrir le Studio Administrateur</span>
                        </button>
                      )}
                    </>
                  ) : (
                    /* Public Visitor view: clean, professional, no unauthorized upload controls */
                    <div className="space-y-2.5 pt-1">
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                          <span>Profil Professionnel Certifié</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          Université Iba Der Thiam de Thiès — UFR Sciences Économiques et Sociales
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {onOpenWhatsApp && (
                          <button
                            onClick={onOpenWhatsApp}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>
                        )}
                        <button
                          onClick={onDownloadCV}
                          className="flex-1 py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Voir le CV</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Hidden file input supporting camera & files (admin only) */}
                  <input
                    ref={fileInputRef}
                    id="hero-photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    Gestion d'activité commerciale (Intellia), conception de bases de données (Access) et stratégie de communication digitale.
                  </p>

                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {['MIO 3e Année', 'Marketing Digital', 'Microsoft Access', 'Gestion Commerciale', 'Coordination'].map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] sm:text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium"
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


