import { Box, Typography, Container, Chip, useTheme } from "@mui/material";
import { Monitor as MonitorIcon } from "@mui/icons-material";

export function DashboardPreview() {
    const theme = useTheme();

    const dashboardFeatures = [
        {
            title: "Dashboard Overview",
            description: "Get a real-time snapshot of your entire studio at a glance. View total students, active memberships, monthly revenue, and expense summaries — all from a single screen. Monitor current month vs last month revenue trends, track instructor count, and stay on top of every aspect of your studio operations without switching between multiple screens.",
            image: "/assets/dashboard-main.png",
        },
        {
            title: "Activity Overview",
            description: "Manage all your studio activities effortlessly in one place. Create and customise activities with flexible membership plans — monthly, quarterly, half-yearly, or yearly. Set up multiple batch timings to accommodate different student schedules, assign dedicated instructors per batch, and define capacity limits. Whether it's yoga, dance, fitness, or martial arts — organise everything with ease.",
            image: "/assets/dashboard-activity.png",
        },
        {
            title: "Income & Expense Reports",
            description: "Powerful, filter-rich reports across every section — bookings, students, clients, expenses, and memberships. Filter by payment mode (Cash, UPI, Card, Bank Transfer), track pending payments, and drill down by date, batch, or instructor. Export fee summaries and expense breakdowns for complete financial visibility.",
            image: "/assets/dashboard-reports.png",
        },
        {
            title: "Analytics",
            description: "Dive deep into your studio's data with intuitive visual analytics. Track payment modes — cash, UPI, card, or bank transfer — and understand which revenue streams perform best. Identify peak enrollment periods, monitor batch-wise occupancy, and spot trends in student drop-offs before they become a problem. Turn your data into actionable insights that help your studio grow.",
            image: "/assets/dashboard-analytics.png",
        },
    ];

    return (
        <Box
            id="dashboard"
            sx={{
                py: 8,
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
                <Box sx={{ textAlign: "center", mb: 4 }}>
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
                        gap: 4,
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
                                    width: { xs: "100%", md: 580 },
                                    height: { xs: 240, md: 340 },
                                    objectFit: "contain",
                                    transform: index % 2 === 0 ? "rotate(-5deg)" : "rotate(5deg)",
                                    transition: "transform 0.3s ease",
                                    flexShrink: 0,
                                    "&:hover": {
                                        transform: "rotate(0deg) scale(1.04)",
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


            </Container>
        </Box>
    );
}
