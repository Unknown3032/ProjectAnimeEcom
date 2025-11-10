import CategoriesSection from "@/Components/Home/CategoriesSection";
import CustomerReviews from "@/Components/Home/CustomerReviews";
import FeaturedProducts from "@/Components/Home/FeaturedProducts";
import HeroSlider from "@/Components/Home/HeroSlider";
import ProductShowcase from "@/Components/Home/ProductShowcase";
import TrendingProducts from "@/Components/Home/TrendingProducts";
import WhyChooseUs from "@/Components/Home/WhyChooseUs";

export default function Home() {
  return (
    <div className="">
      <div>
        <HeroSlider />
        {/* <ProductShowcase /> */}
        <FeaturedProducts />
        <CategoriesSection />
        <TrendingProducts />
        <WhyChooseUs />
        <CustomerReviews />
      </div>
    </div>
  );
}
