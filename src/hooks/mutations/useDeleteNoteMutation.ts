import { deleteUserNote } from "@/lib/api";
import { invalidateQueries } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useDeleteNoteMutation() {
  return useMutation({
    mutationFn: (noteId: string) => {
      return deleteUserNote({ noteId });
    },
    onSuccess: () => {
      toast.success("Note deleted successfully");
      invalidateQueries();
    },
    onError: () => {
      toast.error("Failed to delete note, please try again");
    },
  });
}
