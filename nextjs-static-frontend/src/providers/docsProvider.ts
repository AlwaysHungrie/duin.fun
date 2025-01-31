import { create } from 'zustand';

interface DocsState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useDocsStore = create<DocsState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
}));