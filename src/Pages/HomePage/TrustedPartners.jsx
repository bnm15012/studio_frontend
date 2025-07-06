import { Box, Typography, Avatar } from '@mui/material';

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
                background: 'linear-gradient(180deg, rgb(37,10,49) 0%, rgb(58,17,78) 100%)',
                width: "100vw",
                overflow: 'hidden',
            }}
        >
            <Typography
                variant="h3"
                align="center"
                sx={{
                    color: '#ffffff',
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 700,
                    letterSpacing: 2,
                    mt:10,
                    mb: { xs: 4, md: 6 },
                    textShadow: '0 0 15px #9d4edd',
                    textTransform: 'uppercase',
                }}
            >
                Trusted Partners
            </Typography>

            <Box
                className="marquee"
                sx={{
                    height: '20rem',
                    width: '140rem',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <Box
                    className="marquee-track"
                    sx={{
                        display: 'flex',
                        position: 'absolute',
                        animation: 'marquee 30s linear infinite',
                    }}
                >
                    {/* render partners twice for seamless scroll */}
                    {[...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners].map((partner, index) => (
                        <Box
                            key={index}
                            sx={{
                                flex: '0 0 2rem',
                                mx: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    background:
                                        'linear-gradient(180deg, rgba(157,78,221,0.15) 0%, rgba(37,10,49,0.5) 100%)',
                                    borderRadius: 4,
                                    p: 3,
                                    textAlign: 'center',
                                    width: '30rem',
                                    height: '17rem',
                                    margin: 'auto',
                                    border: '2px solid transparent',
                                    backgroundClip: 'padding-box',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'transform 0.4s ease, box-shadow 0.4s ease, border 0.4s ease',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '-50%',
                                        left: '-50%',
                                        width: '200%',
                                        height: '200%',
                                        background:
                                            'conic-gradient(from 0deg, rgb(206, 170, 236), rgb(198, 178, 223), rgb(168, 125, 204), rgb(206, 170, 236))',
                                        animation: 'rotate 4s linear infinite',
                                        opacity: 0.3,
                                    },
                                    '&:hover': {
                                        transform: 'scale(1.08)',
                                        boxShadow: '0 0 30px rgba(157,78,221,0.8)',
                                        '&::before': {
                                            opacity: 0.6,
                                        },
                                    },
                                }}
                            >
                                <Box sx={{ zIndex: 1 }}>
                                    <Avatar
                                        src={partner.image}
                                        alt={partner.name}

                                        sx={{
                                            margin: "auto",
                                            width: 180,
                                            height: 180,
                                            border: '3px solid #9d4edd',
                                            borderRadius: '50%',
                                            // boxShadow:
                                            //     '0 0 25px rgba(157,78,221,0.7), inset 0 0 20px rgba(157,78,221,0.4)',
                                        }}
                                    />
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            color: '#fff',
                                            fontFamily: 'Orbitron, sans-serif',
                                            fontWeight: 500,
                                            textShadow: '0 0 8px #9d4edd',
                                            letterSpacing: 1,
                                        }}
                                    >
                                        {partner.name} 
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            <style>{`
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes marquee {
          0%   { left: 0; }
          100% { left: -100%; }
        }
      `}</style>
        </Box>
    );
};

export default TrustedPartners;
