import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAlert } from "@/core/components/feedback/Alert";
import { studentsAssignmentsCruds } from "../../api/all.api";
import StudentInvoice from "../Management/Student/StudentInvoice";
import Loading from "@/core/components/loading/Loading";
import BookingInvoice from "../Management/Booking/BookingInvoice";

const InvoicePage: React.FC = () => {
    const { invoiceToken } = useParams<{ invoiceToken: string }>();
    const showAlert = useAlert();
    const [loading, setLoading] = useState(false);
    const [invoice, setInvoice] = useState<any>(null);

    useEffect(() => {
        if (invoiceToken) {
            fetchInvoice(invoiceToken);
        }
    }, [invoiceToken]);

    const fetchInvoice = async (token: string) => {
        const data = await (studentsAssignmentsCruds as any).fetchInvoiceApi(token, showAlert, setLoading);
        setInvoice(data);
    };

    return (
        <div>
            {!loading && invoice?.assignment ? (
                <StudentInvoice
                    open={true}
                    onClose={() => { }}
                    studentData={invoice?.student}
                    activityData={invoice.assignment}
                    studio={invoice?.studio}
                    currentBranch={invoice?.branch}
                />
            ) : invoice?.booking ? (
                <BookingInvoice
                    open={true}
                    onClose={() => { }}
                    bookingData={invoice?.booking}
                    studio={invoice?.studio}
                    currentBranch={invoice?.branch}
                    template={invoice?.template}
                />
            ) : (
                <Loading />
            )}
        </div>
    );
};

export default InvoicePage;
