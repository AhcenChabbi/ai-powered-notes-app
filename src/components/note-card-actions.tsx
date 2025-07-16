import { TNoteWithTags } from "@/lib/types/note";
import { Eye, Edit, Trash2, RotateCcw, Pin, Heart, Trash } from "lucide-react";
import { Button } from "./ui/button";
import useFilterQueryState from "@/hooks/useFilterQueryState";
import { ViewMode } from "@/lib/utils/parsers";
import useNoteActions from "@/hooks/useNoteActions";
import ActionsDropdown from "./actions-dropdown";

// Types
interface ActionItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: (note: TNoteWithTags) => void;
  className?: string;
  disabled: boolean;
}

interface ActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  isListView: boolean;
}

interface NoteCardActionsProps {
  note: TNoteWithTags;
  viewMode: ViewMode;
}

// Constants
const BUTTON_SIZES = {
  list: {
    size: "lg" as const,
    dimensions: "h-8 w-8",
    iconSize: "h-4 w-4",
  },
  grid: {
    size: "sm" as const,
    dimensions: "h-7 w-7",
    iconSize: "h-3 w-3",
  },
} as const;

// Utility functions
const stopPropagation = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const getButtonConfig = (isListView: boolean) =>
  isListView ? BUTTON_SIZES.list : BUTTON_SIZES.grid;

// Components
const ActionButton = ({
  icon: Icon,
  title,
  onClick,
  className = "text-muted-foreground",
  disabled = false,
  isListView,
}: ActionButtonProps) => {
  const { size, dimensions, iconSize } = getButtonConfig(isListView);

  return (
    <Button
      variant="ghost"
      size={size}
      className={`${dimensions} p-0 cursor-pointer ${className}`}
      title={title}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon className={iconSize} />
    </Button>
  );
};

const PinButton = ({
  note,
  onTogglePin,
  isPending,
  isListView,
}: {
  note: TNoteWithTags;
  onTogglePin: () => void;
  isPending: boolean;
  isListView: boolean;
}) => (
  <ActionButton
    icon={Pin}
    title={note.isPinned ? "Unpin note" : "Pin note"}
    onClick={(e) => {
      stopPropagation(e);
      onTogglePin();
    }}
    className={note.isPinned ? "text-orange-500" : "text-muted-foreground"}
    disabled={isPending}
    isListView={isListView}
  />
);

const FavoriteButton = ({
  note,
  onToggleFavorite,
  isPending,
  isListView,
}: {
  note: TNoteWithTags;
  onToggleFavorite: () => void;
  isPending: boolean;
  isListView: boolean;
}) => {
  const HeartIcon = ({ className }: { className?: string }) => (
    <Heart
      className={`${className} ${note.isFavorite ? "fill-current" : ""}`}
    />
  );

  return (
    <ActionButton
      icon={HeartIcon}
      title={note.isFavorite ? "Remove from favorites" : "Add to favorites"}
      onClick={(e) => {
        stopPropagation(e);
        onToggleFavorite();
      }}
      className={note.isFavorite ? "text-red-500" : "text-muted-foreground"}
      disabled={isPending}
      isListView={isListView}
    />
  );
};

const TrashActions = ({
  isListView,
  onRestoreNote,
  onDeleteNote,
}: {
  isListView: boolean;
  onRestoreNote: () => void;
  onDeleteNote: () => void;
}) => (
  <>
    <ActionButton
      icon={RotateCcw}
      title="Restore note"
      onClick={(e) => {
        stopPropagation(e);
        onRestoreNote();
      }}
      className="text-green-600 hover:text-green-700"
      isListView={isListView}
    />
    <ActionButton
      icon={Trash}
      title="Delete permanently"
      onClick={(e) => {
        stopPropagation(e);
        onDeleteNote();
      }}
      className="text-red-600 hover:text-red-700"
      isListView={isListView}
    />
  </>
);

const RegularActions = ({
  note,
  onTogglePin,
  onToggleFavorite,
  isPending,
  isListView,
}: {
  note: TNoteWithTags;
  onTogglePin: () => void;
  onToggleFavorite: () => void;
  isPending: boolean;
  isListView: boolean;
}) => (
  <>
    <PinButton
      note={note}
      onTogglePin={onTogglePin}
      isPending={isPending}
      isListView={isListView}
    />
    <FavoriteButton
      note={note}
      onToggleFavorite={onToggleFavorite}
      isPending={isPending}
      isListView={isListView}
    />
  </>
);

const useActionItems = (
  note: TNoteWithTags,
  handlers: ReturnType<typeof useNoteActions>
) => {
  const {
    moveNoteToTrash,
    openNoteViewerModal,
    openNoteEditorModal,
    handleDeleteNote,
    isUpdating,
    isDeleting,
    RestoreNote,
  } = handlers;

  const regularActions: ActionItem[] = [
    {
      icon: Eye,
      label: "View",
      action: openNoteViewerModal,
      disabled: false,
    },
    {
      icon: Edit,
      label: "Edit",
      action: openNoteEditorModal,
      disabled: false,
    },
    {
      icon: Trash2,
      label: "Move to trash",
      action: moveNoteToTrash,
      className: "text-destructive",
      disabled: isUpdating,
    },
  ];

  const trashActions: ActionItem[] = [
    {
      label: "Restore",
      icon: RotateCcw,
      action: () => RestoreNote(),
      disabled: false,
      className: "text-green-600",
    },
    {
      label: "Delete Permanently",
      icon: Trash2,
      action: () => handleDeleteNote(),
      disabled: isDeleting,
      className: "text-destructive",
    },
  ];

  return { regularActions, trashActions };
};

// Main component
export default function NoteCardActions({
  note,
  viewMode,
}: NoteCardActionsProps) {
  const [filter] = useFilterQueryState();
  const handlers = useNoteActions(note);
  const { regularActions, trashActions } = useActionItems(note, handlers);

  const isTrashView = filter === "trash";
  const isListView = viewMode === "list";
  const displayedActions = isTrashView ? trashActions : regularActions;

  return (
    <div
      className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
        isListView ? "ml-4" : ""
      }`}
    >
      {isTrashView ? (
        <TrashActions
          isListView={isListView}
          onRestoreNote={handlers.RestoreNote}
          onDeleteNote={handlers.handleDeleteNote}
        />
      ) : (
        <RegularActions
          note={note}
          onTogglePin={handlers.handleTogglePinNote}
          onToggleFavorite={handlers.handleToggleFavoriteNote}
          isPending={handlers.isUpdating}
          isListView={isListView}
        />
      )}

      <ActionsDropdown
        actions={displayedActions}
        onActionClick={handlers.handleActionClick}
      />
    </div>
  );
}
