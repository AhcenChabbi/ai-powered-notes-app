import {
  parseAsFilter,
  parseAsSearch,
  parseAsTags,
  parseAsViewMode,
} from "@/lib/utils/parsers";
import { useQueryStates } from "nuqs";

export default function useAllQueryStates() {
  return useQueryStates(
    {
      filter: parseAsFilter,
      search: parseAsSearch,
      tags: parseAsTags,
      viewMode: parseAsViewMode,
    },
    {
      urlKeys: {
        filter: "filter",
        search: "search",
        tags: "tags",
        viewMode: "viewMode",
      },
    }
  );
}
