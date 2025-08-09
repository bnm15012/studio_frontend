import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import PageNotFound from "../Pages/Error/PageNotFound";
import HomePage from "../Pages/HomePage/HomePage";
import DashBoard from "../Pages/DashBoard/DashBoard";
import Management from "../Pages/Management/Management";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import ProfilePage from "../Pages/ProfilePage/ProfilePage";
import SignupDialog from "../Pages/Auth/SignupDialog";
import LoginDialog from "../Pages/Auth/LoginDialog";
import SubscriptionPopup from "../Pages/Auth/SubscriptionPopup";
import AboutUsPage from "../Pages/AboutUs/AboutUsPage";
import CancellationRefundPolicy from "../Pages/CancellationRefundPolicy/CancellationRefundPolicy";
import TermsConditionPage from "../Pages/TermsCondition/TermsConditionPage";
import PrivacyPolicyPage from "../Pages/PrivacyPolicy/PrivacyPolicyPage";
import Analysis from "../Pages/Analysis/Analysis";
import ContactUsPage from "../Pages/ContactUs/ContactUs";
import FormFillPage from "../Pages/FormPage/FormFillPage";

export const AllRoutes = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-and-condition" element={<TermsConditionPage />} />
        <Route path="/cancellation-refund-policy" element={<CancellationRefundPolicy />} />
        <Route path="/form/:formId" element={<FormFillPage />} />

        {user && (
          <>
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/management/:page" element={<Management />} />
            <Route path="/management/:page/:ID" element={<Management />} />
          </>
        )}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ForgotPassword />
      <ProfilePage />
      <LoginDialog />
      <SignupDialog />
      {user && <SubscriptionPopup />}
    </>
  );
};
