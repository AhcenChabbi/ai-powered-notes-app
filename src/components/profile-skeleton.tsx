import { SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg animate-pulse">
          <div className="h-8 w-8 bg-muted rounded-lg flex-shrink-0"></div>

          <div className="grid flex-1 gap-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>

          <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
