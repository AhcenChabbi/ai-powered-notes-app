import { useEditor } from "novel";
import { useState } from "react";
import { toast } from "sonner";

export default function useCopyContent() {
  const [copied, setCopied] = useState(false);
  const { editor } = useEditor();
  const handleCopy = async () => {
    if (!editor) {
      return;
    }
    const html = editor.getHTML();
    const text = editor.getText();

    try {
      // Create clipboard item with both HTML and plain text
      const clipboardItem = new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" }),
      });

      await navigator.clipboard.write([clipboardItem]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      toast.error("Failed to copy to clipboard");
      await navigator.clipboard.writeText(text);
    }
  };

  return { handleCopy, copied };
}
