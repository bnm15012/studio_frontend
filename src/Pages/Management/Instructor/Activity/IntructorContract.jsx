import PropTypes from "prop-types";
import DialogContent from "@mui/material/DialogContent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getLocalDateTime } from "../../../../utils/DateUtil";
import Loading from "../../../../Components/Loading/Loading";
import { Typography } from "@mui/material";
import { getAllTemplatesAPI } from "../../TemplatesPage/Template.api";
import { useAlert } from "../../../../utils/Alert";
import { replacePlaceholders } from "../../../../utils/globalFuns";
import StyledDialog from "../../../../Components/New/StyledDialog";
import { PrinterIcon } from "lucide-react";
import HtmlToPdfViewer from "../../../../Components/New/Html2PDF/HtmlToPdfViewer";

const InstructorContract = ({ open, onClose, activityData }) => {
    const dispatch = useDispatch();
    const showAlert = useAlert();
    const pdfViewerRef = useRef();
    const [templates, setTemplates] = useState([]);
    const studio = useSelector((state) => state.auth.studio);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const [instructorData, setInstructorData] = useState({});

    const tableState = useSelector((state) => state["instructors"]);

    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setLoading(true);
                const res = await getAllTemplatesAPI({
                    studioId: studio.studioId,
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
    }, [dispatch, showAlert, studio.studioId, token]);

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
                    header={
                        <>
                            <p style={{ margin: 0, textWrap: "wrap" }}>{currentBranch?.address}</p>
                            <p style={{ margin: 0 }}>
                                {currentBranch?.city}, {currentBranch?.state}{" "}
                                {currentBranch?.pincode}
                            </p>
                            <p style={{ margin: 0 }}>{currentBranch?.phone}</p>
                            <p style={{ margin: 0 }}>{studio?.email}</p>
                        </>
                    }
                    content={
                        <>
                            {/* Personal Details */}
                            <h3>Instructor Personal Details</h3>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: "12px",
                                    marginTop: "10px",
                                }}
                            >
                                <tbody>
                                    {[
                                        ["Name", instructorData?.name],
                                        ["Date of Birth", getLocalDateTime(instructorData?.dob)],
                                        ["Email", instructorData?.email],
                                        ["Mobile", instructorData?.phone],
                                        [
                                            "Emergency Contact",
                                            instructorData?.emergencyContactNumber,
                                        ],
                                        ["Address", instructorData?.address],
                                    ].map(([label, value], idx) => (
                                        <tr key={idx}>
                                            <td
                                                style={{
                                                    padding: "6px 10px",
                                                    borderBottom: "1px solid #ddd",
                                                    textAlign: "left",
                                                }}
                                            >
                                                <strong>{label}:</strong> {value || "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Terms and Conditions */}
                            <div style={{ marginTop: "5mm" }}>
                                <Typography fontWeight={"bolder"}>Terms and Conditions</Typography>
                                {preparedDescription ? (
                                    <>
                                        <Typography
                                            variant="body2"
                                            sx={{ textAlign: "justify", whiteSpace: "pre-wrap" }}
                                            dangerouslySetInnerHTML={{
                                                __html: preparedDescription.replace(
                                                    /\n/g,
                                                    "<br />",
                                                ),
                                            }}
                                        />
                                        I confirm that the personal details provided above are true
                                        and accurate to the best of my knowledge.
                                    </>
                                ) : (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "red",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            fontSize: "20px",
                                        }}
                                    >
                                        No Contract Template Created.
                                    </Typography>
                                )}
                            </div>

                            {/* Signature Section */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "5mm",
                                }}
                            >
                                <div>
                                    <p>_________________________</p>
                                    <p>Instructor Name & Signature</p>
                                    <p>Date: ____________</p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p>_________________________</p>
                                    <p>Authorized Studio Representative</p>
                                    <p>{studio?.studioName}</p>
                                    <p>{currentBranch?.name}</p>
                                </div>
                            </div>
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
