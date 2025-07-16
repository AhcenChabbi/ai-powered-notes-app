"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Save, Pin, Heart, X, Edit3, FileText } from "lucide-react";
import { useNoteEditor } from "@/store/noteEditor.store";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteSchema, TNoteSchema } from "@/lib/schemas/schemas";
import { toast } from "sonner";
import { Tag, TNoteWithTags } from "@/lib/types/note";
import useUpdateNoteMutation from "@/hooks/mutations/useUpdateNoteMutation";
import { invalidateQueries } from "@/lib/utils";
import useCreateNoteMutation from "@/hooks/queries/useCreateNoteQuery";
import { JSONContent } from "novel";
import Editor from "./editor/editor";
import { generateJSON } from "@tiptap/core";
import { useNoteViewer } from "@/store/noteViewer.store";
import { extensions } from "./editor";
// Constants
const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#6366f1",
];
const KEYBOARD_SHORTCUTS = {
  ESCAPE: "Escape",
  SAVE: "Enter",
} as const;
const TOAST_MESSAGES = {
  update: {
    success: "Note updated successfully",
    error: "Failed to update note, please try again",
  },
  create: {
    success: "Note created successfully",
    error: "Failed to create note, please try again",
  },
} as const;
const useNoteForm = (Note: TNoteWithTags | null) => {
  return useForm({
    resolver: zodResolver(noteSchema),
    values: {
      title: Note?.title || "",
      content: Note?.content || "",
      summary: Note?.summary || "",
      isFavorite: Note?.isFavorite || false,
      isPinned: Note?.isPinned || false,
      tags: Note?.tags || [],
    },
  });
};

const generateInitialContent = (Note: TNoteWithTags | null): JSONContent => {
  return Note?.content
    ? generateJSON(Note.content, extensions)
    : {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "",
              },
            ],
          },
        ],
      };
};

const DialogHeaderContent = ({
  isEditing,
  isUnsaved,
}: {
  isEditing: boolean;
  isUnsaved: boolean;
}) => {
  return (
    <>
      <div className="flex items-center gap-3">
        {isEditing ? (
          <>
            <Edit3 className="h-5 w-5 text-blue-500" />
            <DialogTitle>Edit Note</DialogTitle>
          </>
        ) : (
          <>
            <FileText className="h-5 w-5 text-green-500" />
            <DialogTitle>Create New Note</DialogTitle>
          </>
        )}
        {isUnsaved && (
          <Badge variant="secondary" className="text-xs">
            Unsaved changes
          </Badge>
        )}
      </div>
      <DialogDescription className="flex flex-col space-y-1">
        {isEditing
          ? "Edit your note details below."
          : "Fill in the details to create a new note."}
      </DialogDescription>
    </>
  );
};

const TagDisplay = ({
  tags,
  onRemoveTag,
}: {
  tags: Tag[];
  onRemoveTag: (name: string) => void;
}) => {
  return tags.map((tag) => (
    <Badge
      key={tag.id || tag.name}
      variant="secondary"
      className="gap-1 px-2 py-1"
      style={{
        backgroundColor: `${tag.color}15`,
        color: tag.color,
        border: `1px solid ${tag.color}30`,
      }}
    >
      {tag.name}
      <button
        onClick={() => onRemoveTag(tag.name)}
        className="hover:bg-destructive/20 rounded-full p-0.5 cursor-pointer"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  ));
};
const useUnsavedChangesWarning = ({
  Note,
  currentNote,
  isOpen,
}: {
  Note: TNoteWithTags | null;
  currentNote: TNoteSchema;
  isOpen: boolean;
}) => {
  const [isUnsaved, setIsUnsaved] = useState(false);
  const { title, summary, content, isPinned, isFavorite, tags } = currentNote;
  useEffect(() => {
    if (isOpen) {
      const hasChanges =
        title !== (Note?.title || "") ||
        summary !== (Note?.summary || "") ||
        content !== (Note?.content || "") ||
        isPinned !== (Note?.isPinned || false) ||
        isFavorite !== (Note?.isFavorite || false) ||
        JSON.stringify(tags) !== JSON.stringify(Note?.tags || []);
      setIsUnsaved(hasChanges);
    }
  }, [isOpen, title, summary, content, isPinned, isFavorite, tags, Note]);
  return { isUnsaved, setIsUnsaved };
};
export function NoteEditor() {
  const { Note, closeNoteEditorModal, isOpen } = useNoteEditor();
  const setNote = useNoteViewer((state) => state.setNote);
  const isEditing = !!Note;
  const form = useNoteForm(Note);
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;
  const currentNote = watch();
  const { tags } = currentNote;
  const [newTag, setNewTag] = useState("");
  const { isUnsaved, setIsUnsaved } = useUnsavedChangesWarning({
    Note,
    currentNote,
    isOpen,
  });
  const handleClose = () => {
    if (isUnsaved) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirmClose) return;
    }
    reset();
    closeNoteEditorModal();
  };

  const addTag = (tag: { id: string; name: string; color: string }) => {
    if (tags.find((t) => t.name === tag.name)) {
      toast.error("Tag already exists");
      return;
    }
    setValue("tags", [...tags, tag]);
    setNewTag("");
  };

  const handleAddTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === KEYBOARD_SHORTCUTS.SAVE && newTag.trim()) {
      addTag({
        id: Date.now().toString(),
        name: newTag.trim(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  };

  const removeTag = (name: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag.name !== name)
    );
  };
  const { isPending: isUpdating, mutate: updateUserNote } =
    useUpdateNoteMutation();
  const { isPending: isCreating, mutate: createUserNote } =
    useCreateNoteMutation();
  const handleOnSuccessState = (
    message: string,
    updatedNote?: TNoteWithTags
  ) => {
    toast.success(message);
    setIsUnsaved(false);
    invalidateQueries();
    if (updatedNote) setNote(updatedNote);
    reset();
    closeNoteEditorModal();
  };
  const onSubmit = (data: TNoteSchema) => {
    if (isEditing) {
      updateUserNote(
        { id: Note.id, ...data },
        {
          onSuccess: (data) => {
            handleOnSuccessState(TOAST_MESSAGES.update.success, data);
          },
          onError: () => {
            toast.error(TOAST_MESSAGES.update.error);
          },
        }
      );
    } else {
      createUserNote(data, {
        onSuccess: () => {
          handleOnSuccessState(TOAST_MESSAGES.create.success);
        },
        onError: () => {
          toast.error(TOAST_MESSAGES.create.error);
        },
      });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        aria-describedby=""
        className="!max-w-5xl max-h-[95vh] h-[95vh] overflow-hidden flex flex-col"
      >
        <DialogHeader className="border-b border-border pb-4">
          <DialogHeaderContent isEditing={isEditing} isUnsaved={isUnsaved} />
        </DialogHeader>
        <Form {...form}>
          <div className="flex-1 overflow-y-auto space-y-6 py-4">
            {/* Title */}
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="title">Title *</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      {...field}
                      placeholder="Enter note title..."
                      value={field.value}
                      className="text-lg font-medium"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label>Content</Label>
              <Editor
                initialContent={generateInitialContent(Note)}
                onUpdate={(field) => setValue("content", field)}
                editable={true}
              />

              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>
            {/* Summary */}
            <FormField
              control={control}
              name="summary"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="summary">Summary (optional)</FormLabel>
                  <FormControl>
                    <Input
                      id="summary"
                      {...field}
                      placeholder="Brief summary of your note..."
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                <TagDisplay tags={tags} onRemoveTag={removeTag} />
              </div>
              <Input
                type="text"
                placeholder="Add a tag..."
                onChange={(e) => setNewTag(e.target.value)}
                value={newTag}
                onKeyDown={handleAddTagKeyDown}
              />
            </div>

            {/* Settings */}
            <div className="space-y-4 pt-4 border-t border-border">
              <Label className="text-sm font-medium">Note Settings</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="isPinned"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel
                        htmlFor="pinned"
                        className="flex items-center gap-2"
                      >
                        <Pin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Pin this note</span>
                      </FormLabel>
                      <FormControl>
                        <Switch
                          id="pinned"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="isFavorite"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel
                        htmlFor="favorite"
                        className="flex items-center gap-2"
                      >
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Add to favorites</span>
                      </FormLabel>
                      <FormControl>
                        <Switch
                          id="favorite"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4 flex justify-between">
            <div className="text-xs text-muted-foreground">
              Press <kbd className="px-1 py-0.5 bg-muted rounded">Esc</kbd> to
              close •{" "}
              <kbd className="px-1 py-0.5 bg-muted rounded">Cmd+Enter</kbd> to
              save
            </div>
            <div className="flex gap-2">
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={!isUnsaved || isUpdating || isCreating}
                className="cursor-pointer"
              >
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? "Update Note" : "Create Note"}
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
