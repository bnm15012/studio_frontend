import { Box, Typography, Container, Chip } from "@mui/material";
import { Star as StarIcon } from "@mui/icons-material";
import PricingPlanCards from "./PricingPlanCards";

const PricingSection = () => {
    const faqs = [
        {
            question: "Is there a free trial?",
            answer: "Yes! We offer a 7-day free trial with full access to all features. No credit card required.",
        },
        {
            question: "Can I change plans anytime?",
            answer: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept via RazorPay.",
        },
        {
            question: "Is there a setup fee?",
            answer: "No setup fees.",
        },
    ];

    return (
        <Box
            id="pricing"
            sx={{
                py: 12,
                background:
                    "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Decorative Elements */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 320,
                    height: 320,
                    background:
                        "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(20, 184, 166, 0.2) 100%)",
                    borderRadius: "50%",
                    filter: "blur(60px)",
                    transform: "translate(33%, -33%)",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: 320,
                    height: 320,
                    background:
                        "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)",
                    borderRadius: "50%",
                    filter: "blur(60px)",
                    transform: "translate(-33%, 33%)",
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 10 }}>
                {/* Section Header */}
                <Box sx={{ textAlign: "center", mb: 8 }}>
                    <Chip
                        icon={<StarIcon />}
                        label="Simple Pricing"
                        sx={{
                            mb: 2,
                            backgroundColor: "rgba(139, 92, 246, 0.1)",
                            color: "primary.main",
                            fontWeight: 600,
                        }}
                    />
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: "2.5rem", lg: "3rem" },
                            fontWeight: "bold",
                            mb: 3,
                            color: "text.primary",
                        }}
                    >
                        Choose the Perfect Plan for Your Studio
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "text.secondary",
                            maxWidth: 800,
                            mx: "auto",
                        }}
                    >
                        Start with a 7-day free trial. No credit card required. Cancel anytime.
                    </Typography>
                </Box>
                <PricingPlanCards />

                {/* FAQ Section */}
                <Box sx={{ maxWidth: 1000, mx: "auto" }}>
                    <Typography
                        variant="h4"
                        sx={{ textAlign: "center", fontWeight: "bold", mb: 6 }}
                    >
                        Frequently Asked Questions
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                            gap: 4,
                        }}
                    >
                        {faqs.map((faq, index) => (
                            <Box key={index}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
                                    >
                                        {faq.question}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ color: "text.secondary", lineHeight: 1.6 }}
                                    >
                                        {faq.answer}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default PricingSection;
