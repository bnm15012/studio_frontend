import { Box, Typography, Container, Chip, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Star as StarIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import PricingPlanCards from "./PricingPlanCards";

const PricingSection = () => {
    const faqs = [
        {
            question: "Is there a free trial?",
            answer: "Yes! We offer a 7-day free trial with full access to all features. No credit card required.",
        },
        {
            question: "Can I change plans anytime?",
            answer: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing accordingly.",
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major payment methods through RazorPay including credit/debit cards, UPI, net banking, and popular wallets.",
        },
        {
            question: "Is there a setup fee?",
            answer: "No setup fees. You can get started immediately without any additional costs.",
        },
        {
            question: "How long does it take to set up?",
            answer: "Most studios are up and running within 24-48 hours. Our team provides onboarding support to ensure a smooth transition.",
        },
        {
            question: "Is my data secure?",
            answer: "Yes, we use enterprise-grade encryption and follow GDPR compliance standards. Your data is backed up daily and stored in secure data centers.",
        },
        {
            question: "Do you offer customer support?",
            answer: "Yes, we provide 24/7 customer support via chat, email, and phone. Our average response time is under 2 hours.",
        },
        {
            question: "Can I import my existing data?",
            answer: "Absolutely. We help you import your existing member data, schedules, and booking history from spreadsheets or other systems at no extra cost.",
        },
        {
            question: "What happens if I cancel?",
            answer: "You can cancel anytime. Your data will be exported for you, and you'll retain access until the end of your billing period.",
        },
        {
            question: "Do you offer discounts for annual plans?",
            answer: "Yes, annual plans come with a 20% discount compared to monthly billing. Contact our sales team for custom enterprise pricing.",
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
                <Box sx={{ maxWidth: 900, mx: "auto" }}>
                    <Typography
                        variant="h4"
                        sx={{ textAlign: "center", fontWeight: "bold", mb: 6 }}
                    >
                        Frequently Asked Questions
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {faqs.map((faq, index) => (
                            <Accordion
                                key={index}
                                sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    backdropFilter: "blur(10px)",
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    "&:before": { display: "none" },
                                    boxShadow: "none",
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                        fontWeight: 600,
                                        color: "text.primary",
                                    }}
                                >
                                    {faq.question}
                                </AccordionSummary>
                                <AccordionDetails
                                    sx={{
                                        color: "text.secondary",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {faq.answer}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default PricingSection;
