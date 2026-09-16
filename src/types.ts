export interface Project {
  id: string;
  title: string;
  category: 'Full Stack' | 'Frontend' | 'Backend';
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
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
