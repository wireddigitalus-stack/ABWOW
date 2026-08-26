import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import WhyChooseUs from "@/components/WhyChooseUs";
import Estimator from "@/components/Estimator";
import { CTABanner, StickyMobileCTA } from "@/components/CTABanner";
import ContactForm from "@/components/ContactForm";
import Testimonials from "@/components/Testimonials";
import FacebookFeed from "@/components/FacebookFeed";
import ServiceAreas from "@/components/ServiceAreas";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Gallery />
      <WhyChooseUs />
      <Estimator />
      <CTABanner />
      <ContactForm />
      <Testimonials />
      <FacebookFeed />
      <ServiceAreas />
      <FAQ />
      <Footer />
      <Chatbot />
      <StickyMobileCTA />
    </main>
  );
}
