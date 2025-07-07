"use client";
import type React from "react";
import useAllQueryStates from "@/hooks/useAllQueryStates";
import useInfiniteNotesQuery from "@/hooks/queries/useInfiniteNotesQuery";
import { useMemo } from "react";
import InfiniteScrollContainer from "./InfiniteScrollContainer";
import NoteCard from "./note-card";
import NotesHeader from "./notes-header";
import EmptyNotesState from "./empty-notes-state";

export function NotesGrid() {
  const [{ filter, search, tags, viewMode }] = useAllQueryStates();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteNotesQuery({ filter, search, tags });
  const allNotes = useMemo(
    () => data?.pages.flatMap((page) => page.notes) || [],
    [data]
  );
  const totalCount = data?.pages[0]?.pagination.totalCount || 0;
  const isEmpty = allNotes.length === 0;

  if (isEmpty) {
    return <EmptyNotesState filter={filter} search={search} tags={tags} />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <NotesHeader totalCount={totalCount} filter={filter} />
      <div className="flex-1 overflow-y-auto p-6">
        <InfiniteScrollContainer
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onBottomReached={fetchNextPage}
        >
          <NotesGridLayout viewMode={viewMode}>
            {allNotes.map((note) => (
              <NoteCard key={note.id} {...note} />
            ))}
          </NotesGridLayout>
          {isFetchingNextPage && <LoadingIndicator />}
        </InfiniteScrollContainer>
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center my-4">
      <span className="text-muted-foreground">Loading more notes...</span>
    </div>
  );
}

interface NotesGridLayoutProps {
  viewMode: "grid" | "list";
  children: React.ReactNode;
}
function NotesGridLayout({ viewMode, children }: NotesGridLayoutProps) {
  const gridClasses =
    viewMode === "grid"
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      : "space-y-2";

  return <div className={gridClasses}>{children}</div>;
}
