import React, { useState } from 'react';
import { X, Phone, MessageSquare, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { useProfilePhoto } from '../utils/photoStorage';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose }) => {
  const { photoUrl } = useProfilePhoto();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rawPhone = "221783333175";
  const formattedPhone = personalInfo.phone; // +221 78 333 31 75
  const whatsappLink = `https://wa.me/${rawPhone}?text=Bonjour%20Aliou%2C%20je%20vous%20contacte%20depuis%20votre%20portfolio%20professionnel.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedPhone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={photoUrl}
                alt="Aliou Mbow"
                className="w-14 h-14 rounded-2xl object-cover object-top border-2 border-white/80 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900 flex items-center justify-center" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Aliou Mbow</h3>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Contact Téléphone & WhatsApp
              </p>
              <div className="inline-flex items-center gap-1 mt-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>En ligne • Réponse rapide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Main phone highlight box */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
              Numéro de téléphone & WhatsApp
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight my-1">
              {formattedPhone}
            </div>
            <p className="text-xs text-slate-400">
              Sénégal (Dakar & Thiès) • Indicatif +221
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5">
            {/* Direct WhatsApp button */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Ouvrir la discussion WhatsApp</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>

            {/* Direct Call button */}
            <a
              href={`tel:${rawPhone}`}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              <Phone className="w-4 h-4" />
              <span>Appeler le {formattedPhone}</span>
            </a>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Numéro copié dans le presse-papier !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copier le numéro ({formattedPhone})</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ligne directe professionnelle d'Aliou Mbow</span>
          </div>

        </div>

      </div>
    </div>
  );
};
