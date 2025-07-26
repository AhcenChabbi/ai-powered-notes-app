import DashboardSidebar from "@/components/dashboard-sidebar";
import { NoteEditor } from "@/components/note-editor";
import { NoteViewer } from "@/components/note-viewer";
import ProfileInfoModal from "@/components/profile-info-modal";
import SettingsModal from "@/components/settings-modal";
import { SidebarProvider } from "@/components/ui/sidebar";
import getSession from "@/lib/getSession";
import DashboardProviders from "@/providers/dashboard-providers";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "AI Notes - Dashboard",
};
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    redirect("/login");
  }
  return (
    <DashboardProviders session={session} user={user}>
      <SidebarProvider>
        <DashboardSidebar />
        {children}
      </SidebarProvider>
      <NoteViewer />
      <NoteEditor />
      <ProfileInfoModal user={user} />
      <SettingsModal user={user} />
    </DashboardProviders>
  );
}
