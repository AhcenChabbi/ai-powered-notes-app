"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

interface TagsSidebarSkeletonProps {
  itemCount?: number;
}

export function TagsListSkeleton({ itemCount = 6 }: TagsSidebarSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-8" />
        <div className="h-6 w-6 flex items-center justify-center border border-border rounded animate-pulse">
          <Plus className="h-3 w-3 text-muted-foreground opacity-50" />
        </div>
      </div>

      {/* Tags list skeleton */}
      <div className="space-y-1">
        {Array.from({ length: itemCount }, (_, index) => (
          <div
            key={index}
            className="w-full flex items-center justify-between px-2 py-1.5 rounded-md animate-pulse"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Color dot skeleton */}
              <div className="w-2 h-2 rounded-full bg-muted animate-pulse" />

              {/* Tag name skeleton with varying widths */}
              <Skeleton
                className="h-3"
                style={{
                  width: `${Math.floor(Math.random() * 40) + 40}px`,
                }}
              />
            </div>

            {/* Count skeleton */}
            <Skeleton className="h-3 w-4" />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="text-center py-2">
        <div className="flex items-center justify-center space-x-1">
          <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
          <div
            className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-1 animate-pulse">
          Loading tags...
        </p>
      </div>
    </div>
  );
}
