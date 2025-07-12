import SearchInput from "./search-input";
import SidebarNav from "./sidebar-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "./ui/sidebar";
import Profile from "./profile";
import { Suspense } from "react";
import { TagsListSkeleton } from "./tags-list-skeleton";
import { TagsList } from "./tags-list";
import Logo from "./logo";

export default function DashboardSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <Logo />
        <SearchInput />
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <SidebarNav />
        <SidebarSeparator />
        <Suspense fallback={<TagsListSkeleton />}>
          <TagsList />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <Profile />
      </SidebarFooter>
    </Sidebar>
  );
}
