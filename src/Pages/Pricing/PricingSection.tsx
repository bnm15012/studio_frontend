import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Typography,
    Container,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    Button,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    CircularProgress,
} from "@mui/material";
import {
    Star as StarIcon,
    ExpandMore as ExpandMoreIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Remove as RemoveIcon,
    WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import { Crown, Users, CreditCard, Calendar, BarChart3, TrendingUp } from "lucide-react";
import { getAllPlans } from "@/Pages/Pricing/plans.api";

interface ComparisonRow {
    feature: string;
    bnm: boolean | string;
    gymmaster: boolean | string;
    fitbudd: boolean | string;
    glofox: boolean | string;
}

const comparisonRows: ComparisonRow[] = [
    {
        feature: "PDF Invoice & Receipt Generator",
        bnm: true,
        gymmaster: false,
        fitbudd: false,
        glofox: false,
    },
    { feature: "Expense Management", bnm: true, gymmaster: false, fitbudd: false, glofox: false },
    {
        feature: "Activity & Batch Management",
        bnm: true,
        gymmaster: "partial",
        fitbudd: "partial",
        glofox: false,
    },
    {
        feature: "Affordable for Small Studios",
        bnm: true,
        gymmaster: "partial",
        fitbudd: false,
        glofox: false,
    },
    {
        feature: "WhatsApp Invoice Sharing",
        bnm: true,
        gymmaster: false,
        fitbudd: false,
        glofox: false,
    },
    {
        feature: "Multiple Branch (Same Login)",
        bnm: true,
        gymmaster: false,
        fitbudd: false,
        glofox: false,
    },
    {
        feature: "Student Attendance Tracking",
        bnm: true,
        gymmaster: false,
        fitbudd: false,
        glofox: false,
    },
];

interface Plan {
    id: string | number;
    planType: string;
    description: string;
    amount: number;
    period: string;
    popular?: boolean;
    enabledFeatures: string[];
    disabledFeatures: string[];
}

const getFeatureIcon = (featureName: string) => {
    const lowerName = featureName.toLowerCase();
    if (lowerName.includes("student")) return Users;
    if (lowerName.includes("payment")) return CreditCard;
    if (lowerName.includes("booking") || lowerName.includes("calendar")) return Calendar;
    if (lowerName.includes("statistics") || lowerName.includes("analysis")) return BarChart3;
    if (lowerName.includes("sales") || lowerName.includes("report")) return TrendingUp;
    return null;
};

const PricingSection: React.FC = () => {
    const [plans, setPlans] = useState<Plan[] | null>(null);
    const [plansLoading, setPlansLoading] = useState(true);

    const fetchPlans = useCallback(async () => {
        setPlansLoading(true);
        const { data, success } = await getAllPlans({ AMC: false });
        if (success) {
            setPlans(data);
        }
        setPlansLoading(false);
    }, []);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

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
                py: 16,
                background: "linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Enhanced Decorative Elements */}
            <Box
                sx={{
                    position: "absolute",
                    top: -150,
                    right: -150,
                    width: 500,
                    height: 500,
                    background:
                        "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(20, 184, 166, 0.1) 50%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(70px)",
                    animation: "float 10s ease-in-out infinite",
                    "@keyframes float": {
                        "0%, 100%": { transform: "translate(0, 0)" },
                        "50%": { transform: "translate(-20px, 20px)" },
                    },
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: -150,
                    left: -150,
                    width: 500,
                    height: 500,
                    background:
                        "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(70px)",
                    animation: "float 10s ease-in-out infinite reverse",
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 10 }}>
                {/* Section Header */}
                <Box sx={{ textAlign: "center", mb: 12 }}>
                    <Chip
                        icon={<StarIcon />}
                        label="Simple Pricing"
                        sx={{
                            mb: 3,
                            backgroundColor: "rgba(139, 92, 246, 0.2)",
                            color: "#a78bfa",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            letterSpacing: 0.5,
                            border: "1px solid rgba(139, 92, 246, 0.3)",
                        }}
                    />
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: "2.5rem", lg: "4rem" },
                            fontWeight: 800,
                            mb: 4,
                            color: "#ffffff",
                            letterSpacing: -1,
                            background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Choose the Perfect Plan for Your Studio
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            maxWidth: 700,
                            mx: "auto",
                            lineHeight: 1.8,
                            fontSize: { xs: "1rem", lg: "1.25rem" },
                        }}
                    >
                        Start with a 7-day free trial. No credit card required. Cancel anytime.
                    </Typography>
                </Box>

                {/* Plan Cards with Contact Team CTA */}
                {plansLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress sx={{ color: "white" }} />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "repeat(auto-fit, minmax(15rem, 1fr))",
                                lg: "repeat(auto-fit, minmax(15rem, 1fr))",
                            },
                            gap: 4,
                            mb: 8,
                        }}
                    >
                        {plans &&
                            plans.map((plan: Plan, index: number) => {
                                const whatsappMessage = encodeURIComponent(
                                    `Hi, I'm interested in the ${plan.planType.replace("_", " ")} plan for my studio. I'd like to schedule a demo and discuss pricing.`,
                                );
                                const whatsappUrl = `https://wa.me/917326027500?text=${whatsappMessage}`;

                                return (
                                    <Card
                                        key={index}
                                        sx={{
                                            position: "relative",
                                            height: "100%",
                                            p: 4,
                                            border: "2px solid",
                                            borderColor: plan.popular
                                                ? "primary.main"
                                                : "rgba(255, 255, 255, 0.12)",
                                            transition: "all 0.3s ease",
                                            background: plan.popular
                                                ? "linear-gradient(to left, rgba(139,92,246,0.3), rgba(139,92,246,0.2))"
                                                : "linear-gradient(to left, rgba(139,92,246,0.05), rgba(139,92,246,0.1))",
                                            backdropFilter: "blur(10px)",
                                            transform: plan.popular ? "scale(1.05)" : "scale(1)",
                                            "&:hover": {
                                                transform: plan.popular
                                                    ? "scale(1.05) translateY(-8px)"
                                                    : "translateY(-8px)",
                                                boxShadow: "0 20px 40px rgba(139, 92, 246, 0.15)",
                                                borderColor: "primary.main",
                                            },
                                        }}
                                    >
                                        {plan.popular && (
                                            <Chip
                                                icon={<Crown color="white" size={16} />}
                                                label=" Most Popular"
                                                sx={{
                                                    position: "absolute",
                                                    top: 5,
                                                    left: "50%",
                                                    transform: "translateX(-50%)",
                                                    background:
                                                        "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                                                    color: "white",
                                                    fontWeight: 600,
                                                    px: 3,
                                                }}
                                            />
                                        )}

                                        <CardHeader
                                            sx={{ textAlign: "center", pb: 4 }}
                                            title={
                                                <Box>
                                                    <Typography
                                                        variant="h5"
                                                        sx={{
                                                            fontWeight: "bold",
                                                            mb: 1,
                                                            color: "white",
                                                        }}
                                                    >
                                                        {plan.planType.replace("_", " ")}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: "white", mb: 2 }}
                                                    >
                                                        {plan.description}
                                                    </Typography>
                                                </Box>
                                            }
                                        />

                                        <CardContent sx={{ pt: 0 }}>
                                            <Button
                                                variant={plan.popular ? "contained" : "outlined"}
                                                size="large"
                                                fullWidth
                                                startIcon={<WhatsAppIcon />}
                                                href={whatsappUrl}
                                                target="_blank"
                                                sx={{
                                                    mb: 4,
                                                    py: 1.5,
                                                    fontSize: "1rem",
                                                    fontWeight: 600,
                                                    color: "white",
                                                    borderColor: "rgba(255, 255, 255, 0.5)",
                                                    transition: "transform 0.3s ease",
                                                    "&:hover": {
                                                        transform: "scale(1.05)",
                                                        borderColor: "white",
                                                    },
                                                }}
                                            >
                                                Contact Team
                                            </Button>

                                            <Typography
                                                variant="subtitle1"
                                                sx={{ fontWeight: 600, mb: 3, color: "white" }}
                                            >
                                                What&apos;s included:
                                            </Typography>
                                            <List sx={{ p: 0 }}>
                                                {plan.enabledFeatures.map(
                                                    (feature: string, featureIndex: number) => {
                                                        const FeatureIcon = getFeatureIcon(feature);
                                                        return (
                                                            <ListItem
                                                                key={featureIndex}
                                                                sx={{
                                                                    px: 0,
                                                                    py: 1.5,
                                                                    borderRadius: 2,
                                                                    transition: "all 0.2s ease",
                                                                    "&:hover": {
                                                                        backgroundColor:
                                                                            "rgba(16, 185, 129, 0.08)",
                                                                    },
                                                                }}
                                                            >
                                                                <ListItemIcon sx={{ minWidth: 40 }}>
                                                                    <Avatar
                                                                        sx={{
                                                                            width: 36,
                                                                            height: 36,
                                                                            background:
                                                                                "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                                                                            boxShadow:
                                                                                "0 4px 12px rgba(16, 185, 129, 0.3)",
                                                                        }}
                                                                    >
                                                                        {FeatureIcon ? (
                                                                            <FeatureIcon
                                                                                size={18}
                                                                                color="white"
                                                                            />
                                                                        ) : (
                                                                            <CheckIcon
                                                                                sx={{
                                                                                    fontSize:
                                                                                        "1.25rem",
                                                                                    color: "white",
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Avatar>
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    primary={feature}
                                                                    slotProps={{
                                                                        primary: {
                                                                            variant: "body1",
                                                                            sx: {
                                                                                fontWeight: 500,
                                                                                color: "white",
                                                                            },
                                                                        },
                                                                    }}
                                                                />
                                                            </ListItem>
                                                        );
                                                    },
                                                )}
                                                {plan.disabledFeatures.map(
                                                    (feature: string, featureIndex: number) => {
                                                        const FeatureIcon = getFeatureIcon(feature);
                                                        return (
                                                            <ListItem
                                                                key={featureIndex}
                                                                sx={{
                                                                    px: 0,
                                                                    py: 1.5,
                                                                    borderRadius: 2,
                                                                    opacity: 0.85,
                                                                }}
                                                            >
                                                                <ListItemIcon sx={{ minWidth: 40 }}>
                                                                    <Avatar
                                                                        sx={{
                                                                            width: 36,
                                                                            height: 36,
                                                                            background:
                                                                                "rgba(239, 68, 68, 0.2)",
                                                                            border: "1px solid rgba(239, 68, 68, 0.4)",
                                                                        }}
                                                                    >
                                                                        {FeatureIcon ? (
                                                                            <FeatureIcon
                                                                                size={18}
                                                                                color="#EF4444"
                                                                            />
                                                                        ) : (
                                                                            <CloseIcon
                                                                                sx={{
                                                                                    fontSize:
                                                                                        "1.25rem",
                                                                                    color: "#EF4444",
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Avatar>
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    primary={feature}
                                                                    slotProps={{
                                                                        primary: {
                                                                            variant: "body1",
                                                                            sx: {
                                                                                fontWeight: 500,
                                                                                color: "white",
                                                                            },
                                                                        },
                                                                    }}
                                                                />
                                                            </ListItem>
                                                        );
                                                    },
                                                )}
                                            </List>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                    </Box>
                )}

                {/* Comparison Section */}
                <Box sx={{ maxWidth: 1400, mx: "auto", mb: 12 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            textAlign: "center",
                            fontWeight: 800,
                            mb: 2,
                            color: "#ffffff",
                            fontSize: { xs: "1.75rem", lg: "2.5rem" },
                            letterSpacing: -0.5,
                        }}
                    >
                        Why Choose Book & Manage?
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            textAlign: "center",
                            color: "rgba(255, 255, 255, 0.7)",
                            mb: 8,
                            fontSize: { xs: "1rem", lg: "1.15rem" },
                            lineHeight: 1.7,
                        }}
                    >
                        See why studios choose Book & Manage over the alternatives
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
                            gap: 4,
                        }}
                    >
                        {[
                            {
                                name: "Book & Manage",
                                highlight: true,
                                color: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                                features: comparisonRows.map((r) => ({
                                    label: r.feature,
                                    val: r.bnm,
                                })),
                            },
                            {
                                name: "Gymmaster",
                                highlight: false,
                                color: "linear-gradient(135deg, #475569 0%, #64748B 100%)",
                                features: comparisonRows.map((r) => ({
                                    label: r.feature,
                                    val: r.gymmaster,
                                })),
                            },
                            {
                                name: "Fitbudd",
                                highlight: false,
                                color: "linear-gradient(135deg, #475569 0%, #64748B 100%)",
                                features: comparisonRows.map((r) => ({
                                    label: r.feature,
                                    val: r.fitbudd,
                                })),
                            },
                            {
                                name: "Glofox",
                                highlight: false,
                                color: "linear-gradient(135deg, #475569 0%, #64748B 100%)",
                                features: comparisonRows.map((r) => ({
                                    label: r.feature,
                                    val: r.glofox,
                                })),
                            },
                        ].map((app, i) => (
                            <Paper
                                key={i}
                                elevation={0}
                                sx={{
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    border: app.highlight ? "2px solid" : "1px solid",
                                    borderColor: app.highlight
                                        ? "rgba(139, 92, 246, 0.6)"
                                        : "rgba(255, 255, 255, 0.1)",
                                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                                    backdropFilter: "blur(20px)",
                                    opacity: 0,
                                    animation: "fadeInUp 0.6s ease forwards",
                                    animationDelay: `${i * 0.1}s`,
                                    "@keyframes fadeInUp": {
                                        "0%": { opacity: 0, transform: "translateY(20px)" },
                                        "100%": { opacity: 1, transform: "translateY(0)" },
                                    },
                                    "&:hover": {
                                        transform: app.highlight
                                            ? "translateY(-12px) scale(1.02)"
                                            : "translateY(-8px)",
                                        boxShadow: app.highlight
                                            ? "0 30px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 92, 246, 0.4)"
                                            : "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2)",
                                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                                    },
                                }}
                            >
                                {/* Card Header */}
                                <Box
                                    sx={{
                                        background: app.color,
                                        px: 3,
                                        py: 3.5,
                                        textAlign: "center",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    {app.highlight && (
                                        <Chip
                                            label="⭐ Best Choice"
                                            size="small"
                                            sx={{
                                                mb: 1.5,
                                                background: "rgba(255,255,255,0.25)",
                                                color: "white",
                                                fontWeight: 700,
                                                fontSize: "0.75rem",
                                                letterSpacing: 0.5,
                                                border: "1px solid rgba(255,255,255,0.3)",
                                            }}
                                        />
                                    )}
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: "white",
                                            fontWeight: 800,
                                            fontSize: "1.2rem",
                                            position: "relative",
                                            zIndex: 1,
                                        }}
                                    >
                                        {app.name}
                                    </Typography>
                                </Box>

                                {/* Features */}
                                <Box sx={{ px: 3, py: 3, backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
                                    {app.features.map((f, fi) => (
                                        <Box
                                            key={fi}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                py: 2,
                                                borderBottom:
                                                    fi < app.features.length - 1
                                                        ? "1px solid"
                                                        : "none",
                                                borderColor: "rgba(255, 255, 255, 0.08)",
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "rgba(255, 255, 255, 0.95)",
                                                    fontWeight: 500,
                                                    fontSize: "0.85rem",
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {f.label}
                                            </Typography>
                                            <Box sx={{ flexShrink: 0, ml: 1.5 }}>
                                                {f.val === true && (
                                                    <Box
                                                        sx={{
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: "50%",
                                                            background: "rgba(16,185,129,0.25)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            boxShadow:
                                                                "0 0 12px rgba(16,185,129,0.3)",
                                                        }}
                                                    >
                                                        <CheckIcon
                                                            sx={{
                                                                color: "#10B981",
                                                                fontSize: "1.1rem",
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                                {f.val === false && (
                                                    <Box
                                                        sx={{
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: "50%",
                                                            background: "rgba(239,68,68,0.2)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        <CloseIcon
                                                            sx={{
                                                                color: "#EF4444",
                                                                fontSize: "1.1rem",
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                                {f.val === "partial" && (
                                                    <Box
                                                        sx={{
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: "50%",
                                                            background: "rgba(251, 191, 36, 0.2)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        <RemoveIcon
                                                            sx={{
                                                                color: "#FBBF24",
                                                                fontSize: "1.1rem",
                                                            }}
                                                        />
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
                    <Typography
                        variant="h3"
                        sx={{
                            textAlign: "center",
                            fontWeight: 800,
                            mb: 8,
                            color: "#ffffff",
                            fontSize: { xs: "1.75rem", lg: "2.5rem" },
                            letterSpacing: -0.5,
                        }}
                    >
                        Frequently Asked Questions
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                            gap: 3,
                            alignItems: "start",
                        }}
                    >
                        {faqs.map((faq, index) => (
                            <Accordion
                                key={index}
                                sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                                    backdropFilter: "blur(20px)",
                                    border: "1px solid",
                                    borderColor: "rgba(255, 255, 255, 0.1)",
                                    borderRadius: "12px !important",
                                    "&:before": { display: "none" },
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                                    "&:hover": {
                                        borderColor: "rgba(139, 92, 246, 0.4)",
                                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    },
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: "#a78bfa" }} />}
                                    sx={{
                                        fontWeight: 700,
                                        color: "#ffffff",
                                        px: 3,
                                        py: 2,
                                        fontSize: "1rem",
                                    }}
                                >
                                    {faq.question}
                                </AccordionSummary>
                                <AccordionDetails
                                    sx={{
                                        color: "rgba(255, 255, 255, 0.8)",
                                        lineHeight: 1.8,
                                        px: 3,
                                        pb: 3,
                                        fontSize: "0.95rem",
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
