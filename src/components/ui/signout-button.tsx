"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { DropdownMenuItem } from "./dropdown-menu";
import { LogOut } from "lucide-react";

export default function SignoutButton() {
  const [pending, startTransition] = useTransition();
  const handleSignout = () => {
    startTransition(async () => {
      await signOut({
        redirectTo: "/login",
      });
      toast.success("Signed out successfully");
    });
  };
  return (
    <DropdownMenuItem onClick={handleSignout} disabled={pending}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  );
}
