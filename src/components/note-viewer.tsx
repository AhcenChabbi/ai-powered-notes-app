"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Edit,
  Pin,
  Heart,
  Trash2,
  Calendar,
  Clock,
  Eye,
  RotateCcw,
  Trash,
} from "lucide-react";
import { useNoteViewer } from "@/store/noteViewer.store";
import { useNoteEditor } from "@/store/noteEditor.store";
import { TNoteWithTags } from "@/lib/types/note";
import Editor from "./editor/editor";
import { generateJSON } from "@tiptap/core";
import { extensions } from "./editor";
import useNoteActions from "@/hooks/useNoteActions";
import useFilterQueryState from "@/hooks/useFilterQueryState";
import ActionsDropdown from "./actions-dropdown";
import { formatDate } from "@/lib/utils/format-date";

export function NoteViewer() {
  const { Note, closeNoteViewerModal, isOpen } = useNoteViewer();
  if (!Note) return null;
  return (
    <Dialog open={isOpen} onOpenChange={closeNoteViewerModal}>
      <DialogContent className="!max-w-5xl max-h-[95vh] h-[95vh] overflow-hidden flex flex-col p-0">
        <NoteViewerHeader note={Note} />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-bold leading-tight">
                {Note.title}
              </DialogTitle>
              {Note.summary && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {Note.summary}
                </p>
              )}
            </div>
            {/* Metadata */}
            <NoteMetadata Note={Note} />
            {/* Content */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Content
              </h3>
              <Editor
                editable={false}
                initialContent={generateJSON(Note.content, extensions)}
                onUpdate={() => {}}
              />
              {/* <div
                className="prose prose-slate dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full"
                dangerouslySetInnerHTML={{ __html: Note.content }}
              /> */}
            </div>
            {/* Tags */}
            <NoteTags tags={Note.tags} />
          </div>
        </div>
        <NoteViewerFooter Note={Note} />
      </DialogContent>
    </Dialog>
  );
}

const NoteViewerHeader = ({ note }: { note: TNoteWithTags }) => {
  const {
    moveNoteToTrash,
    isUpdating,
    RestoreNote,
    handleDeleteNote,
    isDeleting,
    handleActionClick,
  } = useNoteActions(note);
  const openNoteEditorModal = useNoteEditor(
    (state) => state.openNoteEditorModal
  );
  const [filter] = useFilterQueryState();
  const trashActions = [
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
  const regularActions = [
    {
      label: "Move to trash",
      icon: Trash2,
      action: () => moveNoteToTrash(),
      disabled: isUpdating,
      className: "text-destructive",
    },
  ];
  const displayedActions = filter === "trash" ? trashActions : regularActions;
  return (
    <div className="flex items-center justify-between p-6 border-b border-border">
      <div className="flex items-center gap-3">
        <Eye className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Viewing Note</span>
      </div>
      <div className="flex items-center gap-2">
        {filter !== "trash" && (
          <Button
            onClick={() => openNoteEditorModal(note)}
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
        <ActionsDropdown
          actions={displayedActions}
          onActionClick={handleActionClick}
        />
      </div>
    </div>
  );
};

const NoteMetadata = ({ Note }: { Note: TNoteWithTags }) => (
  <div className="flex items-center gap-6 text-sm text-muted-foreground border-b border-border pb-4">
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4" />
      <span>Created {formatDate(Note.createdAt, "DATE_TIME")}</span>
    </div>
    {Note.updatedAt !== Note.createdAt && (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>Updated {formatDate(Note.updatedAt, "DATE_TIME")}</span>
      </div>
    )}
    <div className="flex items-center gap-2">
      {Note.isPinned && (
        <Badge variant="secondary" className="gap-1">
          <Pin className="h-3 w-3 text-orange-500" />
          Pinned
        </Badge>
      )}
      {Note.isFavorite && (
        <Badge variant="secondary" className="gap-1">
          <Heart className="h-3 w-3 text-red-500 fill-current" />
          Favorite
        </Badge>
      )}
    </div>
  </div>
);

const NoteTags = ({ tags }: { tags: TNoteWithTags["tags"] }) => {
  if (tags.length === 0)
    return (
      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">No tags yet</p>
      </div>
    );
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.name}
            variant="secondary"
            className="px-3 py-1"
            style={{
              backgroundColor: `${tag.color}15`,
              color: tag.color,
              border: `1px solid ${tag.color}30`,
            }}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};

const NoteViewerFooter = ({ Note }: { Note: TNoteWithTags }) => {
  const {
    handleToggleFavoriteNote,
    handleTogglePinNote,
    isUpdating,
    handleDeleteNote,
    RestoreNote,
    isDeleting,
  } = useNoteActions(Note);
  const [filter] = useFilterQueryState();
  return (
    <div className="border-t border-border p-4 flex items-center justify-between bg-muted/30">
      <div className="flex items-center gap-2">
        {filter === "trash" ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 hover:text-green-700 cursor-pointer"
              disabled={isUpdating}
              onClick={RestoreNote}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore note
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 cursor-pointer"
              disabled={isDeleting}
              onClick={handleDeleteNote}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete permanently
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              className={`${Note.isPinned && "text-orange-500"} cursor-pointer`}
              disabled={isUpdating}
              onClick={handleTogglePinNote}
            >
              <Pin className="h-4 w-4 mr-2" />
              {Note.isPinned ? "Unpin" : "Pin"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`${Note.isFavorite && "text-red-500"} cursor-pointer`}
              disabled={isUpdating}
              onClick={handleToggleFavoriteNote}
            >
              <Heart
                className={`h-4 w-4 mr-2 ${
                  Note.isFavorite ? "fill-current" : ""
                }`}
              />
              {Note.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        Press <kbd className="px-1 py-0.5 bg-background rounded">Esc</kbd> to
        close
      </div>
    </div>
  );
};
