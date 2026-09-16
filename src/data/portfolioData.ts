import { Project, SkillCategory, Experience } from '../types';

export const personalInfo = {
  name: "Pape Aliou Mbow",
  role: "Développeur Full Stack & Ingénieur Logiciel",
  email: "mbowpapealiou@gmail.com",
  github: "https://github.com/mbowpapealiou-collab",
  linkedin: "https://linkedin.com/in/mbowpapealiou",
  location: "Dakar, Sénégal / Disponible en Remote",
  availability: "Disponible immédiatement pour opportunités & missions freelance",
  bio: "Développeur Full Stack passionné par la création d'applications web modernes, réactives et performantes. Avec une solide expertise en React, Next.js, TypeScript, Node.js et Prisma, j'accompagne les équipes et entreprises dans la conception de solutions sur mesure allant de l'architecture logicielle au déploiement cloud.",
  stats: [
    { label: "Années d'expérience", value: "3+" },
    { label: "Projets menés à bien", value: "18+" },
    { label: "Technologies maîtrisées", value: "12+" },
    { label: "Satisfaction & Rigueur", value: "100%" }
  ]
};

export const skillsData: SkillCategory[] = [
  {
    title: "Frontend Development",
    iconName: "Layout",
    skills: [
      { name: "React & Next.js", level: 95 },
      { name: "TypeScript / JavaScript", level: 90 },
      { name: "Tailwind CSS & CSS3", level: 92 },
      { name: "Responsive & UI/UX Design", level: 88 },
      { name: "Gestion d'état (Zustand, Context)", level: 85 }
    ]
  },
  {
    title: "Backend & API",
    iconName: "Server",
    skills: [
      { name: "Node.js & Express", level: 90 },
      { name: "APIs RESTful & GraphQL", level: 88 },
      { name: "Prisma ORM & Mongoose", level: 87 },
      { name: "Architecture MVC & Clean Code", level: 85 },
      { name: "Authentification (JWT, NextAuth)", level: 88 }
    ]
  },
  {
    title: "Bases de Données",
    iconName: "Database",
    skills: [
      { name: "PostgreSQL", level: 88 },
      { name: "MongoDB", level: 85 },
      { name: "MySQL / MariaDB", level: 82 },
      { name: "Modélisation relationnelle", level: 90 },
      { name: "Optimisation de requêtes", level: 80 }
    ]
  },
  {
    title: "DevOps & Outils",
    iconName: "Terminal",
    skills: [
      { name: "Git & GitHub Workflow", level: 92 },
      { name: "Déploiement Vercel / Cloud Run", level: 88 },
      { name: "Docker & Conteneurs", level: 78 },
      { name: "Postman & Tests d'API", level: 85 },
      { name: "Linux & Bash scripting", level: 82 }
    ]
  }
];

export const projectsData: Project[] = [
  {
    id: "proj-1",
    title: "E-Commerce Nova Market",
    category: "Full Stack",
    description: "Plateforme e-commerce complète avec gestion du catalogue, panier dynamique, paiement sécurisé Stripe, et panneau d'administration.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
    liveUrl: "https://github.com/mbowpapealiou-collab",
    githubUrl: "https://github.com/mbowpapealiou-collab/CV-ALIOU",
    featured: true
  },
  {
    id: "proj-2",
    title: "SaaS TaskFlow Pro",
    category: "Full Stack",
    description: "Application collaborative de gestion de projets et tickets avec tableaux Kanban, assignation des tâches, notifications et rôles utilisateurs.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    liveUrl: "https://github.com/mbowpapealiou-collab",
    githubUrl: "https://github.com/mbowpapealiou-collab",
    featured: true
  },
  {
    id: "proj-3",
    title: "Plateforme de Réservation Médicale",
    category: "Full Stack",
    description: "Solution de prise de rendez-vous en ligne avec synchronisation de calendrier, rappels automatiques et gestion des créneaux horaires.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    tags: ["Next.js", "PostgreSQL", "Prisma", "Tailwind CSS"],
    liveUrl: "https://github.com/mbowpapealiou-collab",
    githubUrl: "https://github.com/mbowpapealiou-collab",
    featured: true
  },
  {
    id: "proj-4",
    title: "API REST Microservices & Auth",
    category: "Backend",
    description: "Service backend robuste avec authentification sécurisée JWT, contrôle d'accès basé sur les rôles (RBAC) et documentation OpenAPI Swagger.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    tags: ["Node.js", "Express", "TypeScript", "PostgreSQL", "Docker"],
    liveUrl: "https://github.com/mbowpapealiou-collab",
    githubUrl: "https://github.com/mbowpapealiou-collab",
    featured: false
  }
];

export const experiencesData: Experience[] = [
  {
    period: "2023 - Présent",
    role: "Développeur Full Stack",
    company: "Freelance & Projets Clients",
    description: [
      "Conception et déploiement d'applications web scalables avec Next.js, React et Node.js.",
      "Modélisation et intégration de bases de données relationnelles avec Prisma et PostgreSQL.",
      "Optimisation des performances web, du SEO et de l'accessibilité (score Lighthouse > 95)."
    ]
  },
  {
    period: "2022 - 2023",
    role: "Développeur Frontend & Web",
    company: "Solutions Digitales",
    description: [
      "Intégration d'interfaces utilisateurs responsives et interactives à partir de maquettes Figma.",
      "Consommation d'APIs RESTful et gestion d'états applicatifs complexes.",
      "Collaboration en méthode Agile / Scrum avec revue de code systématique sur GitHub."
    ]
  },
  {
    period: "2021 - 2022",
    role: "Formation & Spécialisation Logicielle",
    company: "Cursus Informatique & Technologies Web",
    description: [
      "Approfondissement des algorithmes, structures de données et patrons de conception logicielle (Design Patterns).",
      "Développement de projets d'envergure en équipe et apprentissage des bonnes pratiques Git."
    ]
  }
];
