import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export type Filter = "all" | "pinned" | "favorites" | "trash";
const FILTER_VALUES = ["all", "pinned", "favorites", "trash"] as const;
export const parseAsFilter = parseAsStringLiteral(FILTER_VALUES)
  .withDefault("all")
  .withOptions({
    history: "push",
  });
export const parseAsSearch = parseAsString.withDefault("").withOptions({
  history: "push",
});
export const parseAsTags = parseAsArrayOf(parseAsString)
  .withDefault([])
  .withOptions({
    history: "push",
  });

export const parseAsPageNumber = parseAsInteger.withDefault(1).withOptions({
  history: "push",
});

export type ViewMode = "grid" | "list";
const VIEW_MODE_VALUES = ["grid", "list"] as const;
export const parseAsViewMode =
  parseAsStringLiteral(VIEW_MODE_VALUES).withDefault("grid");
