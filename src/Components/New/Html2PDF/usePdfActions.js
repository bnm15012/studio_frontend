// src/hooks/usePdfActions.js
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAlert } from "../../../utils/Alert";
import { sendMessageApi } from "../../../Pages/Management/Communication/communication.api";

/**
 * Generates a jsPDF document by rendering each .pdf-page element individually.
 * This avoids the browser canvas size limit (~16384px) which causes all pages
 * to go blank when the entire tall preview is captured at once with html2pdf.
 *
 * Strategy:
 * 1. For each .pdf-page element, render it to a JPEG data URL via html2pdf.
 * 2. Assemble all images into a single jsPDF document (one image per page).
 *
 * @param {HTMLElement} contentEl - The preview container (previewRef.current)
 * @param {number} scale - html2canvas scale factor
 * @returns {Promise<jsPDF>} - Resolved jsPDF instance with all pages
 */
const generatePdfFromPages = async (contentEl, scale = 3) => {
    const pages = Array.from(contentEl.querySelectorAll(".pdf-page"));
    if (pages.length === 0) throw new Error("No .pdf-page elements found.");

    if (!window.html2pdf) {
        throw new Error("html2pdf is not available. Make sure html2pdf.js is loaded.");
    }

    const W_MM = 210;
    const H_MM = 297;

    const html2canvasOpts = {
        scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#ffffff",
    };

    const pdfOpts = {
        margin: [0, 0, 0, 0],
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: html2canvasOpts,
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    /**
     * Capture a single .pdf-page element as a JPEG data URL.
     * Strips decorative margin/shadow before capture and restores after.
     * Prefers window.html2canvas (exposed by html2pdf bundle) for simplicity;
     * falls back to html2pdf's own outputImg worker chain.
     */
    const captureDataUrl = async (pageEl) => {
        const prevMargin = pageEl.style.margin;
        const prevBoxShadow = pageEl.style.boxShadow;
        pageEl.style.margin = "0";
        pageEl.style.boxShadow = "none";
        try {
            if (window.html2canvas) {
                const canvas = await window.html2canvas(pageEl, html2canvasOpts);
                return canvas.toDataURL("image/jpeg", 0.95);
            }
            // Fallback via html2pdf worker — outputImg internally runs toImg/toCanvas
            return await window.html2pdf().set(pdfOpts).from(pageEl).outputImg("datauristring");
        } finally {
            pageEl.style.margin = prevMargin;
            pageEl.style.boxShadow = prevBoxShadow;
        }
    };

    // Step 1: Capture every page as a data URL (sequential to avoid DOM conflicts)
    const dataUrls = [];
    for (const pageEl of pages) {
        dataUrls.push(await captureDataUrl(pageEl));
    }

    // Step 2: Get a jsPDF instance that has ALL plugins (addImage, addPage, etc.)
    // from html2pdf's own toPdf chain. This is the ONLY reliable way to get
    // a plugin-equipped jsPDF when using html2pdf.bundle.min.js — window.jspdf.jsPDF
    // and window.jsPDF give a bare constructor without the image plugin.
    const dummyEl = document.createElement("div");
    dummyEl.style.cssText =
        "width:1px;height:1px;position:absolute;top:-9999px;left:-9999px;visibility:hidden;";
    document.body.appendChild(dummyEl);
    let basePdf;
    try {
        basePdf = await window
            .html2pdf()
            .set({ ...pdfOpts, html2canvas: { scale: 1, logging: false } })
            .from(dummyEl)
            .toPdf()
            .get("pdf");
    } finally {
        document.body.removeChild(dummyEl);
    }

    // Step 3: The dummy element produced one nearly-empty page in basePdf.
    // Overwrite page 1 with our first captured image (the 1×1px dummy content
    // is invisible under a full-A4 JPEG), then add the remaining pages.
    // NOTE: jsPDF v2 stores pages in a closure — there is no public API to
    //       delete pages, so we reuse page 1 and append the rest.
    basePdf.setPage(1);
    basePdf.addImage(dataUrls[0], "JPEG", 0, 0, W_MM, H_MM);

    for (let i = 1; i < dataUrls.length; i++) {
        basePdf.addPage("a4", "portrait");
        basePdf.addImage(dataUrls[i], "JPEG", 0, 0, W_MM, H_MM);
    }

    return basePdf;
};

export const usePdfActions = ({ contentRef, pdfOptions, fileName, remainingPayload }) => {
    const token = useSelector((s) => s.auth.token);
    const studio = useSelector((s) => s.auth.studio);
    const currentBranch = useSelector((s) => s.branch.currentBranch);
    const showAlert = useAlert();
    const [loading, setLoading] = useState(false);

    // Scale factor used for rendering (html2canvas scale)
    const CANVAS_SCALE = Number(pdfOptions?.html2canvas?.scale) || 3;

    /**
     * Temporarily resets the preview container's CSS transform so that
     * html2canvas captures elements at their true (scale:1) dimensions,
     * then restores the original transform afterwards.
     */
    const withTemporaryScaleReset = async (action) => {
        if (!contentRef.current) {
            showAlert("Content not available for PDF generation.", "error");
            return;
        }

        const el = contentRef.current;
        const origTransform = el.style.transform;
        const origTransformOrigin = el.style.transformOrigin;
        const origWidth = el.style.width;
        const origHeight = el.style.height;

        try {
            // Reset transform so pages render at their actual pixel size
            el.style.transform = "none";
            el.style.transformOrigin = "top left";
            // Width / height are set by the viewer; keep them so layout stays correct

            return await action(el);
        } finally {
            el.style.transform = origTransform;
            el.style.transformOrigin = origTransformOrigin;
            el.style.width = origWidth;
            el.style.height = origHeight;
        }
    };

    const createPdfBlob = async () =>
        withTemporaryScaleReset(async (el) => {
            const pdf = await generatePdfFromPages(el, CANVAS_SCALE);
            return pdf.output("blob");
        });

    const downloadPDF = async () => {
        setLoading(true);
        try {
            await withTemporaryScaleReset(async (el) => {
                const pdf = await generatePdfFromPages(el, CANVAS_SCALE);
                pdf.save(`${fileName}.pdf`);
            });
        } catch (error) {
            console.error(error);
            showAlert("Failed to download PDF", "error");
        } finally {
            setLoading(false);
        }
    };

    const printPDF = async () => {
        setLoading(true);
        try {
            await withTemporaryScaleReset(async (el) => {
                const pdf = await generatePdfFromPages(el, CANVAS_SCALE);
                pdf.autoPrint();
                window.open(pdf.output("bloburl"), "_blank");
            });
        } catch (err) {
            console.error(err);
            showAlert("Failed to print PDF", "error");
        } finally {
            setLoading(false);
        }
    };

    const sendFile = async ({ type, contentLabel }) => {
        setLoading(true);
        try {
            const pdfBlob = type === "WHATSAPP" ? null : await createPdfBlob();
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

    const redirectToWhatsApp = ({ phone, name, studioName, invoiceToken }) => {
        sendFile({ type: "WHATSAPP", contentLabel: "Invoice" });
        const invoiceUrl = `${window.location.origin}/#/invoice/${invoiceToken}`;
        const message = `Hello ${name},\n\nPlease find your invoice here: ${invoiceUrl}\n(Link will be expired in 30 days)\n\nRegards, \n${studioName}`;
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    const sendMail = () => sendFile({ type: "EMAIL", contentLabel: "Invoice" });
    const sendWhatsApp = (payload) => redirectToWhatsApp(payload);

    return { loading, downloadPDF, printPDF, sendMail, sendWhatsApp };
};
