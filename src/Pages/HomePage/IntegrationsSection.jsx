import { Box, Typography, Container, Card, CardContent, Chip, Avatar, useTheme } from "@mui/material";
import { Extension as ExtensionIcon, Check as CheckIcon } from "@mui/icons-material";

export function IntegrationsSection() {
    const theme = useTheme();

    const integrations = [
        {
            name: "WhatsApp Business",
            description: "Automated notifications and reminders",
            icon: "/assets/whatsapp-icon.png",
            category: "Communication",
        },
        {
            name: "RazorPay",
            description: "Secure payment processing",
            icon: "/assets/razorpay-icon.png",
            category: "Payments",
        },
        {
            name: "Google Calendar",
            description: "Sync schedules seamlessly",
            icon: "/assets/google-calendar-icon.png",
            category: "Productivity",
        },
        {
            name: "Gmail",
            description: "Email notifications and updates",
            icon: "/assets/gmail-icon.png",
            category: "Communication",
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
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: 4,
                        mb: 8,
                        maxWidth: 900,
                        mx: "auto",
                    }}
                >
                    {integrations.map((integration, index) => (
                        <Card
                            key={index}
                            sx={{
                                height: "100%",
                                transition: "all 0.3s ease",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: "0 20px 40px rgba(139, 92, 246, 0.15)",
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                },
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <Avatar
                                        src={integration.icon}
                                        alt={integration.name}
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            backgroundColor: "rgba(139, 92, 246, 0.1)",
                                        }}
                                    >
                                        <ExtensionIcon sx={{ color: "primary.main" }} />
                                    </Avatar>
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 600, color: "text.primary" }}
                                        >
                                            {integration.name}
                                        </Typography>
                                        <Chip
                                            label={integration.category}
                                            size="small"
                                            sx={{
                                                backgroundColor: "rgba(139, 92, 246, 0.1)",
                                                color: "primary.main",
                                                fontSize: "0.75rem",
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "text.secondary",
                                        lineHeight: 1.6,
                                    }}
                                >
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
