import { getUserNotes } from "@/lib/api";
import { TNoteFilters } from "@/lib/types/note";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

export default function useInfiniteNotesQuery({
  filter,
  search,
  tags,
}: TNoteFilters) {
  return useSuspenseInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["notes", { tags, filter, search }],
    queryFn: ({ pageParam }) =>
      getUserNotes({ filter, search, tags, pageParam }),
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
  });
}
