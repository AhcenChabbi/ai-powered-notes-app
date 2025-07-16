import { Filter } from "../utils/parsers";

export type TNoteFilters = {
  search: string;
  filter: Filter;
  tags: string[];
};
export type Tag = {
  id: string;
  name: string;
  color: string;
};
export type TNoteWithTags = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  title: string;
  content: string;
  summary: string | null;
  isPinned: boolean;
  isFavorite: boolean;
  deletedAt: string | null;
  tags: Tag[];
};

export type TNoteWithoutMetadata = Omit<
  TNoteWithTags,
  "createdAt" | "updatedAt" | "userId"
>;

export type TagWithCount = Tag & { _count: { notes: number } };
