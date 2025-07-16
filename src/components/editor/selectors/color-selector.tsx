import { Check, ChevronDown } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

// Types
export interface BubbleColorMenuItem {
  name: string;
  color: string;
}

interface ColorSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type EditorInstance = ReturnType<typeof useEditor>["editor"];

// Constants
const TEXT_COLORS: BubbleColorMenuItem[] = [
  { name: "Default", color: "var(--novel-black)" },
  { name: "Purple", color: "#9333EA" },
  { name: "Red", color: "#E00000" },
  { name: "Yellow", color: "#EAB308" },
  { name: "Blue", color: "#2563EB" },
  { name: "Green", color: "#008A00" },
  { name: "Orange", color: "#FFA500" },
  { name: "Pink", color: "#BA4081" },
  { name: "Gray", color: "#A8A29E" },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
  { name: "Default", color: "var(--novel-highlight-default)" },
  { name: "Purple", color: "var(--novel-highlight-purple)" },
  { name: "Red", color: "var(--novel-highlight-red)" },
  { name: "Yellow", color: "var(--novel-highlight-yellow)" },
  { name: "Blue", color: "var(--novel-highlight-blue)" },
  { name: "Green", color: "var(--novel-highlight-green)" },
  { name: "Orange", color: "var(--novel-highlight-orange)" },
  { name: "Pink", color: "var(--novel-highlight-pink)" },
  { name: "Gray", color: "var(--novel-highlight-gray)" },
];

const ICON_SIZE = "h-4 w-4";
const DEFAULT_COLOR = "Default";

// Helper functions
const isDefaultColor = (name: string): boolean => name === DEFAULT_COLOR;

const getActiveColor = (
  editor: EditorInstance,
  colors: BubbleColorMenuItem[],
  type: "textStyle" | "highlight"
) => {
  return colors.find(({ color }) => editor?.isActive(type, { color }));
};

// Sub-components
interface ColorSectionProps {
  title: string;
  colors: BubbleColorMenuItem[];
  editor: EditorInstance;
  onColorSelect: (color: BubbleColorMenuItem) => void;
  activeColor?: BubbleColorMenuItem;
  showActiveIndicator?: boolean;
}

const ColorSection = ({
  title,
  colors,
  onColorSelect,
  activeColor,
  showActiveIndicator = false,
}: ColorSectionProps) => (
  <div className="flex flex-col">
    <div className="my-1 px-2 text-sm font-semibold text-muted-foreground">
      {title}
    </div>
    {colors.map((colorItem) => (
      <EditorBubbleItem
        key={colorItem.name}
        onSelect={() => onColorSelect(colorItem)}
        className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent"
      >
        <div className="flex items-center gap-2">
          <ColorPreview
            color={colorItem.color}
            isBackground={title === "Background"}
          />
          <span>{colorItem.name}</span>
        </div>
        {showActiveIndicator && activeColor?.name === colorItem.name && (
          <Check className={ICON_SIZE} />
        )}
      </EditorBubbleItem>
    ))}
  </div>
);

interface ColorPreviewProps {
  color: string;
  isBackground?: boolean;
}

const ColorPreview = ({ color, isBackground = false }: ColorPreviewProps) => (
  <div
    className="rounded-sm border px-2 py-px font-medium"
    style={isBackground ? { backgroundColor: color } : { color }}
  >
    A
  </div>
);

// Main component
export const ColorSelector = ({ open, onOpenChange }: ColorSelectorProps) => {
  const { editor } = useEditor();

  if (!editor) return null;

  // Get active colors
  const activeTextColor = getActiveColor(editor, TEXT_COLORS, "textStyle");
  const activeHighlightColor = getActiveColor(
    editor,
    HIGHLIGHT_COLORS,
    "highlight"
  );

  // Color selection handlers
  const handleTextColorSelect = (colorItem: BubbleColorMenuItem) => {
    editor.commands.unsetColor();

    if (!isDefaultColor(colorItem.name)) {
      editor.chain().focus().setColor(colorItem.color).run();
    }

    onOpenChange(false);
  };

  const handleHighlightColorSelect = (colorItem: BubbleColorMenuItem) => {
    editor.commands.unsetHighlight();

    if (!isDefaultColor(colorItem.name)) {
      editor.commands.setHighlight({ color: colorItem.color });
    }

    onOpenChange(false);
  };

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          className="gap-2 rounded-none cursor-pointer"
          variant="ghost"
          aria-label="Text and background color"
        >
          <span
            className="rounded-sm px-1"
            style={{
              color: activeTextColor?.color,
              backgroundColor: activeHighlightColor?.color,
            }}
            aria-hidden="true"
          >
            A
          </span>
          <ChevronDown className={ICON_SIZE} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        sideOffset={5}
        className="my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl"
        align="start"
      >
        <ColorSection
          title="Color"
          colors={TEXT_COLORS}
          editor={editor}
          onColorSelect={handleTextColorSelect}
          activeColor={activeTextColor}
          showActiveIndicator={false}
        />

        <ColorSection
          title="Background"
          colors={HIGHLIGHT_COLORS}
          editor={editor}
          onColorSelect={handleHighlightColorSelect}
          activeColor={activeHighlightColor}
          showActiveIndicator={true}
        />
      </PopoverContent>
    </Popover>
  );
};
