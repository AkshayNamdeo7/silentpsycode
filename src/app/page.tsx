import BestSellers from "@/components/home/best-sellers";
import FeaturedBooks from "@/components/home/featured-books";
import FeaturedCategories from "@/components/home/featured-categories";
import FAQ from "@/components/home/faq";
import Features from "@/components/home/features";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import Newsletter from "@/components/home/newsletter";
import Stats from "@/components/home/stats";
import Testimonials from "@/components/home/testimonials";
import Hero from "@/components/home/hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <Stats />
      <FeaturedCategories />
      <FeaturedBooks />
      <BestSellers />
      <Features />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <Footer />
    </main>
  );
}
