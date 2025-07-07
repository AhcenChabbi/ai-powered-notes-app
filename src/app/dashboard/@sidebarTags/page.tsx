import { TagsList } from "@/components/tags-list";
import { TagsListSkeleton } from "@/components/tags-list-skeleton";
import { Suspense } from "react";

export default function SidebarTagsPage() {
  return (
    <Suspense fallback={<TagsListSkeleton />}>
      <TagsList />
    </Suspense>
  );
}
