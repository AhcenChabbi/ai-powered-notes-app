import Hero from "@/components/hero";
import HomeNavbar from "@/components/home-navbar";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
export default async function Home() {
  const session = await getSession();
  const user = session?.user;
  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen">
      <HomeNavbar />
      <Hero />
    </div>
  );
}
