import { Box, Typography, Container, Card, CardContent, Chip, Avatar, useTheme } from "@mui/material";
import { Extension as ExtensionIcon, Check as CheckIcon, WhatsApp as WhatsAppIcon, Payment as PaymentIcon, CalendarMonth as CalendarIcon, Email as EmailIcon, PictureAsPdf as PdfIcon } from "@mui/icons-material";

export function IntegrationsSection() {
    const theme = useTheme();

    const integrations = [
        {
            name: "WhatsApp Business",
            description: "Send automated fee reminders, booking confirmations, and attendance alerts directly to students and parents on WhatsApp.",
            icon: <WhatsAppIcon sx={{ fontSize: 32, color: "#25D366" }} />,
            iconBg: "rgba(37, 211, 102, 0.1)",
            category: "Communication",
        },
        {
            name: "RazorPay",
            description: "Accept payments online securely via UPI, cards, net banking, and wallets. Track every transaction in real-time.",
            icon: <PaymentIcon sx={{ fontSize: 32, color: "#2D9CDB" }} />,
            iconBg: "rgba(45, 156, 219, 0.1)",
            category: "Payments",
        },
        {
            name: "Google Calendar",
            description: "Sync class schedules, batch timings, and events directly with Google Calendar so nothing is ever missed.",
            icon: <CalendarIcon sx={{ fontSize: 32, color: "#4285F4" }} />,
            iconBg: "rgba(66, 133, 244, 0.1)",
            category: "Productivity",
        },
        {
            name: "Gmail",
            description: "Send fee receipts, invoices, and important studio updates directly to students and parents via email.",
            icon: <EmailIcon sx={{ fontSize: 32, color: "#EA4335" }} />,
            iconBg: "rgba(234, 67, 53, 0.1)",
            category: "Communication",
        },
        {
            name: "PDF & Invoice Generator",
            description: "Auto-generate fee receipts, student invoices, and expense reports as professional downloadable PDFs in one click.",
            icon: <PdfIcon sx={{ fontSize: 32, color: "#F44336" }} />,
            iconBg: "rgba(244, 67, 54, 0.1)",
            category: "Documents",
        },
    ];

    const benefits = [
        "One-click setup for all integrations",
        "Real-time data synchronization",
        "Secure API connections",
        "24/7 integration support",
    ];

    return (
        <Box
            id="integrations"
            sx={{
                py: 12,
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)",
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
                    width: 384,
                    height: 384,
                    background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)",
                    borderRadius: "50%",
                    filter: "blur(60px)",
                    transform: "translate(50%, -50%)",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: 384,
                    height: 384,
                    background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)",
                    borderRadius: "50%",
                    filter: "blur(60px)",
                    transform: "translate(-50%, 50%)",
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 10 }}>
                {/* Section Header */}
                <Box sx={{ textAlign: "center", mb: 8 }}>
                    <Chip
                        icon={<ExtensionIcon />}
                        label="Seamless Integrations"
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
                        Essential Integrations
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "text.secondary",
                            maxWidth: 800,
                            mx: "auto",
                            lineHeight: 1.6,
                        }}
                    >
                        Book & Manage integrates with the essential tools you need to run your studio efficiently.
                    </Typography>
                </Box>

                {/* Benefits */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: 3,
                        mb: 8,
                    }}
                >
                    {benefits.map((benefit, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                px: 3,
                                py: 1.5,
                                backgroundColor: "rgba(255, 255, 255, 0.6)",
                                backdropFilter: "blur(10px)",
                                borderRadius: 2,
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                            }}
                        >
                            <CheckIcon sx={{ color: "#10B981", fontSize: "1.25rem" }} />
                            <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                                {benefit}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Integrations Grid */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
                        gap: 3,
                        maxWidth: 1100,
                        mx: "auto",
                    }}
                >
                    {integrations.map((integration, index) => (
                        <Card
                            key={index}
                            sx={{
                                height: "100%",
                                transition: "all 0.3s ease",
                                backgroundColor: "#fff",
                                border: "1px solid",
                                borderColor: "grey.100",
                                borderRadius: 3,
                                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                "&:hover": {
                                    transform: "translateY(-6px)",
                                    boxShadow: "0 16px 40px rgba(139, 92, 246, 0.15)",
                                    borderColor: "primary.light",
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                {/* Icon + Category row */}
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                    <Avatar
                                        sx={{
                                            width: 52,
                                            height: 52,
                                            backgroundColor: integration.iconBg,
                                            borderRadius: 2,
                                        }}
                                    >
                                        {integration.icon}
                                    </Avatar>
                                    <Chip
                                        label={integration.category}
                                        size="small"
                                        sx={{
                                            backgroundColor: integration.iconBg,
                                            color: "text.secondary",
                                            fontWeight: 600,
                                            fontSize: "0.7rem",
                                            borderRadius: 1,
                                        }}
                                    />
                                </Box>
                                {/* Name */}
                                <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
                                    {integration.name}
                                </Typography>
                                {/* Description */}
                                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                                    {integration.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
