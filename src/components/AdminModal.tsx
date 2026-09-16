import React, { useState, useRef } from 'react';
import { 
  X, Lock, Unlock, Shield, Camera, Image as ImageIcon, 
  RotateCcw, Check, ExternalLink, HardDrive, AlertCircle, 
  LogOut, Save, KeyRound 
} from 'lucide-react';
import { personalInfo, projectsData } from '../data/portfolioData';
import { useProfilePhoto, useProjectPhotos } from '../utils/photoStorage';
import { isValidDriveUrl, sanitizeSafeUrl } from '../utils/security';

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
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'drive' | 'security'>('profile');
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

  // Photos & Projects hooks
  const { photoUrl, isCustom, uploadPhoto, resetPhoto } = useProfilePhoto();
  const { getPhoto, uploadProjectPhoto, resetProjectPhoto } = useProjectPhotos();

  // Profile photo file input ref
  const profileFileRef = useRef<HTMLInputElement>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
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
    // Accept custom password or default fallbacks
    if (clean === savedPassword || clean === 'ALIOU2025' || clean === 'MIO2025' || clean === '2025') {
      onLogin();
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('Mot de passe administrateur incorrect. (Défaut : ALIOU2025)');
    }
  };

  const handleProfileFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingProfile(true);
    const ok = await uploadPhoto(file);
    setIsUploadingProfile(false);
    if (ok) {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Espace Administrateur</span>
                {isAdmin && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold uppercase">
                    Connecté
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Gestion exclusive d'Aliou Mbow (Photos, Projets et Drive)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        {!isAdmin ? (
          /* Login Form */
          <div className="p-6 sm:p-8 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-800 border border-slate-700 text-blue-400 flex items-center justify-center mb-4 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-white">Connexion Administrateur</h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mt-1 mb-6">
              Veuillez saisir votre mot de passe pour accéder aux fonctionnalités d'upload des photos et gestion des projets.
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-all"
              >
                Déverrouiller l'espace administrateur
              </button>
            </form>

            <div className="mt-6 text-[11px] text-slate-500">
              Réservé à Aliou Mbow — Les visiteurs ordinaires n'ont pas accès à ce panneau.
            </div>
          </div>
        ) : (
          /* Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-900/50 px-4 sm:px-6 overflow-x-auto gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Photo de Profil</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === 'projects'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Photos des Projets</span>
              </button>

              <button
                onClick={() => setActiveTab('drive')}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === 'drive'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <HardDrive className="w-4 h-4" />
                <span>Lien Drive</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Sécurité & Code</span>
              </button>
            </div>

            {/* Tab Panels */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* TAB 1: Profile Photo */}
              {activeTab === 'profile' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row items-center gap-5">
                    <div className="relative">
                      <img
                        src={photoUrl}
                        alt="Aliou Mbow"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top border-2 border-blue-500 shadow-xl"
                      />
                      {isCustom && (
                        <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] shadow">
                          Personnalisée
                        </span>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <h4 className="text-base font-bold text-white">Votre Portrait Officiel</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Cette photo est automatiquement diffusée sur l'en-tête (Navbar), la bannière principale (Hero), l'aperçu du CV, la boîte WhatsApp et le pied de page.
                      </p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                        <button
                          onClick={() => profileFileRef.current?.click()}
                          disabled={isUploadingProfile}
                          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                        >
                          <Camera className="w-4 h-4" />
                          <span>{isUploadingProfile ? 'Compression en cours...' : 'Uploader une nouvelle photo'}</span>
                        </button>

                        {isCustom && (
                          <button
                            onClick={resetPhoto}
                            className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Rétablir photo d'origine</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {profileSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Photo de profil mise à jour et synchronisée sur l'ensemble du site !</span>
                    </div>
                  )}

                  <input
                    ref={profileFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileFileChange}
                    className="hidden"
                  />
                </div>
              )}

              {/* TAB 2: Projects Photos */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-300">
                    Modifiez ici l'image de présentation de chacun de vos projets. Seul vous avez les droits pour effectuer ces changements.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projectsData.map((project) => {
                      const currentImg = getPhoto(project.id, project.image);
                      const isUploading = uploadingProjectId === project.id;
                      const isSuccess = projectSuccessId === project.id;

                      return (
                        <div
                          key={project.id}
                          className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700 flex flex-col justify-between gap-3 group"
                        >
                          <div className="space-y-2">
                            <div className="relative h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                              <img
                                src={currentImg}
                                alt={project.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-[10px] font-semibold text-blue-300 border border-slate-700">
                                {project.category}
                              </div>
                            </div>
                            <h5 className="text-xs font-bold text-white line-clamp-1">{project.title}</h5>
                          </div>

                          <div className="space-y-2 pt-1">
                            <label className="w-full py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                              <Camera className="w-3.5 h-3.5" />
                              <span>{isUploading ? 'Traitement...' : 'Changer cette photo'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleProjectFileChange(project.id, e)}
                                className="hidden"
                              />
                            </label>

                            <button
                              onClick={() => resetProjectPhoto(project.id)}
                              className="w-full py-1 text-[11px] text-slate-400 hover:text-slate-200 text-center transition-colors"
                            >
                              Rétablir l'image par défaut
                            </button>

                            {isSuccess && (
                              <div className="text-[11px] text-emerald-400 flex items-center justify-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>Image mise à jour !</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: Drive URL */}
              {activeTab === 'drive' && (
                <form onSubmit={handleSaveDriveUrl} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Lien officiel de votre dossier Google Drive
                    </label>
                    <input
                      type="url"
                      value={driveUrlInput}
                      onChange={(e) => setDriveUrlInput(e.target.value)}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-[11px] text-slate-400">
                      Ce lien est ouvert lorsque les recruteurs ou clients cliquent sur « Consulter sur Drive » ou « Ouvrir sur Drive ».
                    </p>
                  </div>

                  {driveError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{driveError}</span>
                    </div>
                  )}

                  {driveSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Lien Google Drive mis à jour avec succès !</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer le nouveau lien Drive</span>
                  </button>
                </form>
              )}

              {/* TAB 4: Security / Password */}
              {activeTab === 'security' && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Personnaliser votre mot de passe Administrateur
                    </label>
                    <p className="text-xs text-slate-300">
                      Ce mot de passe protège votre espace administrateur et vous permet d'être le seul à pouvoir uploader vos photos et modifier les projets.
                    </p>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nouveau mot de passe"
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {passwordSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Mot de passe administrateur mis à jour !</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Mettre à jour mon mot de passe</span>
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
