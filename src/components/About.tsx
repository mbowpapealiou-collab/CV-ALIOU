import React from 'react';
import { User, CheckCircle2, Award, Briefcase, Users, TrendingUp, GraduationCap, Check, Clock } from 'lucide-react';
import { usePortfolioContent } from '../utils/contentStorage';

export const About: React.FC = () => {
  const { personalInfo, experiences } = usePortfolioContent();

  const highlights = [
    {
      title: "Management & Organisation",
      desc: "Coordination d'équipes, optimisation des processus de gestion et rigueur organisationnelle appliquée aux structures d'entreprise.",
      icon: Briefcase
    },
    {
      title: "Informatique de Gestion & Access",
      desc: "Conception et structuration de bases de données relationnelles, requêtes multicritères, traitement analytique sous Excel et Access.",
      icon: Award
    },
    {
      title: "Marketing Digital & Réseaux",
      desc: "Idéation de contenu, personal branding, community management et renforcement de l'impact numérique des organisations.",
      icon: TrendingUp
    },
    {
      title: "Leadership & Vie Associative",
      desc: "Présidence et animation de commissions pédagogiques et sociales au sein de l'Université Iba Der Thiam de Thiès.",
      icon: Users
    }
  ];

  return (
    <section id="about" className="py-20 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold mb-3">
            <User className="w-3.5 h-3.5" />
            PROFIL & PARCOURS
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {personalInfo.role} & Stratégie Digitale
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            {personalInfo.bio}
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-orange-500/40 transition-all hover:-translate-y-1 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Formation & Objectif Professionnel */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Formation Académique</h3>
            </div>
            <div className="space-y-4">
              {personalInfo.education && personalInfo.education.map((edu, idx) => (
                <div key={idx} className="pb-3 border-b border-slate-700/40 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white text-base">{edu.degree}</h4>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-medium border border-orange-500/20">
                      {edu.year}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{edu.school}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-orange-950/30 via-slate-900/60 to-slate-800/40 border border-orange-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Objectif Professionnel</h3>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {personalInfo.objective}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700">Direction Administrative & Financière</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700">Gestion de Projets</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700">Audit & Organisation</span>
            </div>
          </div>
        </div>

        {/* Experience / Engagements Timeline */}
        <div id="experience" className="mt-20 pt-16 border-t border-slate-800">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Responsabilités & Engagements</h3>
            <p className="text-sm text-slate-400 mt-2">
              Expériences concrètes en gestion d'équipes, commissions universitaires et activités commerciales.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-3.5 sm:before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-slate-800">
            {experiences.map((exp, idx) => {
              const isTermine = exp.isCompleted || (!exp.period.toLowerCase().includes('présent') && !exp.period.toLowerCase().includes('en cours'));
              return (
                <div
                  key={idx}
                  className="relative flex flex-col sm:flex-row items-start gap-6 group"
                >
                  {/* Center dot */}
                  <div className={`absolute left-3.5 sm:left-1/2 -translate-x-1/2 top-1.5 w-4 h-4 rounded-full ring-4 ring-slate-900 ring-offset-2 transition-transform ${
                    isTermine
                      ? 'bg-slate-500 ring-offset-slate-600/30'
                      : 'bg-orange-500 ring-offset-orange-500/20 group-hover:scale-125'
                  }`} />

                  {/* Left side on desktop: Date/Period & Status */}
                  <div className="sm:w-1/2 sm:text-right pl-10 sm:pl-0 sm:pr-10">
                    <div className="flex items-center sm:justify-end gap-2 flex-wrap mb-1">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/25">
                        {exp.period}
                      </span>
                      {isTermine ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          <Check className="w-3 h-3 text-emerald-400" />
                          Terminé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse">
                          <Clock className="w-3 h-3" />
                          En cours
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-white mt-1">{exp.role}</h4>
                    <p className="text-sm text-slate-400 font-medium">{exp.company}</p>
                  </div>

                  {/* Right side on desktop: Details */}
                  <div className="sm:w-1/2 pl-10 sm:pl-10">
                    <ul className="space-y-2 text-sm text-slate-400">
                      {exp.description.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
