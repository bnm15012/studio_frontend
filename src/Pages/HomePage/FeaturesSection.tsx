import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    Stack,
    Chip,
    Button,
} from "@mui/material";
import { BarChart as BarChartIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { featurePageContent } from "./data";

function FeaturesSection() {

    return (
        <Box
            id="features"
            sx={{
                py: 16,
                background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)",
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
                    bottom: -150,
                    left: -150,
                    width: 500,
                    height: 500,
                    background:
                        "radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(70px)",
                    animation: "float 10s ease-in-out infinite reverse",
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 10 }}>
                {/* Section Header */}
                <Box sx={{ textAlign: "center", mb: 12 }}>
                    <Chip
                        icon={<BarChartIcon />}
                        label="Powerful Features"
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
                        {featurePageContent.title}
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
                        {featurePageContent.description}
                    </Typography>
                </Box>

                {/* Features Grid */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" },
                        gap: 5,
                        mb: 10,
                    }}
                >
                    {featurePageContent.featuresGrids.map((feature, index) => (
                        <Box key={index}>
                            <Card
                                sx={{
                                    height: "100%",
                                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                                    backdropFilter: "blur(20px)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: 3,
                                    opacity: 0,
                                    animation: "fadeInUp 0.6s ease forwards",
                                    animationDelay: `${index * 0.1}s`,
                                    "@keyframes fadeInUp": {
                                        "0%": { opacity: 0, transform: "translateY(20px)" },
                                        "100%": { opacity: 1, transform: "translateY(0)" },
                                    },
                                    "&:hover": {
                                        transform: "translateY(-12px)",
                                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.3)",
                                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 5 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2.5,
                                            mb: 4,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                p: 2.5,
                                                background:
                                                    feature.color ||
                                                    "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                                                borderRadius: 2.5,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "transform 0.3s ease",
                                                boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
                                                "&:hover": {
                                                    transform: "scale(1.1) rotate(5deg)",
                                                },
                                            }}
                                        >
                                            <feature.icon
                                                sx={{ color: "white", fontSize: "1.75rem" }}
                                            />
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: "#ffffff",
                                                fontSize: "1.25rem",
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "rgba(255, 255, 255, 0.8)",
                                            mb: 4,
                                            lineHeight: 1.7,
                                            fontSize: "1rem",
                                        }}
                                    >
                                        {feature.description}
                                    </Typography>

                                    <Stack spacing={2}>
                                        {feature.benefits.map((benefit, benefitIndex) => (
                                            <Box
                                                key={benefitIndex}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 2,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        background:
                                                            "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                                                        borderRadius: "50%",
                                                        flexShrink: 0,
                                                        boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
                                                    }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "rgba(255, 255, 255, 0.7)",
                                                        fontSize: "0.95rem",
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    {benefit}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Box>

                {/* CTA Section */}
                <Card
                    sx={{
                        maxWidth: 1000,
                        width: "100%",
                        mx: "auto",
                        p: 8,
                        background:
                            "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "white",
                        textAlign: "center",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        borderRadius: 3,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                        "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 35px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 92, 246, 0.4)",
                        },
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            mb: 3,
                            fontSize: { xs: "1.75rem", lg: "2.5rem" },
                            letterSpacing: -0.5,
                        }}
                    >
                        {featurePageContent.cta.title}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            mb: 5,
                            fontSize: { xs: "1rem", lg: "1.25rem" },
                            lineHeight: 1.7,
                        }}
                    >
                        {featurePageContent.cta.description}
                    </Typography>
                    <Button
                        variant="outlined"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                            borderColor: "rgba(255, 255, 255, 0.5)",
                            color: "#ffffff",
                            py: 2,
                            px: 5,
                            fontSize: "1.125rem",
                            fontWeight: 600,
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderColor: "#ffffff",
                                transform: "scale(1.05)",
                                boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
                            },
                        }}
                    >
                        {featurePageContent.cta.buttonText}
                    </Button>
                </Card>
            </Container>
        </Box>
    );
}

export default FeaturesSection;
