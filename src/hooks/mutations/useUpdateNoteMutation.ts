import { updateUserNote } from "@/lib/api";
import { TNoteWithoutMetadata } from "@/lib/types/note";
import { useMutation } from "@tanstack/react-query";

export default function useUpdateNoteMutation() {
  return useMutation({
    mutationFn: (noteData: Partial<TNoteWithoutMetadata> & { id: string }) => {
      return updateUserNote(noteData);
    },
  });
}
