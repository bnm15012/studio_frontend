import { useEffect, lazy, Suspense } from "react";
import { Box } from "@mui/material";
import { Navbar } from "@/NavigationComponets/Navbar/Navbar";
import { HeroSection } from "./HeroSection";
const TestimonialsSection = lazy(() => import("./TestimonialsSection"));
const FeaturesSection = lazy(() => import("./FeaturesSection"));
const DashboardPreview = lazy(() => import("./DashboardPreview"));
const PricingSection = lazy(() => import("../Pricing/PricingSection"));
const DemoVideoSection = lazy(() => import("./DemoVideoSection"));
const Footer = lazy(() => import("@/core/components/Footer"));

const HomePage = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    return (
        <Box sx={{ minHeight: "100vh" }}>
            <Navbar />
            <HeroSection />
            <Suspense fallback={<></>}>
                <FeaturesSection />
                <DashboardPreview />
                <DemoVideoSection />
                <TestimonialsSection />
                <PricingSection />
                <Footer />
            </Suspense>
        </Box>
    );
};

export default HomePage;
