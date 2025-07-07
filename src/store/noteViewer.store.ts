import { TNoteWithTags } from "@/lib/types/note";
import { create } from "zustand";

type NoteViewerStore = {
  Note: TNoteWithTags | null;
  isOpen: boolean;
  openNoteViewerModal: (note: TNoteWithTags) => void;
  closeNoteViewerModal: () => void;
  setNote: (note: TNoteWithTags) => void;
};

export const useNoteViewer = create<NoteViewerStore>((set) => ({
  Note: null,
  isOpen: false,
  openNoteViewerModal: (note) => set({ Note: note, isOpen: true }),
  closeNoteViewerModal: () => set({ Note: null, isOpen: false }),
  setNote: (note) => set({ Note: note }),
}));
