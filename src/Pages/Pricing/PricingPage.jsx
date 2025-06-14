import WidgetsOnPage from "../../Components/WidgetsOnPage";
import PricingPlans from "./PricingPlans";

const PricingPage = () => {
  return (
    <WidgetsOnPage
      title={"Pricing"}
      components={
        <>
          <PricingPlans />
        </>
      }
    />
  );
};

export default PricingPage;
