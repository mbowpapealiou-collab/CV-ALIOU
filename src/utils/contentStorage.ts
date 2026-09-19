import { useState, useEffect } from 'react';
import { personalInfo as defaultPersonalInfo, experiencesData as defaultExperiences, projectsData as defaultProjects, skillsData as defaultSkills } from '../data/portfolioData';
import { PersonalInfo, Experience, Project, SkillCategory } from '../types';

const PERSONAL_STORAGE_KEY = 'aliou_content_personal';
const EXPERIENCES_STORAGE_KEY = 'aliou_content_experiences';
const PROJECTS_STORAGE_KEY = 'aliou_content_projects';
const SKILLS_STORAGE_KEY = 'aliou_content_skills';
const CONTENT_EVENT = 'aliou_content_updated';

const BACKEND_FALLBACK_URL = 'https://ais-pre-hbn74f6nh5h5hqlnlip7i6-905892281788.europe-west2.run.app';

async function fetchContentApi(endpoint: string, options?: RequestInit): Promise<Response> {
  try {
    const res = await fetch(endpoint, options);
    if (res.ok || res.status !== 404) {
      return res;
    }
  } catch (err) {
    // Try fallback
  }

  try {
    return await fetch(`${BACKEND_FALLBACK_URL}${endpoint}`, options);
  } catch (err) {
    throw err;
  }
}

// In-memory cache
let cachedPersonal: PersonalInfo = defaultPersonalInfo;
let cachedExperiences: Experience[] = defaultExperiences;
let cachedProjects: Project[] = defaultProjects;
let cachedSkills: SkillCategory[] = defaultSkills;

// Read helpers with fallback
export function getStoredPersonalInfo(): PersonalInfo {
  try {
    const saved = localStorage.getItem(PERSONAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultPersonalInfo, ...parsed };
    }
  } catch (e) {
    // fallback
  }
  return cachedPersonal;
}

export function getStoredExperiences(): Experience[] {
  try {
    const saved = localStorage.getItem(EXPERIENCES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // fallback
  }
  return cachedExperiences;
}

export function getStoredProjects(): Project[] {
  try {
    const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // fallback
  }
  return cachedProjects;
}

export function getStoredSkills(): SkillCategory[] {
  try {
    const saved = localStorage.getItem(SKILLS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // fallback
  }
  return cachedSkills;
}

// Save helpers
export async function savePersonalInfo(data: PersonalInfo): Promise<boolean> {
  cachedPersonal = data;
  try {
    localStorage.setItem(PERSONAL_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(CONTENT_EVENT, { detail: { type: 'personal', data } }));

    // Sync to server so all visitors see updates
    await fetchContentApi('/api/content/personal-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personalInfo: data }),
    });
    return true;
  } catch (err) {
    console.warn('Sync server personal info failed:', err);
    return true;
  }
}

export async function saveExperiences(data: Experience[]): Promise<boolean> {
  cachedExperiences = data;
  try {
    localStorage.setItem(EXPERIENCES_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(CONTENT_EVENT, { detail: { type: 'experiences', data } }));

    // Sync to server
    await fetchContentApi('/api/content/experiences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ experiences: data }),
    });
    return true;
  } catch (err) {
    console.warn('Sync server experiences failed:', err);
    return true;
  }
}

export async function saveProjects(data: Project[]): Promise<boolean> {
  cachedProjects = data;
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(CONTENT_EVENT, { detail: { type: 'projects', data } }));

    // Sync to server
    await fetchContentApi('/api/content/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projects: data }),
    });
    return true;
  } catch (err) {
    console.warn('Sync server projects failed:', err);
    return true;
  }
}

export async function saveSkills(data: SkillCategory[]): Promise<boolean> {
  cachedSkills = data;
  try {
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(CONTENT_EVENT, { detail: { type: 'skills', data } }));

    // Sync to server
    await fetchContentApi('/api/content/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills: data }),
    });
    return true;
  } catch (err) {
    console.warn('Sync server skills failed:', err);
    return true;
  }
}

export async function resetAllContent(): Promise<void> {
  try {
    localStorage.removeItem(PERSONAL_STORAGE_KEY);
    localStorage.removeItem(EXPERIENCES_STORAGE_KEY);
    localStorage.removeItem(PROJECTS_STORAGE_KEY);
    localStorage.removeItem(SKILLS_STORAGE_KEY);

    cachedPersonal = defaultPersonalInfo;
    cachedExperiences = defaultExperiences;
    cachedProjects = defaultProjects;
    cachedSkills = defaultSkills;

    window.dispatchEvent(new CustomEvent(CONTENT_EVENT, { detail: { type: 'reset' } }));

    await fetchContentApi('/api/content/reset', { method: 'POST' });
  } catch (err) {
    console.error('Erreur réinitialisation contenu:', err);
  }
}

// Background sync on boot
let hasContentSynced = false;
export async function syncContentWithServer() {
  if (hasContentSynced) return;
  hasContentSynced = true;

  try {
    const res = await fetchContentApi('/api/content');
    if (res.ok) {
      const data = await res.json();
      let hasUpdates = false;

      if (data.personalInfo) {
        cachedPersonal = { ...defaultPersonalInfo, ...data.personalInfo };
        localStorage.setItem(PERSONAL_STORAGE_KEY, JSON.stringify(cachedPersonal));
        hasUpdates = true;
      }
      if (Array.isArray(data.experiences) && data.experiences.length > 0) {
        cachedExperiences = data.experiences;
        localStorage.setItem(EXPERIENCES_STORAGE_KEY, JSON.stringify(data.experiences));
        hasUpdates = true;
      }
      if (Array.isArray(data.projects) && data.projects.length > 0) {
        cachedProjects = data.projects;
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(data.projects));
        hasUpdates = true;
      }
      if (Array.isArray(data.skills) && data.skills.length > 0) {
        cachedSkills = data.skills;
        localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(data.skills));
        hasUpdates = true;
      }

      if (hasUpdates) {
        window.dispatchEvent(new CustomEvent(CONTENT_EVENT, { detail: { type: 'sync' } }));
      }
    }
  } catch (err) {
    // silent catch
  }
}

// React Hook for dynamic content
export function usePortfolioContent() {
  const [personal, setPersonal] = useState<PersonalInfo>(() => getStoredPersonalInfo());
  const [experiences, setExperiences] = useState<Experience[]>(() => getStoredExperiences());
  const [projects, setProjects] = useState<Project[]>(() => getStoredProjects());
  const [skills, setSkills] = useState<SkillCategory[]>(() => getStoredSkills());
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    syncContentWithServer();

    const handleUpdate = () => {
      setPersonal(getStoredPersonalInfo());
      setExperiences(getStoredExperiences());
      setProjects(getStoredProjects());
      setSkills(getStoredSkills());
      setRefreshKey((k) => k + 1);
    };

    window.addEventListener(CONTENT_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(CONTENT_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    personalInfo: personal,
    experiences,
    projects,
    skills,
    refreshKey,
    updatePersonalInfo: savePersonalInfo,
    updateExperiences: saveExperiences,
    updateProjects: saveProjects,
    updateSkills: saveSkills,
    resetContent: resetAllContent,
  };
}
