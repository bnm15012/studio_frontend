import { useAppDispatch, useAppSelector } from "@/state";

import DialogContent from "@mui/material/DialogContent";
import { useEffect, useRef, useState } from "react";
import { getLocalDateTime } from "@/core/utils/DateUtil";
import TopProgressBar from "@/core/components/loading/TopProgressBar";
import { getAllTemplatesAPI } from "@/Pages/Management/TemplatesPage/Template.api";
import { useAlert } from "@/core/components/feedback/Alert";
import { replacePlaceholders } from "@/core/utils/globalFuns";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import { PrinterIcon } from "lucide-react";
import HtmlToPdfViewer, { HtmlToPdfViewerRef } from "@/core/components/Html2PDF/HtmlToPdfViewer";
import { useAppUI } from "@/context/UIContext";

const InstructorContract = ({
    open,
    onClose,
    activityData,
}: {
    open: boolean;
    onClose: () => void;
    activityData: Record<string, unknown>;
}) => {
    const dispatch = useAppDispatch();
    const showAlert = useAlert();
    const pdfViewerRef = useRef<HtmlToPdfViewerRef>(null);
    const [templates, setTemplates] = useState<Record<string, unknown>[]>([]);
    const { token, studio, currentBranch } = useAppUI();

    const [loading, setLoading] = useState(false);
    const [instructorData, setInstructorData] = useState<Record<string, unknown>>({});

    const tableState = useAppSelector((state) => state["instructors"]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setLoading(true);
                const res = await getAllTemplatesAPI({
                    studioId: studio.studioId!,
                    token,
                    templateType: "INSTRUCTOR_CONTRACT",
                });
                if (res.success) {
                    setTemplates(res.data || []);
                } else {
                    showAlert(res.message || "Failed to load templates", "error");
                }
            } catch {
                showAlert("Error loading templates", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, [dispatch, showAlert, studio, token]);

    useEffect(() => {
        if (instructorData)
            setInstructorData(tableState.recordById[activityData.instructorId as string] || {});
    }, [activityData.instructorId, instructorData, tableState.recordById]);

    useEffect(() => {
        if (templates.length && !selectedTemplateId) {
            const matchedTemplate = templates.find((t) =>
                String(t.templateType)
                    .toLowerCase()
                    .includes(String(activityData.activityName).toLowerCase()),
            );

            if (matchedTemplate) {
                setSelectedTemplateId(matchedTemplate.id as string);
            }
        }
    }, [templates, selectedTemplateId, activityData.activityName]);

    const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

    const preparedDescription = selectedTemplate
        ? replacePlaceholders(selectedTemplate.templateContent as string, {
              instructor: instructorData,
              instructorActivity: activityData,
              studio,
              branch: currentBranch,
              getLocalDateTime,
          })
        : "";

    return (
        <StyledDialog
            onConfirm={() => pdfViewerRef.current!.downloadPDF()}
            confirmText="Download"
            open={open}
            onClose={onClose}
            maxWidth="md"
            actions={[
                {
                    key: "print",
                    tip: "Print",
                    onClick: () => pdfViewerRef.current!.printPDF(),
                    component: <PrinterIcon />,
                },
            ]}
        >
            <DialogContent dividers sx={{ display: "flex", justifyContent: "center" }}>
                <TopProgressBar loading={loading} />
                <HtmlToPdfViewer
                    fileName={`Instructor-Contract-${String(instructorData.name)}.pdf`}
                    ref={pdfViewerRef}
                    studio={studio as { logo: string; studioName: string }}
                    header={
                        <p>
                            <p style={{ margin: 0, textWrap: "wrap" }}>{currentBranch.address}</p>
                            <p style={{ margin: 0 }}>
                                {currentBranch.city}, {currentBranch.state} {currentBranch.pincode}
                            </p>
                            <p style={{ margin: 0 }}>{currentBranch.phone}</p>
                            <p style={{ margin: 0 }}>{studio.email}</p>
                        </p>
                    }
                    content={
                        <>
                            {/* Personal Details */}
                            <p>Instructor Personal Details</p>
                            <table>
                                {[
                                    ["Name", String(instructorData.name ?? "")],
                                    ["Date of Birth", getLocalDateTime(String(instructorData.dob))],
                                    ["Email", String(instructorData.email ?? "")],
                                    ["Mobile", String(instructorData.phone ?? "")],
                                    [
                                        "Emergency Contact",
                                        String(instructorData.emergencyContactNumber ?? ""),
                                    ],
                                    ["Address", String(instructorData.address ?? "")],
                                ].map(([label, value], idx) => (
                                    <tr key={idx}>
                                        <td
                                            style={{
                                                padding: "6px 10px",
                                                textAlign: "left",
                                            }}
                                        >
                                            <strong>{label}:</strong> {String(value ?? "-")}
                                        </td>
                                    </tr>
                                ))}
                            </table>
                            {/* Terms and Conditions */}
                            <p style={{ fontWeight: "bolder" }}>Terms and Conditions</p>
                            <p style={{ marginTop: "5mm" }}>
                                {preparedDescription ? (
                                    <p>
                                        I confirm that the personal details provided above are true
                                        and accurate to the best of my knowledge.
                                    </p>
                                ) : (
                                    <p
                                        style={{
                                            color: "#EF4444",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            fontSize: "20px",
                                        }}
                                    >
                                        No Contract Template Created.
                                    </p>
                                )}
                            </p>

                            {/* Signature Section */}
                            <p
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "5mm",
                                }}
                            >
                                <p>
                                    <p>_________________________</p>
                                    <p>Instructor Name & Signature</p>
                                    <p>Date: ____________</p>
                                </p>
                                <p style={{ textAlign: "right" }}>
                                    <p>_________________________</p>
                                    <p>Authorized Studio Representative</p>
                                    <p>{studio.studioName}</p>
                                    <p>{currentBranch.name}</p>
                                </p>
                            </p>
                        </>
                    }
                />
            </DialogContent>
        </StyledDialog>
    );
};

export default InstructorContract;
