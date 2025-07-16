import { cn } from "@/lib/utils";
import { EditorBubbleItem, useEditor } from "novel";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Types
interface TextFormattingItem {
  name: string;
  icon: LucideIcon;
  command: (editor: EditorInstance) => void;
  isActive: (editor: EditorInstance) => boolean;
  ariaLabel: string;
}

type EditorInstance = ReturnType<typeof useEditor>["editor"];

// Constants
const ICON_SIZE = "h-4 w-4";
const ACTIVE_COLOR = "text-blue-500";

// Helper functions
const createFormattingItem = (
  name: string,
  icon: LucideIcon,
  toggleMethod:
    | "toggleBold"
    | "toggleItalic"
    | "toggleUnderline"
    | "toggleStrike"
    | "toggleCode",
  ariaLabel: string
): TextFormattingItem => ({
  name,
  icon,
  command: (editor) => editor?.chain().focus()[toggleMethod]().run(),
  isActive: (editor) => editor?.isActive(name) ?? false,
  ariaLabel,
});

// Configuration
const TEXT_FORMATTING_ITEMS: TextFormattingItem[] = [
  createFormattingItem("bold", BoldIcon, "toggleBold", "Toggle bold"),
  createFormattingItem("italic", ItalicIcon, "toggleItalic", "Toggle italic"),
  createFormattingItem(
    "underline",
    UnderlineIcon,
    "toggleUnderline",
    "Toggle underline"
  ),
  createFormattingItem(
    "strike",
    StrikethroughIcon,
    "toggleStrike",
    "Toggle strikethrough"
  ),
  createFormattingItem("code", CodeIcon, "toggleCode", "Toggle inline code"),
];

// Component
export const TextButtons = () => {
  const { editor } = useEditor();

  if (!editor) return null;

  const handleItemSelect = (item: TextFormattingItem) => {
    item.command(editor);
  };

  return (
    <div className="flex" role="toolbar" aria-label="Text formatting options">
      {TEXT_FORMATTING_ITEMS.map((item) => (
        <EditorBubbleItem
          key={item.name}
          onSelect={() => handleItemSelect(item)}
        >
          <Button
            size="icon"
            className="rounded-none cursor-pointer"
            variant="ghost"
            aria-label={item.ariaLabel}
            aria-pressed={item.isActive(editor)}
          >
            <item.icon
              className={cn(ICON_SIZE, {
                [ACTIVE_COLOR]: item.isActive(editor),
              })}
            />
          </Button>
        </EditorBubbleItem>
      ))}
    </div>
  );
};
