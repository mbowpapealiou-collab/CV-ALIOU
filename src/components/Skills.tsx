import React from 'react';
import { Cpu, Briefcase, Megaphone, Database, Sparkles } from 'lucide-react';
import { usePortfolioContent } from '../utils/contentStorage';

export const Skills: React.FC = () => {
  const { skills } = usePortfolioContent();
  const getIcon = (name: string) => {
    switch (name) {
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-orange-400" />;
      case 'Megaphone':
        return <Megaphone className="w-5 h-5 text-amber-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-emerald-400" />;
      case 'Cpu':
      default:
        return <Cpu className="w-5 h-5 text-orange-400" />;
    }
  };

  return (
    <section id="skills" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            COMPÉTENCES CLÉS
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Savoir-Faire & Outils Opérationnels
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Une combinaison équilibrée entre sens de la gestion organisationnelle, rigueur du traitement de données et maîtrise des leviers du marketing digital.
          </p>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((cat) => (
            <div
              key={cat.title}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-xl hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                  {getIcon(cat.iconName)}
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {cat.title}
                </h3>
              </div>

              <div className="space-y-4">
                {cat.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center text-sm font-medium mb-1.5">
                      <span className="text-slate-200">{skill.name}</span>
                      <span className="text-xs text-orange-400 font-mono font-semibold">{skill.level}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Floating tech badge cloud */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-slate-800/30 border border-slate-800 text-center">
          <p className="text-xs font-semibold text-orange-400/90 uppercase tracking-wider mb-4">
            Domaines de Maîtrise & Outils Pratiques
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              'Management des Organisations (MIO)',
              'Microsoft Access (Tables & Requêtes)',
              'Microsoft Excel (Analyses & Tableaux)',
              'Microsoft Word',
              'Application Intellia (Ventes)',
              'Marketing Digital',
              'Community Management',
              'Personal Branding',
              'Stratégie de Contenu',
              'Intelligence Artificielle & Productivité',
              'Communication Professionnelle',
              'Gestion & Coordination Associative'
            ].map((tech) => (
              <span
                key={tech}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-orange-300 text-xs sm:text-sm font-medium border border-slate-700/70 hover:border-orange-500/30 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

