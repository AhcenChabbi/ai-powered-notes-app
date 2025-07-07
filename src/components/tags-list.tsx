"use client";
import { TagWithCount } from "@/lib/types/note";
import CreateTagModal from "./create-tag-modal";
import useTagsQueryState from "@/hooks/useTagsQueryState";
import { useMemo } from "react";
import { SidebarGroup, SidebarGroupContent } from "./ui/sidebar";
import useGetUserTagsQuery from "@/hooks/queries/useGetUserTagsQuery";
import InfiniteScrollContainer from "./InfiniteScrollContainer";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import useDeleteTagMutation from "@/hooks/mutations/useDeleteTagMutation";
import { toast } from "sonner";
import { invalidateQueries } from "@/lib/utils";
type TagItemProps = {
  tag: TagWithCount;
  isSelected: boolean;
  onToggle: (tagName: string) => void;
  onDeleteTag: (tagId: string) => void;
  isDeleting: boolean;
};

const TagItem = ({
  tag,
  isSelected,
  onToggle,
  isDeleting,
  onDeleteTag,
}: TagItemProps) => {
  return (
    <div
      onClick={() => {
        onToggle(tag.name);
      }}
      className={`w-full group/tag flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-all hover:bg-accent group ${
        isSelected && "bg-accent ring-1 ring-ring"
      }`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div
          className="w-2 h-2 rounded-full transition-transform group-hover:scale-125"
          style={{ backgroundColor: tag.color }}
        />
        <span className="truncate font-medium">{tag.name}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover/tag:opacity-100 transition-opacity text-muted-foreground hover:text-destructive cursor-pointer"
          title="Delete tag"
          disabled={isDeleting}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteTag(tag.id);
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
          {tag._count.notes}
        </span>
      </div>
    </div>
  );
};
const EmptyTagsState = () => {
  return (
    <div className="text-center py-4">
      <p className="text-xs text-muted-foreground">No tags yet</p>
    </div>
  );
};
export function TagsList() {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetUserTagsQuery();
  const tags = useMemo(() => {
    return data.pages.flatMap((page) => page.tags);
  }, [data]);
  const [selectedTags, setSelectedTags] = useTagsQueryState();
  const { mutate: deleteTag, isPending: isDeleting } = useDeleteTagMutation();
  const handleDeleteTag = (tagId: string) => {
    const isConfirm = confirm("Are you sure you want to delete this tag?");
    if (!isConfirm) return;
    deleteTag(tagId, {
      onSuccess: () => {
        toast.success("Tag deleted successfully");
        invalidateQueries();
      },
      onError: () => {
        toast.error("Failed to delete tag, please try again");
      },
    });
  };
  const onToggle = (tagName: string) => {
    setSelectedTags((prev) => {
      return prev.includes(tagName)
        ? prev.filter((selectedTag) => selectedTag !== tagName)
        : [...prev, tagName];
    });
  };
  const isEmpty = tags.length === 0;
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
            <CreateTagModal />
          </div>

          {isEmpty ? (
            <EmptyTagsState />
          ) : (
            <InfiniteScrollContainer
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onBottomReached={fetchNextPage}
            >
              <div className="space-y-1">
                {tags.map((tag) => (
                  <TagItem
                    key={tag.id}
                    tag={tag}
                    isSelected={selectedTags.includes(tag.name)}
                    onToggle={onToggle}
                    onDeleteTag={handleDeleteTag}
                    isDeleting={isDeleting}
                  />
                ))}
                {/* loading indiacate that we are fetching the next tags */}
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center space-x-2 py-2">
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Loading more tags...
                    </span>
                  </div>
                )}
                {!hasNextPage && !isFetchingNextPage && (
                  <div className="text-center py-2">
                    <span className="text-xs text-muted-foreground">
                      No more tags available
                    </span>
                  </div>
                )}
              </div>
            </InfiniteScrollContainer>
          )}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
