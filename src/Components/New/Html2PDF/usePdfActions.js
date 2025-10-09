// src/hooks/usePdfActions.js
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAlert } from "../../../utils/Alert";
import { sendMessageApi } from "../../../Pages/Management/Communication/communication.api";

export const usePdfActions = ({ contentRef, pdfOptions, fileName, remainingPayload }) => {
    const token = useSelector((s) => s.auth.token);
    const studio = useSelector((s) => s.auth.studio);
    const currentBranch = useSelector((s) => s.branch.currentBranch);
    const showAlert = useAlert();
    const [loading, setLoading] = useState(false);

    const createPdfBlob = async () => {
        if (!contentRef.current) throw new Error("Content ref is empty");
        return await window.html2pdf().set(pdfOptions).from(contentRef.current).outputPdf("blob");
    };

    const downloadPDF = () => {
        if (!contentRef.current) return;
        window.html2pdf().set(pdfOptions).from(contentRef.current).save();
    };

    const printPDF = async () => {
        try {
            const blob = await createPdfBlob();
            const blobUrl = URL.createObjectURL(blob);
            const printWindow = window.open(blobUrl, "_blank");
            if (printWindow) printWindow.print();
            else showAlert("Popup blocked. Allow popups and try again.", "warning");
        } catch (err) {
            console.error(err);
            showAlert("Failed to print PDF", "error");
        }
    };

    const sendFile = async ({ type, contentLabel }) => {
        setLoading(true);
        try {
            const pdfBlob = await createPdfBlob();
            const payload = {
                branchId: currentBranch.branchId,
                studioId: studio.studioId,
                content: contentLabel,
                notificationType: type,
                ...remainingPayload,
            };

            showAlert(`Sending ${type}...`, "info");
            const { success, message } = await sendMessageApi({
                token,
                payload,
                file: new File([pdfBlob], `${fileName}.pdf`, { type: "application/pdf" }),
            });

            showAlert(message || `${type} sent`, success ? "success" : "error");
        } catch (err) {
            console.error(err);
            showAlert(`Failed to send ${type}`, "error");
        } finally {
            setLoading(false);
        }
    };

    const sendMail = () => sendFile({ type: "EMAIL", contentLabel: "Invoice" });
    const sendWhatsApp = () => sendFile({ type: "WHATSAPP", contentLabel: "Invoice" });

    return { loading, downloadPDF, printPDF, sendMail, sendWhatsApp };
};
