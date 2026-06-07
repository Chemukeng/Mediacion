"use client";

import React, { useState, useEffect } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { useRouter } from "next/navigation";
import {
  Send,
  User,
  Mail,
  Check,
  Copy,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  MessageSquare,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HowItWorksModal from "@/components/HowItWorksModal";

export default function InvitacionPage() {
  const {
    inviteSent,
    inviteName,
    inviteEmail,
    inviteMessage,
    sendInvite,
    partnerPhaseCompleted,
    partnerName
  } = useSimulation();

  const router = useRouter();

  // Local Form states
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [messageInput, setMessageInput] = useState(
    "Hola, he iniciado un proceso en MedIAdor para gestionar nuestro convenio regulador de mutuo acuerdo de forma privada y neutral. ¿Te unes?"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Sync inputs with state if already set (e.g. if loaded midway)
  useEffect(() => {
    if (inviteSent) {
      setNameInput(inviteName);
      setEmailInput(inviteEmail);
    }
  }, [inviteSent, inviteName, inviteEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !emailInput) return;

    setIsSubmitting(true);
    setTimeout(() => {
      sendInvite(nameInput, emailInput, messageInput);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleCopyLink = () => {
    const inviteLink = `https://mediador.es/unirse?code=MED-${Math.floor(
      1000 + Math.random() * 9000
    )}-X`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendReminder = () => {
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 px-6 py-6 select-none flex-1 justify-start lg:justify-center pt-8 lg:pt-0">
      <AnimatePresence mode="wait">
        {/* CASE A: No invitation sent yet */}
        {!inviteSent && (
          <motion.div
            key="invite-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-5"
          >
            {/* Header info */}
            <div className="text-center flex flex-col gap-2 mt-2">
              <span className="text-[9px] font-bold text-brand-gold tracking-[0.25em] uppercase font-sans">
                PASO PREVIO OBLIGATORIO
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#13382c] tracking-tight">
                Vincular Ex-Pareja
              </h2>
              <p className="text-xs text-brand-muted leading-relaxed max-w-sm mx-auto font-light">
                Para redactar un convenio de mutuo acuerdo, es necesario invitar a la otra parte. Tu diario y Bóveda seguirán siendo estrictamente confidenciales.
              </p>
              
              <button
                type="button"
                onClick={() => setShowHowItWorks(true)}
                className="text-[10px] text-brand-muted hover:text-brand-green hover:underline transition duration-200 mt-1.5 font-sans flex items-center justify-center gap-1 self-center cursor-pointer"
              >
                <HelpCircle size={11} className="text-brand-gold" />
                <span>¿Cómo funciona el proceso?</span>
              </button>
            </div>

            {/* Main Form Box */}
            <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-brand-green/75 tracking-wider uppercase font-sans">
                    Nombre de la ex-pareja
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 text-brand-muted" size={16} />
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Ej. David Martín"
                      className="w-full bg-brand-bg/50 border border-brand-border focus:border-brand-gold focus:outline-none rounded-xl py-3 pl-11 pr-4 text-xs text-brand-text placeholder-brand-muted/70 transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-brand-green/75 tracking-wider uppercase font-sans">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 text-brand-muted" size={16} />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="david.martin@ejemplo.com"
                      className="w-full bg-brand-bg/50 border border-brand-border focus:border-brand-gold focus:outline-none rounded-xl py-3 pl-11 pr-4 text-xs text-brand-text placeholder-brand-muted/70 transition"
                    />
                  </div>
                </div>

                {/* Custom Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-brand-green/75 tracking-wider uppercase font-sans">
                    Mensaje personalizado (Opcional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 text-brand-muted" size={16} />
                    <textarea
                      rows={3}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="w-full bg-brand-bg/50 border border-brand-border focus:border-brand-gold focus:outline-none rounded-xl py-3 pl-11 pr-4 text-xs text-brand-text placeholder-brand-muted/70 transition resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-semibold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition duration-200 shadow-md mt-2 disabled:bg-brand-green/50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Enviar Invitación Cifrada
                      <Send size={12} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Informational security card */}
            <div className="bg-[#EAEAE6]/40 border border-brand-border rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-brand-muted">
              <ShieldCheck className="text-brand-gold shrink-0 mt-0.5" size={16} />
              <div>
                <strong className="text-brand-green font-semibold block mb-0.5">Espacio Neutro y Privado</strong>
                Ninguno de los cónyuges podrá leer el diario o las notas individuales del otro. La IA de mediación solo combinará propuestas cuando detecte coincidencias.
              </div>
            </div>
          </motion.div>
        )}

        {/* CASE B: Invitation sent, connection pending */}
        {inviteSent && !partnerPhaseCompleted && (
          <motion.div
            key="invite-pending"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Pulsing visual indicator */}
            <div className="flex flex-col items-center justify-center gap-4 mt-2">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 border border-brand-gold/30 rounded-full animate-ping" />
                <div className="absolute inset-2 border border-brand-gold/40 rounded-full animate-[pulse_2s_infinite]" />
                <div className="w-12 h-12 rounded-full bg-brand-green flex items-center justify-center border border-brand-gold/50 shadow-lg">
                  <Clock className="text-brand-gold animate-spin-[spin_10s_linear_infinite]" size={20} />
                </div>
              </div>

              <div className="text-center flex flex-col gap-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-gold/30 bg-[#B5944E]/10 text-brand-gold text-[9px] font-bold uppercase tracking-wider mx-auto">
                  <span className="w-1.5 h-1.5 bg-brand-gold rounded-full inline-block animate-pulse" />
                  Vinculación Pendiente
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#13382c] mt-1.5">
                  Esperando a la otra parte
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed font-light max-w-xs mx-auto">
                  Se ha enviado la invitación por correo a <strong className="text-brand-green font-medium">{inviteEmail || emailInput}</strong> ({inviteName || nameInput}).
                </p>
                
                <button
                  type="button"
                  onClick={() => setShowHowItWorks(true)}
                  className="text-[10px] text-brand-muted hover:text-brand-green hover:underline transition duration-200 mt-1.5 font-sans flex items-center justify-center gap-1 self-center cursor-pointer"
                >
                  <HelpCircle size={11} className="text-brand-gold" />
                  <span>¿Cómo funciona el proceso?</span>
                </button>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              {/* Copyable generated link */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-brand-green/70 tracking-wider uppercase font-sans">
                  Enlace seguro de invitación
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://mediador.es/unirse?code=MED-9812-C"
                    className="flex-1 bg-brand-bg/50 border border-brand-border focus:outline-none rounded-xl px-4 py-2.5 text-[11px] text-brand-green font-mono select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-brand-green hover:bg-brand-green/90 text-white rounded-xl px-4 flex items-center justify-center transition border border-brand-gold/30 hover:border-brand-gold shadow-sm cursor-pointer"
                    title="Copiar enlace"
                  >
                    {copied ? <Check size={14} className="text-brand-gold" /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="text-[10px] text-brand-muted leading-tight mt-0.5">
                  Puedes copiar este enlace y enviárselo directamente por WhatsApp o SMS.
                </p>
              </div>

              <div className="h-[1px] bg-brand-border/60 my-1" />

              {/* simulated reminder button */}
              <button
                onClick={handleSendReminder}
                disabled={reminderSent}
                className="w-full bg-transparent hover:bg-brand-green/5 text-brand-green border border-brand-green/30 hover:border-brand-green font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {reminderSent ? (
                  <>
                    <Check size={12} className="text-brand-gold" />
                    ¡Recordatorio enviado por Email!
                  </>
                ) : (
                  <>
                    Enviar Recordatorio por Email
                    <Send size={11} />
                  </>
                )}
              </button>
            </div>

            {/* Desktop simulation help text */}
            <div className="bg-[#EAEAE6]/30 border border-brand-border rounded-xl p-3 text-[10px] text-center text-brand-muted italic flex items-center justify-center gap-1.5">
              <Sparkles size={11} className="text-brand-gold shrink-0 animate-pulse" />
              <span>Para continuar con la demo, haz clic en <strong>'Ex completa fase'</strong> en el panel de simulación lateral.</span>
            </div>

            {/* Continue to lobby button if they want to review or bypass temporarily */}
            <button
              onClick={() => router.push("/vestibulo")}
              className="w-full text-brand-muted hover:text-brand-green text-xs font-semibold flex items-center justify-center gap-1 mt-1 transition cursor-pointer"
            >
              Ir al Vestíbulo de Mediación
              <ArrowRight size={12} />
            </button>
          </motion.div>
        )}

        {/* CASE C: Ex-partner joined */}
        {inviteSent && partnerPhaseCompleted && (
          <motion.div
            key="invite-connected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6 items-center text-center mt-2"
          >
            {/* Connection Success Shield */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Gold outer circles */}
              <div className="absolute inset-0 border border-brand-gold/30 rounded-full animate-pulse" />
              <div className="absolute inset-3 border border-[#B5944E]/20 rounded-full" />
              <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-xl text-white">
                <ShieldCheck size={28} />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute top-1 right-1 w-6 h-6 bg-brand-gold rounded-full border border-white flex items-center justify-center shadow"
              >
                <Sparkles size={11} className="text-white" />
              </motion.div>
            </div>

            {/* Success details */}
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 text-[9px] font-bold uppercase tracking-wider mx-auto">
                Conexión Establecida
              </div>
              <h3 className="font-serif text-3xl font-bold text-[#13382c] tracking-tight">
                Vínculo Completado
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed font-light max-w-xs mx-auto">
                Tu ex-pareja, <strong className="text-brand-green font-medium">{partnerName || inviteName}</strong>, se ha unido de forma segura al proceso.
              </p>
            </div>

            {/* Details Box */}
            <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm w-full flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-muted">Proceso de Mediación:</span>
                <span className="font-mono text-brand-gold font-bold">ACTIVO</span>
              </div>
              <div className="h-[1px] bg-brand-border/60" />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-brand-green/75 tracking-wider uppercase">Estado actual del proceso:</span>
                <ul className="text-xs text-brand-muted flex flex-col gap-1.5 mt-1 font-light">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Bóvedas encriptadas individuales: conectadas.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Cuestionario Básico: disponible.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Mesa de Negociación: habilitada.
                  </li>
                </ul>
              </div>
            </div>

            {/* Go to Lobby button */}
            <button
              onClick={() => router.push("/vestibulo")}
              className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-semibold py-4 rounded-xl text-xs flex items-center justify-center gap-2 transition duration-200 shadow-md mt-2 border border-brand-gold/30 hover:border-brand-gold cursor-pointer"
            >
              Comenzar Mediación
              <ArrowRight size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How It Works Modal */}
      <HowItWorksModal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
    </div>
  );
}
