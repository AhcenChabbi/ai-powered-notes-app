import { cn } from "@/lib/utils";
import { useEditor } from "novel";
import { Check, Trash, ExternalLink } from "lucide-react";
import { type FormEvent, useEffect, useRef } from "react";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";

// Types
interface LinkSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

//type EditorInstance = ReturnType<typeof useEditor>["editor"];

// Utility functions
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getUrlFromString = (str: string): string | null => {
  if (isValidUrl(str)) return str;

  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch {
    // Intentionally empty - fall through to return null
  }

  return null;
};

// Constants
const LINK_ICON_SIZE = "h-4 w-4";
const BUTTON_HEIGHT = "h-8";

// Component
export const LinkSelector = ({ open, onOpenChange }: LinkSelectorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { editor } = useEditor();

  // Auto-focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  if (!editor) return null;

  const isLinkActive = editor.isActive("link");
  const currentHref = editor.getAttributes("link").href || "";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const inputValue = formData.get("url") as string;

    if (!inputValue?.trim()) return;

    const url = getUrlFromString(inputValue.trim());
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
      onOpenChange(false);
    }
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    onOpenChange(false);
  };

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 rounded-none border-none cursor-pointer"
        >
          <ExternalLink className={LINK_ICON_SIZE} />
          <span
            className={cn("underline decoration-stone-400 underline-offset-4", {
              "text-blue-500": isLinkActive,
            })}
          >
            Link
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-60 p-0" sideOffset={10}>
        <form onSubmit={handleSubmit} className="flex p-1">
          <input
            ref={inputRef}
            name="url"
            type="url"
            placeholder="Paste a link"
            className="flex-1 bg-background p-1 text-sm outline-none"
            defaultValue={currentHref}
            autoComplete="url"
          />

          {currentHref ? (
            <Button
              size="icon"
              variant="outline"
              type="button"
              className={cn(
                "flex items-center rounded-sm p-1 text-red-600 transition-all",
                "hover:bg-red-100 dark:hover:bg-red-800 cursor-pointer",
                BUTTON_HEIGHT
              )}
              onClick={handleRemoveLink}
              aria-label="Remove link"
            >
              <Trash className={LINK_ICON_SIZE} />
            </Button>
          ) : (
            <Button
              size="icon"
              className={`${BUTTON_HEIGHT} cursor-pointer`}
              type="submit"
              aria-label="Add link"
            >
              <Check className={LINK_ICON_SIZE} />
            </Button>
          )}
        </form>
      </PopoverContent>
    </Popover>
  );
};
