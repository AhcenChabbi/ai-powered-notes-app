import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { ColorSelector } from "./selectors/color-selector";
import { TextButtons } from "./selectors/text-buttons";
import { EditorBubble, EditorContent } from "novel";
import { useMemo } from "react";

// Types
interface EditorToolbarProps {
  openNode: boolean;
  setOpenNode: (open: boolean) => void;
  openLink: boolean;
  setOpenLink: (open: boolean) => void;
  openColor: boolean;
  setOpenColor: (open: boolean) => void;
  openAI?: boolean;
}

interface ToolbarSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Constants
const BUBBLE_CLASSES =
  "flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl";

// Helper components
const ToolbarSeparator = () => (
  <div className="h-6 w-px bg-border" aria-hidden="true" />
);

// Main component
export const EditorToolbar = ({
  openNode,
  setOpenNode,
  openLink,
  setOpenLink,
  openColor,
  setOpenColor,
  openAI = false,
}: EditorToolbarProps) => {
  // Memoize tippy options to prevent unnecessary re-renders
  const tippyOptions: { placement: "bottom-start" | "top" } = useMemo(
    () => ({
      placement: openAI ? "bottom-start" : ("top" as const),
    }),
    [openAI]
  );

  return (
    <EditorBubble
      tippyOptions={tippyOptions}
      className={BUBBLE_CLASSES}
      {...{ role: "toolbar" }}
      aria-label="Text formatting toolbar"
    >
      <ToolbarSection>
        <NodeSelector open={openNode} onOpenChange={setOpenNode} />
      </ToolbarSection>

      <ToolbarSeparator />

      <ToolbarSection>
        <LinkSelector open={openLink} onOpenChange={setOpenLink} />
      </ToolbarSection>

      <ToolbarSeparator />

      <ToolbarSection>
        <TextButtons />
      </ToolbarSection>

      <ToolbarSeparator />

      <ToolbarSection>
        <ColorSelector open={openColor} onOpenChange={setOpenColor} />
      </ToolbarSection>
    </EditorBubble>
  );
};

// Helper component for consistent spacing
const ToolbarSection = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center">{children}</div>
);

// Alternative version with configuration-based approach
interface ToolbarConfig {
  id: string;
  component: React.ComponentType<ToolbarSelectorProps>;
  props: ToolbarSelectorProps;
}

export const EditorToolbarConfigurable = ({
  openNode,
  setOpenNode,
  openLink,
  setOpenLink,
  openColor,
  setOpenColor,
  openAI = false,
}: EditorToolbarProps) => {
  const toolbarConfig: ToolbarConfig[] = [
    {
      id: "node-selector",
      component: NodeSelector,
      props: { open: openNode, onOpenChange: setOpenNode },
    },
    {
      id: "link-selector",
      component: LinkSelector,
      props: { open: openLink, onOpenChange: setOpenLink },
    },
    {
      id: "color-selector",
      component: ColorSelector,
      props: { open: openColor, onOpenChange: setOpenColor },
    },
  ];

  const tippyOptions: { placement: "bottom-start" | "top" } = useMemo(
    () => ({
      placement: openAI ? "bottom-start" : ("top" as const),
    }),
    [openAI]
  );

  return (
    <EditorContent>
      <EditorBubble
        tippyOptions={tippyOptions}
        className={BUBBLE_CLASSES}
        {...{ role: "toolbar" }}
        aria-label="Text formatting toolbar"
      >
        {toolbarConfig.map((config, index) => (
          <ToolbarSection key={config.id}>
            {index > 0 && <ToolbarSeparator />}
            <config.component {...config.props} />
          </ToolbarSection>
        ))}

        <ToolbarSeparator />

        <ToolbarSection>
          <TextButtons />
        </ToolbarSection>
      </EditorBubble>
    </EditorContent>
  );
};
