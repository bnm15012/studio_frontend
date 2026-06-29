import { Box, Typography, Container, Chip } from "@mui/material";
import { Monitor as MonitorIcon } from "@mui/icons-material";

export function DashboardPreview() {
    const dashboardFeatures = [
        {
            title: "Dashboard Overview",
            description:
                "Get a real-time snapshot of your entire studio at a glance. View total students, active memberships, monthly revenue, and expense summaries — all from a single screen. Monitor current month vs last month revenue trends, track instructor count, and stay on top of every aspect of your studio operations without switching between multiple screens.",
            image: "/assets/dashboard-main.png",
        },
        {
            title: "Activity Overview",
            description:
                "Manage all your studio activities effortlessly in one place. Create and customise activities with flexible membership plans — monthly, quarterly, half-yearly, or yearly. Set up multiple batch timings to accommodate different student schedules, assign dedicated instructors per batch, and define capacity limits. Whether it's yoga, dance, fitness, or martial arts — organise everything with ease.",
            image: "/assets/dashboard-activity.png",
        },
        {
            title: "Income & Expense Reports",
            description:
                "Powerful, filter-rich reports across every section — bookings, students, clients, expenses, and memberships. Filter by payment mode (Cash, UPI, Card, Bank Transfer), track pending payments, and drill down by date, batch, or instructor. Export fee summaries and expense breakdowns for complete financial visibility.",
            image: "/assets/dashboard-reports.png",
        },
        {
            title: "Analytics",
            description:
                "Dive deep into your studio's data with intuitive visual analytics. Track payment modes — cash, UPI, card, or bank transfer — and understand which revenue streams perform best. Identify peak enrollment periods, monitor batch-wise occupancy, and spot trends in student drop-offs before they become a problem. Turn your data into actionable insights that help your studio grow.",
            image: "/assets/dashboard-analytics.png",
        },
    ];

    return (
        <Box
            id="dashboard"
            sx={{
                py: 16,
                background:
                    "linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Enhanced Decorative Elements */}
            <Box
                sx={{
                    position: "absolute",
                    top: -200,
                    left: -200,
                    width: 600,
                    height: 600,
                    background:
                        "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(80px)",
                    animation: "float 8s ease-in-out infinite",
                    "@keyframes float": {
                        "0%, 100%": { transform: "translate(0, 0)" },
                        "50%": { transform: "translate(30px, -30px)" },
                    },
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: -200,
                    right: -200,
                    width: 600,
                    height: 600,
                    background:
                        "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(80px)",
                    animation: "float 8s ease-in-out infinite reverse",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 800,
                    height: 800,
                    background:
                        "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(100px)",
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 10 }}>
                {/* Section Header */}
                <Box sx={{ textAlign: "center", mb: 12 }}>
                    <Chip
                        icon={<MonitorIcon />}
                        label="Powerful Dashboard"
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
                        See Your Studio at a Glance
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
                        Our intuitive dashboard gives you complete control over your studio
                        operations. Track bookings, payments, and member engagement in real-time.
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
                                flexDirection: {
                                    xs: "column",
                                    md: index % 2 === 0 ? "row" : "row-reverse",
                                },
                                alignItems: "center",
                                gap: 8,
                                maxWidth: 1400,
                                mx: "auto",
                                opacity: 0,
                                animation: "fadeInUp 0.8s ease forwards",
                                animationDelay: `${index * 0.2}s`,
                                "@keyframes fadeInUp": {
                                    "0%": { opacity: 0, transform: "translateY(30px)" },
                                    "100%": { opacity: 1, transform: "translateY(0)" },
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={feature.image}
                                alt={feature.title}
                                sx={{
                                    width: { xs: "100%", md: 600 },
                                    height: { xs: 250, md: 380 },
                                    objectFit: "contain",
                                    borderRadius: 3,
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.1)",
                                    transform: index % 2 === 0 ? "rotate(-3deg)" : "rotate(3deg)",
                                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                    flexShrink: 0,
                                    "&:hover": {
                                        transform: "rotate(0deg) scale(1.05) translateY(-10px)",
                                        boxShadow: "0 35px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 92, 246, 0.3)",
                                    },
                                }}
                            />
                            <Box
                                sx={{
                                    flex: 1,
                                    textAlign: {
                                        xs: "center",
                                        md: index % 2 === 0 ? "left" : "right",
                                    },
                                    p: { xs: 2, md: 0 },
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 3,
                                        color: "#ffffff",
                                        fontSize: { xs: "1.75rem", lg: "2.25rem" },
                                        letterSpacing: -0.5,
                                    }}
                                >
                                    {feature.title}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: "rgba(255, 255, 255, 0.8)",
                                        lineHeight: 1.9,
                                        fontSize: { xs: "1rem", lg: "1.15rem" },
                                    }}
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
