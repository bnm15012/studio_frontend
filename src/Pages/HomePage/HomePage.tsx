import { useAppSelector } from "@/state";
import { useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/NavigationComponets/Navbar/Navbar";
import { HeroSection } from "./HeroSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FeaturesSection } from "./FeaturesSection";
import { DashboardPreview } from "./DashboardPreview";
import Footer from "../../Components/Footer";
import PricingSection from "../Pricing/PricingSection";
import DemoVideoSection from "./DemoVideoSection";

const HomePage = () => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [navigate, user]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    return (
        <Box sx={{ minHeight: "100vh" }}>
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <DashboardPreview />
            <DemoVideoSection />
            <TestimonialsSection />
            <PricingSection />
            <Footer />
        </Box>
    );
};

export default HomePage;
