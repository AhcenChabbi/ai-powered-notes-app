"use client";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorInstance,
  EditorRoot,
  handleCommandNavigation,
  JSONContent,
} from "novel";
import hljs from "highlight.js";
import { EditorToolbar } from "./editor-toolbar";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import CopyToClipboardButton from "../ui/copy-to-clipboard-button";
import { extensions } from ".";
import { suggestionItems } from "./slash-command";
const highlightCodeblocks = (content: string) => {
  const doc = new DOMParser().parseFromString(content, "text/html");
  doc.querySelectorAll("pre code").forEach((el: Element) => {
    hljs.highlightElement(el as HTMLElement);
  });
  return doc.body.innerHTML;
};
type EditorProps = {
  initialContent?: JSONContent;
  onUpdate: (content: string) => void;
  editable?: boolean;
};
const Editor = ({ initialContent, onUpdate, editable }: EditorProps) => {
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openNode, setOpenNode] = useState(false);
  const debouncedUpdates = useDebouncedCallback(
    async ({ editor }: { editor: EditorInstance }) => {
      const html = highlightCodeblocks(editor.getHTML());
      onUpdate(html);
    },
    700
  );
  return (
    <EditorRoot>
      <EditorContent
        initialContent={initialContent}
        onUpdate={debouncedUpdates}
        immediatelyRender={false}
        editable={editable}
        extensions={extensions}
        className="relative p-4  min-h-64 w-full border-muted bg-background  sm:rounded-lg sm:border"
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          attributes: {
            class:
              "prose prose-slate dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
          },
        }}
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command!(val)}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
        <EditorToolbar
          openAI={false}
          openColor={openColor}
          setOpenColor={setOpenColor}
          openLink={openLink}
          setOpenLink={setOpenLink}
          openNode={openNode}
          setOpenNode={setOpenNode}
        />
        <CopyToClipboardButton />
      </EditorContent>
    </EditorRoot>
  );
};
export default Editor;
