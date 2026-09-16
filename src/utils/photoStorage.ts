import { useState, useEffect } from 'react';

const STORAGE_KEY = 'aliou_profile_photo';
const EVENT_NAME = 'aliou_photo_updated';
export const DEFAULT_PHOTO = '/photo.jpg';

export function getProfilePhoto(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    // Security check: Only allow safe raster image data URLs (jpeg, png, webp)
    if (
      saved &&
      (saved.startsWith('data:image/jpeg') ||
       saved.startsWith('data:image/png') ||
       saved.startsWith('data:image/webp'))
    ) {
      return saved;
    }
  } catch (err) {
    console.error('Erreur lecture photo localStorage', err);
  }
  return DEFAULT_PHOTO;
}

export function saveProfilePhoto(dataUrl: string): void {
  // Security validation: verify dataUrl is a genuine image dataUrl
  if (
    !dataUrl.startsWith('data:image/jpeg') &&
    !dataUrl.startsWith('data:image/png') &&
    !dataUrl.startsWith('data:image/webp')
  ) {
    console.error('[Sécurité] Format d\'image invalide ou suspect bloqué');
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, dataUrl);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: dataUrl }));
  } catch (err) {
    console.error('Erreur sauvegarde photo localStorage', err);
  }
}

export function resetProfilePhoto(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_PHOTO }));
  } catch (err) {
    console.error('Erreur réinitialisation photo', err);
  }
}

// Auto-compress and resize image to ensure it works on all mobile devices and stays within browser quotas
export function compressImage(file: File, maxDimension = 800, quality = 0.85): Promise<string> {
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
          // Fallback to raw dataUrl if canvas context is unavailable
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
  try {
    const saved = localStorage.getItem(`aliou_proj_${projectId}`);
    if (
      saved &&
      (saved.startsWith('data:image/jpeg') ||
       saved.startsWith('data:image/png') ||
       saved.startsWith('data:image/webp'))
    ) {
      return saved;
    }
  } catch (err) {
    console.error('Erreur lecture photo projet', err);
  }
  return defaultImage;
}

export function saveProjectPhoto(projectId: string, dataUrl: string): void {
  if (
    !dataUrl.startsWith('data:image/jpeg') &&
    !dataUrl.startsWith('data:image/png') &&
    !dataUrl.startsWith('data:image/webp')
  ) {
    console.error('[Sécurité] Format image invalide');
    return;
  }
  try {
    localStorage.setItem(`aliou_proj_${projectId}`, dataUrl);
    window.dispatchEvent(new CustomEvent(PROJECT_EVENT_NAME, { detail: { projectId, dataUrl } }));
  } catch (err) {
    console.error('Erreur sauvegarde photo projet', err);
  }
}

export function resetProjectPhoto(projectId: string): void {
  try {
    localStorage.removeItem(`aliou_proj_${projectId}`);
    window.dispatchEvent(new CustomEvent(PROJECT_EVENT_NAME, { detail: { projectId, dataUrl: null } }));
  } catch (err) {
    console.error('Erreur reset photo projet', err);
  }
}

export function useProjectPhotos() {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
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
      const compressed = await compressImage(file, 900, 0.85);
      saveProjectPhoto(projectId, compressed);
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
      return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      return false;
    }
  });

  useEffect(() => {
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
      // Compress to lightweight high-res JPEG (~100kb) suitable for mobile localStorage
      const compressedDataUrl = await compressImage(file, 800, 0.86);
      if (compressedDataUrl) {
        saveProfilePhoto(compressedDataUrl);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erreur compression image:', err);
      // Fallback direct read
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            saveProfilePhoto(result);
            resolve(true);
          } else {
            resolve(false);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return {
    photoUrl,
    isCustom,
    uploadPhoto: handleUploadFile,
    resetPhoto: resetProfilePhoto,
  };
}
