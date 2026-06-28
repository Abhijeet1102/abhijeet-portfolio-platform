import { create } from 'zustand';

interface BlogState {
  data: unknown[];
  isLoading: boolean;
  error: string | null;
  setBlog: (data: unknown[]) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string) => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  setBlog: (data) => set({ data }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
