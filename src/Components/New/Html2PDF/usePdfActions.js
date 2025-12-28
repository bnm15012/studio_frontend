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
        setLoading(true);
        window.html2pdf().set(pdfOptions).from(contentRef.current).toPdf().save();
        setLoading(false);
    };

    const printPDF = async () => {
        try {
            if (!contentRef.current) throw new Error("Content ref is empty");
            window
                .html2pdf()
                .set(pdfOptions)
                .from(contentRef.current)
                .toPdf()
                .get("pdf")
                .then((pdf) => {
                    contentRef.current.classList.remove("generating-pdf");
                    pdf.autoPrint();
                    window.open(pdf.output("bloburl"), "_blank");
                });
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
