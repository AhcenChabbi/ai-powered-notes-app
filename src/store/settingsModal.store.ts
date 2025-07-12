import { create } from "zustand";

interface SettingsModalState {
  isOpen: boolean;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
}
export const useSettingsModal = create<SettingsModalState>((set) => ({
  isOpen: false,
  openSettingsModal: () => set({ isOpen: true }),
  closeSettingsModal: () => set({ isOpen: false }),
}));
