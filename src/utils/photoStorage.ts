import { useState, useEffect } from 'react';

const STORAGE_KEY = 'aliou_profile_photo';
const EVENT_NAME = 'aliou_photo_updated';
export const DEFAULT_PHOTO = '/photo.jpg';

// Shared backend URL in case the app is viewed through external static hosts (like Vercel or custom domain)
const BACKEND_FALLBACK_URL = 'https://ais-pre-hbn74f6nh5h5hqlnlip7i6-905892281788.europe-west2.run.app';

// Resilient API fetcher with fallback
async function fetchServerMedia(endpoint: string, options?: RequestInit): Promise<Response> {
  try {
    const res = await fetch(endpoint, options);
    if (res.ok || res.status !== 404) {
      return res;
    }
  } catch (err) {
    // If local relative endpoint fails (e.g., static hosting), try fallback backend
  }

  try {
    const fullUrl = `${BACKEND_FALLBACK_URL}${endpoint}`;
    return await fetch(fullUrl, options);
  } catch (err) {
    throw err;
  }
}

// In-memory cache for live synchronization
let cachedProfilePhoto: string | null = null;
const cachedProjectPhotos: Record<string, string> = {};

export function getProfilePhoto(): string {
  if (cachedProfilePhoto) {
    return cachedProfilePhoto;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (
      saved &&
      (saved.startsWith('data:image/') || saved.startsWith('/') || saved.startsWith('http'))
    ) {
      return saved;
    }
  } catch (err) {
    console.error('Erreur lecture photo localStorage', err);
  }
  return DEFAULT_PHOTO;
}

export function saveProfilePhotoLocally(photoUrl: string): void {
  try {
    cachedProfilePhoto = photoUrl;
    localStorage.setItem(STORAGE_KEY, photoUrl);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: photoUrl }));
  } catch (err) {
    console.error('Erreur sauvegarde photo locale', err);
  }
}

export async function saveProfilePhoto(dataUrl: string): Promise<boolean> {
  // Validate format
  if (
    !dataUrl.startsWith('data:image/jpeg') &&
    !dataUrl.startsWith('data:image/png') &&
    !dataUrl.startsWith('data:image/webp') &&
    !dataUrl.startsWith('/') &&
    !dataUrl.startsWith('http')
  ) {
    console.error('[Sécurité] Format d\'image invalide');
    return false;
  }

  // 1. Instantly update locally for snappy UI
  saveProfilePhotoLocally(dataUrl);

  // 2. Persist to server so ALL visitors and friends see it
  try {
    const res = await fetchServerMedia('/api/media/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photo: dataUrl }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.profilePhoto) {
        saveProfilePhotoLocally(data.profilePhoto);
      }
      return true;
    }
  } catch (err) {
    console.warn('[Sync] Sauvegarde serveur en cours ou indisponible, stocké localement:', err);
  }
  return true;
}

export async function resetProfilePhoto(): Promise<void> {
  try {
    cachedProfilePhoto = null;
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_PHOTO }));

    await fetchServerMedia('/api/media/reset-profile', { method: 'POST' });
  } catch (err) {
    console.error('Erreur réinitialisation photo', err);
  }
}

// Auto-compress and resize image to ensure fast transfer and high quality
export function compressImage(file: File, maxDimension = 900, quality = 0.88): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error("Erreur de chargement de l'image"));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Project photos storage helpers
const PROJECT_EVENT_NAME = 'aliou_project_photo_updated';

export function getProjectPhoto(projectId: string, defaultImage: string): string {
  if (cachedProjectPhotos[projectId]) {
    return cachedProjectPhotos[projectId];
  }
  try {
    const saved = localStorage.getItem(`aliou_proj_${projectId}`);
    if (
      saved &&
      (saved.startsWith('data:image/') || saved.startsWith('/') || saved.startsWith('http'))
    ) {
      return saved;
    }
  } catch (err) {
    console.error('Erreur lecture photo projet', err);
  }
  return defaultImage;
}

export async function saveProjectPhoto(projectId: string, dataUrl: string): Promise<boolean> {
  try {
    cachedProjectPhotos[projectId] = dataUrl;
    localStorage.setItem(`aliou_proj_${projectId}`, dataUrl);
    window.dispatchEvent(new CustomEvent(PROJECT_EVENT_NAME, { detail: { projectId, dataUrl } }));

    // Send to server so all visitors see it
    await fetchServerMedia('/api/media/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, photo: dataUrl }),
    });
    return true;
  } catch (err) {
    console.error('Erreur sauvegarde photo projet', err);
    return true;
  }
}

export async function resetProjectPhoto(projectId: string): Promise<void> {
  try {
    delete cachedProjectPhotos[projectId];
    localStorage.removeItem(`aliou_proj_${projectId}`);
    window.dispatchEvent(new CustomEvent(PROJECT_EVENT_NAME, { detail: { projectId, dataUrl: null } }));

    await fetchServerMedia('/api/media/reset-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId }),
    });
  } catch (err) {
    console.error('Erreur reset photo projet', err);
  }
}

// Global server sync: runs once when the app boots
let hasSynced = false;
export async function syncMediaWithServer() {
  if (hasSynced) return;
  hasSynced = true;

  try {
    const res = await fetchServerMedia('/api/media');
    if (res.ok) {
      const data = await res.json();

      // Check if server already has a custom profile photo
      if (data.profilePhoto) {
        cachedProfilePhoto = data.profilePhoto;
        localStorage.setItem(STORAGE_KEY, data.profilePhoto);
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data.profilePhoto }));
      } else {
        // AUTO-SYNC: If server does not have a photo yet, but current browser has a custom photo uploaded previously by Aliou,
        // automatically push it to the server so all other visitors instantly see it!
        const localPhoto = localStorage.getItem(STORAGE_KEY);
        if (localPhoto && localPhoto.startsWith('data:image/')) {
          console.log('[Sync] Poussée automatique de la photo locale vers le serveur partagé...');
          fetchServerMedia('/api/media/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photo: localPhoto }),
          }).catch(() => {});
        }
      }

      // Sync project photos
      if (data.projectPhotos && typeof data.projectPhotos === 'object') {
        Object.entries(data.projectPhotos).forEach(([projId, url]) => {
          if (typeof url === 'string') {
            cachedProjectPhotos[projId] = url;
            localStorage.setItem(`aliou_proj_${projId}`, url);
            window.dispatchEvent(new CustomEvent(PROJECT_EVENT_NAME, { detail: { projectId: projId, dataUrl: url } }));
          }
        });
      }

      // Sync Google Drive URL
      if (data.driveUrl) {
        localStorage.setItem('aliou_drive_url', data.driveUrl);
      }
    }
  } catch (err) {
    console.log('[Sync] Serveur média inaccessible en lecture, utilisation du cache local');
  }
}

export function useProjectPhotos() {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    syncMediaWithServer();
    const handler = () => setRefreshKey((prev) => prev + 1);
    window.addEventListener(PROJECT_EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(PROJECT_EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const getPhoto = (projectId: string, defaultImage: string) => {
    return getProjectPhoto(projectId, defaultImage);
  };

  const uploadProjectPhoto = async (projectId: string, file: File): Promise<boolean> => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide.');
      return false;
    }
    try {
      const compressed = await compressImage(file, 900, 0.88);
      await saveProjectPhoto(projectId, compressed);
      return true;
    } catch (err) {
      console.error('Erreur upload photo projet:', err);
      return false;
    }
  };

  return {
    refreshKey,
    getPhoto,
    uploadProjectPhoto,
    resetProjectPhoto,
  };
}

export function useProfilePhoto() {
  const [photoUrl, setPhotoUrl] = useState<string>(() => getProfilePhoto());
  const [isCustom, setIsCustom] = useState<boolean>(() => {
    try {
      const current = getProfilePhoto();
      return Boolean(current && current !== DEFAULT_PHOTO);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    syncMediaWithServer();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const newUrl = customEvent.detail || getProfilePhoto();
      setPhotoUrl(newUrl);
      setIsCustom(newUrl !== DEFAULT_PHOTO);
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const newUrl = getProfilePhoto();
        setPhotoUrl(newUrl);
        setIsCustom(newUrl !== DEFAULT_PHOTO);
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleUploadFile = async (file: File): Promise<boolean> => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return false;
    }

    try {
      const compressedDataUrl = await compressImage(file, 900, 0.88);
      if (compressedDataUrl) {
        const ok = await saveProfilePhoto(compressedDataUrl);
        return ok;
      }
      return false;
    } catch (err) {
      console.error('Erreur compression image:', err);
      return false;
    }
  };

  return {
    photoUrl,
    isCustom,
    uploadPhoto: handleUploadFile,
    resetPhoto: resetProfilePhoto,
  };
}
