export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  driveUrl?: string;
  projectUrl?: string;
  featured: boolean;
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface SkillCategory {
  title: string;
  iconName: string;
  skills: SkillItem[];
}

export interface Experience {
  id?: string;
  period: string;
  role: string;
  company: string;
  description: string[];
  isCompleted?: boolean;
}

export interface EducationItem {
  degree: string;
  school: string;
  year: string;
  isCompleted?: boolean;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface PersonalInfo {
  name: string;
  role: string;
  specialties: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  googleDriveProjectsUrl: string;
  photoUrl: string;
  availability: string;
  bio: string;
  objective: string;
  education: EducationItem[];
  stats: StatItem[];
}
