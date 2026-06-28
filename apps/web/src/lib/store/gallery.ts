import { create } from 'zustand';

interface GalleryState {
  data: unknown[];
  isLoading: boolean;
  error: string | null;
  setGallery: (data: unknown[]) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string) => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  setGallery: (data) => set({ data }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
