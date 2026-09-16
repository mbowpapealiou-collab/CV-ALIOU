import { Project, SkillCategory, Experience } from '../types';

export const personalInfo = {
  name: "Aliou Mbow",
  role: "Management Informatisé des Organisations (MIO)",
  specialties: "Marketing Digital • Community Management • Informatique de Gestion",
  email: "mbowpapealiou@gmail.com",
  phone: "+221 78 333 31 75",
  location: "Dakar & Thiès, Sénégal",
  linkedin: "https://linkedin.com/in/aliou-mbow-4b5ba7350",
  // Google Drive folder where Aliou stores all his project deliverables, presentations and reports
  googleDriveProjectsUrl: "https://drive.google.com/drive/folders/17Cq4kaG9C9S1aXyA0SLF7PC7p0xg8SO3?usp=drive_link",
  photoUrl: "/photo.jpg",
  availability: "À la recherche d'une opportunité en Management / Gestion / Marketing Digital",
  bio: "Étudiant en 3ème année de Management Informatisé des Organisations (MIO) à l'Université Iba Der Thiam de Thiès, à l'intersection du management, de l'informatique de gestion et de la communication numérique. Force de proposition, rigoureux et autonome, j'ai déjà mis en pratique mes compétences à travers le pilotage d'une activité commerciale et la création de contenu digital.",
  objective: "Intégrer une structure où je peux apprendre vite, contribuer à des projets concrets dès les premières semaines et prendre progressivement des responsabilités. Objectif à long terme : évoluer vers des fonctions de management et de gestion, avec une ambition de carrière vers la Direction Administrative et Financière.",
  education: [
    {
      degree: "Management Informatisé des Organisations (MIO) — 3ème année",
      school: "Université Iba Der Thiam de Thiès",
      year: "En cours"
    },
    {
      degree: "Baccalauréat S2+",
      school: "Série Scientifique",
      year: "Obtenu en 2024"
    }
  ],
  stats: [
    { label: "Formation MIO", value: "3e Année" },
    { label: "Commissions Dirigées", value: "3" },
    { label: "Bases & Outils Maîtrisés", value: "10+" },
    { label: "Rigueur & Engagement", value: "100%" }
  ]
};

export const skillsData: SkillCategory[] = [
  {
    title: "Management & Organisation",
    iconName: "Briefcase",
    skills: [
      { name: "Organisation du travail & planification", level: 92 },
      { name: "Coordination & esprit d'équipe", level: 95 },
      { name: "Pilotage d'activité & suivi d'objectifs", level: 88 },
      { name: "Gestion de commissions associatives", level: 90 }
    ]
  },
  {
    title: "Marketing Digital & Community",
    iconName: "Megaphone",
    skills: [
      { name: "Création de contenu digital & idéation", level: 90 },
      { name: "Stratégie & présence numérique", level: 88 },
      { name: "Animation de communautés (Community)", level: 85 },
      { name: "Personal Branding & Réseaux Sociaux", level: 88 }
    ]
  },
  {
    title: "Informatique de Gestion & Données",
    iconName: "Database",
    skills: [
      { name: "Microsoft Access (Tables, relations, requêtes)", level: 90 },
      { name: "Microsoft Excel & Traitement de données", level: 88 },
      { name: "Microsoft Word (Rédaction professionnelle)", level: 92 },
      { name: "Suivi commercial (Application Intellia)", level: 85 }
    ]
  },
  {
    title: "IA, Outils Numériques & Communication",
    iconName: "Cpu",
    skills: [
      { name: "Outils d'IA & Productivité numérique", level: 92 },
      { name: "Aisance relationnelle & négociation", level: 90 },
      { name: "Présentations & expression orale", level: 90 },
      { name: "Gestion autonome & résolution de problèmes", level: 94 }
    ]
  }
];

export const projectsData: Project[] = [
  {
    id: "proj-1",
    title: "Base de Données de Gestion — Microsoft Access",
    category: "Informatique de Gestion",
    description: "Conception complète d'une base de données relationnelle de gestion sous Access : structuration rigoureuse des tables, définition des relations d'intégrité et élaboration de requêtes multicritères pour répondre aux besoins opérationnels de l'entreprise.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    tags: ["Microsoft Access", "Bases de Données", "Gestion", "Modélisation"],
    driveUrl: "https://drive.google.com/drive/folders/17Cq4kaG9C9S1aXyA0SLF7PC7p0xg8SO3?usp=drive_link",
    featured: true
  },
  {
    id: "proj-2",
    title: "Pilotage Commercial & Gestion des Ventes — App Intellia",
    category: "Management",
    description: "Gestion autonome d'une activité commerciale avec l'application Intellia : suivi rigoureux du chiffre d'affaires, analyse des performances des ventes, gestion des stocks et stratégie active de fidélisation de la clientèle.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    tags: ["Intellia", "Gestion Commerciale", "KPI Ventes", "Relation Client"],
    driveUrl: "https://drive.google.com/drive/folders/17Cq4kaG9C9S1aXyA0SLF7PC7p0xg8SO3?usp=drive_link",
    featured: true
  },
  {
    id: "proj-3",
    title: "Stratégie de Contenu Digital & Personal Branding",
    category: "Marketing Digital",
    description: "Construction et déploiement d'une présence numérique autour du marketing digital, du management, de l'entrepreneuriat et du développement de carrière, de la phase d'idéation jusqu'à la publication et l'engagement d'audience.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    tags: ["Marketing Digital", "Content Creation", "Community Management", "LinkedIn"],
    driveUrl: "https://drive.google.com/drive/folders/17Cq4kaG9C9S1aXyA0SLF7PC7p0xg8SO3?usp=drive_link",
    featured: true
  },
  {
    id: "proj-4",
    title: "Travaux Appliqués en Management des Organisations",
    category: "Projet Universitaire",
    description: "Réalisation de projets d'étude en organisation d'entreprise, optimisation des circuits d'information et audit organisationnel menés dans le cadre du cursus universitaire MIO à l'Université Iba Der Thiam.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    tags: ["MIO", "Organisation", "Management", "Audit"],
    driveUrl: "https://drive.google.com/drive/folders/17Cq4kaG9C9S1aXyA0SLF7PC7p0xg8SO3?usp=drive_link",
    featured: true
  }
];

export const experiencesData: Experience[] = [
  {
    period: "2024 - Présent",
    role: "Adjoint de la Commission Pédagogique",
    company: "UFR Sciences Économiques et Sociales (SES) — Université Iba Der Thiam de Thiès",
    description: [
      "Appui direct à l'organisation et au suivi des questions pédagogiques au sein de l'UFR SES.",
      "Intermédiation et écoute active entre le corps professoral, l'administration et les étudiants.",
      "Coordination d'événements universitaires et suivi académique des promotions."
    ]
  },
  {
    period: "2023 - 2024",
    role: "Président de la Commission Sociale",
    company: "CEERCOOP de Passy, Thiès",
    description: [
      "Pilotage stratégique des actions sociales et solidaires de la coopérative.",
      "Coordination de l'ensemble des initiatives d'entraide et représentation officielle de la commission.",
      "Gestion d'équipe, planification budgétaire et communication avec les partenaires."
    ]
  },
  {
    period: "2023 - 2024",
    role: "Président de la Commission Pédagogique",
    company: "AERT de Darou Mouhty, Thiès",
    description: [
      "Coordination globale des activités pédagogiques et de tutorat de l'association des ressortissants.",
      "Organisation de séances de renforcement scolaire, de conférences et de panels d'orientation.",
      "Mobilisation des ressources et accompagnement des nouveaux bacheliers et étudiants."
    ]
  },
  {
    period: "Activité continue",
    role: "Responsable Activité Commerciale & Création de Contenu",
    company: "Projet Personnel & Digital",
    description: [
      "Gestion autonome des ventes et pilotage des flux financiers via l'application Intellia.",
      "Création de contenu digital axé sur la transformation numérique, le management et la productivité.",
      "Fidélisation de la clientèle et prospection active."
    ]
  }
];

