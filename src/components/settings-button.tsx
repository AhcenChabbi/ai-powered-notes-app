"use client";
import React from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { Settings } from "lucide-react";
import { useSettingsModal } from "@/store/settingsModal.store";

const SettingButton = () => {
  const openSettingdModal = useSettingsModal(
    (state) => state.openSettingsModal
  );
  const handleClick = () => {
    openSettingdModal();
  };
  return (
    <DropdownMenuItem onClick={handleClick}>
      <Settings className="mr-2 h-4 w-4" />
      <span>Settings</span>
    </DropdownMenuItem>
  );
};

export default SettingButton;
