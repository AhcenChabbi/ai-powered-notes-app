import Features from "@/components/features";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import HomeNavbar from "@/components/home-navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HomeNavbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
