import React from "react";
import { Box, Card, Typography, keyframes, alpha } from "@mui/material";

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

const iconFloat = keyframes`
  0%,100% { transform: translateY(0px)   scale(1);    }
  50%      { transform: translateY(-5px) scale(1.07); }
`;

interface SummaryCardProps {
    color: string;
    value: string | number;
    label: string;
    icon?: React.ReactNode;
    onShowMore: () => void;
    delay?: number;
    blurValue?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
    color,
    value,
    label,
    icon,
    onShowMore,
    delay = 0,
    blurValue = false,
}) => {
    const displayValue = typeof value === "number" ? value.toLocaleString() : value;

    return (
        <Card
            onClick={onShowMore}
            sx={{
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                borderRadius: 3,
                background: `linear-gradient(145deg, ${color}ee 0%, ${color} 100%)`,
                boxShadow: `0 4px 24px ${alpha(color, 0.45)}, 0 1px 6px ${alpha(color, 0.25)}`,
                animation: `${slideUp} 0.55s cubic-bezier(.2,.9,.2,1) ${delay}s both`,
                transition: "transform 0.22s ease, box-shadow 0.22s ease",
                "&:hover": {
                    transform: "translateY(-6px) scale(1.025)",
                    boxShadow: `0 16px 40px ${alpha(color, 0.55)}, 0 2px 12px ${alpha(color, 0.3)}`,
                },
                "&:active": { transform: "translateY(-2px) scale(1.01)" },
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse at 85% 10%, rgba(255,255,255,0.25) 0%, transparent 60%)",
                    pointerEvents: "none",
                },
            }}
        >
            <Box
                sx={{
                    p: { xs: 1.75, sm: 2.25, md: 2.5 },
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1, sm: 1.25, md: 1.5 },
                    position: "relative",
                    zIndex: 1,
                    color: "white",
                }}
            >
                {/* Icon row */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Icon box — grows with breakpoint */}
                    <Box
                        sx={{
                            width: { xs: 42, sm: 56, md: 72 },
                            height: { xs: 42, sm: 56, md: 72 },
                            borderRadius: { xs: "12px", sm: "14px", md: "18px" },
                            background: "rgba(255,255,255,0.2)",
                            backdropFilter: "blur(6px)",
                            border: "1px solid rgba(255,255,255,0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            animation: `${iconFloat} 3s ease-in-out infinite`,
                            flexShrink: 0,
                            "& .MuiSvgIcon-root": {
                                fontSize: { xs: "1.4rem", sm: "1.85rem", md: "2.4rem" },
                                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
                            },
                        }}
                    >
                        {icon}
                    </Box>

                    {/* Arrow hint */}
                    <Box
                        sx={{
                            width: 7,
                            height: 7,
                            borderTop: "2px solid rgba(255,255,255,0.5)",
                            borderRight: "2px solid rgba(255,255,255,0.5)",
                            transform: "rotate(45deg)",
                            mt: 0.75,
                            flexShrink: 0,
                        }}
                    />
                </Box>

                {/* Value */}
                <Typography
                    sx={{
                        fontWeight: 800,
                        fontSize: { xs: "1.4rem", sm: "1.65rem", md: "2rem" },
                        lineHeight: 1,
                        letterSpacing: "-0.5px",
                        textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        filter: blurValue ? "blur(8px)" : "none",
                        transition: "filter 0.3s",
                    }}
                >
                    {displayValue}
                </Typography>

                {/* Label */}
                <Typography
                    sx={{
                        fontWeight: 600,
                        fontSize: { xs: "0.68rem", sm: "0.75rem", md: "0.8rem" },
                        opacity: 0.85,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        lineHeight: 1.3,
                    }}
                >
                    {label}
                </Typography>
            </Box>
        </Card>
    );
};

export default SummaryCard;
