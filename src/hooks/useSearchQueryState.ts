import { parseAsSearch } from "@/lib/utils/parsers";
import { useQueryState } from "nuqs";

export default function useSearchQueryState() {
  return useQueryState("search", parseAsSearch);
}
