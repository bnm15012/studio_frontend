import { Box, Typography, Container, Card, CardContent, Avatar, Rating, Chip } from "@mui/material";
import { Star as StarIcon, FormatQuote as QuoteIcon } from "@mui/icons-material";
import TrustedPartners from "./TrustedPartners";

function TestimonialsSection() {
    const testimonials = [
        {
            name: "Ajay Roy",
            role: "Owner, Rhythmix International",
            content:
                "Book & Manage has completely transformed how we operate. The automated scheduling saves us 15+ hours every week, and our members love the easy booking system.",
            rating: 5,
            image: "assets/rhythmix.png",
            metrics: [
                { label: "Time Saved", value: "15+ hrs/week" },
                { label: "Booking Increase", value: "+40%" },
            ],
        },
        {
            name: "Krishna",
            role: "Owner, Studio7 GHY",
            content:
                "The payment processing is seamless and the financial reporting gives us insights we never had before. Our revenue has increased by 30% since implementation.",
            rating: 5,
            image: "assets/studio7.png",
            metrics: [
                { label: "Revenue Growth", value: "+30%" },
                { label: "Payment Speed", value: "2x faster" },
            ],
        },
        {
            name: "Priya Sharma",
            role: "Manager, Urban Beats",
            content:
                "CUSTOMr support is exceptional and the platform is incredibly user-friendly. Both our staff and members adapted to it immediately. Our no-show rate dropped by 60%.",
            rating: 5,
            image: "assets/urban_beats.png",
            metrics: [
                { label: "No-show Reduction", value: "-60%" },
                { label: "Staff Adoption", value: "100%" },
            ],
        },
        {
            name: "Bhavesh",
            role: "Owner, House of Happiness",
            content:
                "The member management features help us provide personalized experiences. Our retention rate has improved significantly since we started using Book & Manage.",
            rating: 5,
            image: "assets/house_of_happiness.jpeg",
            metrics: [
                { label: "Retention Rate", value: "+25%" },
                { label: "Member Satisfaction", value: "4.9/5" },
            ],
        },
    ];

    const stats = [
        { number: "50+", label: "Studios Trust Us" },
        { number: "10K+", label: "Active Members" },
        { number: "98%", label: "Satisfaction Rate" },
        { number: "24/7", label: "Support Available" },
    ];

    return (
        <Box
            id="testimonials"
            sx={{
                py: 16,
                background: "linear-gradient(180deg, #16213e 0%, #0f0f1a 50%, #1a1a2e 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Enhanced Decorative Elements */}
            <Box
                sx={{
                    position: "absolute",
                    top: -100,
                    left: -100,
                    width: 400,
                    height: 400,
                    background:
                        "radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, rgba(249, 115, 22, 0.1) 50%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(60px)",
                    animation: "float 12s ease-in-out infinite",
                    "@keyframes float": {
                        "0%, 100%": { transform: "translate(0, 0)" },
                        "50%": { transform: "translate(20px, -20px)" },
                    },
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    background:
                        "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(60px)",
                    animation: "float 12s ease-in-out infinite reverse",
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 10 }}>
                {/* Section Header */}
                <Box sx={{ textAlign: "center", mb: 12 }}>
                    <Chip
                        icon={<StarIcon />}
                        label="Trusted by Studios"
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
                        What Our Clients Say
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
                        Don&apos;t just take our word for it. Here&apos;s what studio owners are
                        saying about their experience with Book & Manage.
                    </Typography>
                </Box>

                {/* Stats Row */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" },
                        gap: 4,
                        mb: 12,
                    }}
                >
                    {stats.map((stat, index) => (
                        <Card
                            key={index}
                            sx={{
                                textAlign: "center",
                                p: 4,
                                backgroundColor: "rgba(255, 255, 255, 0.03)",
                                backdropFilter: "blur(20px)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: 3,
                                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                opacity: 0,
                                animation: "fadeInUp 0.6s ease forwards",
                                animationDelay: `${index * 0.1}s`,
                                "@keyframes fadeInUp": {
                                    "0%": { opacity: 0, transform: "translateY(20px)" },
                                    "100%": { opacity: 1, transform: "translateY(0)" },
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                    transform: "translateY(-8px) scale(1.05)",
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.3)",
                                },
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontSize: { xs: "2.5rem", lg: "3.5rem" },
                                    fontWeight: 800,
                                    background: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    mb: 1,
                                    letterSpacing: -1,
                                }}
                            >
                                {stat.number}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "rgba(255, 255, 255, 0.8)",
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    letterSpacing: 0.5,
                                }}
                            >
                                {stat.label}
                            </Typography>
                        </Card>
                    ))}
                </Box>

                {/* Testimonials Grid */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: 5,
                        mb: 12,
                    }}
                >
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            sx={{
                                p: 5,
                                height: "100%",
                                backgroundColor: "rgba(255, 255, 255, 0.03)",
                                backdropFilter: "blur(20px)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: 3,
                                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                opacity: 0,
                                animation: "fadeInUp 0.6s ease forwards",
                                animationDelay: `${(index + 4) * 0.1}s`,
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                    transform: "translateY(-12px)",
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.3)",
                                },
                            }}
                        >
                            <CardContent sx={{ p: 0, "&:last-child": { pb: null } }}>
                                <Rating
                                    value={testimonial.rating}
                                    readOnly
                                    sx={{
                                        mb: 3,
                                        "& .MuiRating-iconFilled": {
                                            color: "#fbbf24",
                                        },
                                        "& .MuiRating-icon": {
                                            fontSize: "1.5rem",
                                        },
                                    }}
                                />

                                <Box sx={{ position: "relative", mb: 4 }}>
                                    <QuoteIcon
                                        sx={{
                                            position: "absolute",
                                            top: -12,
                                            left: -12,
                                            fontSize: "3rem",
                                            color: "rgba(139, 92, 246, 0.3)",
                                        }}
                                    />
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: "rgba(255, 255, 255, 0.9)",
                                            lineHeight: 1.8,
                                            pl: 4,
                                            fontStyle: "italic",
                                            fontSize: "1.05rem",
                                        }}
                                    >
                                        &quot;{testimonial.content}&quot;
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                                    <Avatar
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            border: "2px solid rgba(139, 92, 246, 0.3)",
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                                transform: "scale(1.1)",
                                                borderColor: "rgba(139, 92, 246, 0.6)",
                                            },
                                        }}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 700,
                                                color: "#ffffff",
                                                fontSize: "1.1rem",
                                            }}
                                        >
                                            {testimonial.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "rgba(255, 255, 255, 0.7)",
                                                fontSize: "0.95rem",
                                            }}
                                        >
                                            {testimonial.role}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Metrics */}
                                {testimonial.metrics && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 3,
                                            mt: 4,
                                            pt: 4,
                                            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                                        }}
                                    >
                                        {testimonial.metrics.map((metric, metricIndex) => (
                                            <Box key={metricIndex}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 800,
                                                        background:
                                                            "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)",
                                                        backgroundClip: "text",
                                                        WebkitBackgroundClip: "text",
                                                        WebkitTextFillColor: "transparent",
                                                        fontSize: "1.5rem",
                                                        letterSpacing: -0.5,
                                                    }}
                                                >
                                                    {metric.value}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: "rgba(255, 255, 255, 0.7)",
                                                        fontSize: "0.85rem",
                                                        fontWeight: 500,
                                                        letterSpacing: 0.3,
                                                    }}
                                                >
                                                    {metric.label}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Trust Badges */}
                <Box sx={{ textAlign: "center" }}>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            mb: 5,
                            fontSize: "1.1rem",
                            fontWeight: 500,
                        }}
                    >
                        Trusted by leading studios worldwide
                    </Typography>
                    <TrustedPartners />
                </Box>
            </Container>
        </Box>
    );
}

export default TestimonialsSection;
