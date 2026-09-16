import React, { useRef } from 'react';
import { X, Download, Printer, Mail, MapPin, Phone, Linkedin, Award, CheckCircle2, GraduationCap, Briefcase, Globe, Camera } from 'lucide-react';
import { personalInfo, skillsData, experiencesData } from '../data/portfolioData';
import { useProfilePhoto } from '../utils/photoStorage';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsApp?: () => void;
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose, onOpenWhatsApp }) => {
  const { photoUrl, uploadPhoto } = useProfilePhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadPhoto(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl my-6 overflow-hidden">
        
        {/* Hidden photo file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Top bar with actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Award className="w-4 h-4 text-blue-400" />
            <span>Curriculum Vitae — {personalInfo.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-sm"
              title="Télécharger ou imprimer le CV en PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / Télécharger en PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CV Document Content */}
        <div id="printable-cv" className="p-6 sm:p-10 max-h-[82vh] overflow-y-auto space-y-7 bg-slate-900 text-slate-200">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {personalInfo.name}
              </h2>
              <p className="text-blue-400 font-semibold text-base sm:text-lg mt-1">
                Management Informatisé des Organisations (MIO) | Marketing digital | Community Management
              </p>
              <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  Dakar, Sénégal
                </span>
                <button
                  type="button"
                  onClick={onOpenWhatsApp || (() => window.open('https://wa.me/221783333175', '_blank'))}
                  className="flex items-center gap-1.5 text-emerald-400 hover:underline font-medium"
                >
                  <Phone className="w-3.5 h-3.5" />
                  +221 78 333 31 75 (WhatsApp)
                </button>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-1.5 text-blue-400 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {personalInfo.email}
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-blue-400 hover:underline"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  linkedin.com/in/aliou-mbow-4b5ba7350
                </a>
              </div>
            </div>

            {/* Photo with quick-change trigger */}
            <div className="relative shrink-0 group">
              <img
                src={photoUrl}
                alt="Aliou Mbow"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top border-2 border-blue-500 shadow-xl"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md border border-white/20 transition-all opacity-80 group-hover:opacity-100"
                title="Changer la photo du CV"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Profil */}
          <div>
            <h3 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-2">
              Profil
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
              {personalInfo.bio}
            </p>
          </div>

          {/* Formation */}
          <div>
            <h3 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-3">
              Formation
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Université Iba Der Thiam de Thiès</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Management Informatisé des Organisations (MIO) — 3ème année</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  En cours
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Baccalauréat S2+</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Série Scientifique</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Obtenu en 2024
                </span>
              </div>
            </div>
          </div>

          {/* Responsabilités & Engagements */}
          <div>
            <h3 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-3">
              Responsabilités & Engagements
            </h3>
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Adjoint de la Commission Pédagogique</h4>
                  <span className="text-xs text-blue-400 font-mono">UFR SES, Université Iba Der Thiam</span>
                </div>
                <p className="text-xs text-slate-300">
                  Appui à l'organisation et au suivi des questions pédagogiques au sein de l'UFR Sciences Économiques et Sociales.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Président de la Commission Sociale</h4>
                  <span className="text-xs text-blue-400 font-mono">CEERCOOP de Passy, Thiès</span>
                </div>
                <p className="text-xs text-slate-300">
                  Pilotage des actions sociales de la coopérative : coordination des initiatives et représentation de la commission.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Président de la Commission Pédagogique</h4>
                  <span className="text-xs text-blue-400 font-mono">AERT de Darou Mouhty, Thiès</span>
                </div>
                <p className="text-xs text-slate-300">
                  Coordination des activités pédagogiques de l'association des ressortissants.
                </p>
              </div>
            </div>
          </div>

          {/* Engagements & Activités */}
          <div>
            <h3 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-3">
              Engagements & Activités
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <h4 className="text-xs font-bold text-white">Pilotage d'une activité commerciale</h4>
                <p className="text-[11px] text-blue-400 font-medium mt-0.5">Suivi via l'application Intellia</p>
                <p className="text-xs text-slate-300 mt-1">
                  Gestion autonome d'une activité de vente : suivi des performances, fidélisation client et recherche continue de croissance du chiffre d'affaires.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <h4 className="text-xs font-bold text-white">Création de contenu digital</h4>
                <p className="text-[11px] text-blue-400 font-medium mt-0.5">Personal Branding & Réseaux Sociaux</p>
                <p className="text-xs text-slate-300 mt-1">
                  Construction d'une présence numérique personnelle autour du marketing digital, de la carrière, du management et de l'entrepreneuriat — de l'idéation à la publication.
                </p>
              </div>
            </div>
          </div>

          {/* Projets & Réalisations */}
          <div>
            <h3 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-3">
              Projets & Réalisations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <h4 className="text-xs font-bold text-white">Projet Microsoft Access</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Conception complète d'une base de données de gestion : structuration des tables, définition des relations et création de requêtes pour répondre à des cas concrets.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <h4 className="text-xs font-bold text-white">Projets Universitaires MIO</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Réalisation de travaux appliqués en gestion, organisation et traitement de l'information dans le cadre du cursus MIO.
                </p>
              </div>
            </div>
          </div>

          {/* Objectif Professionnel */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/30 to-slate-800/60 border border-blue-800/40">
            <h3 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-1">
              Objectif Professionnel
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              {personalInfo.objective}
            </p>
          </div>

          {/* Compétences Clés */}
          <div>
            <h3 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-3">
              Compétences Clés
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="font-bold text-white block mb-1">Management & organisation</span>
                <p className="text-[11px] text-slate-300">Organisation du travail, coordination, esprit d'équipe</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="font-bold text-white block mb-1">Marketing digital</span>
                <p className="text-[11px] text-slate-300">Création de contenu, communication digitale, personal branding</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="font-bold text-white block mb-1">Community Management</span>
                <p className="text-[11px] text-slate-300">Animation de communautés, stratégie et présence digitale</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="font-bold text-white block mb-1">Informatique de gestion</span>
                <p className="text-[11px] text-slate-300">Microsoft Word, Excel et Access</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="font-bold text-white block mb-1">Bases de données</span>
                <p className="text-[11px] text-slate-300">Tables, relations et requêtes sous Microsoft Access</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="font-bold text-white block mb-1">IA & outils numériques</span>
                <p className="text-[11px] text-slate-300">Productivité, idéation, rédaction et création de contenu</p>
              </div>
            </div>
          </div>

          {/* Formations, Langues & Centres d'Intérêt */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div>
              <span className="font-bold text-white block mb-1">Formations & Événements</span>
              <ul className="space-y-0.5 text-[11px] text-slate-400">
                <li>• Cayor Digital Show</li>
                <li>• Panel des formations</li>
                <li>• Conférences développement personnel</li>
              </ul>
            </div>
            <div>
              <span className="font-bold text-white block mb-1">Langues</span>
              <ul className="space-y-0.5 text-[11px] text-slate-400">
                <li>• Français — Très bon niveau</li>
                <li>• Anglais — Très bon niveau</li>
                <li>• Wolof — Langue maternelle</li>
              </ul>
            </div>
            <div>
              <span className="font-bold text-white block mb-1">Centres d'intérêt</span>
              <p className="text-[11px] text-slate-400 leading-snug">
                Transformation numérique • Intelligence artificielle • Management • Marketing digital • Création de contenu
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

