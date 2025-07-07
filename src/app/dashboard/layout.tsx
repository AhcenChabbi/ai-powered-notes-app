import DashboardSidebar from "@/components/dashboard-sidebar";
import { NoteEditor } from "@/components/note-editor";
import { NoteViewer } from "@/components/note-viewer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  sidebarProfile,
  sidebarTags,
}: {
  children: React.ReactNode;
  sidebarProfile: React.ReactNode;
  sidebarTags: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return (
    <>
      <SidebarProvider>
        <DashboardSidebar
          sidebarProfile={sidebarProfile}
          sidebarTags={sidebarTags}
        />
        {children}
      </SidebarProvider>
      <NoteViewer />
      <NoteEditor />
    </>
  );
}
