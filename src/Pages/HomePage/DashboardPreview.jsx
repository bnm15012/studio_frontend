import { Box, Typography, Container, Card, CardContent, Chip, Button, useTheme } from "@mui/material";
import { Monitor as MonitorIcon, ArrowForward as ArrowForwardIcon, PlayCircle as PlayIcon } from "@mui/icons-material";

export function DashboardPreview() {
    const theme = useTheme();

    const dashboardFeatures = [
        {
            title: "Reports & Analytics",
            description: "Track attendance, retention, and revenue trends",
            image: "/assets/dashboard-reports.png",
        },
        {
            title: "Smart Calendar",
            description: "Manage class schedules and bookings efficiently",
            image: "/assets/dashboard-analytics.png",
        },
        {
            title: "Payment Dashboard",
            description: "Track payments, invoices, and revenue in real-time",
            image: "/assets/dashboard-payments.png",
        },
    ];

    return (
        <Box
            id="dashboard"
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
                    left: 0,
                    width: 384,
                    height: 384,
                    background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)",
                    borderRadius: "50%",
                    filter: "blur(60px)",
                    transform: "translate(-50%, -50%)",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 384,
                    height: 384,
                    background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)",
                    borderRadius: "50%",
                    filter: "blur(60px)",
                    transform: "translate(50%, 50%)",
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 10 }}>
                {/* Section Header */}
                <Box sx={{ textAlign: "center", mb: 8 }}>
                    <Chip
                        icon={<MonitorIcon />}
                        label="Powerful Dashboard"
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
                        See Your Studio at a Glance
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
                        Our intuitive dashboard gives you complete control over your studio operations.
                        Track bookings, payments, and member engagement in real-time.
                    </Typography>
                </Box>

                {/* Dashboard Feature Previews - Zig Zag Layout */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                    }}
                >
                    {dashboardFeatures.map((feature, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: index % 2 === 0 ? "row" : "row-reverse" },
                                alignItems: "center",
                                gap: 6,
                                maxWidth: 1200,
                                mx: "auto",
                            }}
                        >
                            <Box
                                component="img"
                                src={feature.image}
                                alt={feature.title}
                                sx={{
                                    width: { xs: "100%", md: 450 },
                                    height: { xs: 300, md: 350 },
                                    objectFit: "cover",
                                    borderRadius: 3,
                                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                                    transform: index % 2 === 0 ? "rotate(-2deg)" : "rotate(2deg)",
                                    transition: "transform 0.3s ease",
                                    flexShrink: 0,
                                    "&:hover": {
                                        transform: "rotate(0deg) scale(1.02)",
                                    },
                                }}
                            />
                            <Box sx={{ flex: 1, textAlign: { xs: "center", md: index % 2 === 0 ? "left" : "right" } }}>
                                <Typography
                                    variant="h4"
                                    sx={{ fontWeight: "bold", mb: 3, color: "text.primary" }}
                                >
                                    {feature.title}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "text.secondary", lineHeight: 1.8, fontSize: "1.1rem" }}
                                >
                                    {feature.description}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* CTA */}
                <Box sx={{ textAlign: "center", mt: 8 }}>
                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                            py: 2,
                            px: 6,
                            fontSize: "1.125rem",
                            background: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
                            },
                        }}
                    >
                        Start Free Trial
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
