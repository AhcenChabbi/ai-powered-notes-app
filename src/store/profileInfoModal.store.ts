import { create } from "zustand";

interface ProfileInfoState {
  isOpen: boolean;
  openProfileInfoModal: () => void;
  closeProfileInfoModal: () => void;
}

export const useProfileInfoModal = create<ProfileInfoState>((set) => ({
  isOpen: false,
  openProfileInfoModal: () => set({ isOpen: true }),
  closeProfileInfoModal: () => set({ isOpen: false }),
}));
