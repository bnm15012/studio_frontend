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
import { useCallback, useEffect, useState } from "react";
import { getAllPlans } from "./plans.api";
// import { setPricingPlans } from '../../state/authSlice';
import { useDispatch, useSelector } from "react-redux";
import PaymentDialog from "../RazorPay/Payment";
import Loading from "../../Components/Loading/Loading";
import { openDialog } from "../../state/dialogSlice";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";

const PricingPlanCards = ({ buttonText = "Get Started", AMC = false }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [dialogPlanOpen, setPanDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [allPlans, setAllPlans] = useState(null); //useSelector((state) => state.auth.pricingPlans));
    const user = useSelector((state) => state.auth.user);

    const getFeatureIcon = (featureName) => {
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
    const handlePayment = async (plan) => {
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
            // dispatch(setPricingPlans({ pricingPlans: data }));
        }
        setIsLoading(false);
    }, [AMC]);
    useEffect(() => {
        !allPlans && fetchPlans();
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
                allPlans.map((plan, index) => (
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
                            {/* //crown */}
                            {plan.popular && (
                                <Chip
                                    icon={<Crown color="white" />}
                                    label=" Most Popular"
                                    sx={{
                                        position: "absolute",
                                        top: 5,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        background:
                                            "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
                                        color: "white",
                                        fontWeight: 600,
                                        px: 3,
                                    }}
                                />
                            )}

                            <CardHeader
                                sx={{ textAlign: "center", pb: 4 }}
                                title={
                                    <Box>
                                        {/* <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: plan.popular
                              ? 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'
                              : 'linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.02) 100%)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          {plan.popular ? <StarIcon /> : <FlashOn />}
                        </Box>
                      </Box> */}
                                        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                                            {plan?.planType?.replace("_", " ")}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "text.secondary", mb: 2 }}
                                        >
                                            {plan?.description}
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
                                                    color: "text.secondary",
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
                                    variant={!plan?.popular ? "outlined" : "contained"}
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

                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
                                    What&apos;s included:
                                </Typography>
                                <List sx={{ p: 0 }}>
                                    {plan?.enabledFeatures.map((feature, featureIndex) => {
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
                                                        backgroundColor: "rgba(16, 185, 129, 0.08)",
                                                    },
                                                }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 40 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                                                            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                                                        }}
                                                    >
                                                        {FeatureIcon ? (
                                                            <FeatureIcon size={18} color="white" />
                                                        ) : (
                                                            <CheckIcon sx={{ fontSize: "1.25rem", color: "white" }} />
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
                                                                color: "text.primary",
                                                            },
                                                        },
                                                    }}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                    {plan?.disabledFeatures.map((feature, featureIndex) => {
                                        const FeatureIcon = getFeatureIcon(feature);
                                        return (
                                            <ListItem
                                                key={featureIndex}
                                                sx={{
                                                    px: 0,
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    opacity: 0.6,
                                                }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 40 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            background: "rgba(185, 19, 16, 0.1)",
                                                            border: "1px solid rgba(185, 19, 16, 0.2)",
                                                        }}
                                                    >
                                                        {FeatureIcon ? (
                                                            <FeatureIcon size={18} color="#b91310ff" />
                                                        ) : (
                                                            <Close sx={{ fontSize: "1.25rem", color: "#b91310ff" }} />
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
                                                                color: "text.secondary",
                                                            },
                                                        },
                                                    }}
                                                />
                                            </ListItem>
                                        );
                                    })}
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
                    plan={selectedPlan}
                />
            )}
        </Box>
    );
};

PricingPlanCards.propTypes = {
    buttonText: PropTypes.string,
    AMC: PropTypes.bool,
};
export default PricingPlanCards;
