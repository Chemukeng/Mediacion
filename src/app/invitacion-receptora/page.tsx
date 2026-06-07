"use client";

import React, { useState } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { useRouter } from "next/navigation";
import { ShieldCheck, Scale, Clock, CreditCard, Lock, Sparkles, HelpCircle, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import SimulationControls from "@/components/SimulationControls";
import HowItWorksModal from "@/components/HowItWorksModal";

export default function InvitacionReceptoraPage() {
  const { login, togglePartnerPhase, partnerPhaseCompleted, userName, partnerName, hijos, vivienda } = useSimulation();
  const router = useRouter();
  
  const hasChildren = hijos !== "no";
  const hasProperties = vivienda !== "alquiler";
  const totalCost = (hasChildren || hasProperties) ? 800 : 500;
  const halfCost = totalCost / 2;

  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAcceptInvite = () => {
    setIsAccepting(true);
    setTimeout(() => {
      // Set simulation variables to connected
      if (!partnerPhaseCompleted) {
        togglePartnerPhase(); // Mark ex-partner phase completed (connected)
      }
      login(); // Log in
      setIsAccepting(false);
      router.push("/vestibulo"); // Go to dashboard lobby
    }, 1800);
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
      <div id="phone-mockup" className="relative w-full lg:max-w-[400px] h-auto lg:h-[820px] bg-brand-bg lg:rounded-[50px] lg:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] lg:border-[10px] lg:border-[#1C2A25] flex flex-col lg:overflow-hidden z-10 transition-all duration-300">
        


        {/* Status Bar simulation */}
        <div className="hidden lg:flex h-9 px-8 pt-3 justify-between items-center text-[10px] font-semibold text-brand-green/60 select-none z-40 bg-brand-bg">
          <span>10:42</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-5 h-2.5 border border-brand-green/40 rounded-sm p-0.5 flex items-center">
              <div className="h-full w-3 bg-brand-green/60 rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Main Screen Content */}
        <div className="flex-1 flex flex-col px-6 py-4 justify-between gap-4 lg:overflow-y-auto overflow-visible no-scrollbar pb-8">
          
          <div className="flex flex-col gap-4">
            {/* Shield Check Badge & Header */}
            <div className="flex flex-col items-center text-center mt-3 gap-2">
              <div className="w-14 h-14 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center border border-brand-gold/25 shadow-sm">
                <ShieldCheck size={26} className="text-brand-gold animate-[pulse_2s_infinite]" />
              </div>
              <span className="text-[9.5px] font-bold text-brand-gold tracking-[0.25em] uppercase font-sans mt-1">
                INVITACIÓN RECIBIDA
              </span>
              <h2 className="font-serif text-xl font-bold text-brand-green leading-snug">
                Hola {partnerName}
              </h2>
              <p className="text-[10.5px] text-brand-muted leading-relaxed font-light px-2">
                Tu expareja, <strong className="text-brand-green font-semibold">{userName} López Sanz</strong>, te ha invitado a iniciar la redacción de vuestro Convenio Regulador de mutuo acuerdo.
              </p>
            </div>

            {/* Simulated Invitation Message Bubble */}
            <div className="bg-[#EAEAE6]/50 border border-brand-border rounded-2xl p-4 text-[10.5px] leading-relaxed text-brand-text italic relative font-light text-justify">
              <div className="absolute -top-2 left-6 w-3 h-3 bg-[#EAEAE6]/50 rotate-45 border-l border-t border-brand-border" />
              &quot;Hola {partnerName ? partnerName.split(" ")[0] : "David"}, he iniciado un proceso en MedIAdor para gestionar nuestro convenio regulador de mutuo acuerdo de forma privada y neutral. Así nos ahorramos ir a juicio y tener disputas incómodas. ¿Te unes?&quot;
            </div>

            {/* Why Join? Key Persuasion Arguments */}
            <div className="flex flex-col gap-3">
              <span className="text-[9px] font-bold text-brand-gold tracking-[0.2em] uppercase font-sans mt-2">
                ¿POR QUÉ ELEGIR MEDIADOR?
              </span>

              {/* Argument 1: Savings */}
              <div className="bg-white border border-brand-border rounded-2xl p-4 flex gap-3 text-left">
                <CreditCard className="text-brand-gold shrink-0 mt-0.5" size={16} />
                <div className="flex flex-col">
                  <strong className="text-[11.5px] text-brand-green font-serif font-bold">Ahorro de hasta un 80%</strong>
                  <p className="text-[9.5px] text-brand-muted leading-relaxed font-light mt-0.5">
                    Un juicio contencioso con abogados individuales cuesta de media 3.000€ y dura más de un año. En MedIAdor compartís una tarifa plana fija de {totalCost}€ ({halfCost}€ c/u).
                  </p>
                </div>
              </div>

              {/* Argument 2: Control */}
              <div className="bg-white border border-brand-border rounded-2xl p-4 flex gap-3 text-left">
                <Scale className="text-brand-gold shrink-0 mt-0.5" size={16} />
                <div className="flex flex-col">
                  <strong className="text-[11.5px] text-brand-green font-serif font-bold">Tú tienes el control absoluto</strong>
                  <p className="text-[9.5px] text-brand-muted leading-relaxed font-light mt-0.5">
                    No dejes que un juez desconocido decida sobre la custodia de tus hijos, tu vivienda o tus bienes. En MedIAdor decidís vuestro propio futuro.
                  </p>
                </div>
              </div>

              {/* Argument 3: Confidentiality */}
              <div className="bg-white border border-brand-border rounded-2xl p-4 flex gap-3 text-left">
                <Lock className="text-brand-gold shrink-0 mt-0.5" size={16} />
                <div className="flex flex-col">
                  <strong className="text-[11.5px] text-brand-green font-serif font-bold">Privacidad 100% Protegida</strong>
                  <p className="text-[9.5px] text-brand-muted leading-relaxed font-light mt-0.5">
                    {userName} <strong>nunca</strong> tendrá acceso a tus cuestionarios ni a tu diario privado de desahogo. La IA procesa tus datos individualmente y solo cruza propuestas cuando detecta coincidencia neutral.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 w-full shrink-0">
            {/* Primary Action: Join */}
            <button
              onClick={handleAcceptInvite}
              disabled={isAccepting}
              className="w-full bg-brand-gold hover:bg-brand-gold-hover text-[#0E1E1A] font-bold py-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition duration-200 shadow-md uppercase font-serif cursor-pointer"
            >
              {isAccepting ? (
                <span className="animate-pulse">Vinculando cuentas...</span>
              ) : (
                <>
                  <span>Aceptar Invitación y Unirse</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            {/* Secondary Action: How it works */}
            <button
              onClick={() => setShowHowItWorks(true)}
              className="w-full text-brand-muted hover:text-brand-green text-[10.5px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <HelpCircle size={12} className="text-brand-gold" />
              <span>¿Cómo funciona el sistema de mediación?</span>
            </button>
          </div>

        </div>

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
