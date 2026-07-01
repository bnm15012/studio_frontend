import React from "react";
import { Box, Button, Card, CardContent, Typography, useTheme, keyframes } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

// Define animations
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
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
    const theme = useTheme();

    return (
        <Card
            sx={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                color: theme.palette.common.white,
                boxShadow: `0px 4px 10px ${color}`,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: { xs: "12rem", sm: "14rem" },
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                animation: `${slideUp} 0.6s ease-out ${delay}s`,
                animationFillMode: "backwards",
                "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.2)",
                    "& .icon-wrapper": {
                        transform: "scale(1.1) rotate(10deg)",
                    },
                    "& .card-content": {
                        transform: "scale(1.02)",
                    },
                },
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                        "radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 70%)",
                    pointerEvents: "none",
                },
            }}
        >
            <CardContent
                className="card-content"
                sx={{
                    display: "flex",
                    flexGrow: 1,
                    alignItems: "center",
                    width: "100%",
                    transition: "all 0.3s ease",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <Box sx={{ flexGrow: 1, pr: 2 }}>
                    <Typography
                        variant="h3"
                        className={blurValue ? "blur-value" : ""}
                        sx={{
                            fontSize: { xs: "2rem", sm: "2.5rem" },
                            fontWeight: 700,
                            mb: 1,
                            textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                            filter: blurValue ? "blur(10px)" : "none",
                            transition: "filter 0.3s ease",
                        }}
                    >
                        {typeof value === "number" ? value.toLocaleString() : value}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: { xs: "1rem", sm: "1.1rem" },
                            fontWeight: 500,
                            opacity: 0.9,
                            letterSpacing: 0.5,
                        }}
                    >
                        {label}
                    </Typography>
                </Box>
                <Box
                    className="icon-wrapper"
                    sx={{
                        transition: "all 0.3s ease",
                        opacity: 0.9,
                        animation: `${pulse} 2s ease-in-out infinite`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                    }}
                >
                    {icon}
                </Box>
            </CardContent>
            <Button
                onClick={onShowMore}
                sx={{
                    width: "100%",
                    py: 1.5,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    borderRadius: "0 0 12px 12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        "& .arrow-icon": {
                            transform: "translateX(4px)",
                        },
                    },
                }}
            >
                <Typography
                    variant="button"
                    sx={{
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "0.95rem",
                        mr: 1,
                    }}
                >
                    View Details
                </Typography>
                <ArrowCircleRightIcon
                    className="arrow-icon"
                    sx={{
                        transition: "transform 0.3s ease",
                        fontSize: "1.2rem",
                    }}
                />
            </Button>
        </Card>
    );
};

export default SummaryCard;
