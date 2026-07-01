import { useAppDispatch, useAppSelector } from "@/state";
import PropTypes from "prop-types";
import DialogContent from "@mui/material/DialogContent";
import { useEffect, useRef, useState } from "react";
import { getLocalDateTime } from "@/core/utils/DateUtil";
import Loading from "@/core/components/loading/Loading";
import { getAllTemplatesAPI } from "../../TemplatesPage/Template.api";
import { useAlert } from "@/core/components/feedback/Alert";
import { replacePlaceholders } from "../../../../utils/globalFuns";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import { PrinterIcon } from "lucide-react";
import HtmlToPdfViewer from "@/core/components/Html2PDF/HtmlToPdfViewer";

const InstructorContract = ({ open, onClose, activityData }: { open: boolean, onClose: () => void, activityData: any }) => {
    const dispatch = useAppDispatch();
    const showAlert = useAlert();
    const pdfViewerRef = useRef<any>(null);
    const [templates, setTemplates] = useState<any[]>([]);
    const studio = useAppSelector((state) => state.auth.studio);
    const currentBranch = useAppSelector((state: any) => state.branch.currentBranch);
    const [loading, setLoading] = useState(false);
    const token = useAppSelector((state) => state.auth.token);
    const [instructorData, setInstructorData] = useState<any>({});

    const tableState = useAppSelector((state) => state["instructors"]);

    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setLoading(true);
                const res = await getAllTemplatesAPI({
                    studioId: studio!.studioId!,
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
    }, [dispatch, showAlert, studio!.studioId, token]);

    useEffect(() => {
        instructorData && setInstructorData(tableState.recordById[activityData.instructorId] || {});
    }, [activityData.instructorId, instructorData, tableState.recordById]);

    useEffect(() => {
        if (templates.length && !selectedTemplateId) {
            const matchedTemplate = templates.find((t) =>
                t.templateType?.toLowerCase().includes(activityData.activityName?.toLowerCase()),
            );

            if (matchedTemplate) {
                setSelectedTemplateId(matchedTemplate.id);
            }
        }
    }, [templates, selectedTemplateId, activityData.activityName]);

    const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

    const preparedDescription = selectedTemplate
        ? replacePlaceholders(selectedTemplate.templateContent, {
            instructor: instructorData,
            instructorActivity: activityData,
            studio,
            branch: currentBranch,
            getLocalDateTime,
        })
        : "";

    return (
        <StyledDialog
            onConfirm={() => pdfViewerRef.current.downloadPDF()}
            confirmText="Download"
            open={open}
            onClose={onClose}
            maxWidth="md"
            actions={[
                {
                    key: "print",
                    tip: "Print",
                    onClick: () => pdfViewerRef.current.printPDF(),
                    component: <PrinterIcon />,
                },
            ]}
        >
            <DialogContent dividers sx={{ display: "flex", justifyContent: "center" }}>
                {loading && <Loading />}
                <HtmlToPdfViewer
                    fileName={`Instructor-Contract-${instructorData.name}.pdf`}
                    ref={pdfViewerRef}
                    studio={studio as { logo: string; studioName: string }}
                    header={
                        <p>
                            <p style={{ margin: 0, textWrap: "wrap" }}>{currentBranch?.address}</p>
                            <p style={{ margin: 0 }}>
                                {currentBranch?.city}, {currentBranch?.state}{" "}
                                {currentBranch?.pincode}
                            </p>
                            <p style={{ margin: 0 }}>{currentBranch?.phone}</p>
                            <p style={{ margin: 0 }}>{studio?.email}</p>
                        </p>
                    }
                    content={
                        <>
                            {/* Personal Details */}
                            <p>Instructor Personal Details</p>
                            <table>
                                {[
                                    ["Name", instructorData?.name],
                                    ["Date of Birth", getLocalDateTime(instructorData?.dob)],
                                    ["Email", instructorData?.email],
                                    ["Mobile", instructorData?.phone],
                                    ["Emergency Contact", instructorData?.emergencyContactNumber],
                                    ["Address", instructorData?.address],
                                ].map(([label, value], idx) => (
                                    <tr key={idx}>
                                        <td
                                            style={{
                                                padding: "6px 10px",
                                                textAlign: "left",
                                            }}
                                        >
                                            <strong>{label}:</strong> {value || "-"}
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
                                            color: "red",
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
                                    <p>{studio?.studioName}</p>
                                    <p>{currentBranch?.name}</p>
                                </p>
                            </p>
                        </>
                    }
                />
            </DialogContent>
        </StyledDialog>
    );
};

InstructorContract.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    activityData: PropTypes.shape({
        activityName: PropTypes.string.isRequired,
        assignedDate: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string,
        instructorId: PropTypes.number.isRequired,
    }).isRequired,
};

export default InstructorContract;
