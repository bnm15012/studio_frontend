import { Box, Typography, Container, Chip, Accordion, AccordionSummary, AccordionDetails, Paper } from "@mui/material";
import { Star as StarIcon, ExpandMore as ExpandMoreIcon, Check as CheckIcon, Close as CloseIcon, Remove as RemoveIcon } from "@mui/icons-material";
import PricingPlanCards from "./PricingPlanCards";

const comparisonRows = [
    { feature: "PDF Invoice & Receipt Generator", bnm: true, gymmaster: false, fitbudd: false, glofox: false },
    { feature: "Expense Management", bnm: true, gymmaster: false, fitbudd: false, glofox: false },
    { feature: "Activity & Batch Management", bnm: true, gymmaster: "partial", fitbudd: "partial", glofox: false },
    { feature: "Affordable for Small Studios", bnm: true, gymmaster: "partial", fitbudd: false, glofox: false },
    { feature: "WhatsApp Invoice Sharing", bnm: true, gymmaster: false, fitbudd: false, glofox: false },
    { feature: "Multiple Branch (Same Login)", bnm: true, gymmaster: false, fitbudd: false, glofox: false },
    { feature: "Student Attendance Tracking", bnm: true, gymmaster: false, fitbudd: false, glofox: false },
];

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
            answer: "Yes, we use enterprise-grade encryption to keep your data safe. Your data is backed up daily and stored in secure data centers — so you never have to worry about losing it.",
        },
        {
            question: "Do you offer CUSTOMr support?",
            answer: "Yes, we provide 24/7 CUSTOMr support via chat, email, and phone. Our average response time is under 2 hours.",
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

                {/* Comparison Section */}
                <Box sx={{ maxWidth: 1400, mx: "auto", mb: 10 }}>
                    <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 1 }}>
                        Why Choose Book & Manage?
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary", mb: 5 }}>
                        See why studios choose Book & Manage over the alternatives
                    </Typography>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }, gap: 2 }}>
                        {[
                            {
                                name: "Book & Manage",
                                highlight: true,
                                color: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                                features: comparisonRows.map(r => ({ label: r.feature, val: r.bnm })),
                            },
                            {
                                name: "Gymmaster",
                                highlight: false,
                                color: "linear-gradient(135deg, #64748B 0%, #94A3B8 100%)",
                                features: comparisonRows.map(r => ({ label: r.feature, val: r.gymmaster })),
                            },
                            {
                                name: "Fitbudd",
                                highlight: false,
                                color: "linear-gradient(135deg, #64748B 0%, #94A3B8 100%)",
                                features: comparisonRows.map(r => ({ label: r.feature, val: r.fitbudd })),
                            },
                            {
                                name: "Glofox",
                                highlight: false,
                                color: "linear-gradient(135deg, #64748B 0%, #94A3B8 100%)",
                                features: comparisonRows.map(r => ({ label: r.feature, val: r.glofox })),
                            },
                        ].map((app, i) => (
                            <Paper
                                key={i}
                                elevation={app.highlight ? 8 : 1}
                                sx={{
                                    borderRadius: 4,
                                    overflow: "hidden",
                                    border: app.highlight ? "2px solid" : "1px solid",
                                    borderColor: app.highlight ? "primary.main" : "grey.200",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 16px 40px rgba(139,92,246,0.15)" },
                                }}
                            >
                                {/* Card Header */}
                                <Box sx={{ background: app.color, px: 3, py: 2.5, textAlign: "center" }}>
                                    {app.highlight && (
                                        <Chip label="⭐ Best Choice" size="small" sx={{ mb: 1, background: "rgba(255,255,255,0.25)", color: "white", fontWeight: 700, fontSize: "0.7rem" }} />
                                    )}
                                    <Typography variant="h6" sx={{ color: "white", fontWeight: 800 }}>{app.name}</Typography>
                                </Box>

                                {/* Features */}
                                <Box sx={{ px: 2, py: 1.5, backgroundColor: "#fff" }}>
                                    {app.features.map((f, fi) => (
                                        <Box
                                            key={fi}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                py: 1,
                                                borderBottom: fi < app.features.length - 1 ? "1px solid" : "none",
                                                borderColor: "grey.100",
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 400, fontSize: "0.88rem" }}>
                                                {f.label}
                                            </Typography>
                                            <Box sx={{ flexShrink: 0, ml: 1 }}>
                                                {f.val === true && (
                                                    <Box sx={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <CheckIcon sx={{ color: "#10B981", fontSize: "0.9rem" }} />
                                                    </Box>
                                                )}
                                                {f.val === false && (
                                                    <Box sx={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <CloseIcon sx={{ color: "#EF4444", fontSize: "0.9rem" }} />
                                                    </Box>
                                                )}
                                                {f.val === "partial" && (
                                                    <Box sx={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(180,110,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <RemoveIcon sx={{ color: "#92400E", fontSize: "0.9rem" }} />
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        ))}
                    </Box>

                </Box>

                {/* FAQ Section */}
                <Box sx={{ maxWidth: 1100, mx: "auto" }}>
                    <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 6 }}>
                        Frequently Asked Questions
                    </Typography>
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: 2,
                        alignItems: "start",
                    }}>
                        {faqs.map((faq, index) => (
                            <Accordion
                                key={index}
                                sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    backdropFilter: "blur(10px)",
                                    border: "1px solid",
                                    borderColor: "grey.200",
                                    borderRadius: "12px !important",
                                    "&:before": { display: "none" },
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                    "&:hover": { borderColor: "primary.light", boxShadow: "0 4px 16px rgba(139,92,246,0.1)" },
                                    transition: "box-shadow 0.2s, border-color 0.2s",
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
                                    sx={{ fontWeight: 600, color: "text.primary", px: 2.5 }}
                                >
                                    {faq.question}
                                </AccordionSummary>
                                <AccordionDetails sx={{ color: "text.secondary", lineHeight: 1.7, px: 2.5, pb: 2.5 }}>
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
