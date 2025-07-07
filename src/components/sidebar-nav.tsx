"use client";
import useFilterQueryState from "@/hooks/useFilterQueryState";
import { FileText, Heart, Pin, Trash2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Filter } from "@/lib/utils/parsers";

const sidebarSections = [
  { id: "all", label: "All Notes", icon: FileText },
  { id: "pinned", label: "Pinned", icon: Pin },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "trash", label: "Trash", icon: Trash2 },
];
export default function SidebarNav() {
  const [filter, setFilter] = useFilterQueryState();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {sidebarSections.map((section) => (
            <SidebarMenuItem key={section.id}>
              <SidebarMenuButton
                isActive={filter === section.id}
                onClick={() => setFilter(section.id as Filter)}
                className="w-full justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <section.icon className="h-4 w-4" />
                  <span>{section.label}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
