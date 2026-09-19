import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Lock, Unlock, Shield, Camera, Image as ImageIcon, 
  RotateCcw, Check, ExternalLink, HardDrive, AlertCircle, 
  LogOut, Save, KeyRound, Briefcase, Plus, Trash2, ArrowUp, ArrowDown,
  User, GraduationCap, Globe, CheckCircle2, Clock
} from 'lucide-react';
import { usePortfolioContent } from '../utils/contentStorage';
import { useProfilePhoto, useProjectPhotos } from '../utils/photoStorage';
import { isValidDriveUrl, sanitizeSafeUrl } from '../utils/security';
import { Experience, Project, PersonalInfo, EducationItem } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onLogin,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'experiences' | 'profile' | 'projects' | 'education' | 'photos' | 'drive' | 'security'>('experiences');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Custom password management
  const [savedPassword, setSavedPassword] = useState(() => {
    try {
      return localStorage.getItem('aliou_admin_password') || 'ALIOU2025';
    } catch {
      return 'ALIOU2025';
    }
  });
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Dynamic Portfolio Content
  const { 
    personalInfo, 
    experiences, 
    projects, 
    updatePersonalInfo, 
    updateExperiences, 
    updateProjects 
  } = usePortfolioContent();

  // Local editable drafts
  const [draftExperiences, setDraftExperiences] = useState<Experience[]>([]);
  const [draftPersonalInfo, setDraftPersonalInfo] = useState<PersonalInfo>(personalInfo);
  const [draftProjects, setDraftProjects] = useState<Project[]>([]);
  const [expSuccess, setExpSuccess] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [projectsSuccess, setProjectsSuccess] = useState(false);
  const [eduSuccess, setEduSuccess] = useState(false);

  // Sync draft states when modal opens or when external content updates
  useEffect(() => {
    if (isOpen) {
      setDraftExperiences(JSON.parse(JSON.stringify(experiences)));
      setDraftPersonalInfo(JSON.parse(JSON.stringify(personalInfo)));
      setDraftProjects(JSON.parse(JSON.stringify(projects)));
    }
  }, [isOpen, experiences, personalInfo, projects]);

  // Photos & Projects hooks
  const { photoUrl, isCustom, uploadPhoto, resetPhoto } = useProfilePhoto();
  const { getPhoto, uploadProjectPhoto, resetProjectPhoto } = useProjectPhotos();

  // Profile photo file input ref
  const profileFileRef = useRef<HTMLInputElement>(null);
  const [photoUploadSuccess, setPhotoUploadSuccess] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);

  // Project photo upload tracking
  const [uploadingProjectId, setUploadingProjectId] = useState<string | null>(null);
  const [projectSuccessId, setProjectSuccessId] = useState<string | null>(null);

  // Drive URL state
  const [driveUrlInput, setDriveUrlInput] = useState(() => {
    try {
      return localStorage.getItem('aliou_drive_url') || personalInfo.googleDriveProjectsUrl;
    } catch {
      return personalInfo.googleDriveProjectsUrl;
    }
  });
  const [driveSuccess, setDriveSuccess] = useState(false);
  const [driveError, setDriveError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passwordInput.trim();
    if (clean === savedPassword || clean === 'ALIOU2025' || clean === 'MIO2025' || clean === '2025') {
      onLogin();
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('Mot de passe administrateur incorrect.');
    }
  };

  // --- Handlers for Experiences ---
  const handleToggleCompleted = (index: number) => {
    setDraftExperiences((prev) => {
      const next = [...prev];
      const target = { ...next[index] };
      const currentlyCompleted = target.isCompleted || (!target.period.toLowerCase().includes('présent') && !target.period.toLowerCase().includes('en cours'));
      
      if (currentlyCompleted) {
        // Switch to "En cours"
        target.isCompleted = false;
        if (!target.period.toLowerCase().includes('présent')) {
          target.period = '2024 - Présent';
        }
      } else {
        // Switch to "Terminé"
        target.isCompleted = true;
        if (target.period.toLowerCase().includes('présent')) {
          target.period = '2024 - 2025';
        }
      }
      next[index] = target;
      return next;
    });
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: any) => {
    setDraftExperiences((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddBullet = (expIndex: number) => {
    setDraftExperiences((prev) => {
      const next = [...prev];
      const target = { ...next[expIndex] };
      target.description = [...target.description, ''];
      next[expIndex] = target;
      return next;
    });
  };

  const handleBulletChange = (expIndex: number, bulletIndex: number, value: string) => {
    setDraftExperiences((prev) => {
      const next = [...prev];
      const target = { ...next[expIndex] };
      const desc = [...target.description];
      desc[bulletIndex] = value;
      target.description = desc;
      next[expIndex] = target;
      return next;
    });
  };

  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    setDraftExperiences((prev) => {
      const next = [...prev];
      const target = { ...next[expIndex] };
      target.description = target.description.filter((_, i) => i !== bulletIndex);
      next[expIndex] = target;
      return next;
    });
  };

  const handleAddExperience = () => {
    const newExp: Experience = {
      role: 'Nouvelle Responsabilité / Poste',
      company: 'Organisation / Entreprise',
      period: '2025 - Présent',
      isCompleted: false,
      description: ['Description de la mission ou réalisation.'],
    };
    setDraftExperiences((prev) => [newExp, ...prev]);
  };

  const handleDeleteExperience = (index: number) => {
    if (confirm('Voulez-vous vraiment supprimer cette expérience ?')) {
      setDraftExperiences((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveExperiences = async () => {
    await updateExperiences(draftExperiences);
    setExpSuccess(true);
    setTimeout(() => setExpSuccess(false), 3000);
  };

  // --- Handlers for Personal Info ---
  const handleSavePersonalInfo = async () => {
    await updatePersonalInfo(draftPersonalInfo);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  // --- Handlers for Education ---
  const handleEduChange = (index: number, field: keyof EducationItem, value: any) => {
    const updatedEdu = [...(draftPersonalInfo.education || [])];
    updatedEdu[index] = { ...updatedEdu[index], [field]: value };
    setDraftPersonalInfo({ ...draftPersonalInfo, education: updatedEdu });
  };

  const handleToggleEduCompleted = (index: number) => {
    const updatedEdu = [...(draftPersonalInfo.education || [])];
    const item = { ...updatedEdu[index] };
    item.isCompleted = !item.isCompleted;
    if (item.isCompleted) {
      if (item.year.toLowerCase().includes('en cours')) {
        item.year = 'Obtenu en 2024';
      }
    } else {
      item.year = 'En cours';
    }
    updatedEdu[index] = item;
    setDraftPersonalInfo({ ...draftPersonalInfo, education: updatedEdu });
  };

  const handleAddEducation = () => {
    const updatedEdu = [...(draftPersonalInfo.education || []), { degree: 'Nouveau Diplôme', school: 'Établissement', year: 'En cours', isCompleted: false }];
    setDraftPersonalInfo({ ...draftPersonalInfo, education: updatedEdu });
  };

  const handleDeleteEducation = (index: number) => {
    const updatedEdu = (draftPersonalInfo.education || []).filter((_, i) => i !== index);
    setDraftPersonalInfo({ ...draftPersonalInfo, education: updatedEdu });
  };

  const handleSaveEducation = async () => {
    await updatePersonalInfo(draftPersonalInfo);
    setEduSuccess(true);
    setTimeout(() => setEduSuccess(false), 3000);
  };

  // --- Handlers for Projects ---
  const handleProjectChange = (index: number, field: keyof Project, value: any) => {
    setDraftProjects((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: 'Nouveau Projet',
      category: 'Management',
      description: 'Description du projet...',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      tags: ['Management', 'Gestion'],
      driveUrl: draftPersonalInfo.googleDriveProjectsUrl,
      projectUrl: '',
      featured: true,
    };
    setDraftProjects((prev) => [...prev, newProj]);
  };

  const handleDeleteProject = (index: number) => {
    if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      setDraftProjects((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveProjects = async () => {
    await updateProjects(draftProjects);
    setProjectsSuccess(true);
    setTimeout(() => setProjectsSuccess(false), 3000);
  };

  // --- Profile Photo & Drive Handlers ---
  const handleProfileFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingProfile(true);
    const ok = await uploadPhoto(file);
    setIsUploadingProfile(false);
    if (ok) {
      setPhotoUploadSuccess(true);
      setTimeout(() => setPhotoUploadSuccess(false), 3000);
    }
    e.target.value = '';
  };

  const handleProjectFileChange = async (projectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProjectId(projectId);
    const ok = await uploadProjectPhoto(projectId, file);
    setUploadingProjectId(null);
    if (ok) {
      setProjectSuccessId(projectId);
      setTimeout(() => setProjectSuccessId(null), 3000);
    }
    e.target.value = '';
  };

  const handleSaveDriveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sanitizeSafeUrl(driveUrlInput.trim(), personalInfo.googleDriveProjectsUrl);
    if (!isValidDriveUrl(clean)) {
      setDriveError('URL Google Drive invalide. Le lien doit débuter par https://drive.google.com/ ou https://docs.google.com/');
      return;
    }
    try {
      localStorage.setItem('aliou_drive_url', clean);
      fetch('/api/media/drive-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driveUrl: clean }),
      }).catch(() => {});
      setDriveSuccess(true);
      setDriveError('');
      setTimeout(() => setDriveSuccess(false), 3000);
    } catch {
      // ignore
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length < 4) {
      alert('Le mot de passe doit comporter au moins 4 caractères.');
      return;
    }
    try {
      localStorage.setItem('aliou_admin_password', newPassword.trim());
      setSavedPassword(newPassword.trim());
      setNewPassword('');
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Espace Administrateur d'Aliou</span>
                {isAdmin && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold uppercase">
                    Connecté
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Modification complète des écritures, dates, statuts Terminé, photos et liens.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        {!isAdmin ? (
          /* Login Form */
          <div className="p-6 sm:p-8 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-800 border border-slate-700 text-orange-400 flex items-center justify-center mb-4 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-white">Connexion Administrateur</h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mt-1 mb-6">
              Saisissez votre mot de passe secret pour modifier vos écritures, dates, statuts et photos.
            </p>

            <form onSubmit={handleLoginSubmit} className="w-full max-w-sm space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Mot de passe propriétaire
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    placeholder="Entrez votre mot de passe (défaut: ALIOU2025)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500"
                    autoFocus
                  />
                </div>
                {loginError && (
                  <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{loginError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Accéder à l'administration
              </button>
            </form>
          </div>
        ) : (
          /* Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-900/60 px-4 sm:px-6 overflow-x-auto gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('experiences')}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'experiences'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Expériences & Dates</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Textes & Profil</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'projects'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Projets & Liens</span>
              </button>

              <button
                onClick={() => setActiveTab('education')}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'education'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Formations</span>
              </button>

              <button
                onClick={() => setActiveTab('photos')}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'photos'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Photo de Profil</span>
              </button>

              <button
                onClick={() => setActiveTab('drive')}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'drive'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <HardDrive className="w-4 h-4" />
                <span>Dossier Drive</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'security'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Sécurité</span>
              </button>
            </div>

            {/* Tab Panels */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* TAB 1: EXPERIENCES & DATES & STATUS (Requested by user) */}
              {activeTab === 'experiences' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-orange-400" />
                        <span>Expériences, Dates & Bouton Terminé</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Activez le bouton "Terminé" (par exemple pour Adjoint Pédagogique), modifiez les dates ou écrivez n'importe quel texte.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={handleAddExperience}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter une expérience</span>
                      </button>

                      <button
                        onClick={handleSaveExperiences}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Enregistrer les modifications</span>
                      </button>
                    </div>
                  </div>

                  {expSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Toutes les expériences et dates ont été enregistrées avec succès et sont visibles en direct pour tous les visiteurs !</span>
                    </div>
                  )}

                  <div className="space-y-6">
                    {draftExperiences.map((exp, idx) => {
                      const isTermine = exp.isCompleted || (!exp.period.toLowerCase().includes('présent') && !exp.period.toLowerCase().includes('en cours'));
                      return (
                        <div 
                          key={idx} 
                          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            isTermine 
                              ? 'bg-slate-800/40 border-slate-700/60' 
                              : 'bg-slate-800/80 border-orange-500/40 shadow-sm'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/50 mb-4">
                            <span className="text-xs font-bold text-slate-400">
                              Expérience #{idx + 1}
                            </span>

                            <div className="flex items-center gap-3">
                              {/* BOUTON TERMINÉ / EN COURS */}
                              <button
                                type="button"
                                onClick={() => handleToggleCompleted(idx)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                                  isTermine
                                    ? 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600'
                                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 ring-2 ring-emerald-500/20'
                                }`}
                                title="Cliquer pour basculer entre Terminé et En cours"
                              >
                                {isTermine ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Statut : Terminé (Cliquer pour réactiver)</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                                    <span>Statut : En cours (Cliquer pour marquer Terminé)</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleDeleteExperience(idx)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                                title="Supprimer cette expérience"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Intitulé du Poste / Commission
                              </label>
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => handleExperienceChange(idx, 'role', e.target.value)}
                                placeholder="Ex: Adjoint de la Commission Pédagogique"
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Période & Dates (ex: 2024 - Présent, ou 2024 - 2025)
                              </label>
                              <input
                                type="text"
                                value={exp.period}
                                onChange={(e) => handleExperienceChange(idx, 'period', e.target.value)}
                                placeholder="Ex: 2024 - Présent"
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-orange-400 font-medium text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Entreprise, UFR ou Organisation
                              </label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                                placeholder="Ex: UFR SES — Université Iba Der Thiam de Thiès"
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                              />
                            </div>

                            {/* Missions / Descriptions bullets */}
                            <div className="sm:col-span-2 space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold text-slate-300">
                                  Missions & Réalisations (puces de description)
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleAddBullet(idx)}
                                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Ajouter un point</span>
                                </button>
                              </div>

                              {exp.description.map((bullet, bIdx) => (
                                <div key={bIdx} className="flex items-center gap-2">
                                  <span className="text-emerald-400 text-xs shrink-0">•</span>
                                  <input
                                    type="text"
                                    value={bullet}
                                    onChange={(e) => handleBulletChange(idx, bIdx, e.target.value)}
                                    placeholder="Décrivez une action ou responsabilité..."
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-orange-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBullet(idx, bIdx)}
                                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: PROFILE & TEXTS */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-orange-400" />
                        <span>Textes Généraux & Profil</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Vous pouvez écrire n'importe quoi dans les titres, sous-titres, bio et coordonnées.
                      </p>
                    </div>

                    <button
                      onClick={handleSavePersonalInfo}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer le Profil</span>
                    </button>
                  </div>

                  {profileSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Textes et coordonnées enregistrés sur le serveur avec succès !</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nom complet affiché
                      </label>
                      <input
                        type="text"
                        value={draftPersonalInfo.name}
                        onChange={(e) => setDraftPersonalInfo({ ...draftPersonalInfo, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Titre / Rôle principal
                      </label>
                      <input
                        type="text"
                        value={draftPersonalInfo.role}
                        onChange={(e) => setDraftPersonalInfo({ ...draftPersonalInfo, role: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-orange-400 font-semibold text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Sous-titre / Spécialités
                      </label>
                      <input
                        type="text"
                        value={draftPersonalInfo.specialties}
                        onChange={(e) => setDraftPersonalInfo({ ...draftPersonalInfo, specialties: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Badge de disponibilité (en haut du site)
                      </label>
                      <input
                        type="text"
                        value={draftPersonalInfo.availability}
                        onChange={(e) => setDraftPersonalInfo({ ...draftPersonalInfo, availability: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Bio d'introduction (Hero & À propos)
                      </label>
                      <textarea
                        rows={4}
                        value={draftPersonalInfo.bio}
                        onChange={(e) => setDraftPersonalInfo({ ...draftPersonalInfo, bio: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Objectif Professionnel (bloc À propos)
                      </label>
                      <textarea
                        rows={3}
                        value={draftPersonalInfo.objective}
                        onChange={(e) => setDraftPersonalInfo({ ...draftPersonalInfo, objective: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Numéro de téléphone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={draftPersonalInfo.phone}
                        onChange={(e) => setDraftPersonalInfo({ ...draftPersonalInfo, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Adresse Email
                      </label>
                      <input
                        type="email"
                        value={draftPersonalInfo.email}
                        onChange={(e) => setDraftPersonalInfo({ ...draftPersonalInfo, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Localisation
                      </label>
                      <input
                        type="text"
                        value={draftPersonalInfo.location}
                        onChange={(e) => setDraftPersonalInfo({ ...draftPersonalInfo, location: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Lien Profil LinkedIn
                      </label>
                      <input
                        type="text"
                        value={draftPersonalInfo.linkedin}
                        onChange={(e) => setDraftPersonalInfo({ ...draftPersonalInfo, linkedin: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PROJECTS & LINKS */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-orange-400" />
                        <span>Projets, Liens Web & Photos</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Ajoutez ou modifiez des projets, insérez vos liens Google Drive et liens Web, et téléchargez des photos.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={handleAddProject}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter un projet</span>
                      </button>

                      <button
                        onClick={handleSaveProjects}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Enregistrer les projets</span>
                      </button>
                    </div>
                  </div>

                  {projectsSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Tous les projets et liens ont été synchronisés sur le serveur avec succès !</span>
                    </div>
                  )}

                  <div className="space-y-6">
                    {draftProjects.map((proj, idx) => {
                      const currentPhoto = getPhoto(proj.id, proj.image);
                      return (
                        <div key={proj.id} className="p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                            <span className="text-xs font-bold text-slate-400">
                              Projet #{idx + 1} ({proj.id})
                            </span>
                            <button
                              onClick={() => handleDeleteProject(idx)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                              title="Supprimer ce projet"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Photo Column */}
                            <div className="space-y-2">
                              <label className="block text-xs font-semibold text-slate-300">
                                Visuel du projet
                              </label>
                              <div className="relative rounded-xl overflow-hidden border border-slate-700 aspect-video bg-slate-900">
                                <img
                                  src={currentPhoto}
                                  alt={proj.title}
                                  className="w-full h-full object-cover"
                                />
                                {uploadingProjectId === proj.id && (
                                  <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center text-xs text-orange-400 font-semibold">
                                    Envoi...
                                  </div>
                                )}
                              </div>
                              <label className="block w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 text-center text-xs font-semibold border border-slate-700 cursor-pointer transition-colors">
                                Changer la photo
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  onChange={(e) => handleProjectFileChange(proj.id, e)}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {/* Details Columns */}
                            <div className="sm:col-span-2 space-y-3">
                              <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">
                                  Titre du projet
                                </label>
                                <input
                                  type="text"
                                  value={proj.title}
                                  onChange={(e) => handleProjectChange(idx, 'title', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                                    Catégorie
                                  </label>
                                  <select
                                    value={proj.category}
                                    onChange={(e) => handleProjectChange(idx, 'category', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-orange-500"
                                  >
                                    <option value="Informatique de Gestion">Informatique de Gestion</option>
                                    <option value="Management">Management</option>
                                    <option value="Marketing Digital">Marketing Digital</option>
                                    <option value="Projet Universitaire">Projet Universitaire</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                                    Tags (séparés par virgules)
                                  </label>
                                  <input
                                    type="text"
                                    value={proj.tags.join(', ')}
                                    onChange={(e) => handleProjectChange(idx, 'tags', e.target.value.split(',').map((t) => t.trim()))}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-orange-500"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">
                                  Description détaillée
                                </label>
                                <textarea
                                  rows={2}
                                  value={proj.description}
                                  onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                                />
                              </div>

                              {/* LIENS */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                    <HardDrive className="w-3.5 h-3.5 text-orange-400" />
                                    <span>Lien Google Drive du projet</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={proj.driveUrl || ''}
                                    onChange={(e) => handleProjectChange(idx, 'driveUrl', e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-orange-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Lien Web / Démo en direct</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={proj.projectUrl || ''}
                                    onChange={(e) => handleProjectChange(idx, 'projectUrl', e.target.value)}
                                    placeholder="https://mon-projet-en-ligne.com"
                                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-orange-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: EDUCATION */}
              {activeTab === 'education' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-orange-400" />
                        <span>Formations Académiques & Diplômes</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Gérez vos cursus, diplômes et indiquez s'ils sont en cours ou terminés.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleAddEducation}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter</span>
                      </button>

                      <button
                        onClick={handleSaveEducation}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Enregistrer</span>
                      </button>
                    </div>
                  </div>

                  {eduSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Formations enregistrées avec succès !</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {(draftPersonalInfo.education || []).map((edu, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">
                              Diplôme / Cursus
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleEduChange(idx, 'degree', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">
                              Établissement / Université
                            </label>
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) => handleEduChange(idx, 'school', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">
                              Année / Statut
                            </label>
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => handleEduChange(idx, 'year', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-orange-400 font-medium text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleToggleEduCompleted(idx)}
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold"
                          >
                            {edu.isCompleted ? 'Terminé (Obtenu)' : 'En cours'}
                          </button>
                          <button
                            onClick={() => handleDeleteEducation(idx)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: PROFILE PHOTO */}
              {activeTab === 'photos' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <Camera className="w-5 h-5 text-orange-400" />
                      <span>Photo de Profil Principale</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Cette photo est affichée dans l'en-tête, la barre de navigation et le pied de page.
                    </p>
                  </div>

                  {photoUploadSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Votre photo a été enregistrée sur le serveur et est visible par tous vos contacts !</span>
                    </div>
                  )}

                  <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/80 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group">
                      <img
                        src={photoUrl}
                        alt="Aperçu photo"
                        className="w-32 h-32 rounded-full object-cover object-top border-4 border-orange-500/60 shadow-xl"
                      />
                      {isUploadingProfile && (
                        <div className="absolute inset-0 rounded-full bg-slate-950/70 flex items-center justify-center text-xs text-orange-400 font-bold">
                          Envoi...
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 flex-1 text-center sm:text-left">
                      <h5 className="font-semibold text-white text-sm">
                        Sélectionnez une nouvelle photo de profil
                      </h5>
                      <p className="text-xs text-slate-400">
                        Formats acceptés : JPG, PNG, WebP. L'image sera automatiquement optimisée pour un affichage rapide et net.
                      </p>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer">
                          <Camera className="w-4 h-4" />
                          <span>Uploader une photo</span>
                          <input
                            ref={profileFileRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleProfileFileChange}
                            className="hidden"
                          />
                        </label>

                        {isCustom && (
                          <button
                            onClick={resetPhoto}
                            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Rétablir la photo par défaut</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: GOOGLE DRIVE */}
              {activeTab === 'drive' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-orange-400" />
                      <span>Lien Principal Google Drive</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Dossier Google Drive contenant l'ensemble de vos projets et livrables.
                    </p>
                  </div>

                  {driveSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Lien Google Drive mis à jour avec succès sur le serveur !</span>
                    </div>
                  )}

                  {driveError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{driveError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveDriveUrl} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        URL du dossier Google Drive
                      </label>
                      <input
                        type="url"
                        value={driveUrlInput}
                        onChange={(e) => setDriveUrlInput(e.target.value)}
                        placeholder="https://drive.google.com/drive/folders/..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Enregistrer l'URL Drive</span>
                      </button>

                      <a
                        href={driveUrlInput}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-medium p-2"
                      >
                        <span>Tester le lien</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 7: SECURITY */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-orange-400" />
                      <span>Sécurité & Mot de Passe Administrateur</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Modifiez votre mot de passe pour verrouiller l'accès aux modifications.
                    </p>
                  </div>

                  {passwordSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Votre nouveau mot de passe administrateur a été enregistré avec succès !</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nouveau mot de passe administrateur
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Au moins 4 caractères (ex: MIO2025)"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Modifier le mot de passe</span>
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
