import WidgetsOnPage from "../../Components/WidgetsOnPage";
import { useParams } from "react-router-dom";
import Clients from "./Client/Clients";
import Bookings from "./Booking/Bookings";
import Students from "./Student/Students";
import Instructors from "./Instructor/Instructors";
import Activities from "./Activity/Activities";
import StudentForm from "./Student/Form/StudentForm";
import Expenses from "./Expense/Expenses";
import Payments from "./Payments/Payments";
import Reports from "./Reports/Reports";
import Enquiry from "./Enquiry/Enquiry.jsx";
import BookingFormView from "./Booking/BookingFormView";
import Communication from "./Communication/Communication";
import Branches from "./Branches/Branches";
import BranchPage from "./Branches/BranchPage";
import BulkUploadJobs from "./BulkUploadJobs/BulkUploadJobs.jsx";
import TemplatesPage from "./TemplatesPage/TemplatesPage";
import MembershipType from "./MembershipType/MembershipType.jsx";

const Management = () => {
    const { page } = useParams();
    const { ID } = useParams();

    const renderComponent = () => {
        switch (page) {
            case "clients":
                return <Clients />;
            case "bookings":
                if (ID) return <BookingFormView ID={ID} page={page} />;
                return <Bookings />;
            case "student":
                if (ID) return <StudentForm ID={ID} page={page} />;
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
            case "branch":
                if (ID) return <BranchPage ID={ID} page={page} />;
                return <Branches />;
            default:
                return <h1>Not implemented yet !</h1>;
        }
    };

    return <WidgetsOnPage isSidebarShouldBeOn={true} components={<>{renderComponent()}</>} />;
};

export default Management;
