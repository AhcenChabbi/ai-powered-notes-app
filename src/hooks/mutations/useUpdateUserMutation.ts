import { UpdateUser } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export default function useUpdateUserMutation() {
  return useMutation({
    mutationFn: (formData: FormData) => {
      return UpdateUser(formData);
    },
  });
}
