import { useEffect, lazy, Suspense } from "react";
import { Box } from "@mui/material";
import { Navbar } from "@/NavigationComponets/Navbar/Navbar";
import { HeroSection } from "@/Pages/HomePage/HeroSection";
const TestimonialsSection = lazy(() => import("@/Pages/HomePage/TestimonialsSection"));
const FeaturesSection = lazy(() => import("@/Pages/HomePage/FeaturesSection"));
const DashboardPreview = lazy(() => import("@/Pages/HomePage/DashboardPreview"));
const PricingSection = lazy(() => import("@/Pages/Pricing/PricingSection"));
const DemoVideoSection = lazy(() => import("@/Pages/HomePage/DemoVideoSection"));
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
