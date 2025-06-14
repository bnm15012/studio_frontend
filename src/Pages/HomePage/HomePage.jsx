import { useEffect } from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import WidgetsOnPage from "../../Components/WidgetsOnPage";
import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import ContentSection from "./ContentSection";
import FlexBetweenColumn from "../../Components/FlexBetweenColumn";
import PricingPlans from "../Pricing/PricingPlans";

const HomePage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

  return (
    <WidgetsOnPage
      footer={true}
      scrollable={false}
      components={
        <FlexBetweenColumn>
          <Carousel />
          <ContentSection />
          <Box id="pricing">
            <PricingPlans />
          </Box>
        </FlexBetweenColumn>
      }
    />
  );
};

export default HomePage;
