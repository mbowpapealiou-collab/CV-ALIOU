import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2, Github, Linkedin, Clock } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setStatus('loading');

    // Simulate sending message or calling contact endpoint
    setTimeout(() => {
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <Mail className="w-3.5 h-3.5" />
            CONTACTEZ-MOI
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Discutons de votre prochain projet
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Vous avez une idée d'application, un projet freelance ou une opportunité de recrutement ? N'hésitez pas à m'écrire, je vous répondrai sous 24h.
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
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs text-slate-400 font-medium">Email</div>
                    <div className="text-sm font-semibold text-white truncate">{personalInfo.email}</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                  <div className="w-11 h-11 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Localisation</div>
                    <div className="text-sm font-semibold text-white">{personalInfo.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                  <div className="w-11 h-11 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Délai de réponse</div>
                    <div className="text-sm font-semibold text-white">Moins de 24 heures</div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Réseaux & Plateformes
                </div>
                <div className="flex gap-3">
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-sm font-medium transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-sm font-medium transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                </div>
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
                  <h3 className="text-2xl font-bold text-white">Message envoyé avec succès !</h3>
                  <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                    Merci pour votre message, Pape Aliou Mbow vous répondra dans les plus brefs délais à l'adresse indiquée.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setStatus('idle')}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-white mb-2">Envoyez-moi un message</h3>
                  
                  {status === 'error' && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Votre Nom <span className="text-blue-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex. Thomas Diop"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Votre Email <span className="text-blue-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="thomas@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Ex. Proposition de projet / Mission Freelance"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Message <span className="text-blue-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre projet, vos besoins techniques ou votre opportunité..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-70 cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Envoyer le Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
