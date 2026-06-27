import { Typography, Paper, Box, Stack, useTheme, keyframes } from "@mui/material";
import { FlexBetween, FlexEvenlyColumn } from "../../core/components/layout/FlexBox";
import { Navbar } from "../../NavigationComponets/Navbar/Navbar";
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

// Define gradients
const gradients = {
    main: "linear-gradient(135deg, #4fc3f7 0%, #00b0ff 100%)",
    features: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
    highlight: "linear-gradient(135deg, #aed581 0%, #7cb342 100%)",
};

const AboutUsPage = () => {
    const { palette } = useTheme();

    return (
        <Box
            sx={{
                backgroundColor: palette.background.default,
                pt: 10,
            }}
        >
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
                    elevation={3}
                    sx={{
                        p: 4,
                        background: gradients.main,
                        color: "white",
                        borderRadius: 3,
                        animation: `${scaleIn} 0.6s ease-out`,
                        transition: "transform 0.3s ease",
                        "&:hover": {
                            transform: "translateY(-5px)",
                        },
                    }}
                >
                    <FlexBetween sx={{ mb: 3 }}>
                        <Typography
                            variant="h3"
                            textAlign="center"
                            sx={{
                                fontWeight: 700,
                                width: "100%",
                                position: "relative",
                                "&:after": {
                                    content: '""',
                                    position: "absolute",
                                    bottom: -8,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "80px",
                                    height: "3px",
                                    background: "rgba(255, 255, 255, 0.5)",
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
                        }}
                    >
                        At Book & Manage, we provide a comprehensive system designed to help you
                        manage your studio effortlessly and efficiently. Our mission is to empower
                        studio owners with advanced tools for tracking memberships, organizing
                        schedules, streamlining payments, and much more.
                    </Typography>
                </Paper>

                {/* Features Section */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        background: "rgb(249, 225, 152)",
                        borderRadius: 3,
                        animation: `${fadeIn} 0.6s ease-out 0.6s`,
                        animationFillMode: "backwards",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                            transform: "translateY(-5px)",
                        },
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 4,
                            color: palette.primary.dark,
                            fontWeight: 700,
                            textAlign: "center",
                            position: "relative",
                            "&:after": {
                                content: '""',
                                position: "absolute",
                                bottom: -8,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "60px",
                                height: "3px",
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
                                elevation={2}
                                sx={{
                                    p: 3,
                                    background: "white",
                                    borderRadius: 2,
                                    animation: `${slideIn} 0.5s ease-out ${0.8 + index * 0.1}s`,
                                    animationFillMode: "backwards",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateX(10px)",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                                        background: gradients.highlight,
                                        "& .feature-title, & .feature-description": {
                                            color: "white",
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
                                                color: palette.primary.main,
                                                fontWeight: 600,
                                                mb: 0.5,
                                            }}
                                        >
                                            {title}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            className="feature-description"
                                            sx={{
                                                color: "#555",
                                                lineHeight: 1.6,
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
};

export default AboutUsPage;
