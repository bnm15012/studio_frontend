import React from "react";
import { Typography, Paper, Box, Stack, keyframes } from "@mui/material";
import { FlexBetween, FlexEvenlyColumn } from "@/core/components/layout/FlexBox";
import { Navbar } from "@/NavigationComponets/Navbar/Navbar";
import Footer from "../../Components/Footer";

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const AboutUsPage: React.FC = () => (
    <Box
        sx={{
            background: "linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
            pt: 10,
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",
        }}
    >
        {/* Decorative Elements */}
        <Box
            sx={{
                position: "absolute",
                top: -100,
                right: -100,
                width: 400,
                height: 400,
                background:
                    "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)",
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
                bottom: -100,
                left: -100,
                width: 400,
                height: 400,
                background:
                    "radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(70px)",
                animation: "float 10s ease-in-out infinite reverse",
            }}
        />
        <Navbar />
        <FlexEvenlyColumn
            gap={5}
            sx={{
                py: 4,
                px: { xs: 2, sm: 4, md: 6 },
                maxWidth: "1200px",
                margin: "0 auto",
            }}
        >
            {/* Introduction Section */}
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 3,
                    animation: `${scaleIn} 0.6s ease-out`,
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow:
                            "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.3)",
                        background: "rgba(255, 255, 255, 0.08)",
                    },
                }}
            >
                <FlexBetween sx={{ mb: 3 }}>
                    <Typography
                        variant="h3"
                        textAlign="center"
                        sx={{
                            fontWeight: 800,
                            width: "100%",
                            position: "relative",
                            fontSize: { xs: "1.75rem", lg: "2.5rem" },
                            color: "#ffffff",
                            letterSpacing: -0.5,
                            background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            "&:after": {
                                content: '""',
                                position: "absolute",
                                bottom: -12,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "80px",
                                height: "3px",
                                background: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                                borderRadius: "2px",
                            },
                        }}
                    >
                        Welcome to Book & Manage
                    </Typography>
                </FlexBetween>
                <Typography
                    variant="h6"
                    textAlign="center"
                    sx={{
                        lineHeight: 1.8,
                        px: { xs: 1, sm: 4 },
                        animation: `${fadeIn} 0.6s ease-out 0.3s`,
                        animationFillMode: "backwards",
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: { xs: "1rem", lg: "1.15rem" },
                    }}
                >
                    At Book & Manage, we provide a comprehensive system designed to help you manage
                    your studio effortlessly and efficiently. Our mission is to empower studio
                    owners with advanced tools for tracking memberships, organizing schedules,
                    streamlining payments, and much more.
                </Typography>
            </Paper>

            {/* Features Section */}
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 3,
                    animation: `${fadeIn} 0.6s ease-out 0.6s`,
                    animationFillMode: "backwards",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow:
                            "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.3)",
                        background: "rgba(255, 255, 255, 0.08)",
                    },
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        mb: 4,
                        color: "#ffffff",
                        fontWeight: 800,
                        textAlign: "center",
                        fontSize: { xs: "1.5rem", lg: "2rem" },
                        letterSpacing: -0.5,
                        position: "relative",
                        "&:after": {
                            content: '""',
                            position: "absolute",
                            bottom: -12,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "60px",
                            height: "3px",
                            background: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                            borderRadius: "2px",
                        },
                    }}
                >
                    Why Choose us?
                </Typography>
                <Stack spacing={3}>
                    {[
                        {
                            icon: "📅",
                            title: "Scheduling Made Simple",
                            description:
                                "Manage classes, events, and appointments with ease using our intuitive scheduling tools.",
                        },
                        {
                            icon: "💳",
                            title: "Secure Payment Processing",
                            description:
                                "Streamline payment collections and manage transactions securely, all in one place.",
                        },
                        {
                            icon: "🌐",
                            title: "Cloud-Based Accessibility",
                            description:
                                "Access your data anytime, anywhere, on any internet-enabled device—be it a PC, Mac, iPad, iPhone, or Android device.",
                        },
                        {
                            icon: "📊",
                            title: "Powerful Analytics",
                            description:
                                "Gain insights into your studio's performance with detailed reports and analytics tools.",
                        },
                    ].map(({ icon, title, description }, index) => (
                        <Paper
                            key={title}
                            elevation={0}
                            sx={{
                                p: 3.5,
                                background: "rgba(255, 255, 255, 0.05)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: 2.5,
                                animation: `${slideIn} 0.5s ease-out ${0.8 + index * 0.1}s`,
                                animationFillMode: "backwards",
                                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                    transform: "translateX(15px)",
                                    boxShadow: "0 20px 40px rgba(139, 92, 246, 0.2)",
                                    background: "rgba(139, 92, 246, 0.15)",
                                    borderColor: "rgba(139, 92, 246, 0.4)",
                                    "& .feature-title, & .feature-description": {
                                        color: "#ffffff",
                                    },
                                },
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Typography variant="h4" sx={{ opacity: 0.9 }}>
                                    {icon}
                                </Typography>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        className="feature-title"
                                        sx={{
                                            color: "#ffffff",
                                            fontWeight: 700,
                                            mb: 1,
                                            fontSize: "1.1rem",
                                        }}
                                    >
                                        {title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        className="feature-description"
                                        sx={{
                                            color: "rgba(255, 255, 255, 0.7)",
                                            lineHeight: 1.7,
                                            fontSize: "0.95rem",
                                        }}
                                    >
                                        {description}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            </Paper>
        </FlexEvenlyColumn>
        <Footer />
    </Box>
);

export default AboutUsPage;
