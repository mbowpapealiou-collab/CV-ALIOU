import { useState, useEffect } from 'react';

const STORAGE_KEY = 'aliou_profile_photo';
const EVENT_NAME = 'aliou_photo_updated';
export const DEFAULT_PHOTO = '/photo.jpg';

export function getProfilePhoto(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.startsWith('data:image')) {
      return saved;
    }
  } catch (err) {
    console.error('Erreur lecture photo localStorage', err);
  }
  return DEFAULT_PHOTO;
}

export function saveProfilePhoto(dataUrl: string): void {
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

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, []);

  const handleUploadFile = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
        resolve(false);
        return;
      }

      // Max 5MB for localStorage limit
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image est trop volumineuse. Veuillez choisir une image de moins de 5 Mo.");
        resolve(false);
        return;
      }

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
      reader.onerror = (error) => {
        console.error('Erreur lecture image:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  return {
    photoUrl,
    isCustom,
    uploadPhoto: handleUploadFile,
    resetPhoto: resetProfilePhoto,
  };
}
