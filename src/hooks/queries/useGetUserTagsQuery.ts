import { getUserTags } from "@/lib/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

export default function useGetUserTagsQuery() {
  return useSuspenseInfiniteQuery({
    queryKey: ["tags"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return getUserTags({ pageParam });
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
