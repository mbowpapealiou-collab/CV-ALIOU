import React from 'react';
import { X, Download, Printer, Mail, MapPin, Phone, Github, CheckCircle2, Award } from 'lucide-react';
import { personalInfo, skillsData, experiencesData } from '../data/portfolioData';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl my-8 overflow-hidden">
        
        {/* Top bar with actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Award className="w-4 h-4 text-blue-400" />
            <span>Curriculum Vitae — {personalInfo.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CV Document Content */}
        <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto space-y-8 bg-slate-900 text-slate-200">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                {personalInfo.name}
              </h2>
              <p className="text-blue-400 font-semibold text-lg mt-1">
                {personalInfo.role}
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  {personalInfo.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {personalInfo.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-blue-400" />
                  github.com/mbowpapealiou-collab
                </span>
              </div>
            </div>

            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              PAM
            </div>
          </div>

          {/* Profil */}
          <div>
            <h3 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-2">
              Profil Professionnel
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {personalInfo.bio}
            </p>
          </div>

          {/* Expériences */}
          <div>
            <h3 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-4">
              Expériences Professionnelles
            </h3>
            <div className="space-y-6">
              {experiencesData.map((exp) => (
                <div key={exp.period} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <span className="text-base font-bold text-white">{exp.role}</span>
                    <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 w-fit">
                      {exp.period}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">{exp.company}</div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-300">
                    {exp.description.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Compétences Clés */}
          <div>
            <h3 className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-3">
              Compétences & Technologies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skillsData.map((cat) => (
                <div key={cat.title} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-xs font-bold text-white block mb-2">{cat.title}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((s) => (
                      <span key={s.name} className="px-2 py-0.5 rounded bg-slate-700 text-[11px] text-slate-200">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Langues & Atouts */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-6 text-xs text-slate-400">
            <div>
              <span className="font-bold text-white">Langues :</span> Français (Courant), Anglais (Technique/Professionnel), Wolof
            </div>
            <div>
              <span className="font-bold text-white">Atouts :</span> Rigueur, Esprit d'équipe, Autonomie, Veille technologique
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
