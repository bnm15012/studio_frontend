import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Stack,
  useTheme,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  // CalendarToday as CalendarIcon,
  WhatsApp as Communication,
  CreditCard as CreditCardIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { openDialog } from '../../state/dialogSlice';
import { useDispatch } from 'react-redux';

export function HeroSection() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const benefits = [
    'Automated scheduling and booking system',
    'Seamless communication and billing process',
    'Comprehensive member management tools',
  ];

  const trustIndicators = [
    { icon: PeopleIcon, label: '10,000+ Members' },
    // { icon: CalendarIcon, label: '50,000+ Classes' },
    { icon: TrendingUpIcon, label: '98% Satisfaction' },
  ];

  const featureCards = [
    {
      icon: CreditCardIcon,
      title: 'Payment Processing',
      description: 'Secure payment gateway with automated billing and subscription management.',
    },
    {
      icon: PeopleIcon,
      title: 'Member Management',
      description: 'Complete member profiles with attendance tracking and personalized experiences.',
    },
    {
      icon: Communication,
      title: 'Seamless Communication',
      description: 'Effortlessly connect with clients and staff through integrated messaging, and updates in real time.',
    }
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.4), rgba(0,0,0,0.6))',
            zIndex: 1,
          },
        }}
      >
        <Box
          component="img"
          src={"/assets/hero-image.jpg"}
          alt="Professional Studio"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `translateY(${scrollY * 0.5}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      </Box>

      {/* Content */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 10, py: 10 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 6,
            alignItems: 'center',
          }}
        >
          {/* Left Content */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={4} sx={{ color: 'white' }}>
              <Box>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', lg: '3.5rem' },
                    fontWeight: 'bold',
                    lineHeight: 1.2,
                    mb: 2,
                  }}
                >
                  Transform Your{' '}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(45deg, #A78BFA 0%, #60A5FA 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      display: 'block',
                    }}
                  >
                    Studio Management
                  </Box>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.25rem', lg: '1.5rem' },
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.5,
                  }}
                >
                  Streamline operations, boost member engagement, and grow your business with our
                  comprehensive studio management platform.
                </Typography>
              </Box>

              {/* Key Benefits */}
              <Stack spacing={2}>
                {benefits.map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircleIcon sx={{ color: '#4ADE80', flexShrink: 0 }} />
                    <Typography variant="body1" sx={{ fontSize: '1.125rem' }}>
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {/* CTA Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    dispatch(openDialog("signupDialog"));
                  }}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.125rem',
                  }}
                >
                  Get Started Today
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.125rem',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.background.paper,
                      color: 'black',
                      borderColor: 'white',
                    },
                  }}
                >
                  Watch Demo
                </Button>
              </Stack>

              {/* Trust Indicators */}
              <Box sx={{ pt: 4, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <Typography variant="body2" fontWeight={"bolder"} sx={{ color: 'rgba(255, 255, 255, 1)', mb: 2 }}>
                  Trusted by 50+ studios worldwide
                </Typography>
                <Stack direction="row" spacing={4} flexWrap="wrap">
                  {trustIndicators.map((indicator, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <indicator.icon sx={{ color: 'rgba(255, 255, 255)', fontSize: '1.25rem' }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255)' }}>
                        {indicator.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* Right Content - Feature Cards */}
          <Box sx={{ flex: 1, display: { xs: 'none', lg: 'block' } }}>
            <Stack spacing={3}>
              {featureCards.map((card, index) => (
                <Card
                  key={index}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                          borderRadius: 2,
                        }}
                      >
                        <card.icon sx={{ color: 'white' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {card.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {card.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* Scroll Indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%, 20%, 53%, 80%, 100%': {
              transform: 'translateX(-50%) translateY(0)',
            },
            '40%, 43%': {
              transform: 'translateX(-50%) translateY(-10px)',
            },
            '70%': {
              transform: 'translateX(-50%) translateY(-5px)',
            },
            '90%': {
              transform: 'translateX(-50%) translateY(-2px)',
            },
          },
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 40,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 12,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            pt: 1,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 12,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: 2,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}