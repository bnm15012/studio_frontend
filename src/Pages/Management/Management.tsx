import React, { lazy, Suspense } from "react";
import WidgetsOnPage from "@/core/components/layout/WidgetsOnPage";
import { useParams, useLocation } from "react-router-dom";
import Loading from "@/core/components/loading/Loading";
const Clients = lazy(() => import("./Client/Clients"));
const Bookings = lazy(() => import("./Booking/Bookings"));
const Students = lazy(() => import("./Student/Students"));
const Instructors = lazy(() => import("./Instructor/Instructors"));
const Activities = lazy(() => import("./Activity/Activities"));
const Expenses = lazy(() => import("./Expense/Expenses"));
const Payments = lazy(() => import("./Payments/Payments"));
const Reports = lazy(() => import("./Reports/Reports"));
const Enquiry = lazy(() => import("./Enquiry/Enquiry"));
const Communication = lazy(() => import("./Communication/Communication"));
const Branches = lazy(() => import("./Branches/Branches"));
const BranchPage = lazy(() => import("./Branches/BranchPage"));
const BulkUploadJobs = lazy(() => import("./BulkUploadJobs/BulkUploadJobs"));
const TemplatesPage = lazy(() => import("./TemplatesPage/TemplatesPage"));
const MembershipType = lazy(() => import("./MembershipType/MembershipType"));
const Attendance = lazy(() => import("./Attendance/Attendance"));

const Management: React.FC = () => {
    const { page, ID: rawID } = useParams<{ page: string; ID?: string }>();
    const location = useLocation();
    /** Convert URL param to number. "NEW" → 0, digits → Number, absent → undefined */
    const ID = rawID !== undefined ? (rawID === "NEW" ? 0 : Number(rawID) || 0) : undefined;

    const renderComponent = () => {
        switch (page) {
            case "clients":
                return <Clients />;
            case "booking":
                if (ID) return <Bookings ID={ID} />;
                return <Bookings />;
            case "students":
                if (ID) return <Students ID={ID} />;
                return <Students />;
            case "instructors":
                if (ID) return <Instructors ID={ID} />;
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
            <Suspense key={location.pathname} fallback={<Loading />}>
                {renderComponent()}
            </Suspense>
        </WidgetsOnPage>
    );
};

export default Management;
