import { useCallback, useEffect, useState } from "react";
import { Box, IconButton, Typography, Button, keyframes } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FlexEvenly from "../../Components/FlexEvenly";
import { useDispatch } from "react-redux";
import { openDialog } from "../../state/dialogSlice";

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

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const images = [
  {
    src: "/assets/carouselImg1.webp",
    alt: "Gym Yoga",
    title: "Transform Your Studio Management",
    subtitle: "Streamline operations, boost member engagement, and grow your business"
  },
  {
    src: "/assets/carouselImg2.webp",
    alt: "Yoga",
    title: "Elevate Your Client Experience",
    subtitle: "Provide seamless booking, easy payments, and personalized services"
  },
  {
    src: "/assets/carouselImg3.webp",
    alt: "Dance",
    title: "Simplify Your Workflow",
    subtitle: "All-in-one solution for scheduling, payments, and member management"
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();

  const handleNext = useCallback(
    () => setCurrentIndex((currentIndex + 1) % images.length),
    [currentIndex]
  );

  const handlePrev = () =>
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);

  const handleIndicatorClick = (index) => setCurrentIndex(index);

  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, handleNext]);

  return (
    <FlexEvenly>
      <Box
        sx={{
          position: "relative",
          width: "100vw",
          height: { xs: "80vh", md: "85vh" },
          overflow: "hidden",
        }}
      >
        {/* Hero Content Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            zIndex: 10,
            textAlign: "center",
            padding: { xs: 3, md: 6 },
            background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))",
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: "white",
              fontWeight: 700,
              textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
              mb: 2,
              animation: `${fadeIn} 0.8s ease-out`,
              maxWidth: "800px",
            }}
          >
            {images[currentIndex].title}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: "white",
              mb: 4,
              maxWidth: "700px",
              textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
              animation: `${fadeIn} 0.8s ease-out 0.3s`,
              animationFillMode: "backwards",
            }}
          >
            {images[currentIndex].subtitle}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              justifyContent: "center",
              animation: `${slideInRight} 0.8s ease-out 0.6s`,
              animationFillMode: "backwards",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => dispatch(openDialog("signupDialog"))}
              sx={{
                px: 4,
                py: 1.5,
                mb: 2,
                fontWeight: 600,
                borderRadius: 2,
                fontSize: "1.1rem",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        {/* Carousel Indicators */}
        <Box
          sx={{
            position: "absolute",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "12px",
            zIndex: 20,
          }}
        >
          {images.map((_, index) => (
            <IconButton
              key={index}
              size="small"
              onClick={() => handleIndicatorClick(index)}
              sx={{
                color: index === currentIndex ? "white" : "rgba(255,255,255,0.5)",
                transition: "all 0.3s ease",
                transform: index === currentIndex ? "scale(1.2)" : "scale(1)",
              }}
            >
              <FiberManualRecordIcon fontSize="small" />
            </IconButton>
          ))}
        </Box>

        {/* Slideshow */}
        <Box
          sx={{
            display: "flex",
            transition: "transform 0.8s ease",
            transform: `translateX(-${currentIndex * 100}%)`,
            height: "100%",
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
                filter: "brightness(0.9)",
              }}
            />
          ))}
        </Box>

        {/* Controls */}
        <IconButton
          onClick={handlePrev}
          sx={{
            position: "absolute",
            top: "50%",
            left: { xs: "5px", md: "20px" },
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            color: "white",
            zIndex: 20,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              transform: "translateY(-50%) scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <ArrowBackIosIcon fontSize="medium" />
        </IconButton>

        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: { xs: "5px", md: "20px" },
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            color: "white",
            zIndex: 20,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              transform: "translateY(-50%) scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <ArrowForwardIosIcon fontSize="medium" />
        </IconButton>
      </Box>
    </FlexEvenly>
  );
};

export default Carousel;
