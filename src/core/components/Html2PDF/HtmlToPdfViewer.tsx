/** Main PDF viewer/generator component: renders HTML content, paginates to A4, and exposes download/print/email/WhatsApp actions via ref. */
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ConfirmationDialog } from "@/core/components/Html2PDF/ConfirmationDialog";
import Loading from "@/core/components/loading/Loading";
import { usePdfActions, type WhatsAppPayload, type SendFilePayload } from "@/core/components/Html2PDF/usePdfActions";
import { paginate } from "@/core/components/Html2PDF/html2pdf.util";
import "./html2pdf.css";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const indianMobileRegex = /^[6-9]\d{9}$/;

interface HtmlToPdfViewerProps {
    content: React.ReactNode;
    header?: React.ReactNode;
    studio: { logo: string; studioName: string };
    fileName?: string;
    footer?: React.ReactNode;
    remainingPayload?: SendFilePayload;
    whatsAppPayload?: Partial<WhatsAppPayload>;
}

export interface HtmlToPdfViewerRef {
    downloadPDF: () => void | Promise<void>;
    printPDF: () => void | Promise<void>;
    sendMail: (email: string) => void;
    sendWhatsApp: (mobile: string) => void;
}

const HtmlToPdfViewer = forwardRef<HtmlToPdfViewerRef, HtmlToPdfViewerProps>(
    (
        {
            content,
            header,
            studio,
            fileName = "document",
            footer,
            remainingPayload = {},
            whatsAppPayload = {},
        },
        ref,
    ) => {
        const previewRef = useRef<HTMLDivElement>(null);
        const sourceRef = useRef<HTMLDivElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const [dialogOpen, setDialogOpen] = useState(false);
        const [dialogType, setDialogType] = useState("");
        const [inputValue, setInputValue] = useState("");
        const [inputError, setInputError] = useState("");

        const pdfOptions = {
            filename: `${fileName}.pdf`,
            margin: [0, 0, 0, 0],
            image: { type: "jpeg", quality: 0.95 },
            html2canvas: { scale: 3, useCORS: true },
            jsPDF: { unit: "mm", format: "a4" },
        };

        const { loading, downloadPDF, printPDF, sendMail, sendWhatsApp } = usePdfActions({
            contentRef: previewRef,
            pdfOptions,
            fileName,
            remainingPayload,
        });

        // Dialog functions
        const openDialog = (type: string, value: string) => {
            setDialogType(type);
            setInputValue(value);
            setInputError("");
            setDialogOpen(true);
        };

        const validateInput = (type: string, value: string) => {
            if (type === "email") return emailRegex.test(value) ? "" : "Invalid email address";
            if (type === "mobile")
                return indianMobileRegex.test(value) ? "" : "Invalid Indian mobile number";
            return "";
        };

        const handleDialogConfirm = async () => {
            const error = validateInput(dialogType, inputValue);
            setInputError(error);
            if (error) return;

            setDialogOpen(false);
            if (dialogType === "email") await sendMail();
            else if (dialogType === "mobile")
                sendWhatsApp({ phone: `+91${inputValue}`, ...whatsAppPayload });
        };

        useImperativeHandle(ref, () => ({
            downloadPDF,
            printPDF,
            sendMail: (email) => openDialog("email", email),
            sendWhatsApp: (mobile) => openDialog("mobile", mobile),
        }));

        useEffect(() => {
            setInputError(validateInput(dialogType, inputValue));
        }, [inputValue, dialogType, dialogOpen]);

        useEffect(() => {
            const previewElement = previewRef.current;
            const sourceElement = sourceRef.current;
            const containerElement = containerRef.current;

            if (!previewElement || !sourceElement || !containerElement) return;

            const footerElement = sourceElement.querySelector(".footer-wrapper");
            const footerHtml = footerElement ? footerElement.innerHTML : "";
            // First, paginate the content into the preview element
            paginate(previewElement, sourceElement);
            if (footerHtml) {
                const footerDiv = document.createElement("div");
                footerDiv.className = "pdf-footer";
                footerDiv.innerHTML = footerHtml;
                previewElement.appendChild(footerDiv);
            }
            // Then, adjust the scale of the preview to fit its container
            const adjustPreviewScale = () => {
                if (!previewElement.firstChild || !containerRef.current) return;

                // Reset previewElement inline styles first to get accurate natural dimensions
                previewElement.style.transform = "none";
                previewElement.style.transformOrigin = "top center";
                previewElement.style.width = "";
                previewElement.style.height = "";
                containerRef.current.style.height = "";

                const firstPage = previewElement.firstChild as HTMLElement;
                const contentNaturalWidth = firstPage.offsetWidth;
                const contentNaturalHeight = previewElement.scrollHeight;

                const containerWidth = containerRef.current.clientWidth;

                if (contentNaturalWidth > 0 && containerWidth > 0) {
                    let newScale = containerWidth / contentNaturalWidth;
                    if (newScale > 1) newScale = 1; // Max scale is 1

                    // Set standard size so we can transform from center
                    previewElement.style.width = `${contentNaturalWidth}px`;
                    previewElement.style.height = `${contentNaturalHeight}px`;

                    previewElement.style.transform = `scale(${newScale})`;
                    previewElement.style.transformOrigin = "top center";

                    // Dynamically set the height of the parent container to the scaled height
                    const scaledHeight = contentNaturalHeight * newScale;
                    containerRef.current.style.height = `${scaledHeight}px`;
                }
            };

            // Use a small delay to ensure DOM is updated after paginate has rendered content
            const timeoutId = setTimeout(adjustPreviewScale, 50);

            // Set up ResizeObserver to observe parent container size changes
            const resizeObserver = new ResizeObserver(() => {
                adjustPreviewScale();
            });
            resizeObserver.observe(containerElement);

            window.addEventListener("resize", adjustPreviewScale);
            return () => {
                clearTimeout(timeoutId);
                window.removeEventListener("resize", adjustPreviewScale);
                resizeObserver.disconnect();
            };
        }, [content, studio, footer]); // Include all external props in dependencies to re-run on change

        return (
            <>
                {loading && <Loading />}
                <div id="main" ref={sourceRef} style={{ display: "none" }}>
                    <div>
                        <div className="header-container">
                            <div className="left-section">
                                <img src={studio.logo} alt="Studio Logo" className="studio-logo" />

                                <h2 className="studio-name">{studio.studioName}</h2>
                            </div>

                            <div className="right-section">{header}</div>
                        </div>

                        <hr className="divider" />
                    </div>
                    {content}
                    <div className="footer-wrapper">
                        <div className="footer-flex">
                            <div className="footer-content">
                                <p className="footer-text">{footer}</p>

                                <p className="footer-powered">Powered by Book &amp; Manage</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="preview-container"
                    ref={containerRef}
                    style={{
                        width: "100%",
                        overflowX: "hidden",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                    }}
                >
                    <div id="preview" ref={previewRef}></div>
                </div>

                <ConfirmationDialog
                    type={dialogType}
                    value={inputValue}
                    error={inputError}
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onConfirm={handleDialogConfirm}
                    disabled={!inputValue || !!inputError}
                />
            </>
        );
    },
);

HtmlToPdfViewer.displayName = "HtmlToPdfViewer";

export default HtmlToPdfViewer;
