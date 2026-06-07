"use client";

import React, { useState } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  FileText,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Download,
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Lock,
  UserCheck,
  CreditCard,
  X,
  Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CertificadoMascPage() {
  const { isIdentityVerified, partnerName, userName, verifyIdentity } = useSimulation();
  const router = useRouter();
  
  // Simulation states
  const [simulatedDaysPassed, setSimulatedDaysPassed] = useState(true);
  const [partnerKycVerified, setPartnerKycVerified] = useState(true); // simulated partner verification
  const [downloaded, setDownloaded] = useState(false);
  const [downloadPremium, setDownloadPremium] = useState(false);
 
  // Checkout Modal states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [downloadingMasc, setDownloadingMasc] = useState(false);

  // Requirement checks
  const hasUserKyc = isIdentityVerified;
  const hasPartnerKyc = partnerKycVerified;
  const hasTimeElapsed = simulatedDaysPassed;
  const canRequest = hasUserKyc && hasPartnerKyc && hasTimeElapsed;
 
  const handlePurchase = () => {
    setPaymentModalOpen(true);
  };

  const handleCompletePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
    }, 1800);
  };

  const handleDownload = () => {
    setDownloadingMasc(true);
    setTimeout(() => {
      setDownloadingMasc(false);
      setDownloaded(true);
      setPaymentModalOpen(false);
      // Trigger virtual file download
      const element = document.createElement("a");
      const file = new Blob([
        `ACTA DE FINALIZACIÓN DE MEDIACIÓN SIN ACUERDO\n` +
        `-------------------------------------------\n` +
        `De acuerdo con el Art. 22 de la Ley 5/2012, de 6 de julio, de mediación en asuntos civiles y mercantiles (Efecto MASC / Conciliación Judicial).\n\n` +
        `EXPEDIENTE: MED-2026-8947A\n` +
        `FECHA APERTURA: 03/05/2026\n` +
        `FECHA DE ACTA: 03/06/2026\n\n` +
        `PARTES:\n` +
        `- Dña. ${userName} (Solicitante) - Identificación Biométrica KYC: COMPLETA\n` +
        `- Dña. ${partnerName} (Invitada) - Identificación Biométrica KYC: COMPLETA\n\n` +
        `HACE CONSTAR:\n` +
        `Que habiéndose iniciado el proceso de mediación familiar asíncrona y certificado biométricamente a ambas partes, ha transcurrido el plazo legal de un mes sin que se haya podido alcanzar acuerdo de voluntades debido a la inactividad negociadora o falta de disposición de la parte invitada.\n\n` +
        `El presente documento sirve como acreditación de intento de mediación infructuoso de buena fe ante la jurisdicción civil ordinaria a efectos de evitar condena en costas y cumplir requisitos de admisibilidad procesal.\n\n` +
        `FIRMADO DIGITALMENTE Y SELLADO EN BLOCKCHAIN\n` +
        `Código de Verificación Seguro (CVS): Hash SHA-256: 4fa9b3628e831f2de9384bb25249cf4e48b11c911fa48b8c2d829377489ab83c`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = "Acta_Intento_Mediacion_MASC.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  return (
    <div className="flex flex-col px-6 py-4 select-none relative">
      
      {/* Header Bar */}
      <div className="flex justify-between items-center py-2 border-b border-brand-border/30">
        <button
          onClick={() => router.push("/mesa")}
          className="w-8 h-8 rounded-full hover:bg-brand-border/40 flex items-center justify-center text-brand-green"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold text-brand-gold tracking-[0.2em] uppercase">
            CERTIFICACIÓN JUDICIAL
          </span>
          <h2 className="font-serif text-base font-bold text-[#13382c]">
            Certificado MASC / Intento
          </h2>
        </div>

        <div className="w-8 h-8 flex items-center justify-center text-brand-gold">
          <FileText size={20} />
        </div>
      </div>

      {/* Main explanation alert */}
      <div className="mt-4 bg-[#163B30] text-white rounded-3xl p-5 shadow-sm border border-[#1d4c3f] relative overflow-hidden flex flex-col gap-3">
        <h3 className="font-serif text-lg font-bold text-brand-gold">
          Acreditación de Intento de Mediación
        </h3>
        <p className="text-[11px] text-white/80 leading-relaxed font-light">
          Si las negociaciones en la Mesa no prosperan por falta de disposición negociadora del otro cónyuge, este certificado actúa como un **Acta de Mediación sin Acuerdo (MASC / Conciliación)**. Es una prueba legal de buena fe para presentar en el Juzgado de Familia.
        </p>
      </div>

      {/* Requirements checklist */}
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 px-1">
          <span className="w-1.5 h-4 bg-brand-gold rounded-full" />
          <h3 className="font-serif text-xs font-bold tracking-wider text-brand-green uppercase">
            Requisitos de Validez Judicial
          </h3>
        </div>

        <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-sm flex flex-col gap-4">
          
          {/* Requirement 1: User biometric verification */}
          <div className="flex justify-between items-center text-xs pb-3 border-b border-brand-border/50">
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-brand-green">1. Tu Identificación Biométrica (KYC)</span>
              <span className="text-[10px] text-brand-muted">Certificación de identidad digital del emisor.</span>
            </div>
            {hasUserKyc ? (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 font-sans">
                <CheckCircle size={10} className="text-emerald-700" /> Verificado
              </span>
            ) : (
              <button
                onClick={verifyIdentity}
                className="bg-brand-gold hover:bg-brand-gold/90 text-brand-green text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition font-sans"
              >
                Verificar Ahora
              </button>
            )}
          </div>

          {/* Requirement 2: Partner biometric verification */}
          <div className="flex justify-between items-center text-xs pb-3 border-b border-brand-border/50">
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-brand-green">2. Identificación de {partnerName}</span>
              <span className="text-[10px] text-brand-muted">Certificación de identidad de la otra parte.</span>
            </div>
            {hasPartnerKyc ? (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 font-sans">
                <CheckCircle size={10} className="text-emerald-700" /> Verificado
              </span>
            ) : (
              <button
                onClick={() => setPartnerKycVerified(true)}
                className="bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold border border-brand-gold/30 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition font-sans"
              >
                Forzar KYC Ex
              </button>
            )}
          </div>

          {/* Requirement 3: 30 days negotiation effort */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-brand-green">3. Plazo Mínimo Transcurrido (30 días)</span>
              <span className="text-[10px] text-brand-muted">Tiempo desde el inicio del expediente (03/05/2026).</span>
            </div>
            {hasTimeElapsed ? (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 font-sans">
                <Calendar size={10} className="text-emerald-700" /> 31 Días
              </span>
            ) : (
              <button
                onClick={() => setSimulatedDaysPassed(true)}
                className="bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold border border-brand-gold/30 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition font-sans"
              >
                Simular 30 días
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Certificate Preview Card */}
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 px-1">
          <span className="w-1.5 h-4 bg-brand-gold rounded-full" />
          <h3 className="font-serif text-xs font-bold tracking-wider text-brand-green uppercase">
            Vista Previa del Acta Judicial
          </h3>
        </div>

        <div className="bg-[#FAF9F5] border-2 border-dashed border-brand-border rounded-3xl p-5 shadow-sm flex flex-col gap-4 font-mono text-[9px] text-[#4A5D54] relative overflow-hidden select-text">
          {/* Watermark security stamp */}
          <div className="absolute right-4 top-4 border-2 border-emerald-600/30 rounded-full w-16 h-16 flex flex-col items-center justify-center text-emerald-600/30 rotate-12 uppercase text-[7px] font-bold leading-none pointer-events-none">
            <ShieldCheck size={20} className="mb-0.5" />
            <span>FIRMADO</span>
            <span>SECURE</span>
          </div>

          <div className="flex items-center gap-2 pb-2 border-b border-brand-border/30">
            <div className="w-8 h-8 rounded bg-brand-green flex items-center justify-center text-brand-gold font-serif font-bold text-xs shrink-0">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-brand-green tracking-wider text-[10px]">MEDIADOR DIGITAL LEGAL</span>
              <span className="text-[7px] text-brand-muted uppercase">REGISTRO SECTORIAL DE MEDIADORES Nº 827-BC</span>
            </div>
          </div>

          <div className="space-y-2 mt-1">
            <p className="font-bold text-brand-green text-[10px]">ACTA DE CONCILIACIÓN DE MEDIACIÓN SIN ACUERDO</p>
            <p><strong>CÓDIGO EXPEDIENTE:</strong> MED-2026-8947A</p>
            <p><strong>FECHA EXPEDICIÓN:</strong> {simulatedDaysPassed ? "03/06/2026" : "Aún no transcurrido"}</p>
            <p><strong>SOLICITANTE:</strong> Dña. {userName} (KYC: Verificado)</p>
            <p><strong>PARTE INVITADA:</strong> Dña. {partnerName} (KYC: Verificado)</p>
            
            <p className="leading-relaxed border-t border-b border-brand-border/20 py-2 text-justify">
              Se certifica que ambas partes, habiéndose autenticado mediante sistemas biométricos, iniciaron el expediente de mutuo acuerdo el 03/05/2026. Habiendo transcurrido el plazo establecido por la Ley 5/2012 de Mediación Familiar sin que se haya podido establecer un marco negociador fructífero por inactividad o falta de consenso de la parte invitada, se levanta el acta sin acuerdo a petición de la solicitante.
            </p>
            
            <div className="flex justify-between items-center text-[7px] text-brand-muted">
              <span>FIRMA ELECTRÓNICA: DIGITAL_MEDIADOR_SECURE_KEY</span>
              <span>CVS HASH: 4fa9b3628e831...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="mt-6 mb-8">
        {!canRequest ? (
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 flex flex-col gap-2 text-left">
            <div className="flex items-center gap-2 text-red-800 text-xs font-semibold">
              <AlertTriangle size={14} className="text-red-600" />
              <span>Requisitos Incompletos</span>
            </div>
            <p className="text-[10px] text-brand-muted leading-relaxed">
              Para generar un certificado de incomparecencia MASC válido ante un tribunal, se requiere que ambos perfiles estén validados biométricamente. Utiliza el simulador para forzar las verificaciones.
            </p>
            <button
              disabled
              className="w-full bg-slate-100 text-slate-400 font-bold text-[10px] tracking-wider py-3.5 rounded-xl cursor-not-allowed border border-slate-200 mt-2 font-sans"
            >
              DESCARGA BLOQUEADA
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {!paymentSuccess ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handlePurchase}
                  className="w-full bg-brand-gold hover:bg-brand-gold-hover text-[#0E1E1A] font-bold py-3.5 rounded-xl text-[10px] tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm uppercase font-serif cursor-pointer"
                >
                  <CreditCard size={13} className="text-[#0E1E1A]" />
                  <span>Comprar Acta MASC (80€)</span>
                </button>
                <p className="text-[9px] text-brand-muted text-center leading-normal">
                  Adquiere el acta oficial certificada de intento de mediación familiar asíncrona para iniciar el trámite judicial.
                </p>
              </div>
            ) : !downloaded ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleDownload}
                  disabled={downloadingMasc}
                  className="w-full bg-brand-green hover:bg-brand-green/95 text-white font-bold py-3.5 rounded-xl text-[10px] tracking-widest transition duration-200 shadow-sm flex items-center justify-center gap-2 border border-brand-gold/20 font-sans cursor-pointer"
                >
                  {downloadingMasc ? (
                    <span>Generando archivo...</span>
                  ) : (
                    <>
                      <Download size={14} className="text-brand-gold" />
                      <span>DESCARGAR CERTIFICADO MASC</span>
                    </>
                  )}
                </button>
                <p className="text-[9px] text-brand-muted text-center leading-normal">
                  Descarga el acta oficial firmada digitalmente y sellada en blockchain.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 text-left animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold mb-1">
                  <CheckCircle size={14} className="text-emerald-600" />
                  <span>Certificado Descargado Correctamente</span>
                </div>
                <p className="text-[10px] text-brand-muted leading-relaxed">
                  Se ha generado un archivo TXT con el acta oficial e identificadores criptográficos SHA-256. Ya puedes aportarlo a tu procurador para adjuntar a la demanda de familia.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Micropayment & Download Simulator Modal */}
      <AnimatePresence>
        {paymentModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0E1E1A]/85 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => { if(!isProcessingPayment) setPaymentModalOpen(false); }} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-bg rounded-3xl p-6 border border-brand-gold/30 z-10 flex flex-col gap-4 max-w-sm w-full relative text-center text-brand-green"
            >
              {/* Close button */}
              {!isProcessingPayment && !paymentSuccess && (
                <button
                  onClick={() => setPaymentModalOpen(false)}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-brand-muted hover:text-brand-green cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}

              {paymentSuccess ? (
                /* Success & Download Trigger State */
                <div className="flex flex-col gap-4 py-3">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                    <CheckCircle size={24} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-green">¡Pago Confirmado!</h4>
                    <p className="text-[10px] text-brand-muted mt-2 leading-relaxed px-2">
                      El micropago de 80€ se ha realizado con éxito. Ya puedes descargar la versión oficial e inalterable del certificado de intento de mediación (MASC).
                    </p>
                  </div>
                  
                  <button
                    onClick={handleDownload}
                    disabled={downloadingMasc}
                    className="w-full bg-brand-gold hover:bg-brand-gold-hover text-[#0E1E1A] font-bold py-3.5 rounded-xl text-[10px] tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm font-sans cursor-pointer"
                  >
                    {downloadingMasc ? (
                      <span>Descargando...</span>
                    ) : (
                      <>
                        <Download size={13} className="text-[#0E1E1A]" />
                        <span>Descargar Acta Certificada</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Card Checkout Form State */
                <div className="flex flex-col gap-4 text-left">
                  <div className="text-center flex flex-col gap-1 border-b border-brand-border pb-3">
                    <h4 className="font-serif text-base font-bold text-brand-green">Pasarela Expresa</h4>
                    <span className="text-[10px] text-brand-muted">Descarga del Certificado Oficial MASC</span>
                    <span className="text-lg font-serif font-bold text-brand-gold mt-1">80,00 €</span>
                  </div>

                  <div className="flex flex-col gap-3 font-sans">
                    {/* Simulated card inputs */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[8.5px] font-bold text-brand-gold uppercase tracking-wider">Número de Tarjeta</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="•••• •••• •••• 4242"
                          className="w-full bg-[#EAEAE6]/50 border border-brand-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-gold outline-none pl-9 font-mono"
                          disabled={isProcessingPayment}
                        />
                        <CreditCard className="absolute left-3 top-3.5 text-brand-muted" size={13} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[8.5px] font-bold text-brand-gold uppercase tracking-wider">Caducidad</label>
                        <input
                          type="text"
                          placeholder="12 / 28"
                          className="w-full bg-[#EAEAE6]/50 border border-brand-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-gold outline-none text-center font-mono"
                          disabled={isProcessingPayment}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[8.5px] font-bold text-brand-gold uppercase tracking-wider">CVC</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full bg-[#EAEAE6]/50 border border-brand-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-gold outline-none text-center font-mono"
                            disabled={isProcessingPayment}
                          />
                          <Lock className="absolute right-3 top-3.5 text-brand-muted/40" size={12} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment buttons */}
                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      onClick={handleCompletePayment}
                      disabled={isProcessingPayment}
                      className="w-full bg-brand-green hover:bg-brand-green/95 text-white font-bold py-3.5 rounded-xl text-[10.5px] tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md font-sans"
                    >
                      {isProcessingPayment ? (
                        <span className="animate-pulse">Procesando pago...</span>
                      ) : (
                        <span>Pagar 80,00 €</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleCompletePayment}
                      disabled={isProcessingPayment}
                      className="w-full bg-black hover:bg-neutral-900 text-white font-bold py-3.5 rounded-xl text-[10px] tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm font-sans border-none"
                    >
                      <Smartphone size={12} className="text-white" />
                      <span>Pagar con Apple Pay</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
