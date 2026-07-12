import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAlert } from "@/core/components/feedback/Alert";
import { studentsAssignmentsCruds } from "../../api/all.api";
import StudentInvoice from "../Management/Student/StudentInvoice";
import Loading from "@/core/components/loading/Loading";
import BookingInvoice from "../Management/Booking/BookingInvoice";
import { Box } from "@mui/material";
import { Booking, Branch, GenericTemplate, Student, StudentAssignment, Studio } from "@/api/types";

interface InvoiceData {
    assignment: StudentAssignment;
    student: Student;
    studio: Studio;
    branch: Branch;
    booking: Booking;
    template: GenericTemplate;
}

interface StudentsAssignmentsCrudsExtended {
    fetchInvoiceApi: (
        invoiceToken: string,
        showAlert: (msg: string, type: string) => void,
        setLoading: (loading: boolean) => void,
    ) => Promise<InvoiceData | undefined>;
}

const InvoicePage: React.FC = () => {
    const { invoiceToken } = useParams<{ invoiceToken: string }>();
    const showAlert = useAlert();
    const [loading, setLoading] = useState(false);
    const [invoice, setInvoice] = useState<InvoiceData>();

    const fetchInvoice = useCallback(
        async (token: string) => {
            const data = await (
                studentsAssignmentsCruds as unknown as StudentsAssignmentsCrudsExtended
            ).fetchInvoiceApi(token, showAlert as (msg: string, type: string) => void, setLoading);
            setInvoice(data);
        },
        [showAlert],
    );

    useEffect(() => {
        if (invoiceToken) {
            fetchInvoice(invoiceToken);
        }
    }, [fetchInvoice, invoiceToken]);

    if (loading) {
        return <Loading />;
    }

    if (!invoice) {
        return <Box>No invoice found</Box>;
    }

    if (invoice.booking) {
        return (
            <BookingInvoice
                open={true}
                onClose={() => {}}
                bookingData={invoice?.booking}
                studio={invoice?.studio}
                currentBranch={invoice?.branch}
                template={invoice?.template}
            />
        );
    }

    return (
        <StudentInvoice
            open={true}
            onClose={() => {}}
            studentData={invoice.student}
            activityData={invoice.assignment}
            studio={invoice.studio}
            currentBranch={invoice.branch}
        />
    );
};

export default InvoicePage;
