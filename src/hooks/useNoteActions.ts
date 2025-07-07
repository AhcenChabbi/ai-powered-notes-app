import { TNoteWithTags } from "@/lib/types/note";
import { invalidateQueries } from "@/lib/utils";
import { useNoteEditor } from "@/store/noteEditor.store";
import { useNoteViewer } from "@/store/noteViewer.store";
import { toast } from "sonner";
import useDeleteNoteMutation from "./mutations/useDeleteNoteMutation";
import useUpdateNoteMutation from "./mutations/useUpdateNoteMutation";

const TOAST_MESSAGES = {
  pin: {
    success: (isPinned: boolean) =>
      isPinned ? "Note unpinned successfully" : "Note pinned successfully",
    error: (isPinned: boolean) =>
      isPinned ? "Failed to unpin note" : "Failed to pin note",
  },
  favorite: {
    success: (isFavorite: boolean) =>
      isFavorite ? "Note removed from favorites" : "Note added to favorites",
    error: (isFavorite: boolean) =>
      isFavorite
        ? "Failed to remove note from favorites"
        : "Failed to add note to favorites",
  },
  moveToTrash: {
    success: "Note moved to trash successfully",
    error: "Failed to move note to trash, please try again",
  },
  restore: {
    success: "Note restored successfully",
    error: "Failed to restore note, please try again",
  },
  delete: {
    success: "Note deleted successfully",
    error: "Failed to delete note, please try again",
  },
} as const;
const stopPropagation = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const notesQueryKey = ["notes"];

const useNoteActions = (note: TNoteWithTags) => {
  const { mutate: updateUserNote, isPending: isUpdating } =
    useUpdateNoteMutation();
  const { mutate: deleteUserNote, isPending: isDeleting } =
    useDeleteNoteMutation();
  const { openNoteViewerModal, setNote, closeNoteViewerModal } =
    useNoteViewer();
  const openNoteEditorModal = useNoteEditor(
    (state) => state.openNoteEditorModal
  );

  const handleDeleteNote = () => {
    const isConfirm = confirm("Are you sure you want to delete this note?");
    if (!isConfirm) return;
    deleteUserNote(note.id, {
      onSuccess: () => {
        toast.success(TOAST_MESSAGES.delete.success);
        invalidateQueries();
      },
      onError: () => {
        toast.error(TOAST_MESSAGES.delete.error);
      },
    });
  };

  const handleTogglePinNote = () => {
    updateUserNote(
      { id: note.id, isPinned: !note.isPinned },
      {
        onSuccess: (data) => {
          toast.success(TOAST_MESSAGES.pin.success(note.isPinned));
          setNote(data);
          invalidateQueries(notesQueryKey);
        },
        onError: () => {
          toast.error(TOAST_MESSAGES.pin.error(note.isPinned));
        },
      }
    );
  };

  const handleToggleFavoriteNote = () => {
    updateUserNote(
      { id: note.id, isFavorite: !note.isFavorite },
      {
        onSuccess: (data) => {
          toast.success(TOAST_MESSAGES.favorite.success(note.isFavorite));
          setNote(data);
          invalidateQueries(notesQueryKey);
        },
        onError: () => {
          toast.error(TOAST_MESSAGES.favorite.error(note.isFavorite));
        },
      }
    );
  };

  const moveNoteToTrash = () => {
    updateUserNote(
      { id: note.id, deletedAt: new Date() },
      {
        onSuccess: () => {
          toast.success(TOAST_MESSAGES.moveToTrash.success);
          closeNoteViewerModal();
          invalidateQueries(notesQueryKey);
        },
        onError: () => {
          toast.error(TOAST_MESSAGES.moveToTrash.error);
        },
      }
    );
  };
  const RestoreNote = () => {
    updateUserNote(
      { id: note.id, deletedAt: null },
      {
        onSuccess: () => {
          toast.success(TOAST_MESSAGES.restore.success);
          invalidateQueries(notesQueryKey);
        },
        onError: () => {
          toast.error(TOAST_MESSAGES.restore.error);
        },
      }
    );
  };

  const handleActionClick = (
    e: React.MouseEvent,
    action: (note: TNoteWithTags) => void
  ) => {
    stopPropagation(e);
    action(note);
  };

  return {
    isUpdating,
    isDeleting,
    handleTogglePinNote,
    handleToggleFavoriteNote,
    moveNoteToTrash,
    handleActionClick,
    openNoteViewerModal,
    openNoteEditorModal,
    RestoreNote,
    handleDeleteNote,
  };
};

export default useNoteActions;
