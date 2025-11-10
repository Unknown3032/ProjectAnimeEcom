import Footer from "@/Components/Footer/Footer";
import CategorySection from "@/Components/Home/CategorySection";
import FeaturesSection from "@/Components/Home/FeaturedSection";
import HeroSlider from "@/Components/Home/HeroSlider";
import ProductShowcase from "@/Components/Home/ProductShowcase";
import ReviewSection from "@/Components/Home/ReviewSection";
import TrendingSection from "@/Components/Home/TrendingSection";

export default function Home() {
  return (
    <div className="">
      <div>
        <HeroSlider />
        <ProductShowcase />
        <CategorySection />
        <FeaturesSection />
        <TrendingSection />
        <ReviewSection />
      </div>

    </div>
  );
}
