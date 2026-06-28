import { create } from 'zustand';

interface AnalyticsState {
  data: unknown[];
  isLoading: boolean;
  error: string | null;
  setAnalytics: (data: unknown[]) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  setAnalytics: (data) => set({ data }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
