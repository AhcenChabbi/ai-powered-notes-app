import { Brain } from "lucide-react";
import SearchInput from "./search-input";
import SidebarNav from "./sidebar-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "./ui/sidebar";
const Logo = () => {
  return (
    <div className="flex items-center space-x-2 px-2 py-2">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <Brain className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold">AI Notes</span>
    </div>
  );
};
export default function DashboardSidebar({
  sidebarTags,
  sidebarProfile,
}: {
  sidebarTags: React.ReactNode;
  sidebarProfile: React.ReactNode;
}) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <Logo />
        <SearchInput />
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <SidebarNav />
        <SidebarSeparator />
        {sidebarTags}
      </SidebarContent>
      <SidebarFooter>{sidebarProfile}</SidebarFooter>
    </Sidebar>
  );
}
