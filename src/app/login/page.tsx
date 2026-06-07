"use client";

import React, { useState } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { useRouter } from "next/navigation";
import { Shield, Lock, Send, User, Mail, Sparkles, Check, ArrowRight, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SimulationControls from "@/components/SimulationControls";
import HowItWorksModal from "@/components/HowItWorksModal";

export default function LoginPage() {
  const { login, sendInvite, inviteSent, inviteName, inviteEmail } = useSimulation();
  const router = useRouter();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [messageInput, setMessageInput] = useState(
    "Hola, he iniciado un proceso en MedIAdor para gestionar nuestro convenio regulador de mutuo acuerdo de forma privada. ¿Te unes?"
  );
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);

  const handleGoogleLogin = () => {
    login();
    if (!inviteSent) {
      router.push("/invitacion");
    } else {
      router.push("/vestibulo");
    }
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !emailInput) return;

    setIsSubmittingInvite(true);
    setTimeout(() => {
      sendInvite(nameInput, emailInput, messageInput);
      setIsSubmittingInvite(false);
      setNameInput("");
      setEmailInput("");
      // Don't close immediately so they see the success state
    }, 1500);
  };

  return (
    <div className="min-h-[100dvh] bg-brand-bg lg:bg-[#0E1E1A] text-brand-text flex flex-col lg:flex-row items-stretch lg:items-center lg:justify-center p-0 lg:p-8 gap-8 overflow-x-hidden relative">
      {/* Background Ambience */}
      <div className="hidden lg:block absolute inset-0 bg-radial-[circle_at_50%_-20%] from-[#193F34] to-[#0E1E1A] opacity-80 pointer-events-none" />

      {/* Decorative Brand Text */}
      <div className="hidden lg:flex flex-col text-white max-w-sm gap-2.5 z-10 select-none">
        <span className="font-serif text-brand-gold text-sm tracking-[0.2em] font-semibold">MEDIACIÓN DIGITAL</span>
        
        {/* Brand Logo "MediAción" for Dark Background */}
        <div className="font-serif text-5xl font-bold leading-none tracking-tight flex items-center mt-1">
          <span className="text-white">Med</span>
          <span className="text-brand-gold">iA</span>
          <span className="text-white">ción</span>
        </div>
        <span className="font-sans text-[10px] font-bold text-brand-gold tracking-[0.3em] uppercase mt-1.5">
          ACUERDOS INTELIGENTES
        </span>

        <p className="text-brand-muted text-sm leading-relaxed mt-3">
          Mediación neutral e inteligente para alcanzar convenios reguladores de mutuo acuerdo mediante el uso de inteligencia artificial y soporte legal.
        </p>
        <div className="flex gap-4 mt-6">
          <div className="flex flex-col border-l-2 border-brand-gold/40 pl-3">
            <span className="text-brand-gold text-lg font-serif font-bold">100%</span>
            <span className="text-[10px] text-brand-muted uppercase">Privado y Seguro</span>
          </div>
          <div className="flex flex-col border-l-2 border-brand-gold/40 pl-3">
            <span className="text-brand-gold text-lg font-serif font-bold">IA</span>
            <span className="text-[10px] text-brand-muted uppercase">Validación Legal</span>
          </div>
        </div>
      </div>

      {/* Centered Phone Mockup Frame */}
      <div id="phone-mockup" className="relative w-full lg:max-w-[400px] h-auto lg:h-[820px] bg-brand-bg lg:rounded-[50px] lg:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] lg:border-[10px] lg:border-[#1C2A25] flex flex-col lg:overflow-hidden z-10">
        


        {/* Status Bar simulation */}
        <div className="hidden lg:flex h-9 px-8 pt-3 justify-between items-center text-[10px] font-semibold text-brand-green/60 select-none z-40 bg-transparent">
          <span>10:42</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-5 h-2.5 border border-brand-green/30 rounded-sm p-0.5 flex items-center">
              <div className="h-full w-3 bg-brand-green/60 rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Main Screen Content */}
        <div className="flex-1 flex flex-col px-6 justify-start lg:justify-center pt-24 lg:pt-0 gap-16 lg:overflow-y-auto overflow-visible no-scrollbar pb-12">

          {/* Brand Logo "MediAción" and slogan */}
          <div className="flex flex-col items-center gap-2 select-none shrink-0 w-full mt-4">
            <div className="font-serif text-[46px] font-bold tracking-normal leading-none flex items-center">
              <span className="text-[#11372C]">Med</span>
              <span className="text-[#B5944E]">iA</span>
              <span className="text-[#11372C]">ción</span>
            </div>
            <span className="text-[8.5px] font-bold text-[#11372C]/60 tracking-[0.3em] uppercase mt-2">
              ACUERDOS INTELIGENTES
            </span>
          </div>

          {/* Buttons Area */}
          <div className="w-full flex flex-col gap-4 items-center">
            <p className="text-[9px] font-bold text-brand-green/75 tracking-wider uppercase mb-1">
              INICIAR SESIÓN
            </p>

            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-neutral-50 text-brand-green border border-brand-gold/50 hover:border-brand-gold rounded-xl py-3.5 px-6 flex items-center justify-center gap-3 transition-all duration-200 shadow-sm font-serif text-sm group"
            >
              {/* Gold Google G Icon */}
              <svg className="w-4 h-4 mr-1 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path
                  fill="#B5944E"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#B5944E"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#B5944E"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#B5944E"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continuar con Google
            </button>

            {/* Invite ex spouse option (Requirement) */}
            <button
              onClick={() => setShowInviteModal(true)}
              className="text-xs text-brand-gold hover:text-brand-green hover:underline transition duration-200 mt-2 font-medium"
            >
              Vincular cuenta o enviar invitación
            </button>

            {/* How it works button */}
            <button
              onClick={() => setShowHowItWorks(true)}
              className="text-[10px] text-brand-muted hover:text-brand-green hover:underline transition duration-200 mt-1.5 font-sans flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle size={12} className="text-brand-gold" />
              <span>¿Cómo funciona el sistema de mediación?</span>
            </button>
          </div>

          {/* Mobile Simulation Controls (Visible on mobile only, below everything) */}
          <div className="block lg:hidden mt-8 w-full border-t border-brand-border/60 pt-8 pb-4 shrink-0">
            <SimulationControls />
          </div>
        </div>

        {/* Invitation Bottom Drawer/Modal */}
        <AnimatePresence>
          {showInviteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0E1E1A]/85 backdrop-blur-sm z-50 flex flex-col justify-end"
            >
              {/* Click outside to close */}
              <div className="absolute inset-0" onClick={() => setShowInviteModal(false)} />
              
              {/* Drawer content */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-brand-bg rounded-t-[32px] p-8 border-t border-brand-gold/30 z-10 flex flex-col gap-5 max-h-[85%] overflow-y-auto no-scrollbar relative"
              >
                {/* Pull handle indicator */}
                <div className="w-12 h-1 bg-brand-border rounded-full mx-auto" />
                
                <div>
                  <h3 className="font-serif text-2xl font-bold text-brand-green">Vincular Ex-Pareja</h3>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                    Envía una invitación formal y segura por correo. Al aceptar, vuestras cuentas se conectarán para iniciar la mediación privada.
                  </p>
                </div>

                {inviteSent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl flex flex-col items-center gap-3 text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                      <Check size={20} strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-brand-green">Invitación enviada con éxito</h4>
                      <p className="text-[11px] text-brand-muted mt-1">
                        Se ha enviado un enlace de acceso seguro a <strong className="text-brand-green">{inviteEmail}</strong>.
                      </p>
                    </div>
                    <div className="w-full bg-[#F3F4F0] p-3 rounded-lg border border-brand-border flex items-center justify-between text-left text-[10px] mt-2">
                      <div className="truncate pr-4">
                        <span className="text-brand-muted">Destinatario:</span>
                        <p className="font-semibold text-brand-green truncate">{inviteName}</p>
                      </div>
                      <span className="text-brand-gold font-mono shrink-0 uppercase font-semibold">ENLACE ACTIVO</span>
                    </div>
                    <button
                      onClick={() => setShowInviteModal(false)}
                      className="w-full bg-brand-green hover:bg-brand-green/90 text-white py-2.5 px-4 rounded-xl text-xs font-semibold transition mt-2"
                    >
                      Entendido
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSendInvite} className="flex flex-col gap-4">
                    {/* Name input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-green/75 tracking-wider uppercase">Nombre de la ex-pareja</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 text-brand-muted" size={16} />
                        <input
                          type="text"
                          required
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          placeholder="Ej. David Martín"
                          className="w-full bg-white border border-brand-border focus:border-brand-gold focus:outline-none rounded-xl py-3 pl-11 pr-4 text-xs text-brand-text placeholder-brand-muted/70 transition"
                        />
                      </div>
                    </div>

                    {/* Email input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-green/75 tracking-wider uppercase">Correo electrónico</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 text-brand-muted" size={16} />
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="david.martin@ejemplo.com"
                          className="w-full bg-white border border-brand-border focus:border-brand-gold focus:outline-none rounded-xl py-3 pl-11 pr-4 text-xs text-brand-text placeholder-brand-muted/70 transition"
                        />
                      </div>
                    </div>

                    {/* Message input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-green/75 tracking-wider uppercase">Mensaje personalizado (Opcional)</label>
                      <textarea
                        rows={3}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        className="w-full bg-white border border-brand-border focus:border-brand-gold focus:outline-none rounded-xl py-3 px-4 text-xs text-brand-text placeholder-brand-muted/70 transition resize-none leading-relaxed"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmittingInvite}
                      className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-semibold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition duration-200 shadow-md mt-2 disabled:bg-brand-green/50"
                    >
                      {isSubmittingInvite ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Enviar Invitación Segura
                          <Send size={12} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Cancel button */}
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="w-full text-brand-muted hover:text-brand-green py-2 text-xs font-semibold text-center mt-1"
                >
                  Cancelar y volver
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* How It Works Modal */}
      <HowItWorksModal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />

      {/* Floating Simulation Controls (Desktop only) */}
      <div className="hidden lg:block z-10 w-full lg:w-auto shrink-0">
        <SimulationControls />
      </div>
    </div>
  );
}
