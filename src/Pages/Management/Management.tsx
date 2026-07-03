import React from "react";
import WidgetsOnPage from "@/core/components/layout/WidgetsOnPage";
import { useParams } from "react-router-dom";
import Clients from "./Client/Clients";
import Bookings from "./Booking/Bookings";
import Students from "./Student/Students";
import Instructors from "./Instructor/Instructors";
import Activities from "./Activity/Activities";
import Expenses from "./Expense/Expenses";
import Payments from "./Payments/Payments";
import Reports from "./Reports/Reports";
import Enquiry from "./Enquiry/Enquiry";
import Communication from "./Communication/Communication";
import Branches from "./Branches/Branches";
import BranchPage from "./Branches/BranchPage";
import BulkUploadJobs from "./BulkUploadJobs/BulkUploadJobs";
import TemplatesPage from "./TemplatesPage/TemplatesPage";
import MembershipType from "./MembershipType/MembershipType";
import Attendance from "./Attendance/Attendance";

const Management: React.FC = () => {
    const { page, ID } = useParams<{ page: string; ID?: string }>();

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

    return <WidgetsOnPage isSidebarShouldBeOn={true} components={<>{renderComponent()}</>} />;
};

export default Management;
