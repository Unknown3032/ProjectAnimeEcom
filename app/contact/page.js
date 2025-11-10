import ContactForm from "@/Components/ContactPage/ContactForm";
import ContactHero from "@/Components/ContactPage/ContactHero";
import ContactInfo from "@/Components/ContactPage/ContactInfo";
import ContactMap from "@/Components/ContactPage/ContactMap";


export const metadata = {
  title: 'Contact Us - Anime Gifts',
  description: 'Get in touch with us for any questions about our anime merchandise',
};

export default function ContactPage() {
  return (
    <main className="bg-white">
      <ContactHero />
      <ContactForm />
      <ContactInfo />
      <ContactMap />
    </main>
  );
}