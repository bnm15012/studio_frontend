import { useCallback, useEffect, useState } from "react";
import { Box, IconButton, Typography, Button, Fade, Slide, useTheme, alpha } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useAppDispatch } from "@/state";
import { openDialog } from "../../state/dialogSlice";

const images = [
    {
        src: "/assets/carouselImg1.webp",
        alt: "Gym Yoga",
        title: "Transform Your Studio Management",
        subtitle: "Streamline operations, boost member engagement, and grow your business",
    },
    {
        src: "/assets/carouselImg2.webp",
        alt: "Yoga",
        title: "Elevate Your Client Experience",
        subtitle: "Provide seamless booking, easy payments, and personalized services",
    },
    {
        src: "/assets/carouselImg3.webp",
        alt: "Dance",
        title: "Simplify Your Workflow",
        subtitle: "All-in-one solution for scheduling, payments, and member management",
    },
];

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const handleNext = useCallback(
        () => setCurrentIndex((currentIndex + 1) % images.length),
        [currentIndex],
    );

    const handlePrev = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);

    const handleIndicatorClick = (index: number) => setCurrentIndex(index);

    useEffect(() => {
        const interval = setInterval(handleNext, 5000);
        return () => clearInterval(interval);
    }, [currentIndex, handleNext]);

    return (
        <Box
            sx={{
                position: "relative",
                width: "100vw",
                height: { xs: "80vh", md: "90vh" },
                overflow: "hidden",
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.secondary.main, 0.8)})`,
            }}
        >
            {/* Background Images */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {images.map((img, index) => (
                    <Box
                        key={index}
                        component="img"
                        src={img.src}
                        alt={img.alt}
                        sx={{
                            width: "100vw",
                            height: "100%",
                            objectFit: "cover",
                            flexShrink: 0,
                            filter: "brightness(0.7) saturate(1.2)",
                        }}
                    />
                ))}
            </Box>

            {/* Gradient Overlay */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(to bottom, ${alpha("#000", 0.2)}, ${alpha("#000", 0.6)})`,
                    zIndex: 1,
                }}
            />

            {/* Hero Content */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 2,
                    textAlign: "center",
                    px: { xs: 3, md: 6 },
                }}
            >
                <Fade in timeout={800} key={`title-${currentIndex}`}>
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{
                            color: "white",
                            fontWeight: 800,
                            textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
                            mb: 3,
                            maxWidth: "900px",
                            fontSize: { xs: "2.5rem", md: "4rem" },
                            lineHeight: 1.2,
                        }}
                    >
                        {images[currentIndex].title}
                    </Typography>
                </Fade>

                <Slide in direction="up" timeout={1000} key={`subtitle-${currentIndex}`}>
                    <Typography
                        variant="h4"
                        sx={{
                            color: "white",
                            mb: 5,
                            maxWidth: "700px",
                            textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
                            fontWeight: 300,
                            fontSize: { xs: "1.2rem", md: "1.8rem" },
                        }}
                    >
                        {images[currentIndex].subtitle}
                    </Typography>
                </Slide>

                <Fade in timeout={1200}>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 3,
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            onClick={() => dispatch(openDialog("signupDialog"))}
                            variant="contained"
                            size="large"
                            sx={{
                                px: 5,
                                py: 2,
                                fontSize: "1.2rem",
                                fontWeight: 600,
                                borderRadius: 3,
                                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                                textTransform: "none",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                    transform: "translateY(-4px) scale(1.02)",
                                    boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.6)}`,
                                },
                            }}
                        >
                            Get Started Today
                        </Button>

                        {/* <Button
              variant="outlined"
              size="large"
              sx={{
                px: 5,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 500,
                borderRadius: 3,
                borderColor: "white",
                color: "white",
                textTransform: 'none',
                borderWidth: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: alpha('#fff', 0.1),
                  borderColor: "white",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Watch Demo
            </Button> */}
                    </Box>
                </Fade>
            </Box>

            {/* Navigation Arrows */}
            <IconButton
                onClick={handlePrev}
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: { xs: 16, md: 32 },
                    transform: "translateY(-50%)",
                    backgroundColor: alpha("#fff", 0.2),
                    backdropFilter: "blur(10px)",
                    color: "white",
                    zIndex: 3,
                    width: 56,
                    height: 56,
                    transition: "all 0.3s ease",
                    "&:hover": {
                        backgroundColor: alpha("#fff", 0.3),
                        transform: "translateY(-50%) scale(1.1)",
                    },
                }}
            >
                <ArrowBackIosIcon sx={{ fontSize: 24 }} />
            </IconButton>

            <IconButton
                onClick={handleNext}
                sx={{
                    position: "absolute",
                    top: "50%",
                    right: { xs: 16, md: 32 },
                    transform: "translateY(-50%)",
                    backgroundColor: alpha("#fff", 0.2),
                    backdropFilter: "blur(10px)",
                    color: "white",
                    zIndex: 3,
                    width: 56,
                    height: 56,
                    transition: "all 0.3s ease",
                    "&:hover": {
                        backgroundColor: alpha("#fff", 0.3),
                        transform: "translateY(-50%) scale(1.1)",
                    },
                }}
            >
                <ArrowForwardIosIcon sx={{ fontSize: 24 }} />
            </IconButton>

            {/* Indicators */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 40,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 2,
                    zIndex: 3,
                }}
            >
                {images.map((_, index) => (
                    <IconButton
                        key={index}
                        size="small"
                        onClick={() => handleIndicatorClick(index)}
                        sx={{
                            color: index === currentIndex ? "white" : alpha("#fff", 0.5),
                            transition: "all 0.3s ease",
                            transform: index === currentIndex ? "scale(1.3)" : "scale(1)",
                            "&:hover": {
                                color: "white",
                                transform: "scale(1.2)",
                            },
                        }}
                    >
                        <FiberManualRecordIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                ))}
            </Box>
        </Box>
    );
};

export default Carousel;
