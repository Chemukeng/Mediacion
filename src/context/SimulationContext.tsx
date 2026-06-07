"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type AgreementStatus = "pendiente" | "discusion" | "acordado";

export interface AgreementItem {
  id: string;
  title: string;
  status: AgreementStatus;
  quote: string;
  subtext: string;
  source: string;
  phase?: string;
  percentage?: string;
}

interface SimulationContextType {
  // Auth and Invite States
  isLoggedIn: boolean;
  inviteSent: boolean;
  inviteName: string;
  inviteEmail: string;
  inviteMessage: string;
  
  // Participant Names
  userName: string;
  partnerName: string;

  // Progress States
  partnerPhaseCompleted: boolean; // Simulates the ex completing their phase
  basicCompleted: boolean;
  dynamicCompleted: boolean;
  proposalAccepted: boolean;
  
  // New States for the 11-screen flow
  basicSubmitted: boolean;      // Step 4 Cuestionario Básico form submitted
  dynamicSubmitted: boolean;    // Step 5 Cuestionario Dinámico question answered
  chatPrivadoSelled: boolean;   // Step 6 Private chat locked/sealed
  mariaSigned: boolean;         // Step 9 Convenio signed by user
  paymentOption: "50" | "100";  // Step 10 Payment selection
  paymentCompleted: boolean;    // Step 10 Payment success
  isIdentityVerified: boolean;  // KYC Identity verification status
  userBovedaFinished: boolean;  // Has finished the boveda phase
  hijos: "no" | "menores" | "mayores";
  vivienda: "alquiler" | "propiedad-hipoteca" | "multipropiedad";
  
  // Negotiation Items
  agreements: AgreementItem[];
  mediatorProgress: number;

  // Actions
  login: () => void;
  logout: () => void;
  sendInvite: (name: string, email: string, message: string) => void;
  verifyIdentity: () => void;
  togglePartnerPhase: () => void;
  completeBasic: () => void;
  completeDynamic: () => void;
  acceptProposal: () => void;
  setAgreementStatus: (id: string, status: AgreementStatus) => void;
  submitBasicForm: (hijos: "no" | "menores" | "mayores", vivienda: "alquiler" | "propiedad-hipoteca" | "multipropiedad") => void;
  submitDynamicQuestion: () => void;
  sellChatPrivado: () => void;
  signMaria: () => void;
  setPaymentOption: (option: "50" | "100") => void;
  completePayment: () => void;
  finishUserBoveda: () => void;
  agreeAll: () => void;
  resetSimulation: () => void;
}

const defaultAgreements: AgreementItem[] = [
  {
    id: "distribucion",
    title: "Distribución: Residencia Principal",
    status: "pendiente",
    quote: "Propuesta neutralizada: Venta de la propiedad y división equitativa del remanente tras...",
    subtext: "FASE 1/3",
    source: "Originado en Bóveda Privada",
    phase: "FASE 1/3"
  },
  {
    id: "custodia",
    title: "Custodia: Fines de Semana",
    status: "discusion",
    quote: "Esquema de alternancia 2-2-3 procesado para eliminar adjetivos emocionales. Centrado en...",
    subtext: "65% ACORDADO",
    source: "Cuestionario Dinámico",
    percentage: "65%"
  },
  {
    id: "gastos",
    title: "Gastos: Educación Extra",
    status: "acordado",
    quote: "Acuerdo finalizado sobre la cobertura de actividades extracurriculares y materiales...",
    subtext: "FINALIZADO",
    source: "Cuestionario Dinámico"
  }
];

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  
  const [userName] = useState("Marta");
  const [partnerName] = useState("David Martín");
  
  const [partnerPhaseCompleted, setPartnerPhaseCompleted] = useState(false);
  const [basicCompleted, setBasicCompleted] = useState(false);
  const [dynamicCompleted, setDynamicCompleted] = useState(false);
  const [proposalAccepted, setProposalAccepted] = useState(false);
  
  // New States
  const [basicSubmitted, setBasicSubmitted] = useState(false);
  const [dynamicSubmitted, setDynamicSubmitted] = useState(false);
  const [chatPrivadoSelled, setChatPrivadoSelled] = useState(false);
  const [mariaSigned, setMariaSigned] = useState(false);
  const [paymentOption, setPaymentOptionState] = useState<"50" | "100">("50");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [userBovedaFinished, setUserBovedaFinished] = useState(false);
  const [hijos, setHijos] = useState<"no" | "menores" | "mayores">("no");
  const [vivienda, setVivienda] = useState<"alquiler" | "propiedad-hipoteca" | "multipropiedad">("alquiler");

  const [agreements, setAgreements] = useState<AgreementItem[]>(defaultAgreements);

  // Derive mediator progress based on statuses
  const agreedCount = agreements.filter(a => a.status === "acordado").length;
  const totalCount = agreements.length;
  const mediatorProgress = Math.round((agreedCount / totalCount) * 100);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  const sendInvite = (name: string, email: string, message: string) => {
    setInviteName(name);
    setInviteEmail(email);
    setInviteMessage(message);
    setInviteSent(true);
  };

  const togglePartnerPhase = () => {
    setPartnerPhaseCompleted(prev => !prev);
  };

  const completeBasic = () => {
    setBasicCompleted(true);
    setBasicSubmitted(true);
  };

  const completeDynamic = () => {
    setDynamicCompleted(true);
    setDynamicSubmitted(true);
  };

  const submitBasicForm = (hijos: "no" | "menores" | "mayores", vivienda: "alquiler" | "propiedad-hipoteca" | "multipropiedad") => {
    setHijos(hijos);
    setVivienda(vivienda);
    setBasicCompleted(true);
    setBasicSubmitted(true);
  };

  const submitDynamicQuestion = () => {
    setDynamicCompleted(true);
    setDynamicSubmitted(true);
  };

  const sellChatPrivado = () => {
    setChatPrivadoSelled(true);
  };

  const signMaria = () => {
    setMariaSigned(true);
  };

  const setPaymentOption = (option: "50" | "100") => {
    setPaymentOptionState(option);
  };

  const completePayment = () => {
    setPaymentCompleted(true);
  };

  const verifyIdentity = () => {
    setIsIdentityVerified(true);
  };

  const finishUserBoveda = () => {
    setUserBovedaFinished(true);
  };

  const agreeAll = () => {
    setProposalAccepted(true);
    setAgreements(prev =>
      prev.map(a => ({
        ...a,
        status: "acordado",
        subtext: "FINALIZADO"
      }))
    );
  };

  const acceptProposal = () => {
    setProposalAccepted(true);
    // When proposal is accepted, set custodia to agreed
    setAgreements(prev =>
      prev.map(a =>
        a.id === "custodia"
          ? { ...a, status: "acordado", quote: "Pensión compensatoria acordada de 350€ mensuales por 24 meses.", subtext: "FINALIZADO" }
          : a
      )
    );
  };

  const setAgreementStatus = (id: string, status: AgreementStatus) => {
    setAgreements(prev =>
      prev.map(a => {
        if (a.id === id) {
          let sub = a.subtext;
          if (status === "acordado") sub = "FINALIZADO";
          else if (status === "discusion") sub = "65% ACORDADO";
          else sub = "FASE 1/3";
          return { ...a, status, subtext: sub };
        }
        return a;
      })
    );
  };

  const resetSimulation = () => {
    setIsLoggedIn(false);
    setInviteSent(false);
    setInviteName("");
    setInviteEmail("");
    setInviteMessage("");
    setPartnerPhaseCompleted(false);
    setBasicCompleted(false);
    setDynamicCompleted(false);
    setProposalAccepted(false);
    setBasicSubmitted(false);
    setDynamicSubmitted(false);
    setChatPrivadoSelled(false);
    setMariaSigned(false);
    setPaymentOptionState("50");
    setPaymentCompleted(false);
    setIsIdentityVerified(false);
    setUserBovedaFinished(false);
    setHijos("no");
    setVivienda("alquiler");
    setAgreements(defaultAgreements);
  };

  return (
    <SimulationContext.Provider
      value={{
        isLoggedIn,
        inviteSent,
        inviteName,
        inviteEmail,
        inviteMessage,
        userName,
        partnerName,
        partnerPhaseCompleted,
        basicCompleted,
        dynamicCompleted,
        proposalAccepted,
        basicSubmitted,
        dynamicSubmitted,
        chatPrivadoSelled,
        mariaSigned,
        paymentOption,
        paymentCompleted,
        agreements,
        mediatorProgress,
        login,
        logout,
        sendInvite,
        togglePartnerPhase,
        completeBasic,
        completeDynamic,
        acceptProposal,
        setAgreementStatus,
        submitBasicForm,
        submitDynamicQuestion,
        sellChatPrivado,
        signMaria,
        setPaymentOption,
        completePayment,
        isIdentityVerified,
        verifyIdentity,
        userBovedaFinished,
        finishUserBoveda,
        hijos,
        vivienda,
        agreeAll,
        resetSimulation
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
}
