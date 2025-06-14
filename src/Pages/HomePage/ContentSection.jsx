import { Box, Container, Grid, Typography, useTheme, Paper, keyframes, Button } from "@mui/material";
import EventNoteIcon from '@mui/icons-material/EventNote';
import PaymentsIcon from '@mui/icons-material/Payments';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import { useNavigate } from "react-router-dom";

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const featureData = [
  {
    title: "Smart Scheduling",
    text: "Intuitive calendar system to manage classes, appointments, and events. Allow clients to book online 24/7 and reduce scheduling conflicts.",
    icon: <EventNoteIcon sx={{ fontSize: 50 }} />,
    color: "#4fc3f7"
  },
  {
    title: "Seamless Payments",
    text: "Process payments, manage subscriptions, and automate billing. Keep track of revenue with detailed financial reports.",
    icon: <PaymentsIcon sx={{ fontSize: 50 }} />,
    color: "#aed581"
  },
  {
    title: "Member Management",
    text: "Track memberships, attendance, progress, and preferences. Build stronger relationships with personalized member experiences.",
    icon: <PeopleAltIcon sx={{ fontSize: 50 }} />,
    color: "#ffb74d"
  },
  {
    title: "Studio Growth",
    text: "Marketing tools, analytics, and insights to help your studio reach more clients and increase retention rates.",
    icon: <SportsGymnasticsIcon sx={{ fontSize: 50 }} />,
    color: "#7986cb"
  }
];

const ContentSection = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        padding: { xs: "20px 20px" },
        backgroundColor: 'rgb(37,10,49)'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            animation: `${fadeIn} 0.8s ease-out`
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontWeight: 600,
              letterSpacing: 2
            }}
          >
            POWERFUL FEATURES
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              maxWidth: "800px",
              mx: "auto",
              mt: 3,
              fontWeight: 400
            }}
          >
            Our comprehensive studio management platform helps you streamline operations,
            enhance client experience, and focus on growing your business.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {featureData.map((feature, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  padding: "40px 30px",
                  height: '100%',
                  background: "white",
                  borderRadius: "12px",
                  textAlign: "center",
                  transition: "all 0.4s ease",
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `${fadeIn} 0.8s ease-out ${0.2 + index * 0.1}s`,
                  animationFillMode: 'backwards',
                  '&:hover': {
                    transform: "translateY(-10px)",
                    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
                    '& .icon-wrapper': {
                      backgroundColor: feature.color,
                      color: 'white',
                      animation: `${pulse} 1.5s ease infinite`
                    }
                  },
                }}
              >
                <Box
                  className="icon-wrapper"
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    mb: 3,
                    mx: 'auto',
                    color: feature.color,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {feature.icon}
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: palette.text.primary
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: palette.text.secondary,
                    mb: 2,
                    lineHeight: 1.7
                  }}
                >
                  {feature.text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 8,
            textAlign: 'center',
            animation: `${fadeIn} 0.8s ease-out 0.8s`,
            animationFillMode: 'backwards',
          }}
        >
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => {
              navigate("/contactus");
              window.scrollTo({ top: 0 }); 
            }}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 2,
              fontSize: "1rem",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Learn How We Can Help
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ContentSection;
