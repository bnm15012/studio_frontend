import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Suspense, lazy } from "react";
import HomePage from "../Pages/HomePage/HomePage";
import Loading from "../Components/Loading/Loading";

const PageNotFound = lazy(() => import("../Pages/Error/PageNotFound"));
const DashBoard = lazy(() => import("../Pages/DashBoard/DashBoard"));
const Management = lazy(() => import("../Pages/Management/Management"));
const ProfilePage = lazy(() => import("../Pages/ProfilePage/ProfilePage"));
const AboutUsPage = lazy(() => import("../Pages/AboutUs/AboutUsPage"));
const CancellationRefundPolicy = lazy(
    () => import("../Pages/CancellationRefundPolicy/CancellationRefundPolicy"),
);
const TermsConditionPage = lazy(() => import("../Pages/TermsCondition/TermsConditionPage"));
const PrivacyPolicyPage = lazy(() => import("../Pages/PrivacyPolicy/PrivacyPolicyPage"));
const Analysis = lazy(() => import("../Pages/Analysis/Analysis"));
const ContactUsPage = lazy(() => import("../Pages/ContactUs/ContactUs"));
const FormFillPage = lazy(() => import("../Pages/FormPage/FormFillPage"));

import LoginDialog from "../Pages/Auth/LoginDialog";
import SignupDialog from "../Pages/Auth/SignupDialog";
import SubscriptionPopup from "../Pages/Auth/SubscriptionPopup";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import HashRedirect from "./HashRedirect";

export const AllRoutes = () => {
    const user = useSelector((state) => state.auth.user);

    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/aboutus" element={<AboutUsPage />} />
                <Route path="/contactus" element={<ContactUsPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-and-condition" element={<TermsConditionPage />} />
                <Route path="/cancellation-refund-policy" element={<CancellationRefundPolicy />} />
                <Route path="/form/:formId/:branchId" element={<FormFillPage />} />

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

            {/* Dialogs/Popups */}
            <ForgotPassword />
            <ProfilePage />
            <LoginDialog />
            <HashRedirect />
            <SignupDialog />
            {user && <SubscriptionPopup />}
        </Suspense>
    );
};
