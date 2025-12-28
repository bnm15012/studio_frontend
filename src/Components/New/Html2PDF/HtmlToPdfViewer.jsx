import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ConfirmationDialog } from "./ConfirmationDialog";
import Loading from "../../Loading/Loading";
import { usePdfActions } from "./usePdfActions";
import { useSelector } from "react-redux";
import { paginate } from "./html2pdf.util";
import "./html2pdf.css";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const indianMobileRegex = /^[6-9]\d{9}$/;

const HtmlToPdfViewer = forwardRef(
    ({ content, header, fileName = "document", footer, remainingPayload = {} }, ref) => {
        const previewRef = useRef(null);
        const sourceRef = useRef(null);
        const studio = useSelector((s) => s.auth.studio);
        const [dialogOpen, setDialogOpen] = useState(false);
        const [dialogType, setDialogType] = useState("");
        const [inputValue, setInputValue] = useState("");
        const [inputError, setInputError] = useState("");

        const pdfOptions = {
            filename: `${fileName}.pdf`,
            margin: [0, 0, 0, 0],
            image: { type: "jpeg", quality: 0.01 },
            html2canvas: { scale: 5, useCORS: true },
            jsPDF: { unit: "mm", format: "a4" },
        };

        const { loading, downloadPDF, printPDF, sendMail, sendWhatsApp } = usePdfActions({
            contentRef: previewRef,
            pdfOptions,
            fileName,
            remainingPayload,
        });

        // Dialog functions
        const openDialog = (type, value) => {
            setDialogType(type);
            setInputValue(value);
            setInputError("");
            setDialogOpen(true);
        };

        const validateInput = (type, value) => {
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
            else if (dialogType === "mobile") await sendWhatsApp();
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
            paginate(previewRef.current, sourceRef.current);
        }, [content]);

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

                <div id="preview" ref={previewRef}></div>

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
HtmlToPdfViewer.propTypes = {
    content: PropTypes.node.isRequired,
    header: PropTypes.node,
    fileName: PropTypes.string,
    remainingPayload: PropTypes.object,
    footer: PropTypes.node,
};

export default HtmlToPdfViewer;
