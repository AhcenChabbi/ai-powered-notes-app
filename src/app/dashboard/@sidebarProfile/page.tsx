import Profile from "@/components/profile";
import ProfileSkeleton from "@/components/profile-skeleton";
import { Suspense } from "react";

export default async function SidebarProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <Profile />
    </Suspense>
  );
}
