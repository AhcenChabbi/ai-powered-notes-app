import { parseAsTags } from "@/lib/utils/parsers";
import { useQueryState } from "nuqs";

export default function useTagsQueryState() {
  return useQueryState("tags", parseAsTags);
}
