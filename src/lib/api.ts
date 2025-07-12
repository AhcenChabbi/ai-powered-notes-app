import API from "@/config/apiClient";
import {
  Tag,
  TagWithCount,
  TNoteFilters,
  TNoteWithoutMetadata,
  TNoteWithTags,
} from "./types/note";
import { TNoteSchema } from "./schemas/schemas";
import { User } from "next-auth";

type TGetUserNotesResponse = {
  notes: TNoteWithTags[];
  pagination: {
    currentPage: number;
    nextPage: number | null;
    hasMore: boolean;
    totalPages: number;
    totalCount: number;
  };
};
type TgetUserNotesParams = TNoteFilters & { pageParam: number };
export async function getUserNotes({
  filter,
  search,
  tags,
  pageParam,
}: TgetUserNotesParams) {
  const params = new URLSearchParams();
  params.append("filter", filter);
  params.append("search", search);
  params.append("tags", tags.join(","));
  params.append("page", pageParam.toString());
  const response = await API.get<TGetUserNotesResponse>(
    `/notes?${params.toString()}`
  );
  return response.data;
}

export async function updateUserNote(
  noteData: Partial<TNoteWithoutMetadata> & {
    id: string;
  }
) {
  const response = await API.patch<TNoteWithTags>(
    `/notes/${noteData.id}`,
    noteData
  );
  return response.data;
}
export async function createUserNote(note: TNoteSchema) {
  const response = await API.post<TNoteWithTags>("/notes", note);
  return response.data;
}
type TGetUserTagsResponse = {
  tags: TagWithCount[];
  totalCount: number;
  nextPage: number | null;
};
export async function getUserTags({ pageParam }: { pageParam: number }) {
  const response = await API.get<TGetUserTagsResponse>(
    `/tags?page=${pageParam}`
  );
  return response.data;
}

export async function deleteUserNote({ noteId }: { noteId: string }) {
  const response = await API.delete(`/notes/${noteId}`);
  return response.data;
}

export async function CreateUserTag(tag: Pick<Tag, "name" | "color">) {
  const response = await API.post<Tag>("/tags", tag);
  return response.data;
}

export async function DeleteUserTag({ tagId }: { tagId: string }) {
  const response = await API.delete(`/tags/${tagId}`);
  return response.data;
}

export async function UpdateUser(formData: FormData) {
  const response = await API.patch<User>(`/user`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
