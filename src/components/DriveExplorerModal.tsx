import React, { useState } from 'react';
import { X, HardDrive, Folder, FileText, FileSpreadsheet, Database, ExternalLink, Download, Search, Check, Edit3, ChevronRight, Eye, ShieldCheck } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { sanitizeSafeUrl, isValidDriveUrl, sanitizeInput } from '../utils/security';

interface DriveFile {
  id: string;
  name: string;
  type: 'access' | 'excel' | 'pdf' | 'word';
  size: string;
  date: string;
  description: string;
  highlights: string[];
}

interface DriveFolder {
  id: string;
  name: string;
  category: string;
  filesCount: number;
  files: DriveFile[];
}

interface DriveExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFolderId?: string;
}

export const DriveExplorerModal: React.FC<DriveExplorerModalProps> = ({
  isOpen,
  onClose,
  initialFolderId
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>(initialFolderId || 'folder-access');
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [customDriveUrl, setCustomDriveUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('aliou_drive_url');
      if (saved && !saved.includes('1AliouMbow_Projets')) {
        return saved;
      }
      if (saved && saved.includes('1AliouMbow_Projets')) {
        localStorage.removeItem('aliou_drive_url');
      }
    } catch {
      // Ignore
    }
    return personalInfo.googleDriveProjectsUrl;
  });
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(customDriveUrl);

  if (!isOpen) return null;

  const folders: DriveFolder[] = [
    {
      id: 'folder-access',
      name: '1. Bases de Données & Informatique de Gestion',
      category: 'Informatique de Gestion',
      filesCount: 3,
      files: [
        {
          id: 'acc-1',
          name: 'Base_Access_Gestion_Commerciale_MIO.accdb',
          type: 'access',
          size: '4.2 Mo',
          date: '2024-11-15',
          description: "Base de données relationnelle Microsoft Access complète pour la gestion des clients, des commandes, des produits et des factures d'entreprise.",
          highlights: [
            "Tables relationnelles normalisées (Clients, Articles, Commandes, LignesFacture)",
            "Formulaires ergonomiques de saisie et de consultation avec contrôles d'intégrité",
            "Requêtes SQL multicritères et états d'impression automatisés"
          ]
        },
        {
          id: 'acc-2',
          name: 'Dictionnaire_Donnees_Schema_Relationnel.pdf',
          type: 'pdf',
          size: '1.4 Mo',
          date: '2024-11-18',
          description: "Dossier de conception : modélisation conceptuelle (MCD/MLD), définition des clés primaires/étrangères et contraintes d'intégrité.",
          highlights: [
            "Modèle conceptuel et logique des données",
            "Matrice des droits et intégrité référentielle",
            "Cas d'usage et cahier des charges opérationnel"
          ]
        },
        {
          id: 'acc-3',
          name: 'Requetes_Analytiques_SQL_Access.docx',
          type: 'word',
          size: '850 Ko',
          date: '2024-11-20',
          description: "Documentation des requêtes complexes : calcul du chiffre d'affaires mensuel, clients réguliers, alertes de rupture de stock.",
          highlights: [
            "Requêtes de sélection, jointures et regroupements",
            "Requêtes de mise à jour et d'archivage",
            "Génération d'états récapitulatifs périodiques"
          ]
        }
      ]
    },
    {
      id: 'folder-management',
      name: '2. Management & Organisation Universitaire (MIO)',
      category: 'Management',
      filesCount: 3,
      files: [
        {
          id: 'mgt-1',
          name: 'Rapport_MIO_Audit_Organisation_Entreprise.pdf',
          type: 'pdf',
          size: '3.1 Mo',
          date: '2024-12-05',
          description: "Étude d'organisation d'entreprise : diagnostic organisationnel, cartographie des flux d'information et propositions d'amélioration.",
          highlights: [
            "Analyse des processus et circuits administratifs",
            "Identification des goulots d'étranglement organisationnels",
            "Plan d'action et recommandations pour l'efficacité d'équipe"
          ]
        },
        {
          id: 'mgt-2',
          name: 'Bilan_Activites_Commission_Pedagogique_SES.pdf',
          type: 'pdf',
          size: '1.8 Mo',
          date: '2024-10-12',
          description: "Rapport d'activités en tant qu'Adjoint de la Commission Pédagogique (UFR SES, Université Iba Der Thiam de Thiès).",
          highlights: [
            "Suivi de la coordination pédagogique et écoute des promotions",
            "Organisation des plannings de renforcement et de révision",
            "Intermédiation active avec le corps professoral"
          ]
        },
        {
          id: 'mgt-3',
          name: 'Projet_Social_Solidaire_CEERCOOP_Passy.pdf',
          type: 'pdf',
          size: '1.2 Mo',
          date: '2024-08-20',
          description: "Gestion et pilotage de la Commission Sociale : actions d'entraide, soutien aux étudiants et gestion budgétaire.",
          highlights: [
            "Coordination logistique et financière des aides sociales",
            "Mobilisation communautaire et partenariats locaux",
            "Compte-rendu d'impact et gouvernance"
          ]
        }
      ]
    },
    {
      id: 'folder-intellia',
      name: '3. Gestion Commerciale & Application Intellia',
      category: 'Ventes & Gestion',
      filesCount: 2,
      files: [
        {
          id: 'int-1',
          name: 'Suivi_Performance_Ventes_Intellia.xlsx',
          type: 'excel',
          size: '2.3 Mo',
          date: '2025-01-10',
          description: "Tableau de bord de suivi commercial issu de l'application Intellia : chiffre d'affaires, paniers moyens, marges et rotation des stocks.",
          highlights: [
            "Indicateurs clés de performance (KPI) de vente",
            "Graphiques d'évolution hebdomadaire et mensuelle",
            "Segmentation de la clientèle et historique d'achats"
          ]
        },
        {
          id: 'int-2',
          name: 'Guide_Fidelisation_et_Gestion_Ventes.pdf',
          type: 'pdf',
          size: '1.1 Mo',
          date: '2025-01-22',
          description: "Procédure opérationnelle pour la conduite d'une activité commerciale autonome avec suivi digitalisé.",
          highlights: [
            "Techniques d'accueil et négociation client",
            "Optimisation du cycle de vente et relances",
            "Contrôle journalier des caisses et rapprochement bancaire"
          ]
        }
      ]
    },
    {
      id: 'folder-marketing',
      name: '4. Marketing Digital & Personal Branding',
      category: 'Marketing Digital',
      filesCount: 2,
      files: [
        {
          id: 'mkt-1',
          name: 'Strategie_Contenu_Digital_Aliou_Mbow.pdf',
          type: 'pdf',
          size: '2.7 Mo',
          date: '2025-02-02',
          description: "Ligne éditoriale, piliers de contenu et méthodologie de diffusion pour bâtir une audience engagée sur LinkedIn et réseaux professionnels.",
          highlights: [
            "Piliers thématiques : Management MIO, Marketing digital, Outils IA",
            "Calendrier de publication et formats à fort engagement",
            "Métriques de visibilité et personal branding"
          ]
        },
        {
          id: 'mkt-2',
          name: 'Plan_Community_Management_et_Engagement.pdf',
          type: 'pdf',
          size: '1.5 Mo',
          date: '2025-02-14',
          description: "Guide d'animation de communautés : ton, gestion des interactions, fidélisation et prospection entrante.",
          highlights: [
            "Stratégie de storytelling professionnel",
            "Gestion des commentaires et messageries directes",
            "Veille concurrentielle et tendances marketing"
          ]
        }
      ]
    }
  ];

  const activeFolder = folders.find(f => f.id === selectedFolderId) || folders[0];

  const cleanQuery = sanitizeInput(searchQuery, 80).toLowerCase();
  const filteredFiles = activeFolder.files.filter(f =>
    f.name.toLowerCase().includes(cleanQuery) ||
    f.description.toLowerCase().includes(cleanQuery)
  );

  const getFileIcon = (type: DriveFile['type']) => {
    switch (type) {
      case 'access':
        return <Database className="w-6 h-6 text-red-400" />;
      case 'excel':
        return <FileSpreadsheet className="w-6 h-6 text-emerald-400" />;
      case 'word':
        return <FileText className="w-6 h-6 text-blue-400" />;
      case 'pdf':
      default:
        return <FileText className="w-6 h-6 text-rose-400" />;
    }
  };

  const handleSaveUrl = (e: React.FormEvent) => {
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
    setIsEditingUrl(false);
  };

  const handleDownloadSummary = (file: DriveFile) => {
    const textContent = `DOSSIER PROJET GOOGLE DRIVE — ALIOU MBOW
Email du propriétaire : ${personalInfo.email}
Fichier : ${file.name}
Type : ${file.type.toUpperCase()} | Taille : ${file.size} | Date : ${file.date}

DESCRIPTION :
${file.description}

POINTS CLÉS & CONTENU :
${file.highlights.map(h => `- ${h}`).join('\n')}

Pour consulter l'intégralité du projet et les fichiers sources, ouvrez le Google Drive d'Aliou Mbow :
${customDriveUrl}
Contact : ${personalInfo.email} / ${personalInfo.phone}
`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Synthese_${file.name.replace(/\.[^/.]+$/, "")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl my-6 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-sm shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Google Drive — Espace Projets
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[11px] font-medium hidden sm:inline-block">
                  Compte : {personalInfo.email}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Fichiers sources, bases de données Access, rapports de gestion et livrables MIO
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <a
              href={customDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl transition-all shadow-md min-h-[40px]"
            >
              <span>Ouvrir sur Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setIsEditingUrl(!isEditingUrl)}
              className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              title="Modifier le lien Google Drive"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ml-1 cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional Custom Drive URL Editor */}
        {isEditingUrl && (
          <div className="px-6 py-3 bg-orange-950/30 border-b border-orange-800/40">
            <form onSubmit={handleSaveUrl} className="flex flex-col sm:flex-row gap-2 items-center">
              <span className="text-xs text-orange-300 font-medium whitespace-nowrap">
                Lien de votre dossier Drive :
              </span>
              <input
                type="url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className="flex-1 w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-orange-500/40 text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Enregistrer</span>
              </button>
            </form>
          </div>
        )}

        {/* Explorer Layout: Sidebar Folders + Files Grid */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          
          {/* Folders Navigation Sidebar */}
          <div className="md:col-span-4 bg-slate-900/90 border-r border-slate-800 p-4 max-h-48 md:max-h-none overflow-y-auto space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
              <span>Dossiers de Projets</span>
              <span className="text-orange-400 font-mono">{folders.length}</span>
            </div>

            {folders.map((folder) => {
              const isActive = folder.id === selectedFolderId;
              return (
                <button
                  key={folder.id}
                  onClick={() => {
                    setSelectedFolderId(folder.id);
                    setSelectedFile(null);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold shadow-md shadow-orange-500/25'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Folder className={`w-5 h-5 shrink-0 ${isActive ? 'text-slate-950' : 'text-orange-400'}`} />
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate leading-tight">
                        {folder.name}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${isActive ? 'text-slate-900/80 font-medium' : 'text-slate-400'}`}>
                        {folder.filesCount} document{folder.filesCount > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                </button>
              );
            })}

            <div className="mt-6 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-orange-400 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Propriétaire des fichiers</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Aliou Mbow — <span className="text-slate-200">{personalInfo.email}</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Tous les fichiers sont préparés et structurés dans le cadre de la formation MIO.
              </p>
            </div>
          </div>

          {/* Main Files Area */}
          <div className="md:col-span-8 p-4 sm:p-6 overflow-y-auto flex flex-col bg-slate-950/40">
            
            {/* Search & Folder title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Folder className="w-4 h-4 text-orange-400" />
                  <span>{activeFolder.name}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Catégorie : <span className="text-amber-400 font-medium">{activeFolder.category}</span>
                </p>
              </div>

              {/* Search filter */}
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  maxLength={60}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un fichier..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Files List */}
            <div className="space-y-3 flex-1">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Aucun fichier ne correspond à votre recherche.
                </div>
              ) : (
                filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-3.5 flex-1">
                      <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 group-hover:scale-105 transition-transform shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                          {file.name}
                        </h5>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {file.description}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                          <span className="font-mono text-orange-400">{file.size}</span>
                          <span>•</span>
                          <span>Mis à jour : {file.date}</span>
                          <span>•</span>
                          <span className="uppercase font-semibold text-slate-300">Format {file.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => setSelectedFile(file)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 hover:border-orange-500/30 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-orange-400" />
                        <span>Aperçu</span>
                      </button>

                      <button
                        onClick={() => handleDownloadSummary(file)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 border border-orange-500/30 text-xs font-semibold transition-colors cursor-pointer"
                        title="Télécharger la fiche de synthèse du projet"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Fiche projet</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom quick CTA */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                Compte Google Drive certifié : <strong className="text-white">{personalInfo.email}</strong>
              </span>
              <a
                href={customDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
              >
                <span>Accéder au dossier en ligne complet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>

        {/* Selected File Details Modal */}
        {selectedFile && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md p-6 flex flex-col justify-center items-center z-10">
            <div className="max-w-xl w-full bg-slate-900 border border-slate-700 p-6 sm:p-8 rounded-3xl shadow-2xl relative space-y-4">
              <button
                onClick={() => setSelectedFile(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  {getFileIcon(selectedFile.type)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white break-all">{selectedFile.name}</h4>
                  <div className="text-xs text-slate-400 flex gap-2 mt-0.5">
                    <span>Taille : {selectedFile.size}</span>
                    <span>•</span>
                    <span>Date : {selectedFile.date}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Description</span>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  {selectedFile.description}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Contenu clé du fichier</span>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                  {selectedFile.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleDownloadSummary(selectedFile)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger la fiche</span>
                </button>
                <a
                  href={customDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Ouvrir sur Drive</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
