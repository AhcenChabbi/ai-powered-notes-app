import { CreateUserTag } from "@/lib/api";
import { Tag } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

export default function useCreateTagMutation() {
  return useMutation({
    mutationFn: (tag: Pick<Tag, "name" | "color">) => {
      return CreateUserTag(tag);
    },
  });
}
