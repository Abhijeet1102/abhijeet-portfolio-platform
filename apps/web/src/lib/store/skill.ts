import { create } from 'zustand';

interface SkillState {
  data: unknown[];
  isLoading: boolean;
  error: string | null;
  setSkill: (data: unknown[]) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string) => void;
}

export const useSkillStore = create<SkillState>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  setSkill: (data) => set({ data }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
