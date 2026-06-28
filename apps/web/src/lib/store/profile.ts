import { create } from 'zustand';

interface ProfileState {
  data: unknown[];
  isLoading: boolean;
  error: string | null;
  setProfile: (data: unknown[]) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  setProfile: (data) => set({ data }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
