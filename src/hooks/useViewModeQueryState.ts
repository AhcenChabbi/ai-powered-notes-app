import { parseAsViewMode } from "@/lib/utils/parsers";
import { useQueryState } from "nuqs";

export default function useViewModeQueryState() {
  return useQueryState("viewMode", parseAsViewMode);
}
