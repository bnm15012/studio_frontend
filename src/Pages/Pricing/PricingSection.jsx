import { Box, Typography, Container, Chip, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Star as StarIcon, ExpandMore as ExpandMoreIcon, Check as CheckIcon, Close as CloseIcon, Remove as RemoveIcon } from "@mui/icons-material";
import PricingPlanCards from "./PricingPlanCards";

const CheckCell = () => <CheckIcon sx={{ color: "#10B981", fontSize: "1.4rem" }} />;
const CrossCell = () => <CloseIcon sx={{ color: "#EF4444", fontSize: "1.4rem" }} />;
const PartialCell = () => <RemoveIcon sx={{ color: "#F59E0B", fontSize: "1.4rem" }} />;

const comparisonRows = [
    { feature: "WhatsApp Notifications",         bnm: true,    mindbody: false,  gymmaster: false  },
    { feature: "India-specific Pricing (₹)",     bnm: true,    mindbody: false,  gymmaster: false  },
    { feature: "PDF Invoice & Receipt Generator",bnm: true,    mindbody: "partial", gymmaster: false },
    { feature: "Activity & Batch Management",    bnm: true,    mindbody: "partial", gymmaster: "partial" },
    { feature: "Cash / UPI / Card Tracking",     bnm: true,    mindbody: false,  gymmaster: "partial" },
    { feature: "Expense Management",             bnm: true,    mindbody: false,  gymmaster: false  },
    { feature: "Student & Member Management",    bnm: true,    mindbody: true,   gymmaster: true   },
    { feature: "Income & Expense Reports",       bnm: true,    mindbody: "partial", gymmaster: "partial" },
    { feature: "Mobile App",                     bnm: true,    mindbody: true,   gymmaster: true   },
    { feature: "Affordable for Small Studios",   bnm: true,    mindbody: false,  gymmaster: "partial" },
    { feature: "7-day Free Trial",               bnm: true,    mindbody: false,  gymmaster: true   },
    { feature: "WhatsApp Invoice Sharing",       bnm: true,    mindbody: false,  gymmaster: false  },
];

const renderCell = (val) => {
    if (val === true) return <CheckCell />;
    if (val === false) return <CrossCell />;
    return <PartialCell />;
};

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

                {/* Comparison Table */}
                <Box sx={{ maxWidth: 900, mx: "auto", mb: 10 }}>
                    <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 1 }}>
                        How We Compare
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}>
                        See why studios choose Book & Manage over the alternatives
                    </Typography>
                    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ background: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)" }}>
                                    <TableCell sx={{ color: "white", fontWeight: 700, fontSize: "1rem", width: "40%" }}>
                                        Feature
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                                        Book & Manage
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                                        Mindbody
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                                        Gymmaster
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {comparisonRows.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? "#fff" : "rgba(139, 92, 246, 0.03)",
                                            "&:hover": { backgroundColor: "rgba(139, 92, 246, 0.06)" },
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 500, color: "text.primary" }}>
                                            {row.feature}
                                        </TableCell>
                                        <TableCell align="center">{renderCell(row.bnm)}</TableCell>
                                        <TableCell align="center">{renderCell(row.mindbody)}</TableCell>
                                        <TableCell align="center">{renderCell(row.gymmaster)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* Legend */}
                    <Box sx={{ display: "flex", gap: 3, justifyContent: "center", mt: 2, flexWrap: "wrap" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <CheckIcon sx={{ color: "#10B981", fontSize: "1.1rem" }} />
                            <Typography variant="body2" color="text.secondary">Available</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <RemoveIcon sx={{ color: "#F59E0B", fontSize: "1.1rem" }} />
                            <Typography variant="body2" color="text.secondary">Partial / Limited</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <CloseIcon sx={{ color: "#EF4444", fontSize: "1.1rem" }} />
                            <Typography variant="body2" color="text.secondary">Not Available</Typography>
                        </Box>
                    </Box>
                </Box>

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
