import React, { lazy, Suspense } from "react";
import WidgetsOnPage from "@/core/components/layout/WidgetsOnPage";
import { useParams } from "react-router-dom";
import { Box, Skeleton } from "@mui/material";
const Clients = lazy(() => import("@/Pages/Management/Client/Clients"));
const Bookings = lazy(() => import("@/Pages/Management/Booking/Bookings"));
const Students = lazy(() => import("@/Pages/Management/Student/Students"));
const Instructors = lazy(() => import("@/Pages/Management/Instructor/Instructors"));
const Activities = lazy(() => import("@/Pages/Management/Activity/Activities"));
const Expenses = lazy(() => import("@/Pages/Management/Expense/Expenses"));
const Payments = lazy(() => import("@/Pages/Management/Payments/Payments"));
const Reports = lazy(() => import("@/Pages/Management/Reports/Reports"));
const Enquiry = lazy(() => import("@/Pages/Management/Enquiry/Enquiry"));
const Communication = lazy(() => import("@/Pages/Management/Communication/Communication"));
const Branches = lazy(() => import("@/Pages/Management/Branches/Branches"));
const BranchPage = lazy(() => import("@/Pages/Management/Branches/BranchPage"));
const BulkUploadJobs = lazy(() => import("@/Pages/Management/BulkUploadJobs/BulkUploadJobs"));
const TemplatesPage = lazy(() => import("@/Pages/Management/TemplatesPage/TemplatesPage"));
const MembershipType = lazy(() => import("@/Pages/Management/MembershipType/MembershipType"));
const Attendance = lazy(() => import("@/Pages/Management/Attendance/Attendance"));

const Management: React.FC = () => {
    const { page, ID: rawID } = useParams<{ page: string; ID?: string }>();
    /** Convert URL param to number. "NEW" → 0, digits → Number, absent → undefined */
    const ID =
        rawID !== undefined
            ? rawID === "0" || rawID.toLowerCase() === "new"
                ? 0
                : Number(rawID) || 0
            : undefined;

    const renderComponent = () => {
        switch (page) {
            case "clients":
                return <Clients />;
            case "booking":
                if (ID !== undefined) return <Bookings ID={ID} />;
                return <Bookings />;
            case "students":
                if (ID !== undefined) return <Students ID={ID} />;
                return <Students />;
            case "instructors":
                if (ID !== undefined) return <Instructors ID={ID} />;
                return <Instructors />;
            case "activity":
                return <Activities />;
            case "expenses":
                return <Expenses />;
            case "payments":
                return <Payments />;
            case "reports":
                return <Reports />;
            case "enquiry":
                return <Enquiry />;
            case "communication":
                return <Communication />;
            case "bulk_upload":
                return <BulkUploadJobs />;
            case "template":
                return <TemplatesPage />;
            case "type":
                return <MembershipType />;
            case "attendance":
                return <Attendance />;
            case "branch":
                if (ID) return <BranchPage />;
                return <Branches />;
            default:
                return <h1>Not implemented yet !</h1>;
        }
    };

    return (
        <WidgetsOnPage isSidebarShouldBeOn={true}>
            <Suspense
                fallback={
                    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
                    </Box>
                }
            >
                {renderComponent()}
            </Suspense>
        </WidgetsOnPage>
    );
};

export default Management;
