import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useAlert } from "../../utils/Alert";
import { useState } from "react";
import { useEffect } from "react";
import { studentsAssignmentsCruds } from "../../api/all.api";
import StudentInvoice from "../Management/Student/StudentInvoice";
import Loading from "../../Components/Loading/Loading";


function InvoicePage() {
    const { invoiceToken } = useParams();
    const showAlert = useAlert()
    const [loading, setLoading] = useState(false)
    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        fetchInvoice(invoiceToken);
    }, [invoiceToken]);

    const fetchInvoice = async (invoiceToken) => {
        const invoice = await studentsAssignmentsCruds.fetchInvoiceApi(invoiceToken, showAlert, setLoading);
        setInvoice(invoice)
    }

    return (
        <div>
            {!loading ? (
                <StudentInvoice
                    open={true}
                    studentData={invoice?.student}
                    activityData={invoice?.assignment}
                    studio={invoice?.studio}
                    currentBranch={invoice?.branch}
                />) :
                <Loading />
            }
        </div>
    )
}

export default InvoicePage
