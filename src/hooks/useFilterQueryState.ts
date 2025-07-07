import { parseAsFilter } from "@/lib/utils/parsers";
import { useQueryState } from "nuqs";

export default function useFilterQueryState() {
  return useQueryState("filter", parseAsFilter);
}
