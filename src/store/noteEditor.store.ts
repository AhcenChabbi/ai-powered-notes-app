import { TNoteWithTags } from "@/lib/types/note";
import { create } from "zustand";

type NoteEditorStore = {
  Note: TNoteWithTags | null;
  isOpen: boolean;
  openNoteEditorModal: (note: TNoteWithTags | null) => void;
  closeNoteEditorModal: () => void;
};

export const useNoteEditor = create<NoteEditorStore>((set) => ({
  Note: null,
  isOpen: false,
  openNoteEditorModal: (note) => set({ Note: note, isOpen: true }),
  closeNoteEditorModal: () => set({ Note: null, isOpen: false }),
}));
