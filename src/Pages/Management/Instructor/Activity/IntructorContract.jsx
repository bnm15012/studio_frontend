import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { getLocalDateTime } from '../../../../utils/DateUtil';
import FlexBetween from '../../../../Components/FlexBetween';
import Loading from '../../../../Components/Loading/Loading';
import { Typography } from '@mui/material';
import { getAllTemplatesAPI } from '../../TemplatesPage/Template.api';
import { useAlert } from '../../../../utils/Alert';
import { replacePlaceholders } from '../../../../utils/globalFuns';
import HtmlToPdfViewer from '../../../../Components/Html2PDF';

const InstructorContract = ({ open, onClose, instructorData, activityData }) => {
    const showAlert = useAlert();
    const pdfViewerRef = useRef();
    const [templates, setTemplates] = useState([]);
    const studio = useSelector((state) => state.auth.studio);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.auth.token);

    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setLoading(true)
                const res = await getAllTemplatesAPI({
                    studioId: studio.studioId,
                    token,
                    templateType: "INSTRUCTOR_CONTRACT"
                });
                if (res.success) {
                    setTemplates(res.data || []);
                } else {
                    showAlert(res.message || "Failed to load templates", "error");
                }
            } catch {
                showAlert("Error loading templates", "error");
            } finally {
                setLoading(false)
            }
        };
        fetchTemplates();
    }, [showAlert, studio.studioId, token]);

    useEffect(() => {
        if (templates.length && !selectedTemplateId) {
            const matchedTemplate = templates.find(t =>
                t.templateType?.toLowerCase().includes(activityData.activityName?.toLowerCase())
            );

            if (matchedTemplate) {
                setSelectedTemplateId(matchedTemplate.id);
            }
        }
    }, [templates, selectedTemplateId, activityData.activityName]);

    const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

    const preparedDescription = selectedTemplate
        ? replacePlaceholders(selectedTemplate.templateContent, {
            instructor: { ...instructorData, ...activityData },
            studio,
            branch: currentBranch,
            getLocalDateTime
        })
        : "";

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center' }}>
                {loading && <Loading />}
                <HtmlToPdfViewer
                    fileName={`Instructor-Contract-${instructorData.name}.pdf`}
                    ref={pdfViewerRef}
                    header={
                        <>
                            <p style={{ margin: 0, textWrap: "wrap" }}>{currentBranch?.address}</p>
                            <p style={{ margin: 0 }}>{currentBranch?.city}, {currentBranch?.state} {currentBranch?.pincode}</p>
                            <p style={{ margin: 0 }}>{currentBranch?.phone}</p>
                            <p style={{ margin: 0 }}>{studio?.email}</p>
                        </>
                    }
                    content={
                        <>
                            {/* Personal Details */}
                            <h3>Instructor Personal Details</h3>
                            <table style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: "12px",
                                marginTop: "10px",
                            }}>
                                <tbody>
                                    {[
                                        ['Name', instructorData?.name],
                                        ['Date of Birth', getLocalDateTime(instructorData?.dob)],
                                        ['Email', instructorData?.email],
                                        ['Mobile', instructorData?.phone],
                                        ['Emergency Contact', instructorData?.emergencyContactNumber],
                                        ['Address', instructorData?.address],
                                    ].map(([label, value], idx) => (
                                        <tr key={idx}>
                                            <td style={{
                                                padding: "6px 10px",
                                                borderBottom: "1px solid #ddd",
                                                textAlign: "left"
                                            }}>
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
                                            sx={{ textAlign: 'justify', whiteSpace: 'pre-wrap' }}
                                            dangerouslySetInnerHTML={{ __html: preparedDescription.replace(/\n/g, "<br />") }}
                                        />

                                        I confirm that the personal details provided above are true and accurate to the best of my knowledge.
                                    </>
                                ) : (
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "red", fontWeight: 'bold', textAlign: 'center', fontSize: '20px' }}
                                    >
                                        No Contract Template Created.
                                    </Typography>
                                )}
                            </div>

                            {/* Signature Section */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5mm' }}>
                                <div>
                                    <p>_________________________</p>
                                    <p>Instructor Name & Signature</p>
                                    <p>Date: ____________</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
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
            <DialogActions>
                <FlexBetween width={"100%"} mx={2} gap={2}>
                    <FlexBetween gap={1}>
                        <Button onClick={() => pdfViewerRef.current.downloadPDF()} variant="contained">Download</Button>
                        <Button onClick={() => pdfViewerRef.current.printPDF()} variant="outlined">Print</Button>
                    </FlexBetween>
                    <Button onClick={onClose} variant='outlined' color="primary">Close</Button>
                </FlexBetween>
            </DialogActions>
        </Dialog>
    );
};

InstructorContract.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    instructorData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        dob: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
        emergencyContactNumber: PropTypes.string,
        address: PropTypes.string,
        bankAccountDetails: PropTypes.shape({
            accountNumber: PropTypes.string,
            bankName: PropTypes.string,
            branchName: PropTypes.string,
            ifscCode: PropTypes.string,
            upiId: PropTypes.string,
        }),
    }).isRequired,
    activityData: PropTypes.shape({
        activityName: PropTypes.string.isRequired,
        assignedDate: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string,
    }).isRequired,
};

export default InstructorContract;
