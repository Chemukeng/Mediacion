"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSimulation } from "@/context/SimulationContext";
import {
  ShieldCheck,
  ChevronLeft,
  Check,
  Camera,
  Upload,
  UserCheck,
  AlertCircle,
  FileCheck,
  Fingerprint,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VerificacionIdentidadPage() {
  const router = useRouter();
  const { isIdentityVerified, verifyIdentity, userName, partnerName } = useSimulation();

  // Local interactive states for false condition
  const [docType, setDocType] = useState<"dni" | "pasaporte">("dni");
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);
  const [isUploadingFront, setIsUploadingFront] = useState(false);
  const [isUploadingBack, setIsUploadingBack] = useState(false);

  // Facial scan states
  const [isScanningFacial, setIsScanningFacial] = useState(false);
  const [facialScanComplete, setFacialScanComplete] = useState(false);
  const [facialStatusText, setFacialStatusText] = useState("");

  const handleUploadFront = () => {
    setIsUploadingFront(true);
    setTimeout(() => {
      setIsUploadingFront(false);
      setFrontUploaded(true);
    }, 1200);
  };

  const handleUploadBack = () => {
    setIsUploadingBack(true);
    setTimeout(() => {
      setIsUploadingBack(false);
      setBackUploaded(true);
    }, 1200);
  };

  const handleStartFacialScan = () => {
    setIsScanningFacial(true);
    setFacialStatusText("Iniciando cámara...");
    
    setTimeout(() => setFacialStatusText("Mira fijamente al círculo..."), 800);
    setTimeout(() => setFacialStatusText("Enfoque completado. Parpadea una vez..."), 1600);
    setTimeout(() => {
      setFacialStatusText("Escaneando rasgos biométricos...");
    }, 2400);

    setTimeout(() => {
      setIsScanningFacial(false);
      setFacialScanComplete(true);
    }, 3800);
  };

  const handleCompleteKYC = () => {
    verifyIdentity();
  };

  const handleAutoVerify = () => {
    setFrontUploaded(true);
    setBackUploaded(true);
    setFacialScanComplete(true);
    verifyIdentity();
  };

  const isFormReady = frontUploaded && backUploaded && facialScanComplete;

  return (
    <div className="flex flex-col px-6 py-4 select-none bg-brand-bg min-h-full justify-between gap-5 animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="w-full flex justify-between items-center py-2 border-b border-brand-border/30 bg-brand-bg shrink-0">
        <button
          onClick={() => router.push("/perfil")}
          className="w-8 h-8 rounded-full hover:bg-brand-border/40 flex items-center justify-center text-brand-green"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="font-serif text-base font-bold text-[#13382c]">
          Verificación de Identidad
        </h2>

        <div className="w-8 h-8 flex items-center justify-center text-brand-gold shrink-0">
          <ShieldCheck size={20} className={isIdentityVerified ? "text-emerald-600 animate-pulse" : ""} />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 py-2 overflow-y-auto no-scrollbar">
        
        {/* CASE A: User is already verified */}
        {isIdentityVerified ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-5 text-center mt-4"
          >
            {/* Verification Badge */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-pulse" />
              <div className="absolute inset-2 border border-emerald-500/20 rounded-full" />
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg">
                <UserCheck size={32} />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-brand-gold rounded-full p-1.5 border border-white text-brand-green shadow">
                <Sparkles size={11} className="text-white" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-serif text-2xl font-bold text-brand-green">Identidad Certificada</h3>
              <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200/50 px-3 py-1 rounded-full mx-auto flex items-center gap-1">
                <Check size={10} strokeWidth={3} /> Certificación KYC Homologada
              </p>
            </div>

            {/* Document Details Card */}
            <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-sm text-left flex flex-col gap-3.5">
              <div className="flex justify-between items-center text-xs border-b border-brand-border pb-2.5">
                <span className="text-brand-muted">Titular:</span>
                <span className="font-bold text-brand-green font-serif">{userName} López Sanz</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-brand-border pb-2.5">
                <span className="text-brand-muted">Documento verificado:</span>
                <span className="font-mono text-brand-green font-semibold">DNI España • ***4567*</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-brand-border pb-2.5">
                <span className="text-brand-muted">Método de Liveness:</span>
                <span className="text-brand-green font-medium flex items-center gap-1">
                  <Fingerprint size={12} className="text-brand-gold" /> Biometría Facial 3D
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-brand-muted">Validez legal:</span>
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                  Activo para firmas
                </span>
              </div>
            </div>

            {/* Explanatory text */}
            <p className="text-[11px] text-brand-muted leading-relaxed font-light px-2 text-justify">
              Tu identidad ha sido verificada con éxito contrastando tu DNI y biometría facial. Todos los trámites firmados digitalmente desde tu cuenta en MedIAdor ahora gozan de plena validez jurídica.
              <br /><br />
              <span className="italic text-brand-gold font-medium">Nota:</span> Tu ex-pareja ({partnerName}) también deberá completar este proceso de certificación en su panel para poder cerrar y ratificar el borrador de convenio final.
            </p>
          </motion.div>
        ) : (
          /* CASE B: Identity not verified yet */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5"
          >
            {/* Info disclaimer */}
            <div className="bg-[#EAEAE6]/50 border border-brand-border rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-brand-muted">
              <AlertCircle className="text-brand-gold shrink-0 mt-0.5" size={16} />
              <div>
                <strong className="text-[#13382c] font-semibold block mb-0.5">Seguridad Jurídica Obligatoria</strong>
                Para garantizar la validez del borrador del convenio ante el juez, debemos constatar la identidad de ambos cónyuges.
              </div>
            </div>

            {/* Document upload box */}
            <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-sm flex flex-col gap-4">
              <span className="text-[9px] font-bold text-brand-gold tracking-[0.2em] uppercase font-sans">
                1. DOCUMENTO DE IDENTIDAD
              </span>

              {/* Selector */}
              <div className="flex bg-brand-bg p-1 rounded-xl gap-1 text-[10px] font-bold font-sans">
                <button
                  onClick={() => setDocType("dni")}
                  className={`flex-1 text-center py-2 rounded-lg transition ${
                    docType === "dni" ? "bg-white text-brand-green shadow-sm" : "text-brand-muted"
                  }`}
                >
                  DNI (ESPAÑA)
                </button>
                <button
                  onClick={() => setDocType("pasaporte")}
                  className={`flex-1 text-center py-2 rounded-lg transition ${
                    docType === "pasaporte" ? "bg-white text-brand-green shadow-sm" : "text-brand-muted"
                  }`}
                >
                  PASAPORTE / NIE
                </button>
              </div>

              {/* Upload targets */}
              <div className="flex flex-col gap-2.5">
                {/* Front */}
                <div className="flex items-center justify-between border border-brand-border/60 rounded-xl p-3 bg-brand-bg/25">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-brand-green">Anverso del documento</span>
                    <span className="text-[9px] text-brand-muted">Parte delantera con fotografía</span>
                  </div>
                  
                  <button
                    onClick={handleUploadFront}
                    disabled={frontUploaded || isUploadingFront}
                    className={`px-4 py-2 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      frontUploaded
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-brand-green text-white hover:bg-brand-green/90 shadow-sm"
                    }`}
                  >
                    {isUploadingFront ? (
                      <RefreshCw size={11} className="animate-spin" />
                    ) : frontUploaded ? (
                      <>
                        <Check size={11} strokeWidth={2.5} />
                        Listo
                      </>
                    ) : (
                      <>
                        <Upload size={11} />
                        Subir
                      </>
                    )}
                  </button>
                </div>

                {/* Back */}
                <div className="flex items-center justify-between border border-brand-border/60 rounded-xl p-3 bg-brand-bg/25">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-brand-green">Reverso del documento</span>
                    <span className="text-[9px] text-brand-muted">Parte trasera con firma y datos</span>
                  </div>
                  
                  <button
                    onClick={handleUploadBack}
                    disabled={backUploaded || isUploadingBack}
                    className={`px-4 py-2 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      backUploaded
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-brand-green text-white hover:bg-brand-green/90 shadow-sm"
                    }`}
                  >
                    {isUploadingBack ? (
                      <RefreshCw size={11} className="animate-spin" />
                    ) : backUploaded ? (
                      <>
                        <Check size={11} strokeWidth={2.5} />
                        Listo
                      </>
                    ) : (
                      <>
                        <Upload size={11} />
                        Subir
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Facial Biometrics Widget */}
            <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-sm flex flex-col gap-4">
              <span className="text-[9px] font-bold text-brand-gold tracking-[0.2em] uppercase font-sans">
                2. RECONOCIMIENTO BIOMÉTRICO (LIVENESS)
              </span>

              <p className="text-[10px] text-brand-muted leading-relaxed font-light -mt-1.5">
                Prueba de vida facial para corroborar que eres el legítimo titular del documento aportado.
              </p>

              {isScanningFacial ? (
                /* Scanning state camera circle representation */
                <div className="border border-brand-gold/30 bg-[#0E1E1A] rounded-2xl p-5 flex flex-col items-center gap-4 relative overflow-hidden">
                  {/* Scanner moving beam */}
                  <motion.div
                    animate={{ y: [0, 140, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute inset-x-0 h-0.5 bg-brand-gold/60 shadow-[0_0_10px_2px_rgba(181,148,78,0.5)] z-20 pointer-events-none"
                  />
                  
                  <div className="w-28 h-28 rounded-full border-2 border-brand-gold border-dashed flex items-center justify-center relative bg-brand-green/45">
                    <Camera size={24} className="text-brand-gold animate-pulse" />
                  </div>
                  
                  <div className="flex flex-col gap-1 text-center">
                    <span className="text-[10.5px] font-medium text-brand-gold font-mono">{facialStatusText}</span>
                    <span className="text-[8px] text-white/50">Por favor, no muevas tu dispositivo</span>
                  </div>
                </div>
              ) : facialScanComplete ? (
                /* Facial completed state */
                <div className="border border-emerald-500/25 bg-emerald-500/5 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-inner">
                    <Check size={16} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col text-left">
                    <strong className="font-semibold">Liveness facial completado</strong>
                    <span className="text-[9px] text-emerald-600">Rasgos faciales verificados correctamente.</span>
                  </div>
                </div>
              ) : (
                /* Idle state button */
                <button
                  type="button"
                  onClick={handleStartFacialScan}
                  className="w-full bg-[#163B30] hover:bg-[#163B30]/90 text-white font-bold py-4 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition duration-200 shadow-sm border border-brand-gold/20 hover:border-brand-gold/40 cursor-pointer"
                >
                  <Camera size={14} className="text-brand-gold" />
                  <span>Iniciar Escaneo Facial Biométrico</span>
                </button>
              )}
            </div>

            {/* Quick auto-verify button for demonstration/testing */}
            <div className="bg-[#EAEAE6]/30 border border-brand-border rounded-2xl p-4 flex flex-col gap-3 text-center">
              <span className="text-[9.5px] font-bold text-brand-gold font-sans uppercase">ATAJO DE TESTEO</span>
              <p className="text-[9.5px] text-brand-muted leading-tight font-light italic -mt-1.5">
                Para acelerar la evaluación del KYC de Marta en la demo, pulsa el botón inferior para auto-rellenar y validar todo al instante.
              </p>
              <button
                type="button"
                onClick={handleAutoVerify}
                className="w-full bg-transparent hover:bg-[#B5944E]/10 text-brand-gold border border-brand-gold/50 font-bold py-2.5 rounded-xl text-[10px] tracking-wider transition cursor-pointer"
              >
                Auto-Verificar Marta (Demo 1-Clic)
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer / CTA buttons */}
      <div className="flex flex-col gap-3 w-full shrink-0">
        {isIdentityVerified ? (
          <button
            onClick={() => router.push("/perfil")}
            className="w-full bg-brand-green hover:bg-brand-green/95 text-white font-bold py-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition duration-200 shadow-lg cursor-pointer"
          >
            <span>Volver a mi Perfil</span>
          </button>
        ) : (
          <button
            onClick={handleCompleteKYC}
            disabled={!isFormReady}
            className="w-full bg-brand-gold hover:bg-brand-gold-hover text-[#0E1E1A] font-bold py-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition duration-200 shadow-md disabled:bg-brand-gold/40 disabled:text-neutral-500 disabled:cursor-not-allowed cursor-pointer"
          >
            <ShieldCheck size={14} />
            <span className="font-serif text-sm font-bold uppercase tracking-wider">Finalizar Certificación</span>
          </button>
        )}
      </div>

    </div>
  );
}
