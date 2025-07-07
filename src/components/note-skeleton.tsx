"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface NoteSkeletonProps {
  viewMode?: "grid" | "list"
}

export function NoteSkeleton({ viewMode = "grid" }: NoteSkeletonProps) {
  if (viewMode === "list") {
    return (
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 space-y-3">
              {/* Title */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-48" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-3 rounded-full" />
                </div>
              </div>

              {/* Summary */}
              <Skeleton className="h-4 w-96" />

              {/* Tags and date */}
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 ml-4">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {/* Title */}
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />

            {/* Summary */}
            <div className="mt-2 space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 ml-2">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>

          {/* Date and status */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-3 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
