import { createUserNote } from "@/lib/api";
import { TNoteSchema } from "@/lib/schemas/schemas";
import { useMutation } from "@tanstack/react-query";

export default function useCreateNoteMutation() {
  return useMutation({
    mutationFn: (note: TNoteSchema) => {
      return createUserNote(note);
    },
  });
}
