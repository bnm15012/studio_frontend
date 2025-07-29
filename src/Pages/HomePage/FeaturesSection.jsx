import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  useTheme,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { featurePageContent } from './data';

export function FeaturesSection() {
  const theme = useTheme();

  return (
    <Box
      id="features"
      sx={{
        py: 12,
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 384,
          height: 384,
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 384,
          height: 384,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          transform: 'translate(50%, 50%)',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            icon={<BarChartIcon />}
            label="Powerful Features"
            sx={{
              mb: 2,
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              color: 'primary.main',
              fontWeight: 600,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.5rem', lg: '3rem' },
              fontWeight: 'bold',
              mb: 3,
              color: 'text.primary',
            }}
          >
            {featurePageContent.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            {featurePageContent.description}
          </Typography>
        </Box>

        {/* Features Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 4, mb: 8 }}>
          {featurePageContent.featuresGrids.map((feature, index) => (
            <Box key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(139, 92, 246, 0.15)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        p: 2,
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <feature.icon sx={{ color: 'white', fontSize: '1.5rem' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {feature.title}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>

                  <Stack spacing={1}>
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <Box key={benefitIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            backgroundColor: 'primary.main',
                            borderRadius: '50%',
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
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
            mx: 'auto',
            p: 6,
            background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
            color: 'white',
            textAlign: 'center',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
            },
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            {featurePageContent.cta.title}
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4 }}>
            {featurePageContent.cta.description}
          </Typography>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderColor: 'white',
              color: 'white',
              py: 1.5,
              px: 4,
              fontSize: '1.125rem',
              '&:hover': {
                backgroundColor: theme.palette.background.paper,
                color: 'primary.main',
                transform: 'scale(1.05)',
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