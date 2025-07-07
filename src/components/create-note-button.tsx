import { Button } from "./ui/button";
import { useNoteEditor } from "@/store/noteEditor.store";

type ButtonProps = React.ComponentProps<typeof Button>;

type CreateNoteButtonProps = Omit<ButtonProps, "onClick">;
export default function CreateNoteButton({
  children,
  ...props
}: CreateNoteButtonProps) {
  const openNoteEditorModal = useNoteEditor(
    (state) => state.openNoteEditorModal
  );
  const handleOnClick = () => {
    openNoteEditorModal(null);
  };
  return (
    <Button onClick={handleOnClick} {...props}>
      {children}
    </Button>
  );
}
