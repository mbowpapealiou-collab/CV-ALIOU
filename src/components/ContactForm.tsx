import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2, Linkedin, MessageSquare, Clock, ExternalLink, MailQuestion, ShieldCheck } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { sanitizeInput, validateEmail, checkSubmissionRateLimit, recordSubmission } from '../utils/security';

interface ContactFormProps {
  onOpenWhatsApp?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onOpenWhatsApp }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [honeypot, setHoneypot] = useState('');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getMailtoUrl = () => {
    const safeSubject = encodeURIComponent(sanitizeInput(formData.subject || `Message pour Aliou Mbow`, 100));
    const safeBody = encodeURIComponent(
      `Nom: ${sanitizeInput(formData.name, 80)}\nEmail: ${formData.email.trim()}\n\nMessage:\n${sanitizeInput(formData.message, 2000)}`
    );
    return `mailto:${personalInfo.email}?subject=${safeSubject}&body=${safeBody}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Anti-Bot Honeypot Trap
    if (honeypot.trim().length > 0) {
      console.warn('[Sécurité] Tentative de soumission bot piégée par honeypot.');
      setStatus('loading');
      setTimeout(() => setStatus('success'), 600);
      return;
    }

    // 2. Anti-Flood / Rate Limiting (25 seconds cooldown)
    const rateCheck = checkSubmissionRateLimit('contact_form', 25);
    if (!rateCheck.allowed) {
      setStatus('error');
      setErrorMessage(`Protection anti-spam active : veuillez patienter encore ${rateCheck.remainingSeconds}s avant d'envoyer un nouveau message.`);
      return;
    }

    // 3. Input Validation & Sanitization
    const cleanName = sanitizeInput(formData.name, 80);
    const cleanEmail = formData.email.trim();
    const cleanSubject = sanitizeInput(formData.subject, 120);
    const cleanMessage = sanitizeInput(formData.message, 3000);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      setStatus('error');
      setErrorMessage('Veuillez remplir tous les champs obligatoires avec des valeurs valides.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setStatus('error');
      setErrorMessage('Veuillez renseigner une adresse email valide (ex: amadou@example.com).');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Send real email to Aliou Mbow via FormSubmit API
      const response = await fetch(`https://formsubmit.co/ajax/${personalInfo.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          _subject: `[Portfolio Aliou Mbow] ${cleanSubject || 'Nouveau message de contact'}`,
          message: cleanMessage,
          _replyto: cleanEmail,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.success === 'true' || data.success === true || response.status === 200)) {
        recordSubmission('contact_form');
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        // Fallback to mailto if submission endpoint is blocked
        recordSubmission('contact_form');
        window.location.href = getMailtoUrl();
        setStatus('success');
      }
    } catch (err) {
      console.warn('Erreur envoi réseau, bascule mailto:', err);
      // Open mail client as reliable fallback
      recordSubmission('contact_form');
      window.location.href = getMailtoUrl();
      setStatus('success');
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold mb-3">
            <Mail className="w-3.5 h-3.5" />
            CONTACTEZ-MOI
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Échangeons sur vos opportunités & projets
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Une opportunité professionnelle, un projet de gestion, une collaboration en marketing digital ou community management ? Écrivez-moi directement sur <strong className="text-orange-400">{personalInfo.email}</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Info & Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-white">Coordonnées Directes</h3>
              
              <div className="space-y-4">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-orange-500/30 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs text-slate-400 font-medium">Email direct</div>
                    <div className="text-sm font-semibold text-white truncate">{personalInfo.email}</div>
                  </div>
                </a>

                {/* WhatsApp & Phone Trigger Card */}
                <button
                  type="button"
                  onClick={onOpenWhatsApp || (() => window.open('https://wa.me/221783333175', '_blank'))}
                  className="w-full text-left flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                        <span>Téléphone & WhatsApp</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <div className="text-sm font-semibold text-white">{personalInfo.phone}</div>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    Afficher
                  </div>
                </button>

                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                  <div className="w-11 h-11 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Localisation</div>
                    <div className="text-sm font-semibold text-white">{personalInfo.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Disponibilité</div>
                    <div className="text-sm font-semibold text-white">Réception 24h/24 sur mbowpapealiou@gmail.com</div>
                  </div>
                </div>
              </div>

              {/* Social Links & Quick WhatsApp Button */}
              <div className="pt-4 border-t border-slate-800 space-y-2.5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Canaux rapides
                </div>
                
                <button
                  type="button"
                  onClick={onOpenWhatsApp || (() => window.open('https://wa.me/221783333175', '_blank'))}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 text-sm font-semibold transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Discuter sur WhatsApp ({personalInfo.phone})</span>
                </button>

                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-orange-500/30 text-sm font-semibold transition-all"
                >
                  <Linkedin className="w-4 h-4 text-orange-400" />
                  <span>Profil LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
              
              {status === 'success' ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Message transmis avec succès !</h3>
                  <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
                    Votre message a été envoyé à <strong>{personalInfo.email}</strong>. Aliou Mbow vous répondra dans les meilleurs délais.
                  </p>
                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => setStatus('idle')}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 transition-all cursor-pointer"
                    >
                      Envoyer un autre message
                    </button>
                    <button
                      onClick={onOpenWhatsApp || (() => window.open('https://wa.me/221783333175', '_blank'))}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                    >
                      Discuter sur WhatsApp
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Invisible Honeypot Field to trap malicious bots */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website-trap">Ne pas remplir ce champ si vous êtes humain :</label>
                    <input
                      id="website-trap"
                      type="text"
                      name="_bot_honey"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">Envoyez-moi un message</h3>
                    <span className="text-[11px] text-amber-400/90 font-mono">Reçu sur {personalInfo.email}</span>
                  </div>
                  
                  {status === 'error' && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Votre Nom <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        maxLength={80}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex. Amadou Diop"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Votre Email <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        maxLength={120}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="amadou@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Sujet
                    </label>
                    <input
                      type="text"
                      name="subject"
                      maxLength={120}
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Ex. Proposition d'opportunité / Projet MIO & Marketing"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Message <span className="text-orange-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      maxLength={3000}
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre besoin, opportunité de stage ou projet organisationnel..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 shadow-lg shadow-orange-500/25 transition-all disabled:opacity-70 cursor-pointer"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Envoi vers {personalInfo.email}...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Envoyer le Message à Aliou Mbow</span>
                        </>
                      )}
                    </button>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>Transmission sécurisée & anti-spam</span>
                      </div>
                      <a
                        href={getMailtoUrl()}
                        className="text-slate-400 hover:text-orange-300 underline inline-flex items-center gap-1"
                      >
                        <MailQuestion className="w-3.5 h-3.5" />
                        <span>Ouvrir dans mon logiciel de messagerie</span>
                      </a>
                    </div>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

