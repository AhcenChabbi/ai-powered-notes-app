"use client";
import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User as UserIcon, Mail, Camera, X } from "lucide-react";
import { useSettingsModal } from "@/store/settingsModal.store";
import { User } from "next-auth";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, TPersonalInfoSchema } from "@/lib/schemas/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import useUpdateUserMutation from "@/hooks/mutations/useUpdateUserMutation";
import { useSession } from "next-auth/react";
type Props = {
  user: User;
};
export default function SettingsModal({ user }: Props) {
  const { isOpen, closeSettingsModal } = useSettingsModal();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm({
    resolver: zodResolver(personalInfoSchema),
    values: {
      name: user.name || "",
      image: null,
    },
  });
  const { control, setValue, handleSubmit } = form;
  const [previewUrl, setPreviewUrl] = useState(user.image);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4.5 * 1024 * 1024) {
        toast.error("File size must be less than 4.5 MB");
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("File type must be jpeg, png or webp");
        return;
      }
      setValue("image", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFileRemove = () => {
    setValue("image", null);
    setPreviewUrl(user.image);
  };
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation();
  const { update } = useSession();
  const onSubmit = async (data: TPersonalInfoSchema) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image) {
      formData.append("image", data.image);
    }
    updateUser(formData, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
        update();
        closeSettingsModal();
      },
      onError: () => {
        toast.error("Failed to update profile, please try again");
      },
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={closeSettingsModal}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5" />
              <span>Account Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Profile Picture Section */}
              <div className="space-y-3">
                <Label>Profile Picture</Label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16 relative">
                      <AvatarImage
                        src={previewUrl || "/user.png"}
                        alt="Profile"
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(user.name || "SC")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      onClick={handleFileRemove}
                      type="button"
                      className="absolute top-0 right-0 rounded-full  h-5 w-5 cursor-pointer"
                      size="sm"
                    >
                      <X className="h-4 w-4 " />
                    </Button>
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                    variant="outline"
                    size="sm"
                  >
                    <input
                      accept="image/*"
                      type="file"
                      ref={fileInputRef}
                      hidden
                      onChange={handleFileSelect}
                    />
                    <Camera className="h-4 w-4 mr-2" />
                    Change Picture
                  </Button>
                </div>
              </div>

              <Separator className="bg-border/40" />

              {/* Personal Information */}
              <Form {...form}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="name">Full Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="name"
                              className="bg-muted/50 border-border/40"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="space-y-2">
                      <Input
                        readOnly
                        id="email"
                        className="bg-muted/50 border-border/40"
                        value={user.email || ""}
                        disabled
                      />
                      <div className="flex items-center justify-between">
                        {user.emailVerified ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-500/10 text-green-400 border-green-500/20"
                          >
                            Email Verified
                          </Badge>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="destructive"
                              className="bg-red-500/10 text-red-400 border-red-500/20"
                            >
                              Not Verified
                            </Badge>
                            <Button type="button" variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-2" />
                              Verify Email
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
              <div className="flex justify-end">
                <Button
                  className="cursor-pointer"
                  disabled={isUpdating}
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                >
                  Update Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
