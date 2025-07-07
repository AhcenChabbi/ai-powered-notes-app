import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { tagSchema } from "@/lib/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import useCreateTagMutation from "@/hooks/mutations/useCreateTagMutation";
import { toast } from "sonner";
import { invalidateQueries } from "@/lib/utils";

const tagColors = [
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

const TOAST_MESSAGES = {
  create: {
    success: "Tag created successfully",
    error: "Failed to create tag, please try again",
  },
} as const;

const useTagForm = () => {
  return useForm({
    resolver: zodResolver(tagSchema),
    values: {
      color: tagColors[0],
      name: "",
    },
  });
};
export default function CreateTagModal() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const form = useTagForm();
  const { control, handleSubmit, watch, setValue, reset } = form;
  const { color } = watch();
  const { mutate: createTag, isPending: isCreatingTag } =
    useCreateTagMutation();
  const onSubmit = (data: z.infer<typeof tagSchema>) => {
    createTag(data, {
      onSuccess: () => {
        toast.success(TOAST_MESSAGES.create.success);
        invalidateQueries(["tags"]);
        reset();
        setIsCreateDialogOpen(false);
      },
      onError: () => {
        toast.error(TOAST_MESSAGES.create.error);
      },
    });
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 cursor-pointer"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Tag</DialogTitle>
        </DialogHeader>
        <DialogDescription>Add a new tag to your notes.</DialogDescription>
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="tag-name">Tag Name *</FormLabel>
                  <FormControl>
                    <Input
                      id="tag-name"
                      {...field}
                      placeholder="Enter tag name..."
                      value={field.value}
                      className="text-lg font-medium"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ColorList
              color={color}
              onSelectColor={(tagColor: string) => {
                setValue("color", tagColor);
              }}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer"
                disabled={isCreatingTag}
                type="button"
                onClick={handleSubmit(onSubmit)}
              >
                Create Tag
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const ColorList = ({
  color,
  onSelectColor,
}: {
  color: string;
  onSelectColor: (color: string) => void;
}) => {
  return (
    <div className="space-y-2">
      <Label>Color</Label>
      <div className="flex gap-2 flex-wrap">
        {tagColors.map((tagColor) => (
          <button
            key={tagColor}
            className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
              tagColor === color ? "border-foreground" : "border-transparent"
            }`}
            style={{ backgroundColor: tagColor }}
            onClick={() => onSelectColor(tagColor)}
          />
        ))}
      </div>
    </div>
  );
};
