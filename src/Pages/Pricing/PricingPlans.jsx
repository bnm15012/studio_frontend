import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  useMediaQuery,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlexEvenly from "../../Components/FlexEvenly";
import FlexEvenlyColumn from "../../Components/FlexEvenlyColumn";
import { useDispatch, useSelector } from "react-redux";
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentDialog from "../RazorPay/Payment";
import { setPricingPlans } from "../../state/authSlice";

import Loading from "../../Components/Loading/Loading";

import { getAllPlans } from "./plans.api";
import { openDialog } from "../../state/dialogSlice";

const PricingPlans = () => {
  const dispatch = useDispatch();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [dialogPlanOpen, setPanDialogOpen] = useState(false);
  const isNonMobileScreens = useMediaQuery("(min-width: 660px)");
  const isNonMobileScreens2 = useMediaQuery("(min-width: 400px)");
  const [isLoading, setIsLoading] = useState(false);
  const [allPlans, setAllPlans] = useState(useSelector((state) => state.auth.pricingPlans));
  const user = useSelector((state) => state.auth.user);
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
    const { data, success } = await getAllPlans();
    if (success) {
      setAllPlans(data);
      dispatch(setPricingPlans({ pricingPlans: data }));
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    !allPlans && fetchPlans();
  }, [allPlans, fetchPlans]);

  return (
    <Box
      sx={{
        id: "pricing",
        py: 3,
        px: 1,
        textAlign: "center",
        backgroundColor: 'rgb(37,10,49)'
      }}
    >
      <Typography variant="body1" color="white">
        Choose a plan that fits your needs. All plans include a 7-day free
        trial.
      </Typography>

      <FlexEvenly flexWrap={"wrap"} gap={3} sx={{ mt: 4 }}>
        {isLoading && <Loading />}
        {allPlans !== undefined ? allPlans?.map((plan, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Paper
              elevation={4}
              onClick={() => {
                handlePayment(plan);
              }}
              sx={{
                cursor: "pointer",
                p: 2,
                background: [`linear-gradient(to bottom, #4fc3f7, #03a9f4)`, `linear-gradient(to bottom, #aed581, #8bc34a)`, `linear-gradient(to bottom, #ffb74d, #ff9800)`, `linear-gradient(to bottom, #ff8a65, #f4511e)`, `linear-gradient(to bottom, #7986cb, #3f51b5)`][index],
                borderRadius: 3,
                textAlign: "center",
                height: "20rem",
                width: isNonMobileScreens
                  ? "15rem"
                  : isNonMobileScreens2
                    ? "70vw"
                    : "11rem",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <FlexEvenlyColumn>
                <Typography variant="h5" color="primary" gutterBottom>
                  {plan.planType}
                </Typography>
                <Box display="flex">
                  <CheckCircleIcon sx={{ mr: 1, color: "green" }} />
                  <Typography variant="body2" color="textSecondary">
                    Rs. {plan.amount}
                  </Typography>
                </Box>
                <Box flexGrow={1} sx={{ mb: 3 }}>
                  {plan?.enabledFeatures?.map((feature, i) => (
                    <Box key={i} display="flex">
                      <CheckCircleIcon sx={{ mr: 1, color: "green" }} />
                      <Typography variant="body2" color="textSecondary">
                        {feature}
                      </Typography>
                    </Box>
                  ))}{plan?.disabledFeatures?.map((feature, i) => (
                    <Box key={i} display="flex">
                      <CancelIcon sx={{ mr: 1, color: "red" }} />
                      <Typography variant="body2" color="textSecondary">
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  subscribe now
                </Button>
              </FlexEvenlyColumn>
            </Paper>
          </Grid>
        )) : <Loading />}
      </FlexEvenly>

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

export default PricingPlans;
