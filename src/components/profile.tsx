"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import SignoutButton from "./ui/signout-button";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import ProfileInfoButton from "./profile-info-button";
import SettingButton from "./settings-button";
import { useSession } from "next-auth/react";
import ProfileSkeleton from "./profile-skeleton";

export default function Profile() {
  const { data, status } = useSession();
  if (status === "loading") return <ProfileSkeleton />;
  const user = data?.user;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-full object-cover">
                <AvatarImage
                  src={user?.image || "/user.png"}
                  alt={user?.name || "User Avatar"}
                />
                <AvatarFallback className="rounded-full">SC</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.name || "Unknown User"}
                </span>
                <span className="truncate text-xs">
                  {user?.email || "unknown@example.com"}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full object-cover">
                  <AvatarImage
                    src={user?.image || "/user.png"}
                    alt={user?.name || "User Avatar"}
                  />
                  <AvatarFallback className="rounded-full">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.name || "Unknown User"}
                  </span>
                  <span className="truncate text-xs">
                    {user?.email || "unknown@example.com"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ProfileInfoButton />
            <SettingButton />
            <DropdownMenuSeparator />
            <SignoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
