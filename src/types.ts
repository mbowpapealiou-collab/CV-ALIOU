export interface Project {
  id: string;
  title: string;
  category: 'Management' | 'Marketing Digital' | 'Informatique de Gestion' | 'Projet Universitaire';
  description: string;
  image: string;
  tags: string[];
  driveUrl?: string;
  featured: boolean;
}

export interface SkillCategory {
  title: string;
  iconName: string;
  skills: { name: string; level: number }[];
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  description: string[];
}

