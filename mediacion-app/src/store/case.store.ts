import { create } from "zustand";

export interface Case {
  id: string;
  user_a_id: string;
  user_b_id: string | null;
  status: "pending_partner" | "questionnaires" | "negotiation" | "signing" | "completed";
  invite_token: string;
  created_at: string;
  updated_at: string;
}

interface CaseState {
  activeCaseId: string | null;
  activeCase: Case | null;
  setActiveCaseId: (caseId: string | null) => void;
  setActiveCase: (caseRecord: Case | null) => void;
  clearActiveCase: () => void;
}

export const useCaseStore = create<CaseState>((set) => ({
  activeCaseId: null,
  activeCase: null,
  setActiveCaseId: (activeCaseId) => set({ activeCaseId }),
  setActiveCase: (activeCase) => set({ activeCase, activeCaseId: activeCase ? activeCase.id : null }),
  clearActiveCase: () => set({ activeCaseId: null, activeCase: null }),
}));
