import React, { useState } from 'react';
import { FolderGit2, ExternalLink, ArrowUpRight, HardDrive, Sparkles, FolderOpen, Edit3, Check } from 'lucide-react';
import { projectsData, personalInfo } from '../data/portfolioData';
import { Project } from '../types';

export const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [customDriveUrl, setCustomDriveUrl] = useState<string>(() => {
    return localStorage.getItem('aliou_drive_url') || personalInfo.googleDriveProjectsUrl;
  });
  const [isEditingDrive, setIsEditingDrive] = useState(false);
  const [tempUrl, setTempUrl] = useState(customDriveUrl);

  const categories = ['Tous', 'Informatique de Gestion', 'Management', 'Marketing Digital', 'Projet Universitaire'];

  const filteredProjects = activeCategory === 'Tous'
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  const handleSaveDriveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUrl.trim()) {
      setCustomDriveUrl(tempUrl.trim());
      localStorage.setItem('aliou_drive_url', tempUrl.trim());
    }
    setIsEditingDrive(false);
  };

  return (
    <section id="projects" className="py-20 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <FolderOpen className="w-3.5 h-3.5" />
            RÉALISATIONS & PROJETS
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Mes Travaux & Projets sur Google Drive
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Retrouvez tous mes rapports, bases de données Access, études de cas de gestion et livrables marketing centralisés dans mon espace Google Drive.
          </p>
        </div>

        {/* Big Google Drive CTA Banner */}
        <div className="max-w-4xl mx-auto mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-800/80 to-sky-950/40 border border-blue-600/30 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-md">
                <HardDrive className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Dossier Projets Complet (Google Drive)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Accédez en un clic à l'ensemble des fichiers sources, documents et présentations.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href={customDriveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02]"
              >
                <span>Ouvrir Google Drive</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsEditingDrive(!isEditingDrive)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                title="Personnaliser le lien Google Drive"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Optional inline drive link edit form */}
          {isEditingDrive && (
            <form onSubmit={handleSaveDriveUrl} className="mt-4 pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="Collez votre lien de partage Google Drive ici..."
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer mon lien</span>
              </button>
            </form>
          )}
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
              className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Project Image banner */}
              <a
                href={project.driveUrl || customDriveUrl}
                target="_blank"
                rel="noreferrer"
                className="relative h-52 sm:h-60 w-full overflow-hidden bg-slate-800 block"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/90 backdrop-blur-md text-blue-400 border border-slate-700/80">
                    {project.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/90 backdrop-blur-md text-white border border-blue-500/80 flex items-center gap-1 shadow-md">
                    <HardDrive className="w-3 h-3" />
                    Google Drive
                  </span>
                </div>
              </a>

              {/* Content Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <a
                    href={project.driveUrl || customDriveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group-hover:text-blue-400 transition-colors"
                  >
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
                    </h3>
                  </a>

                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Badges */}
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

                {/* Footer Link pointing to Google Drive */}
                <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                    Dossier disponible en ligne
                  </span>

                  <a
                    href={project.driveUrl || customDriveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all"
                  >
                    <span>Consulter sur Google Drive</span>
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

