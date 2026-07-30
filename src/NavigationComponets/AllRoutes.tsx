import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AppUIProvider, NonAuthUIProvider } from "@/context/UIContext";
import { Box, CircularProgress } from "@mui/material";
import { useAppSelector } from "@/state";

import HomePage from "@/Pages/HomePage/HomePage";

const PageNotFound = lazy(() => import("@/Pages/Error/PageNotFound"));
const DashBoard = lazy(() => import("@/Pages/DashBoard/DashBoard"));
const Management = lazy(() => import("@/Pages/Management/Management"));
const Analysis = lazy(() => import("@/Pages/Analysis/Analysis"));
const ProfilePage = lazy(() => import("@/Pages/ProfilePage/ProfilePage"));

const AboutUsPage = lazy(() => import("@/Pages/AboutUs/AboutUsPage"));
const ContactUsPage = lazy(() => import("@/Pages/ContactUs/ContactUs"));
const PrivacyPolicyPage = lazy(() => import("@/Pages/PrivacyPolicy/PrivacyPolicyPage"));
const TermsConditionPage = lazy(() => import("@/Pages/TermsCondition/TermsConditionPage"));
const CancellationRefundPolicy = lazy(
    () => import("@/Pages/CancellationRefundPolicy/CancellationRefundPolicy"),
);
const FormFillPage = lazy(() => import("@/Pages/FormPage/FormFillPage"));
const InvoicePage = lazy(() => import("@/Pages/Invoice/InvoicePage"));

import LoginDialog from "@/Pages/Auth/LoginDialog";
import SignupDialog from "@/Pages/Auth/SignupDialog";
import ForgotPassword from "@/Pages/Auth/ForgotPassword";
import SubscriptionPopup from "@/Pages/Auth/SubscriptionPopup";
import HashRedirect from "@/NavigationComponets/HashRedirect";
import ServerErrorDialog from "@/core/components/dialogs/ServerErrorDialog";
import AuthTransitionOverlay from "@/core/components/loading/AuthTransitionOverlay";

export const AllRoutes = () => {
    const token = useAppSelector((state) => state.auth.token);
    const loading = useAppSelector((state) => state.auth.loading);

    return (
        <Suspense
            fallback={
                <Box
                    sx={{
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress size={32} thickness={3} />
                </Box>
            }
        >
            {loading ? (
                <AuthTransitionOverlay />
            ) : token ? (
                <AppUIProvider>
                    <Routes>
                        <Route path="/" element={<DashBoard />} />
                        <Route path="/dashboard" element={<DashBoard />} />
                        <Route path="/analysis" element={<Analysis />} />
                        <Route path="/management/:page" element={<Management />} />
                        <Route path="/management/:page/:ID" element={<Management />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>

                    <ProfilePage />
                    <SubscriptionPopup />
                    <ServerErrorDialog />
                </AppUIProvider>
            ) : (
                <NonAuthUIProvider>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/aboutus" element={<AboutUsPage />} />
                        <Route path="/contactus" element={<ContactUsPage />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                        <Route path="/terms-and-condition" element={<TermsConditionPage />} />
                        <Route
                            path="/cancellation-refund-policy"
                            element={<CancellationRefundPolicy />}
                        />
                        <Route path="/form/:formId/:branchId" element={<FormFillPage />} />
                        <Route path="/invoice/:invoiceToken" element={<InvoicePage />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>

                    <ForgotPassword />
                    <LoginDialog />
                    <SignupDialog />
                    <HashRedirect />
                    <ServerErrorDialog />
                </NonAuthUIProvider>
            )}
        </Suspense>
    );
};
