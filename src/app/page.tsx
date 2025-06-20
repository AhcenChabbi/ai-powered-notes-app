import Features from "@/components/features";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import HomeNavbar from "@/components/home-navbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen">
      <HomeNavbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
