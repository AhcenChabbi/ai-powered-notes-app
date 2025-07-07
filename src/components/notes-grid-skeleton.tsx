"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteSkeleton } from "./note-skeleton";

interface NotesGridSkeletonProps {
  viewMode?: "grid" | "list";
  itemsPerPage?: number;
}

export function NotesGridSkeleton({
  viewMode = "grid",
  itemsPerPage = 10,
}: NotesGridSkeletonProps) {
  return (
    <div className="flex-1 flex flex-col" data-notes-grid>
      {/* Header Skeleton */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            {/* Refresh button */}
            <Skeleton className="h-8 w-24" />
            {/* View mode toggle skeleton */}
            <div className="flex items-center border border-border rounded-md">
              <Skeleton className="h-8 w-8 rounded-r-none" />
              <Skeleton className="h-8 w-8 rounded-l-none" />
            </div>

            {/* New note button skeleton */}
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: itemsPerPage }, (_, index) => (
                <NoteSkeleton key={index} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {Array.from({ length: itemsPerPage }, (_, index) => (
                <NoteSkeleton key={index} viewMode="list" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
