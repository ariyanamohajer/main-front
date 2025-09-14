import { useLandingScroll } from "@/hooks/common/useLandingScroll";
import AboutUsSection from "./sections/AboutUsSection";
import ContactUsSection from "./sections/ContactUsSection";
import FaqSection from "./sections/FaqSection";
import Introduction from "./sections/Introduction";
import ServicesSection from "./sections/ServiceSection";
import TestimonialsSection from "./sections/TestimonialsSection";

function HomeView() {
  useLandingScroll();
  return (
    <div className="min-h-screen flex flex-col">
      <Introduction />
      <AboutUsSection />
      <ServicesSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactUsSection />
    </div>
  );
}

export default HomeView;
