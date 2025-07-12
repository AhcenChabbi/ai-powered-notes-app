"use client";
import React from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { User } from "lucide-react";
import { useProfileInfoModal } from "@/store/profileInfoModal.store";

const ProfileInfoButton = () => {
  const openProfileInfoModal = useProfileInfoModal(
    (state) => state.openProfileInfoModal
  );
  const handleClick = () => {
    openProfileInfoModal();
  };
  return (
    <DropdownMenuItem onClick={handleClick}>
      <User className="mr-2 h-4 w-4" />
      <span>Profile</span>
    </DropdownMenuItem>
  );
};

export default ProfileInfoButton;
