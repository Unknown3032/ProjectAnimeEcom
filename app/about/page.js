import AboutHero from "@/Components/AbooutPage/AboutHero";
import JourneySection from "@/Components/AbooutPage/JourneySection";
import TeamSection from "@/Components/AbooutPage/TeamSection";
import VisionSection from "@/Components/AbooutPage/VisionSection";


export const metadata = {
  title: 'About Us - Anime Gifts',
  description: 'Our journey and vision for connecting anime fans through meaningful gifts',
};

export default function AboutPage() {
  return (
    <main className="bg-black">
      <AboutHero />
      <JourneySection />
      <VisionSection />
      <TeamSection />
    </main>
  );
}