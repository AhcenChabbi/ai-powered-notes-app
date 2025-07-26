import { FileText, Plus } from "lucide-react";
import { TNoteFilters } from "@/lib/types/note";
import getSectionTitle from "@/lib/utils/getSectionTitle";
import CreateNoteButton from "./create-note-button";

interface EmptyStateConfig {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  showCreateButton: boolean;
}

function getEmptyStateConfig(
  filter: string,
  search: string,
  tags: string[]
): EmptyStateConfig {
  const hasFilters = Boolean(search || tags.length > 0);
  const isTrash = filter === "trash";

  if (hasFilters) {
    return {
      icon: FileText,
      title: "No notes found",
      description: "Try adjusting your search or filters",
      showCreateButton: false,
    };
  }

  if (isTrash) {
    return {
      icon: FileText,
      title: "Trash is empty",
      description: "Deleted notes will appear here",
      showCreateButton: false,
    };
  }

  return {
    icon: FileText,
    title: "No notes yet",
    description: "Create your first note to get started",
    showCreateButton: true,
  };
}

export default function EmptyNotesState({
  search,
  filter,
  tags,
}: TNoteFilters) {
  const {
    icon: Icon,
    title,
    description,
    showCreateButton,
  } = getEmptyStateConfig(filter, search, tags);
  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-2xl font-semibold">{getSectionTitle(filter)}</h1>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Icon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">{title}</h2>
          <p className="text-muted-foreground mb-6">{description}</p>
          {showCreateButton && (
            <CreateNoteButton size="lg" className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Note
            </CreateNoteButton>
          )}
        </div>
      </div>
    </div>
  );
}
