import { Box } from "@mui/material";
import { useState } from "react";

const VIDEO_ID = "0dF1dLBjiCI";

const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: 8 + (i % 4) * 4,
    left: `${8 + ((i * 9) % 84)}%`,
    top: `${10 + ((i * 13) % 75)}%`,
    duration: `${8 + i}s`,
    delay: `${i * 0.4}s`,
}));

const DemoVideoSection = () => {
    const [playing, setPlaying] = useState(false);

    const handlePlay = () => {
        setPlaying(true);
    };

    return (
        <>
            <Box
                id="demo-video"
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    py: { xs: 8, md: 14 },
                    px: 2,
                    display: "flex",
                    justifyContent: "center",
                    background: `
                        radial-gradient(
                            circle at top left,
                            rgba(99,102,241,.08),
                            transparent 40%
                        ),
                        radial-gradient(
                            circle at bottom right,
                            rgba(236,72,153,.08),
                            transparent 45%
                        ),
                        linear-gradient(
                            180deg,
                            #fbfcff 0%,
                            #f5f7ff 100%
                        )
                    `,
                }}
            >
                {/* Background Grid */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.035,
                        backgroundImage: `
                            linear-gradient(
                                rgba(99,102,241,.5) 1px,
                                transparent 1px
                            ),
                            linear-gradient(
                                90deg,
                                rgba(99,102,241,.5) 1px,
                                transparent 1px
                            )
                        `,
                        backgroundSize: "42px 42px",
                        maskImage: "radial-gradient(circle at center, black 30%, transparent 90%)",
                        pointerEvents: "none",
                    }}
                />

                {/* Ambient Glow - Left */}
                <Box
                    sx={{
                        position: "absolute",
                        width: 500,
                        height: 500,
                        top: -150,
                        left: -180,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(99,102,241,.30), transparent 70%)",
                        filter: "blur(90px)",
                    }}
                />

                {/* Ambient Glow - Right */}
                <Box
                    sx={{
                        position: "absolute",
                        width: 450,
                        height: 450,
                        right: -150,
                        bottom: -120,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(236,72,153,.25), transparent 70%)",
                        filter: "blur(90px)",
                    }}
                />

                {/* Bottom Spotlight */}
                <Box
                    sx={{
                        position: "absolute",
                        left: "50%",
                        bottom: -60,
                        transform: "translateX(-50%)",
                        width: 700,
                        height: 220,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(59,130,246,.16), transparent 70%)",
                        filter: "blur(70px)",
                    }}
                />

                {/* Floating Particles */}
                {particles.map((particle) => (
                    <Box
                        key={particle.id}
                        sx={{
                            position: "absolute",
                            width: particle.size,
                            height: particle.size,
                            borderRadius: "50%",
                            background: "rgba(99,102,241,.08)",
                            filter: "blur(2px)",
                            left: particle.left,
                            top: particle.top,
                            animation: `float ${particle.duration} ease-in-out infinite`,
                            animationDelay: particle.delay,
                        }}
                    />
                ))}

                {/* Video Container */}
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        maxWidth: 1100,
                        borderRadius: 6,
                        p: "2px",
                        background: "linear-gradient(120deg,#6366f1,#8b5cf6,#06b6d4,#6366f1)",
                        backgroundSize: "250% 250%",
                        animation: "gradientMove 10s linear infinite",
                        boxShadow: "0 35px 90px rgba(99,102,241,.18), 0 10px 40px rgba(0,0,0,.08)",
                        transition: "all .35s ease",
                        zIndex: 2,

                        "&:hover": {
                            transform: "translateY(-6px) scale(1.01)",
                            boxShadow:
                                "0 45px 110px rgba(99,102,241,.28), 0 20px 60px rgba(0,0,0,.12)",
                        },

                        "&::before": {
                            content: '""',
                            position: "absolute",
                            inset: -40,
                            borderRadius: "inherit",
                            background:
                                "radial-gradient(circle, rgba(99,102,241,.22), transparent 70%)",
                            filter: "blur(60px)",
                            zIndex: -1,
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: 6,
                            bgcolor: "#000",
                            isolation: "isolate",
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                pt: "56.25%",
                            }}
                        >
                            {!playing ? (
                                /*
                                 * Thumbnail state
                                 *
                                 * No iframe exists yet.
                                 * This means Safari cannot accidentally
                                 * navigate through the YouTube player.
                                 */
                                <Box
                                    onClick={handlePlay}
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Play QRVerse demo"
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            handlePlay();
                                        }
                                    }}
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        cursor: "pointer",
                                        backgroundImage: `url(https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg)`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        "&::after": {
                                            content: '""',
                                            position: "absolute",
                                            inset: 0,
                                            background:
                                                "linear-gradient(to bottom, rgba(0,0,0,.05), rgba(0,0,0,.25))",
                                        },

                                        "&:hover .play-btn": {
                                            transform: "scale(1.12)",
                                            background: "rgba(99,102,241,0.95)",
                                        },

                                        "&:focus-visible .play-btn": {
                                            transform: "scale(1.12)",
                                            outline: "3px solid rgba(255,255,255,.9)",
                                            outlineOffset: 4,
                                        },
                                    }}
                                >
                                    {/* Play button */}
                                    <Box
                                        className="play-btn"
                                        sx={{
                                            position: "relative",
                                            zIndex: 1,
                                            width: 80,
                                            height: 80,
                                            borderRadius: "50%",
                                            background: "rgba(99,102,241,0.85)",
                                            backdropFilter: "blur(8px)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "transform .2s ease, background .2s ease",
                                            boxShadow: "0 8px 32px rgba(99,102,241,.5)",
                                        }}
                                    >
                                        <Box
                                            component="svg"
                                            viewBox="0 0 24 24"
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                fill: "#fff",
                                                ml: "4px",
                                            }}
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </Box>
                                    </Box>
                                </Box>
                            ) : (
                                <Box
                                    component="iframe"
                                    src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`}
                                    title="QRVerse Demo"
                                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                    allowFullScreen
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        border: 0,
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>

            <style>{`
                @keyframes gradientMove {
                    0% {
                        background-position: 0% 50%;
                    }

                    100% {
                        background-position: 200% 50%;
                    }
                }

                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px);
                        opacity: .3;
                    }

                    50% {
                        transform: translateY(-22px);
                        opacity: .9;
                    }
                }
            `}</style>
        </>
    );
};

export default DemoVideoSection;
