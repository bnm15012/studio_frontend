import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAlert } from "@/core/components/feedback/Alert";
import { studentsAssignmentsCruds } from "../../api/all.api";
import StudentInvoice from "../Management/Student/StudentInvoice";
import Loading from "@/core/components/loading/Loading";
import BookingInvoice from "../Management/Booking/BookingInvoice";

interface InvoiceData {
    assignment?: Record<string, unknown>;
    student?: Record<string, unknown>;
    studio?: Record<string, unknown>;
    branch?: Record<string, unknown>;
    booking?: Record<string, unknown>;
    template?: Record<string, unknown>;
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
    const [invoice, setInvoice] = useState<InvoiceData | null>(null);

    useEffect(() => {
        if (invoiceToken) {
            fetchInvoice(invoiceToken);
        }
    }, [invoiceToken]);

    const fetchInvoice = async (token: string) => {
        const data = await (studentsAssignmentsCruds as unknown as StudentsAssignmentsCrudsExtended).fetchInvoiceApi(token, showAlert as (msg: string, type: string) => void, setLoading);
        setInvoice(data ?? null);
    };

    return (
        <div>
            {!loading && invoice?.assignment ? (
                <StudentInvoice
                    open={true}
                    onClose={() => { }}
                    studentData={invoice?.student ?? {}}
                    activityData={invoice.assignment ?? {}}
                    studio={invoice?.studio ?? {}}
                    currentBranch={invoice?.branch ?? {}}
                />
            ) : invoice?.booking ? (
                <BookingInvoice
                    open={true}
                    onClose={() => { }}
                    bookingData={invoice?.booking ?? {} as Record<string, unknown>}
                    studio={invoice?.studio ?? {} as Record<string, unknown>}
                    currentBranch={invoice?.branch as import("@/api/types").Branch}
                    template={invoice?.template ?? {}}
                />
            ) : (
                <Loading />
            )}
        </div>
    );
};

export default InvoicePage;
