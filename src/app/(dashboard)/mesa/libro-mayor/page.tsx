"use client";

import React, { useState } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { useRouter } from "next/navigation";
import { ChevronLeft, MoreVertical, Landmark, Check, PenTool, HelpCircle, ArrowRight, Lock, AlertCircle, ShieldCheck, X, Sparkles, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LibroMayorFirmaPage() {
  const { mariaSigned, signMaria, userName, partnerName, mediatorProgress, isIdentityVerified } = useSimulation();
  const router = useRouter();

  const [localMariaSigned, setLocalMariaSigned] = useState(mariaSigned);
  const [showViviendaText, setShowViviendaText] = useState(true);

  // Human Mediator simulation states
  const [showMediatorModal, setShowMediatorModal] = useState(false);
  const [conflictReason, setConflictReason] = useState("vivienda");
  const [requestedName, setRequestedName] = useState("");
  const [isSubmittingMediator, setIsSubmittingMediator] = useState(false);
  const [mediatorSuccess, setMediatorSuccess] = useState(false);

  const isMediationComplete = mediatorProgress === 100;

  const handleSignMariaClick = () => {
    if (!isMediationComplete || !isIdentityVerified) return;
    setLocalMariaSigned(true);
    signMaria();
  };

  const handleAprobarYFirmar = () => {
    if (!isMediationComplete) return;
    if (!isIdentityVerified) {
      router.push("/perfil/verificacion");
      return;
    }
    if (!localMariaSigned) {
      handleSignMariaClick();
    }
    alert("Convenio regulador firmado por ambas partes. Accediendo al acta del acuerdo alcanzado.");
    router.push("/mesa/acuerdo-alcanzado");
  };

  return (
    <div className="flex flex-col px-6 py-4 select-none relative bg-[#13382C] text-white min-h-full">
      
      {/* Header bar (screen copia 8.png) */}
      <div className="flex justify-between items-center py-2 border-b border-white/10 bg-[#13382C] shrink-0">
        <button
          onClick={() => router.push("/mesa")}
          className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <h2 className="font-serif text-xs font-bold text-white tracking-widest uppercase">
            CONVENIO REGULADOR
          </h2>
          <span className="text-[9px] text-brand-gold font-bold tracking-widest uppercase mt-0.5">
            BORRADOR V3
          </span>
        </div>

        <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Gold progress line under header (screen copia 8.png) */}
      <div className="w-full bg-white/10 h-1 overflow-hidden shrink-0 mt-0.5 relative">
        <div className="bg-brand-gold h-full w-[90%]" />
      </div>

      {/* Main timeline book structure */}
      <div className="flex flex-col items-center gap-2.5 mt-6 shrink-0">
        <div className="w-12 h-12 rounded-full border border-brand-gold/40 flex items-center justify-center text-brand-gold bg-[#0E1E1A]">
          <Landmark size={20} />
        </div>
        <h3 className="font-serif text-xl font-bold text-white">
          De mutuo acuerdo
        </h3>
      </div>

      {/* Intro text */}
      <p className="text-[10px] text-white/70 leading-relaxed text-justify mt-4 bg-[#0E1E1A]/35 p-4 rounded-xl border border-white/5 font-light">
        En la ciudad de <strong className="text-white">Madrid</strong>, a <strong className="text-white">24 de Octubre de 2026</strong>.
        <br /><br />
        REUNIDOS de una parte, <strong className="text-white">D. DAVID MARTÍN GÓMEZ</strong>, con DNI 12345678A, y de otra, <strong className="text-white">Dña. MARTA LÓPEZ SANZ</strong> (representada en simulación por Marta), con DNI 87654321B. Ambas partes se reconocen mutuamente la capacidad legal necesaria para otorgar el presente <strong className="text-brand-gold">CONVENIO REGULADOR</strong> de los efectos de su divorcio.
      </p>

      {/* Stipulations timeline */}
      <div className="flex flex-col gap-4 mt-6">
        
        {/* Stipulation 1 */}
        <div className="bg-[#0E1E1A]/40 border border-white/10 p-4 rounded-2xl flex flex-col gap-2 relative">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-serif text-xs font-bold text-white">Estipulación Primera:</span>
              <span className="text-[10px] text-brand-gold">Patria Potestad</span>
            </div>
            <span className="bg-white/5 text-emerald-400 border border-emerald-500/25 text-[8px] font-bold px-2 py-0.5 rounded uppercase font-sans">
              CONSENSUADO
            </span>
          </div>
          <button className="text-[9px] text-white/50 hover:text-white text-left font-bold uppercase mt-1">
            ▼ MOSTRAR TEXTO
          </button>
        </div>

        {/* Stipulation 2: Active open text (screen copia 8.png) */}
        <div className="bg-[#0E1E1A]/40 border border-brand-gold/45 p-4 rounded-2xl flex flex-col gap-2 relative border-dashed">
          {/* Timeline bullet line indicator */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-serif text-xs font-bold text-white">Estipulación Segunda:</span>
              <span className="text-[10px] text-brand-gold font-bold">Uso de la Vivienda</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="bg-brand-gold/10 text-brand-gold border border-brand-gold/30 text-[8px] font-bold px-2 py-0.5 rounded uppercase font-sans">
                EN REVISIÓN
              </span>
              <svg className="w-3.5 h-3.5 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L1 17l1.338-3.123C1.493 12.75 1 11.438 1 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
              </svg>
            </div>
          </div>

          <button
            onClick={() => setShowViviendaText(!showViviendaText)}
            className="text-[9px] text-brand-gold hover:text-brand-gold-hover text-left font-bold uppercase mt-1"
          >
            {showViviendaText ? "▲ OCULTAR TEXTO" : "▼ MOSTRAR TEXTO"}
          </button>

          {showViviendaText && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-[10px] text-white/80 leading-relaxed border-t border-white/10 pt-3 mt-1 text-justify font-light flex flex-col gap-3"
            >
              <p className="border-l-2 border-brand-gold/40 pl-2 italic">
                &quot;Se atribuye el uso y disfrute del domicilio familiar, sito en Calle Gran Vía 12, así como del ajuar doméstico, a los hijos menores y al progenitor custodio, Doña Marta López Sanz, hasta la independencia económica de los hijos. Los gastos de comunidad e IBI serán satisfechos al 50% por ambos copropietarios.&quot;
              </p>
              
              <button
                type="button"
                onClick={() => alert("Revisando comentario pendiente sobre IBI")}
                className="w-full bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold text-center py-2.5 rounded-lg text-[9px] font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>VER COMENTARIO PENDIENTE</span>
                <ArrowRight size={10} />
              </button>
            </motion.div>
          )}
        </div>

        {/* Stipulation 3 */}
        <div className="bg-[#0E1E1A]/40 border border-white/10 p-4 rounded-2xl flex flex-col gap-2 relative">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-serif text-xs font-bold text-white">Estipulación Tercera:</span>
              <span className="text-[10px] text-brand-gold">Pensión de Alimentos</span>
            </div>
            <span className="bg-white/5 text-emerald-400 border border-emerald-500/25 text-[8px] font-bold px-2 py-0.5 rounded uppercase font-sans">
              CONSENSUADO
            </span>
          </div>
          <button className="text-[9px] text-white/50 hover:text-white text-left font-bold uppercase mt-1">
            ▼ MOSTRAR TEXTO
          </button>
        </div>

        {/* Stipulation 4 */}
        <div className="bg-[#0E1E1A]/40 border border-white/10 p-4 rounded-2xl flex flex-col gap-2 relative">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-serif text-xs font-bold text-white">Estipulación Cuarta:</span>
              <span className="text-[10px] text-brand-gold">Liquidación de Gananciales</span>
            </div>
            <span className="bg-white/5 text-emerald-400 border border-emerald-500/25 text-[8px] font-bold px-2 py-0.5 rounded uppercase font-sans">
              CONSENSUADO
            </span>
          </div>
          <button className="text-[9px] text-white/50 hover:text-white text-left font-bold uppercase mt-1">
            ▼ MOSTRAR TEXTO
          </button>
        </div>

      </div>

      {/* Ratificación and Signatures (screen copia 8.png) */}
      <div className="mt-8 flex flex-col gap-4 bg-[#0E1E1A]/35 p-5 rounded-2xl border border-white/5">
        <span className="text-[9px] font-bold text-brand-gold tracking-[0.2em] uppercase text-center block">
          RATIFICACIÓN
        </span>
        
        <p className="text-[10px] text-white/70 leading-relaxed text-center font-light italic">
          Y en prueba de conformidad, firman el presente convenio en el lugar y fecha arriba indicados.
        </p>

        {/* Informational Alert if blocked */}
        {!isMediationComplete ? (
          <div className="flex flex-col gap-3 w-full">
            {/* Warning Alert */}
            <div className="bg-red-500/10 border border-red-500/25 p-3.5 rounded-xl flex gap-2.5 text-[10px] leading-relaxed text-red-300 text-left">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={14} />
              <div>
                <strong className="text-white font-semibold block mb-0.5">Firma Bloqueada</strong>
                Quedan propuestas activas o en discusión en la Mesa de Negociación ({mediatorProgress}% completado). Debéis alcanzar un acuerdo en todos los puntos antes de poder firmar el borrador oficial.
              </div>
            </div>

            {/* Premium Human Mediator Card */}
            <div className="bg-[#163B30] text-white border border-[#235848] rounded-2xl p-4.5 flex flex-col gap-3 shadow-md relative overflow-hidden text-left border-dashed">
              <div className="absolute -right-10 -top-10 w-24 h-24 bg-brand-gold/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-brand-gold border border-white/10 shrink-0 mt-0.5">
                  <Landmark size={14} />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-serif text-[12px] font-bold text-brand-gold leading-tight">
                    ¿Atascados en algún punto?
                  </h4>
                  <p className="text-[10px] text-white/80 leading-relaxed font-light text-justify">
                    Evita meses de litigio judicial. Contrata un <strong>Mediador Humano Letrado</strong>. Intervendrá de manera estrictamente neutral para ayudaros a consensuar un acuerdo, sin posicionarse jamás con ninguno de los dos, independientemente de quién realice el pago.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] border-t border-white/10 pt-2.5 mt-0.5 font-sans">
                <div className="flex flex-col">
                  <span className="text-white/60">Sesión virtual (2h - 1h c/u):</span>
                  <span className="font-bold text-brand-gold font-serif text-[11px]">120€ (60€ por c/u)</span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowMediatorModal(true)}
                  className="bg-brand-gold hover:bg-brand-gold-hover text-[#0E1E1A] font-bold py-1.5 px-3 rounded-lg text-[9px] uppercase tracking-wider transition cursor-pointer"
                >
                  Contratar Mediador
                </button>
              </div>
            </div>
          </div>
        ) : !isIdentityVerified ? (
          <div className="bg-[#B5944E]/10 border border-[#B5944E]/25 p-3.5 rounded-xl flex gap-2.5 text-[10px] leading-relaxed text-amber-200 text-left">
            <AlertCircle className="text-brand-gold shrink-0 mt-0.5" size={14} />
            <div>
              <strong className="text-white font-semibold block mb-0.5">Certificación KYC Pendiente</strong>
              Para garantizar la validez legal y firma digital del convenio regulador, debes verificar tu identidad previamente.
            </div>
          </div>
        ) : null}

        {/* Signatures Area */}
        <div className="flex flex-col gap-6 mt-4 items-center">
          
          {/* Partner 1: David Martín */}
          <div className="flex flex-col items-center gap-1.5">
            {isMediationComplete ? (
              <span className="font-serif text-xl italic text-brand-gold/80 font-bold select-none cursor-not-allowed">
                David M.
              </span>
            ) : (
              <span className="text-[10.5px] text-white/30 italic font-light py-1">
                Firma no disponible
              </span>
            )}
            <div className="w-36 h-[1px] bg-white/20" />
            <span className="text-[9px] text-white/50 font-sans uppercase">
              D. David Martín
            </span>
          </div>

          {/* Partner 2: Marta López (User) */}
          <div className="flex flex-col items-center gap-1.5 w-full">
            {localMariaSigned ? (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-xl italic text-brand-gold font-bold py-1"
              >
                Marta L. S.
              </motion.span>
            ) : !isMediationComplete ? (
              <button
                disabled
                className="w-full max-w-[200px] border border-dashed border-red-500/30 bg-red-500/5 p-3 rounded-xl flex items-center justify-center gap-1.5 text-xs text-red-400 font-medium cursor-not-allowed"
              >
                <Lock size={12} className="text-red-400" />
                <span>FIRMA BLOQUEADA</span>
              </button>
            ) : !isIdentityVerified ? (
              <button
                onClick={() => router.push("/perfil/verificacion")}
                className="w-full max-w-[200px] border border-dashed border-[#B5944E]/55 hover:border-brand-gold bg-[#B5944E]/5 p-3 rounded-xl flex items-center justify-center gap-1.5 text-xs text-[#B5944E] font-medium transition cursor-pointer hover:bg-brand-gold/10"
              >
                <ShieldCheck size={12} className="text-[#B5944E]" />
                <span>VERIFICAR PARA FIRMAR</span>
              </button>
            ) : (
              <button
                onClick={handleSignMariaClick}
                className="w-full max-w-[200px] border border-dashed border-brand-gold/55 hover:border-brand-gold bg-brand-gold/5 p-3 rounded-xl flex items-center justify-center gap-1.5 text-xs text-brand-gold font-medium transition cursor-pointer hover:bg-brand-gold/10"
              >
                <PenTool size={12} />
                <span>PULSAR PARA FIRMAR</span>
              </button>
            )}
            <div className="w-36 h-[1px] bg-white/20" />
            <span className="text-[9px] text-white/50 font-sans uppercase">
              Dña. Marta López
            </span>
          </div>

        </div>
      </div>

      {/* Warning Footer Text */}
      <p className="text-[9px] text-white/40 leading-relaxed text-justify mt-6 font-light font-sans text-center">
        Este documento es un borrador generado por IA. No tiene validez legal hasta que sea revisado por un letrado y ratificado judicialmente.
      </p>

      {/* Bottom CTA Button (screen copia 8.png) */}
      {!isMediationComplete ? (
        <button
          disabled
          className="w-full bg-[#1C2A25] text-white/30 border border-white/5 font-bold py-4 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-not-allowed mt-5 shadow-inner shrink-0"
        >
          <Lock size={14} className="text-white/25" />
          <span className="font-serif text-sm font-bold uppercase tracking-wider">Esperando Acuerdos</span>
        </button>
      ) : !isIdentityVerified ? (
        <button
          onClick={() => router.push("/perfil/verificacion")}
          className="w-full bg-[#EAEAE6]/10 text-[#B5944E] border border-[#B5944E]/30 hover:border-brand-gold hover:bg-brand-gold/10 font-bold py-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition duration-200 mt-5 shadow-lg shrink-0 cursor-pointer"
        >
          <ShieldCheck size={14} className="text-[#B5944E]" />
          <span className="font-serif text-sm font-bold uppercase tracking-wider">Verificar Identidad para Firmar</span>
        </button>
      ) : (
        <button
          onClick={handleAprobarYFirmar}
          className="w-full bg-brand-gold hover:bg-brand-gold-hover text-[#0E1E1A] font-bold py-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition duration-200 mt-5 shadow-lg group shrink-0"
        >
          <PenTool size={14} className="text-[#0E1E1A]" />
          <span className="font-serif text-sm font-bold uppercase tracking-wider">Aprobar y Firmar</span>
        </button>
      )}

      {/* Tip bubble */}
      <div className="text-center text-[9px] text-white/40 mt-3 italic font-sans">
        Pulse cualquier cláusula para expandir o solicitar cambios.
      </div>

      {/* Human Mediator Reservation Modal */}
      <AnimatePresence>
        {showMediatorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0E1E1A]/85 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <div className="absolute inset-0" onClick={() => { if(!isSubmittingMediator) setShowMediatorModal(false); }} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-bg rounded-3xl p-6 border border-brand-gold/30 z-10 flex flex-col gap-4 max-w-sm w-full relative text-center text-brand-green"
            >
              {/* Close Button */}
              {!isSubmittingMediator && (
                <button
                  onClick={() => setShowMediatorModal(false)}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-brand-muted hover:text-brand-green cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}

              {mediatorSuccess ? (
                // Success State
                <div className="flex flex-col gap-4 py-4">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                    <Check size={24} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-green">¡Solicitud Procesada!</h4>
                    <p className="text-[10px] text-brand-muted mt-2 leading-relaxed px-2 text-justify">
                      Hemos recibido tu solicitud. Asignaremos un Letrado Mediador especialista a tu caso en menos de 2 horas laborables.
                      <br /><br />
                      Se enviará una invitación a tu expareja ({partnerName}) para seleccionar el horario conjunto y realizar la mediación de 2 horas (1 hora de intervención para cada parte).
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowMediatorModal(false);
                      setMediatorSuccess(false);
                    }}
                    className="w-full bg-brand-green hover:bg-brand-green/95 text-white font-bold py-3.5 rounded-xl text-[10px] tracking-wider transition cursor-pointer"
                  >
                    Entendido
                  </button>
                </div>
              ) : (
                // Setup / Request State
                <div className="flex flex-col gap-4 text-left">
                  <div className="text-center flex flex-col gap-1">
                    <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto border border-brand-gold/20 mb-1">
                      <Sparkles size={18} />
                    </div>
                    <h4 className="font-serif text-base font-bold text-brand-green">Solicitar Mediador Letrado</h4>
                    <p className="text-[10px] text-brand-muted mt-1 leading-relaxed">
                      Reserva una sesión virtual neutral para consensuar y desatascar las cláusulas en conflicto.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-brand-gold uppercase tracking-wider font-sans">Estipulación Conflictiva</label>
                    <select
                      value={conflictReason}
                      onChange={(e) => setConflictReason(e.target.value)}
                      className="w-full bg-[#EAEAE6]/50 border border-brand-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-gold outline-none"
                    >
                      <option value="vivienda">Uso de la Vivienda Familiar (Estipulación 2)</option>
                      <option value="custodia">Custodia y Régimen de Visitas</option>
                      <option value="alimentos">Pensión de Alimentos</option>
                      <option value="gananciales">Liquidación de Gananciales</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-brand-gold uppercase tracking-wider font-sans">Detalles de Discordia (Opcional)</label>
                    <textarea
                      placeholder="Indica qué puntos causan conflicto..."
                      value={requestedName}
                      onChange={(e) => setRequestedName(e.target.value)}
                      rows={3}
                      className="w-full bg-[#EAEAE6]/50 border border-brand-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-gold outline-none resize-none"
                    />
                  </div>

                  {/* Neutrality & Impartiality Warning */}
                  <div className="bg-[#B5944E]/10 border border-[#B5944E]/25 rounded-xl p-3 text-[9.5px] leading-relaxed text-amber-800 flex gap-2 text-justify">
                    <Scale size={16} className="shrink-0 text-brand-gold mt-0.5" />
                    <div>
                      <strong className="text-[#13382c] font-semibold block mb-0.5">Garantía de Imparcialidad</strong>
                      El mediador actúa como facilitador neutral. Su única labor es ayudaros a encontrar un consenso equilibrado de mutuo acuerdo. En ningún caso se posicionará a favor de ninguno de los dos, independientemente de quién inicie la solicitud o abone el servicio.
                    </div>
                  </div>

                  <div className="bg-[#163B30]/5 border border-brand-green/10 rounded-xl p-3 flex justify-between items-center text-[10px]">
                    <span className="text-brand-muted font-sans font-medium">Coste de la sesión:</span>
                    <span className="font-bold text-brand-green font-mono">120,00 €</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsSubmittingMediator(true);
                      setTimeout(() => {
                        setIsSubmittingMediator(false);
                        setMediatorSuccess(true);
                      }, 1500);
                    }}
                    disabled={isSubmittingMediator}
                    className="w-full bg-brand-gold hover:bg-brand-gold-hover text-[#0E1E1A] font-bold py-3.5 rounded-xl text-[10.5px] tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm uppercase font-serif"
                  >
                    {isSubmittingMediator ? (
                      <span className="animate-pulse">Reservando sesión...</span>
                    ) : (
                      <span>Confirmar y Reservar</span>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
