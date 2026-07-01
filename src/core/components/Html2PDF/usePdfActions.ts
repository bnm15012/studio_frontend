// src/hooks/usePdfActions.ts
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAlert } from "../feedback/Alert";
import { sendMessageApi } from "../../../Pages/Management/Communication/communication.api";

interface UsePdfActionsProps {
    contentRef: React.RefObject<HTMLElement | null>;
    pdfOptions: any;
    fileName: string;
    remainingPayload?: any;
}

export const usePdfActions = ({
    contentRef,
    pdfOptions,
    fileName,
    remainingPayload = {},
}: UsePdfActionsProps) => {
    const token = useSelector((s: any) => s.auth.token);
    const studio = useSelector((s: any) => s.auth.studio);
    const currentBranch = useSelector((s: any) => s.branch.currentBranch);
    const showAlert = useAlert();
    const [loading, setLoading] = useState(false);

    // Helper function to get the html2pdf instance with common settings
    const getPdfInstance = () => {
        if (!contentRef.current) {
            throw new Error("Content ref is empty. Cannot generate PDF.");
        }
        return (window as any).html2pdf().set(pdfOptions).from(contentRef.current);
    };

    // New helper to temporarily reset scale before PDF generation
    const withTemporaryScaleReset = async <T>(pdfAction: () => Promise<T> | T): Promise<T | undefined> => {
        if (!contentRef.current) {
            showAlert("Content not available for PDF generation.", "error");
            return undefined;
        }

        const originalTransform = contentRef.current.style.transform;
        const originalTransformOrigin = contentRef.current.style.transformOrigin;

        try {
            // Reset scale to 1 for accurate PDF generation
            contentRef.current.style.transform = "scale(1)";
            contentRef.current.style.transformOrigin = "top left"; // Ensure origin is consistent

            return await pdfAction();
        } finally {
            // Restore original scale after PDF generation
            contentRef.current.style.transform = originalTransform;
            contentRef.current.style.transformOrigin = originalTransformOrigin;
        }
    };

    const createPdfBlob = async () =>
        await withTemporaryScaleReset(async () => getPdfInstance().outputPdf("blob"));

    const downloadPDF = async () => {
        setLoading(true);
        await withTemporaryScaleReset(async () => {
            try {
                await getPdfInstance().toPdf().save();
            } catch (error: any) {
                console.error(error);
                showAlert("Failed to download PDF", "error");
            } finally {
                setLoading(false);
            }
        });
    };

    const printPDF = async () => {
        setLoading(true);
        await withTemporaryScaleReset(async () => {
            try {
                await getPdfInstance()
                    .toPdf()
                    .get("pdf")
                    .then((pdf: any) => {
                        if (contentRef.current) {
                            contentRef.current.classList.remove("generating-pdf");
                        }
                        pdf.autoPrint();
                        window.open(pdf.output("bloburl"), "_blank");
                    });
            } catch (err) {
                console.error(err);
                showAlert("Failed to print PDF", "error");
            } finally {
                setLoading(false);
            }
        });
    };

    const sendFile = async ({ type, contentLabel }: { type: string; contentLabel: string }) => {
        setLoading(true);
        try {
            const pdfBlob = type === "WHATSAPP" ? null : await createPdfBlob();
            const payload = {
                branchId: currentBranch?.branchId,
                studioId: studio?.studioId,
                content: contentLabel,
                notificationType: type,
                ...remainingPayload,
            };

            showAlert(`Sending ${type}...`, "info");
            const { success, message } = await (sendMessageApi as any)({
                token,
                payload,
                file: pdfBlob ? new File([pdfBlob], `${fileName}.pdf`, { type: "application/pdf" }) : null,
            });

            showAlert(message || `${type} sent`, success ? "success" : "error");
        } catch (err) {
            console.error(err);
            showAlert(`Failed to send ${type}`, "error");
        } finally {
            setLoading(false);
        }
    };

    const redirectToWhatsApp = ({ phone, name, studioName, invoiceToken }: any) => {
        sendFile({ type: "WHATSAPP", contentLabel: "Invoice" });
        const invoiceUrl = `${window.location.origin}/#/invoice/${invoiceToken}`;
        const message = `Hello ${name},\n\nPlease find your invoice here: ${invoiceUrl} \n\nRegards, \n${studioName}`;
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    const sendMail = () => sendFile({ type: "EMAIL", contentLabel: "Invoice" });
    const sendWhatsApp = (payload: any) => redirectToWhatsApp(payload);

    return { loading, downloadPDF, printPDF, sendMail, sendWhatsApp };
};
