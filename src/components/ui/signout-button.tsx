"use client";

import { useTransition } from "react";
import { Button } from "./button";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export default function SignoutButton() {
  const [pending, startTransition] = useTransition();
  const handleSignout = () => {
    startTransition(async () => {
      await signOut();
      toast.success("Signed out successfully");
    });
  };
  return (
    <Button onClick={handleSignout} disabled={pending} variant={"outline"}>
      Signout
    </Button>
  );
}
