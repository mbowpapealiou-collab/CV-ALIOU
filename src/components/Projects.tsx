import React, { useState, useRef } from 'react';
import { FolderGit2, ExternalLink, ArrowUpRight, HardDrive, Sparkles, FolderOpen, Edit3, Check, FolderSearch, Camera } from 'lucide-react';
import { projectsData, personalInfo } from '../data/portfolioData';
import { Project } from '../types';
import { sanitizeSafeUrl, isValidDriveUrl } from '../utils/security';
import { useProjectPhotos } from '../utils/photoStorage';

interface ProjectsProps {
  onOpenDriveModal?: (folderId?: string) => void;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
}

export const Projects: React.FC<ProjectsProps> = ({ 
  onOpenDriveModal,
  isAdmin = false,
  onOpenAdmin,
}) => {
  const { getPhoto, uploadProjectPhoto } = useProjectPhotos();
  const [uploadingProjId, setUploadingProjId] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [customDriveUrl, setCustomDriveUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('aliou_drive_url');
      if (saved && !saved.includes('1AliouMbow_Projets')) {
        return saved;
      }
      // If old broken link was stored, clean it up
      if (saved && saved.includes('1AliouMbow_Projets')) {
        localStorage.removeItem('aliou_drive_url');
      }
    } catch {
      // Ignore localStorage errors
    }
    return personalInfo.googleDriveProjectsUrl;
  });
  const [isEditingDrive, setIsEditingDrive] = useState(false);
  const [tempUrl, setTempUrl] = useState(customDriveUrl);

  const categories = ['Tous', 'Informatique de Gestion', 'Management', 'Marketing Digital', 'Projet Universitaire'];

  const filteredProjects = activeCategory === 'Tous'
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  const handleSaveDriveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sanitizeSafeUrl(tempUrl.trim(), personalInfo.googleDriveProjectsUrl);
    if (!isValidDriveUrl(clean)) {
      alert("Sécurité : Le lien doit obligatoirement être une URL Google Drive sécurisée (commençant par https://drive.google.com/ ou https://docs.google.com/)");
      return;
    }
    setCustomDriveUrl(clean);
    try {
      localStorage.setItem('aliou_drive_url', clean);
    } catch {
      // Ignore
    }
    setIsEditingDrive(false);
  };

  const getFolderIdForProject = (projId: string) => {
    switch (projId) {
      case 'proj-1':
        return 'folder-access';
      case 'proj-2':
        return 'folder-intellia';
      case 'proj-3':
        return 'folder-marketing';
      case 'proj-4':
        return 'folder-management';
      default:
        return 'folder-access';
    }
  };

  return (
    <section id="projects" className="py-20 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold mb-3">
            <FolderOpen className="w-3.5 h-3.5" />
            RÉALISATIONS & PROJETS
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Mes Travaux & Projets sur Google Drive
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Retrouvez tous mes rapports, bases de données Access, études de cas de gestion et livrables marketing centralisés dans mon espace Google Drive ({personalInfo.email}).
          </p>
        </div>

        {/* Big Google Drive CTA Banner */}
        <div className="max-w-4xl mx-auto mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-950/40 via-slate-900/90 to-amber-950/30 border border-orange-500/30 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0 shadow-md">
                <HardDrive className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Dossier Projets Complet (Google Drive)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Explorez directement les dossiers de test connectés au compte <span className="text-amber-300 font-semibold">{personalInfo.email}</span>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
              {onOpenDriveModal && (
                <button
                  onClick={() => onOpenDriveModal()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] min-h-[44px] cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4 shrink-0" />
                  <span>Consulter sur Drive</span>
                </button>
              )}

              <div className="flex items-center gap-2">
                <a
                  href={customDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-orange-500/30 transition-colors text-xs min-h-[44px]"
                  title="Ouvrir dans un nouvel onglet Google Drive"
                >
                  <span>Lien direct web</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>

                <button
                  onClick={() => setIsEditingDrive(!isEditingDrive)}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-orange-400 border border-slate-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                  title="Personnaliser le lien Google Drive"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
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
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-sm font-bold transition-all cursor-pointer"
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
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold shadow-md shadow-orange-500/30'
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
              className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Project Image banner */}
              <div
                onClick={() => onOpenDriveModal ? onOpenDriveModal(getFolderIdForProject(project.id)) : window.open(project.driveUrl || customDriveUrl, '_blank')}
                className="relative h-52 sm:h-60 w-full overflow-hidden bg-slate-800 block cursor-pointer"
              >
                <img
                  src={getPhoto(project.id, project.image)}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/90 backdrop-blur-md text-amber-400 border border-orange-500/30">
                    {project.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 backdrop-blur-md text-slate-950 border border-orange-400/80 flex items-center gap-1 shadow-md">
                    <HardDrive className="w-3 h-3" />
                    Google Drive
                  </span>
                </div>

                {/* Admin Quick Upload Button on Card */}
                {isAdmin && (
                  <div
                    className="absolute bottom-3 right-3 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => fileInputRefs.current[project.id]?.click()}
                      className="px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-orange-500 text-white hover:text-slate-950 border border-slate-700/80 text-xs font-medium flex items-center gap-1.5 shadow-xl backdrop-blur-md transition-all cursor-pointer"
                      title="Changer la photo de ce projet"
                    >
                      <Camera className="w-3.5 h-3.5 text-orange-400 hover:text-slate-950" />
                      <span>{uploadingProjId === project.id ? 'Chargement...' : 'Modifier photo'}</span>
                    </button>
                    <input
                      ref={(el) => (fileInputRefs.current[project.id] = el)}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingProjId(project.id);
                        await uploadProjectPhoto(project.id, file);
                        setUploadingProjId(null);
                        e.target.value = '';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div
                    onClick={() => onOpenDriveModal ? onOpenDriveModal(getFolderIdForProject(project.id)) : window.open(project.driveUrl || customDriveUrl, '_blank')}
                    className="cursor-pointer"
                  >
                    <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors flex items-center justify-between">
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-orange-400 transition-colors shrink-0" />
                    </h3>
                  </div>

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
                <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 break-all">
                    <FolderOpen className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    {personalInfo.email}
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {onOpenDriveModal && (
                      <button
                        onClick={() => onOpenDriveModal(getFolderIdForProject(project.id))}
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 px-3.5 py-2 rounded-lg shadow-sm transition-all min-h-[38px] cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                        <span>Consulter sur Drive</span>
                      </button>
                    )}

                    <a
                      href={project.driveUrl || customDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 text-xs text-slate-300 hover:text-orange-400 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors min-h-[38px] min-w-[38px]"
                      title="Ouvrir dans Google Drive Web"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

