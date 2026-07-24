import { useAppDispatch, useAppSelector } from "@/state";
import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Button,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    Avatar,
} from "@mui/material";
import { Crown, Users, CreditCard, Calendar, BarChart3, TrendingUp } from "lucide-react";
import { Check as CheckIcon, Close } from "@mui/icons-material";
import { getAllPlans } from "./plans.api";
import PaymentDialog from "@/Pages/RazorPay/Payment";
import Loading from "@/core/components/loading/Loading";
import { openDialog } from "../../state/dialogSlice";
import { alpha } from "@mui/material/styles";
import { PlanItem } from "@/Pages/RazorPay/Payment";

interface Plan {
    id: string | number;
    planType: string;
    description: string;
    amount: number;
    period: string;
    popular?: boolean;
    enabledFeatures: string[];
    disabledFeatures: string[];
}

interface PricingPlanCardsProps {
    buttonText?: string;
    AMC?: boolean;
}

const PricingPlanCards: React.FC<PricingPlanCardsProps> = ({
    buttonText = "Get Started",
    AMC = false,
}) => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [dialogPlanOpen, setPanDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [allPlans, setAllPlans] = useState<Plan[] | null>(null);
    const user = useAppSelector((state) => state.auth.user);
    const textColor = buttonText === "Get Started" ? "white" : "black";

    const getFeatureIcon = (featureName: string) => {
        const lowerName = featureName.toLowerCase();
        if (lowerName.includes("student")) return Users;
        if (lowerName.includes("payment")) return CreditCard;
        if (lowerName.includes("booking") || lowerName.includes("calendar")) return Calendar;
        if (lowerName.includes("statistics") || lowerName.includes("analysis")) return BarChart3;
        if (lowerName.includes("sales") || lowerName.includes("report")) return TrendingUp;
        return null;
    };

    const gradient = `linear-gradient(
      to left,
      ${alpha(theme.palette.primary.main, 0.3)},
      ${alpha(theme.palette.primary.main, 0.2)}
    )`;

    const gradient2 = `linear-gradient(
      to left,
      ${alpha(theme.palette.primary.main, 0.05)},
      ${alpha(theme.palette.primary.main, 0.1)}
    )`;

    const handlePayment = async (plan: Plan) => {
        if (!user) {
            dispatch(openDialog("loginDialog"));
        } else {
            setSelectedPlan(plan);
            setPanDialogOpen(true);
        }
    };

    const closePlansDialog = () => {
        setPanDialogOpen(false);
        setSelectedPlan(null);
    };

    const fetchPlans = useCallback(async () => {
        setIsLoading(true);
        const { data, success } = await getAllPlans({ AMC });
        if (success) {
            setAllPlans(data);
        }
        setIsLoading(false);
    }, [AMC]);

    useEffect(() => {
        if (!allPlans) {
            fetchPlans();
        }
    }, [allPlans, fetchPlans]);

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "repeat(auto-fit, minmax(15rem, 1fr))",
                    lg: "repeat(auto-fit, minmax(15rem, 1fr))",
                },
                gap: 4,
                mb: 8,
            }}
        >
            {isLoading && <Loading />}
            {allPlans &&
                allPlans.map((plan: Plan, index: number) => (
                    <Box key={index}>
                        <Card
                            sx={{
                                position: "relative",
                                height: "100%",
                                p: 4,
                                border: plan.popular ? "2px solid" : "2px solid",
                                borderColor: plan.popular ? "primary.main" : "rgba(0, 0, 0, 0.12)",
                                transition: "all 0.3s ease",
                                background: plan.popular ? gradient : gradient2,
                                backdropFilter: "blur(10px)",
                                transform: plan.popular ? "scale(1.05)" : "scale(1)",
                                "&:hover": {
                                    transform: plan.popular
                                        ? "scale(1.05) translateY(-8px)"
                                        : "translateY(-8px)",
                                    boxShadow: "0 20px 40px rgba(139, 92, 246, 0.15)",
                                    borderColor: "primary.main",
                                },
                            }}
                        >
                            {plan.popular && (
                                <Chip
                                    icon={<Crown color={textColor} />}
                                    label=" Most Popular"
                                    sx={{
                                        position: "absolute",
                                        top: 5,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        background:
                                            "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                                        color: textColor,
                                        fontWeight: 600,
                                        px: 3,
                                    }}
                                />
                            )}

                            <CardHeader
                                sx={{ textAlign: "center", pb: 4 }}
                                title={
                                    <Box>
                                        <Typography
                                            variant="h5"
                                            sx={{ fontWeight: "bold", mb: 1, color: textColor }}
                                        >
                                            {plan.planType.replace("_", " ")}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: textColor, mb: 2 }}
                                        >
                                            {plan.description}
                                        </Typography>
                                        <Box>
                                            <Typography
                                                variant="h3"
                                                sx={{
                                                    fontWeight: "bold",
                                                    background:
                                                        "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                                                    backgroundClip: "text",
                                                    WebkitBackgroundClip: "text",
                                                    color: "transparent",
                                                    display: "inline",
                                                }}
                                            >
                                                Rs. {plan.amount}/-
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: textColor,
                                                    display: "inline",
                                                    ml: 1,
                                                }}
                                            >
                                                {plan.period}
                                            </Typography>
                                        </Box>
                                    </Box>
                                }
                            />

                            <CardContent sx={{ pt: 0 }}>
                                <Button
                                    onClick={() => {
                                        handlePayment(plan);
                                    }}
                                    variant={!plan.popular ? "outlined" : "contained"}
                                    size="large"
                                    fullWidth
                                    sx={{
                                        mb: 4,
                                        py: 1.5,
                                        fontSize: "1.125rem",
                                        transition: "transform 0.3s ease",
                                        "&:hover": {
                                            transform: "scale(1.05)",
                                        },
                                    }}
                                >
                                    {buttonText}
                                </Button>

                                <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600, mb: 3, color: textColor }}
                                >
                                    What&apos;s included:
                                </Typography>
                                <List sx={{ p: 0 }}>
                                    {plan.enabledFeatures.map(
                                        (feature: string, featureIndex: number) => {
                                            const FeatureIcon = getFeatureIcon(feature);
                                            return (
                                                <ListItem
                                                    key={featureIndex}
                                                    sx={{
                                                        px: 0,
                                                        py: 1.5,
                                                        borderRadius: 2,
                                                        transition: "all 0.2s ease",
                                                        "&:hover": {
                                                            backgroundColor:
                                                                "rgba(16, 185, 129, 0.08)",
                                                        },
                                                    }}
                                                >
                                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                                        <Avatar
                                                            sx={{
                                                                width: 36,
                                                                height: 36,
                                                                background:
                                                                    "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                                                                boxShadow:
                                                                    "0 4px 12px rgba(16, 185, 129, 0.3)",
                                                            }}
                                                        >
                                                            {FeatureIcon ? (
                                                                <FeatureIcon
                                                                    size={18}
                                                                    color={textColor}
                                                                />
                                                            ) : (
                                                                <CheckIcon
                                                                    sx={{
                                                                        fontSize: "1.25rem",
                                                                        color: textColor,
                                                                    }}
                                                                />
                                                            )}
                                                        </Avatar>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={feature}
                                                        slotProps={{
                                                            primary: {
                                                                variant: "body1",
                                                                sx: {
                                                                    fontWeight: 500,
                                                                    color: textColor,
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </ListItem>
                                            );
                                        },
                                    )}
                                    {plan.disabledFeatures.map(
                                        (feature: string, featureIndex: number) => {
                                            const FeatureIcon = getFeatureIcon(feature);
                                            return (
                                                <ListItem
                                                    key={featureIndex}
                                                    sx={{
                                                        px: 0,
                                                        py: 1.5,
                                                        borderRadius: 2,
                                                        opacity: 0.85,
                                                    }}
                                                >
                                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                                        <Avatar
                                                            sx={{
                                                                width: 36,
                                                                height: 36,
                                                                background:
                                                                    "rgba(239, 68, 68, 0.2)",
                                                                border: "1px solid rgba(239, 68, 68, 0.4)",
                                                            }}
                                                        >
                                                            {FeatureIcon ? (
                                                                <FeatureIcon
                                                                    size={18}
                                                                    color="#EF4444"
                                                                />
                                                            ) : (
                                                                <Close
                                                                    sx={{
                                                                        fontSize: "1.25rem",
                                                                        color: "#EF4444",
                                                                    }}
                                                                />
                                                            )}
                                                        </Avatar>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={feature}
                                                        slotProps={{
                                                            primary: {
                                                                variant: "body1",
                                                                sx: {
                                                                    fontWeight: 500,
                                                                    color: textColor,
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </ListItem>
                                            );
                                        },
                                    )}
                                </List>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            {/* PaymentDialog */}
            {selectedPlan && (
                <PaymentDialog
                    open={dialogPlanOpen}
                    onClose={closePlansDialog}
                    plan={selectedPlan as unknown as PlanItem}
                />
            )}
        </Box>
    );
};

export default PricingPlanCards;
