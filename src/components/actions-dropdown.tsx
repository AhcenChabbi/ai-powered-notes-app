import { TNoteWithTags } from "@/lib/types/note";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";

interface ActionItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: (note: TNoteWithTags) => void;
  className?: string;
  disabled: boolean;
}
const stopPropagation = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};
export default function ActionsDropdown({
  actions,
  onActionClick,
}: {
  actions: ActionItem[];
  onActionClick: (
    e: React.MouseEvent,
    action: (note: TNoteWithTags) => void
  ) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground"
          onClick={stopPropagation}
        >
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map(({ action, label, icon: Icon, className, disabled }) => (
          <DropdownMenuItem
            key={label}
            onClick={(e) => onActionClick(e, action)}
            className={className}
            disabled={disabled}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
