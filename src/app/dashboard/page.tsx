import DashboardNavbar from "@/components/dashboard-navbar";
import { NotesGrid } from "@/components/notes-grid";
import { NotesGridSkeleton } from "@/components/notes-grid-skeleton";
import { SidebarInset } from "@/components/ui/sidebar";
import { Suspense } from "react";
export default async function DashboardPage() {
  return (
    <SidebarInset>
      <DashboardNavbar />
      <Suspense fallback={<NotesGridSkeleton />}>
        <NotesGrid />
      </Suspense>
    </SidebarInset>
  );
}
