import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
} from '@mui/material';
import {
  Star as StarIcon,
  FormatQuote as QuoteIcon,
} from '@mui/icons-material';
import TrustedPartners from './TrustedPartners';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Ajay Roy",
      role: "Owner, Rhythmix International",
      content: "Book & Manage has completely transformed how we operate. The automated scheduling saves us hours every week, and our members love the easy booking system.",
      rating: 5,
      image: "assets/rhythmix.png"
    },
    {
      name: "Krishna",
      role: "Owner, Studio7 GHY",
      content: "The payment processing is seamless and the financial reporting gives us insights we never had before. Our revenue has increased by 30% since implementation.",
      rating: 5,
      image: "assets/studio7.png"
    },
    {
      role: "Manager, Urban Beats",
      content: "Customer support is exceptional and the platform is incredibly user-friendly. Both our staff and members adapted to it immediately.",
      rating: 5,
      image: "assets/urban_beats.png"
    },
    {
      name: "Rajiv",
      role: "Owner, Gymnastics Terminal",
      content: "The member management features help us provide personalized experiences. Our retention rate has improved significantly since we started using Book & Manage.",
      rating: 5,
      image: "assets/gymnastics_terminal.jpg"
    }
  ];

  const stats = [
    { number: "50+", label: "Studios Trust Us" },
    { number: "10K+", label: "Active Members" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <Box
      id="testimonials"
      sx={{
        py: 12,
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 80,
          left: 40,
          width: 128,
          height: 128,
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(249, 115, 22, 0.3) 100%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 80,
          right: 40,
          width: 160,
          height: 160,
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            icon={<StarIcon />}
            label="Trusted by Studios"
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
            What Our Clients Say
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
            Don&apos;t just take our word for it. Here&apos;s what studio owners are saying about their experience with Book & Manage.
          </Typography>
        </Box>

        {/* Stats Row */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, 
          gap: 3, 
          mb: 8 
        }}>
          {stats.map((stat, index) => (
            <Card
              key={index}
              sx={{
                textAlign: 'center',
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 20px 40px rgba(139, 92, 246, 0.15)',
                },
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2.5rem', lg: '3rem' },
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {stat.number}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {stat.label}
              </Typography>
            </Card>
          ))}
        </Box>

        {/* Testimonials Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
          gap: 4, 
          mb: 8 
        }}>
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              sx={{
                p: 4,
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(139, 92, 246, 0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Rating
                  value={testimonial.rating}
                  readOnly
                  sx={{
                    mb: 2,
                    '& .MuiRating-iconFilled': {
                      color: '#fbbf24',
                    },
                  }}
                />
                
                <Box sx={{ position: 'relative', mb: 3 }}>
                  <QuoteIcon
                    sx={{
                      position: 'absolute',
                      top: -8,
                      left: -8,
                      fontSize: '2rem',
                      color: 'primary.main',
                      opacity: 0.2,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      pl: 3,
                      fontStyle: 'italic',
                    }}
                  >
                    &quot;{testimonial.content}&quot;
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={testimonial.image}
                    alt={testimonial.name}
                    sx={{
                      width: 48,
                      height: 48,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Trust Badges */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Trusted by leading studios worldwide
          </Typography>
          <TrustedPartners />
        </Box>
      </Container>
    </Box>
  );
}