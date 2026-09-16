import React, { useState } from 'react';
import { FolderGit2, ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { projectsData } from '../data/portfolioData';
import { Project } from '../types';

export const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Tous');

  const categories = ['Tous', 'Full Stack', 'Frontend', 'Backend'];

  const filteredProjects = activeCategory === 'Tous'
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            PORTFOLIO
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Projets Récents & Réalisations
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Une sélection d'applications complètes illustrant mon savoir-faire en architecture logicielle, interfaces et gestion de données.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project: Project) => (
            <div
              key={project.id}
              className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Project Image banner */}
              <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-slate-800">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-blue-400 border border-slate-700/80">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>{project.title}</span>
                    <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </h3>

                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech stack badges */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Links */}
                <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
                  <a
                    href={project.githubUrl || "https://github.com/mbowpapealiou-collab"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>Code Source</span>
                  </a>

                  <a
                    href={project.liveUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>Voir le Projet</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
