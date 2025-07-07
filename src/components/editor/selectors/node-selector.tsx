import {
  Check,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  TextQuote,
  List,
  ListOrdered,
  TextIcon,
  Code,
  CheckSquare,
  type LucideIcon,
} from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

// Types
export type SelectorItem = {
  name: string;
  icon: LucideIcon;
  command: (editor: ReturnType<typeof useEditor>["editor"]) => void;
  isActive: (editor: ReturnType<typeof useEditor>["editor"]) => boolean;
};

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type EditorInstance = ReturnType<typeof useEditor>["editor"];

// Constants
const FALLBACK_ITEM = { name: "Multiple" };

// Helper functions
const createHeadingItem = (
  level: 1 | 2 | 3,
  icon: LucideIcon
): SelectorItem => ({
  name: `Heading ${level}`,
  icon,
  command: (editor) => editor?.chain().focus().toggleHeading({ level }).run(),
  isActive: (editor) => editor?.isActive("heading", { level }) ?? false,
});

const isTextActive = (editor: EditorInstance): boolean => {
  return (
    (editor?.isActive("paragraph") &&
      !editor?.isActive("bulletList") &&
      !editor?.isActive("orderedList")) ??
    false
  );
};

// Configuration
const items: SelectorItem[] = [
  {
    name: "Text",
    icon: TextIcon,
    command: (editor) =>
      editor?.chain().focus().toggleNode("paragraph", "paragraph").run(),
    isActive: isTextActive,
  },
  createHeadingItem(1, Heading1),
  createHeadingItem(2, Heading2),
  createHeadingItem(3, Heading3),
  {
    name: "To-do List",
    icon: CheckSquare,
    command: (editor) => editor?.chain().focus().toggleTaskList().run(),
    isActive: (editor) => editor?.isActive("taskItem") ?? false,
  },
  {
    name: "Bullet List",
    icon: List,
    command: (editor) => editor?.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor?.isActive("bulletList") ?? false,
  },
  {
    name: "Numbered List",
    icon: ListOrdered,
    command: (editor) => editor?.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor?.isActive("orderedList") ?? false,
  },
  {
    name: "Quote",
    icon: TextQuote,
    command: (editor) =>
      editor
        ?.chain()
        .focus()
        .toggleNode("paragraph", "paragraph")
        .toggleBlockquote()
        .run(),
    isActive: (editor) => editor?.isActive("blockquote") ?? false,
  },
  {
    name: "Code",
    icon: Code,
    command: (editor) => editor?.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor?.isActive("codeBlock") ?? false,
  },
];

// Component
export const NodeSelector = ({ open, onOpenChange }: NodeSelectorProps) => {
  const { editor } = useEditor();

  if (!editor) return null;

  const activeItem =
    items.find((item) => item.isActive(editor)) ?? FALLBACK_ITEM;

  const handleItemSelect = (item: SelectorItem) => {
    item.command(editor);
    onOpenChange(false);
  };

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        asChild
        className="gap-2 rounded-none border-none hover:bg-accent focus:ring-0"
      >
        <Button variant="ghost" className="gap-2">
          <span className="whitespace-nowrap text-sm">{activeItem.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={5} align="start" className="w-48 p-1">
        {items.map((item) => (
          <EditorBubbleItem
            key={item.name}
            onSelect={() => handleItemSelect(item)}
            className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent"
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-sm border p-1">
                <item.icon className="h-3 w-3" />
              </div>
              <span>{item.name}</span>
            </div>
            {activeItem.name === item.name && <Check className="h-4 w-4" />}
          </EditorBubbleItem>
        ))}
      </PopoverContent>
    </Popover>
  );
};
