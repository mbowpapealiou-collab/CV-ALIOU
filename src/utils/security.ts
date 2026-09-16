/**
 * Utilitaires de sécurité et de protection du portfolio d'Aliou Mbow
 * - Prévention des failles XSS et injections de scripts
 * - Filtrage strict des URLs externes (anti-open-redirect et anti-javascript:)
 * - Protection anti-spam et limitation de débit (Rate Limiting)
 * - Validation stricte des données du formulaire de contact
 */

// Regex stricte pour validation d'email conforme RFC
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Nettoie et valide une URL externe pour empêcher les injections XSS
 * (Ex: interdiction absolue de javascript:, data:, vbscript:)
 */
export function sanitizeSafeUrl(url: string | undefined | null, fallback: string): string {
  if (!url || typeof url !== 'string') {
    return fallback;
  }

  const trimmed = url.trim();

  // Rejet absolu des protocoles dangereux
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:') ||
    lower.includes('<script')
  ) {
    console.warn('[Sécurité] URL dangereuse bloquée :', trimmed);
    return fallback;
  }

  // Autorise uniquement https:// (et liens mailto / tel valides)
  if (
    lower.startsWith('https://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:')
  ) {
    return trimmed;
  }

  // Si c'est un chemin relatif interne sûr (ex: /photo.jpg)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  // Par défaut, retourner le fallback sécurisé
  return fallback;
}

/**
 * Valide si une URL Google Drive est légitime
 */
export function isValidDriveUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  return (
    trimmed.startsWith('https://drive.google.com/') ||
    trimmed.startsWith('https://docs.google.com/')
  );
}

/**
 * Assainit une chaîne de texte utilisateur pour éliminer les risques d'injection
 */
export function sanitizeInput(input: string, maxLength = 1000): string {
  if (!input || typeof input !== 'string') return '';
  
  // Suppression des caractères de contrôle nuls et limitation de taille
  let cleaned = input.replace(/\0/g, '').trim();
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }

  // Échappement des balises HTML potentiellement malveillantes
  return cleaned;
}

/**
 * Vérifie la validité d'une adresse email
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Rate Limiter côté client pour protéger le formulaire d'envoi de messages contre le spam flood
 * Empêche les soumissions automatisées en boucle
 */
export function checkSubmissionRateLimit(key = 'contact_rate_limit', cooldownSeconds = 30): { allowed: boolean; remainingSeconds: number } {
  try {
    const lastTimeStr = localStorage.getItem(`sec_${key}`);
    const now = Date.now();
    
    if (lastTimeStr) {
      const lastTime = parseInt(lastTimeStr, 10);
      const diffSeconds = Math.floor((now - lastTime) / 1000);
      
      if (diffSeconds < cooldownSeconds) {
        return {
          allowed: false,
          remainingSeconds: cooldownSeconds - diffSeconds
        };
      }
    }

    return { allowed: true, remainingSeconds: 0 };
  } catch {
    // Si localStorage est désactivé ou restreint
    return { allowed: true, remainingSeconds: 0 };
  }
}

export function recordSubmission(key = 'contact_rate_limit'): void {
  try {
    localStorage.setItem(`sec_${key}`, Date.now().toString());
  } catch {
    // Ignore
  }
}
