import { useEffect } from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../NavigationComponets/Navbar/Navbar";
import { HeroSection } from "./HeroSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FeaturesSection } from "./FeaturesSection";
import Footer from "../../Components/Footer";
import PricingSection from "../Pricing/PricingSection";

const HomePage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  })

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </Box>
  );
};

export default HomePage;
