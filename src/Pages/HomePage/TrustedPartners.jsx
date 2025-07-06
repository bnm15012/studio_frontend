import { Box, Typography, Avatar, Container, alpha } from '@mui/material';

const partners = [
  {
    name: 'Rhythmix International',
    image: '/assets/rhythmix.png',
  },
  {
    name: 'Studio7 GHY',
    image: '/assets/studio7.png',
  },
  {
    name: 'Gymnastics Terminal',
    image: '/assets/gymnastics_terminal.jpg',
  },
  {
    name: 'Urban Beats',
    image: '/assets/urban_beats.png',
  },
];

const TrustedPartners = () => {

  return (
    <Box
      sx={{
        width: "100vw",
        py: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, rgb(37,10,49) 50%, rgb(85, 21, 112) 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            color: 'white',
            fontWeight: 800,
            letterSpacing: 1,
            mb: 8,
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}
        >
          Trusted by Studios
        </Typography>

        <Box
          sx={{
            position: 'relative',
            // height: { xs: 200, md: 300 },
            overflow: 'hidden',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              width: 100,
              height: '100%',
              zIndex: 2,
              pointerEvents: 'none',
            },
            // '&::before': {
            //   left: 0,
            //   background: `linear-gradient(to right, ${theme.palette.primary.main}, transparent)`,
            // },
            // '&::after': {
            //   right: 0,
            //   background: `linear-gradient(to left, ${theme.palette.secondary.main}, transparent)`,
            // }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: "400rem",
              overflow: "hidden",
              animation: 'marquee 20s linear infinite',
              '&:hover': {
                animationPlayState: 'paused',
              }
            }}
          >
            {/* Duplicate partners for seamless scroll */}
            {[...partners, ...partners, ...partners, ...partners, ...partners, ...partners].map((partner, index) => (
              <Box
                key={index}
                sx={{
                  flex: '0 0 auto',
                  mx: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: { xs: 150, md: 200 },
                }}
              >
                <Box
                  sx={{
                    background: alpha('#fff', 0.1),
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    p: 3,
                    textAlign: 'center',
                    width: '100%',
                    height: { xs: 160, md: 220 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${alpha('#fff', 0.2)}`,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-10px) scale(1.05)',
                      background: alpha('#fff', 0.2),
                      boxShadow: `0 20px 40px ${alpha('#000', 0.3)}`,
                    },
                  }}
                >
                  <Avatar
                    src={partner.image}
                    alt={partner.name}
                    sx={{
                      width: { xs: 80, md: 120 },
                      height: { xs: 80, md: 120 },
                      mb: 2,
                      border: `3px solid ${alpha('#fff', 0.3)}`,
                      boxShadow: `0 8px 25px ${alpha('#000', 0.2)}`,
                      transition: 'all 0.3s ease',
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      textAlign: 'center',
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                      fontSize: { xs: '0.9rem', md: '1rem' }
                    }}
                  >
                    {partner.name}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* <Typography
          variant="h6"
          align="center"
          sx={{
            color: alpha('#fff', 0.9),
            mt: 6,
            fontWeight: 300,
            maxWidth: 600,
            mx: 'auto',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
        >
          Join hundreds of studio owners who trust us to manage and grow their businesses
        </Typography> */}
      </Container>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </Box>
  );
};

export default TrustedPartners;