import { DeleteUserTag } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export default function useDeleteTagMutation() {
  return useMutation({
    mutationFn: (tagId: string) => {
      return DeleteUserTag({ tagId });
    },
  });
}
