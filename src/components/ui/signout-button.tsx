"use client";
import { useTransition } from "react";
import { DropdownMenuItem } from "./dropdown-menu";
import { LogOut } from "lucide-react";
import { handleSignOut } from "@/lib/actions/actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export default function SignoutButton() {
  const [pending, startTransition] = useTransition();
  const handleClick = () => {
    startTransition(async () => {
      const { successMessage } = await handleSignOut();
      toast.success(successMessage);
      redirect("/login");
    });
  };
  return (
    <DropdownMenuItem onClick={handleClick} disabled={pending}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  );
}
