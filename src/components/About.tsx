import React from 'react';
import { User, CheckCircle2, Award, Laptop, Clock, ShieldCheck } from 'lucide-react';
import { personalInfo, experiencesData } from '../data/portfolioData';

export const About: React.FC = () => {
  const highlights = [
    {
      title: "Architecture Propre & Scalable",
      desc: "Code modulaire, typé avec rigueur en TypeScript et structuré pour la maintenabilité à long terme.",
      icon: Laptop
    },
    {
      title: "Maîtrise Base de Données & ORM",
      desc: "Conception de schémas optimisés sous PostgreSQL et MongoDB avec Prisma ORM pour des requêtes rapides et sécurisées.",
      icon: ShieldCheck
    },
    {
      title: "Expérience Utilisateur Moderne",
      desc: "Interfaces ultra-réactives au pixel près avec Tailwind CSS, Next.js App Router et transitions soignées.",
      icon: Award
    },
    {
      title: "Respect des Délais & Engagement",
      desc: "Méthodologie Agile, communication transparente et itérations rapides avec déploiement continu.",
      icon: Clock
    }
  ];

  return (
    <section id="about" className="py-20 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <User className="w-3.5 h-3.5" />
            À PROPOS DE MOI
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Passionné par l'innovation logicielle et la création de valeur
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Alliant sens du détail graphique et rigueur d'ingénierie backend, je transforme des idées complexes en produits web fluides, intuitifs et prêts pour la production.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Experience Timeline */}
        <div id="experience" className="mt-20 pt-16 border-t border-slate-800">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-white">Parcours & Expériences</h3>
            <p className="text-sm text-slate-400 mt-2">
              Un cheminement orienté vers l'excellence technique et la livraison de solutions concrètes.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-3.5 sm:before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-slate-800">
            {experiencesData.map((exp, idx) => (
              <div
                key={exp.period}
                className="relative flex flex-col sm:flex-row items-start gap-6 group"
              >
                {/* Center dot */}
                <div className="absolute left-3.5 sm:left-1/2 -translate-x-1/2 top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-slate-900 ring-offset-2 ring-offset-blue-500/20 group-hover:scale-125 transition-transform" />

                {/* Left side on desktop: Date/Period */}
                <div className="sm:w-1/2 sm:text-right pl-10 sm:pl-0 sm:pr-10">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {exp.period}
                  </span>
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
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
