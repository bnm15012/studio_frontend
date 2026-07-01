import { Box, Avatar, Container, alpha } from "@mui/material";

const partners = [
    {
        name: "Rhythmix International",
        image: "/assets/rhythmix.png",
    },
    {
        name: "Studio7 GHY",
        image: "/assets/studio7.png",
    },
    {
        name: "Gymnastics Terminal",
        image: "/assets/gymnastics_terminal.jpg",
    },
    {
        name: "Urban Beats",
        image: "/assets/urban_beats.png",
    },
    {
        name: "Fit Pro Gym",
        image: "/assets/fit_pro.png",
    },
    {
        name: "Majesty Dance Studio",
        image: "/assets/majesty.jpg",
    },
    {
        name: "Nritya Hop Dance Studio",
        image: "/assets/nritya.jpg",
    },
];

const TrustedPartners = () => (
    <>
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Box
                sx={{
                    position: "relative",
                    // height: { xs: 200, md: 300 },
                    overflow: "hidden",
                    "&::before, &::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        width: 100,
                        height: "100%",
                        zIndex: 2,
                        pointerEvents: "none",
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
                        display: "flex",
                        width: "400rem",
                        overflow: "hidden",
                        animation: "marquee 20s linear infinite",
                        "&:hover": {
                            animationPlayState: "paused",
                        },
                    }}
                >
                    {/* Duplicate partners for seamless scroll */}
                    {[
                        ...partners,
                        ...partners,
                        ...partners,
                        ...partners,
                        ...partners,
                        ...partners,
                    ].map((partner, index) => (
                        <Box
                            key={index}
                            sx={{
                                flex: "0 0 auto",
                                mx: 3,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                minWidth: { xs: 150, md: 200 },
                            }}
                        >
                            <Avatar
                                src={partner.image}
                                alt={partner.name}
                                sx={{
                                    width: { xs: 80, md: 180 },
                                    height: { xs: 80, md: 180 },
                                    border: `3px solid ${alpha("#fff", 0.3)}`,
                                    transition: "all 0.3s ease",
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Container>

        <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
);

export default TrustedPartners;
