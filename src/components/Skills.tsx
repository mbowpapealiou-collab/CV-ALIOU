import React from 'react';
import { Cpu, Layout, Server, Database, Terminal } from 'lucide-react';
import { skillsData } from '../data/portfolioData';

export const Skills: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Layout':
        return <Layout className="w-5 h-5 text-blue-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-indigo-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-emerald-400" />;
      case 'Terminal':
      default:
        return <Terminal className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <section id="skills" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            STACK TECHNIQUE
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Compétences & Technologies Maîtrisées
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Un écosystème moderne centré sur l'écosystème JavaScript/TypeScript, des architectures résilientes et des outils industriels.
          </p>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillsData.map((cat) => (
            <div
              key={cat.title}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-xl"
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
                      <span className="text-xs text-slate-400 font-mono">{skill.level}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000"
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
        <div className="mt-14 p-6 rounded-2xl bg-slate-800/30 border border-slate-800 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Aperçu rapide des technologies quotidiennes
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              'React 19',
              'Next.js 15 (App Router)',
              'TypeScript',
              'Node.js',
              'Express',
              'Tailwind CSS v4',
              'Prisma ORM',
              'PostgreSQL',
              'MongoDB',
              'REST API',
              'GraphQL',
              'Docker',
              'Git & GitHub Actions',
              'Vercel',
              'Zustand',
              'Postman'
            ].map((tech) => (
              <span
                key={tech}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs sm:text-sm font-medium border border-slate-700/70 transition-colors"
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
