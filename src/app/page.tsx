import FeaturedBooks from "@/components/home/featured-books";
import Stats from "@/components/home/stats";
<FeaturedBooks />
import Navbar from "@/components/layout/navbar";
import Hero from "@/components/home/hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Stats />
    </main>
  );
}