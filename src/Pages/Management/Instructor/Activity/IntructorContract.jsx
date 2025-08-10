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
import { DialogTitle, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { getAllTemplatesAPI } from '../../TemplatesPage/Template.api';
import { useAlert } from '../../../../utils/Alert';

const tableStyle = {
    width: '100%',
    marginBottom: '8mm',
};

const labelStyle = {
    fontWeight: 'bold',
    width: '40%',
    padding: '4px 8px',
    verticalAlign: 'top',
    borderBottom: '1px solid #eee',
};

const valueStyle = {
    padding: '4px 8px',
    borderBottom: '1px solid #eee',
};

const sectionTitle = {
    marginTop: '8mm',
    marginBottom: '3mm',
    borderBottom: '1px solid #ccc',
    paddingBottom: '2mm',
    fontSize: '14px',
};


// Helper to replace placeholders like {{instructorData.name}} with actual values
function replacePlaceholders(templateStr, dataMap) {
    if (!templateStr) return "";
    return templateStr.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
        // Support nested keys like instructorData.name
        const keys = key.split('.');
        let value = dataMap;
        for (let k of keys) {
            value = value?.[k];
            if (value === undefined || value === null) return "";
        }
        if (typeof value === 'string' && !isNaN(Date.parse(value))) {
            if (typeof dataMap.getLocalDateTime === 'function') {
                return dataMap.getLocalDateTime(value);
            }
        }
        return value;
    });
}

const InstructorContract = ({ open, onClose, instructorData, activityData }) => {
    const showAlert = useAlert();
    const [templates, setTemplates] = useState([]);
    const studio = useSelector((state) => state.auth.studio);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const [loading, setLoading] = useState(false);
    const invoiceRef = useRef();
    const token = useSelector((state) => state.auth.token);

    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await getAllTemplatesAPI({ branchId: currentBranch.branchId, token, templateType: "INSTRUCTOR_CONTRACT" });
                if (res.success) {
                    setTemplates(res.data || []);
                } else {
                    showAlert(res.message || "Failed to load templates", "error");
                }
            } catch {
                showAlert("Error loading templates", "error");
            }
        };
        fetchTemplates();
    }, [currentBranch.branchId, showAlert, token]);

    useEffect(() => {
        if (templates.length && !selectedTemplateId) {
            const matchedTemplate = templates.find(t =>
                t.templateType?.toLowerCase().includes(activityData.activityName?.toLowerCase())
            );

            if (matchedTemplate) {
                setSelectedTemplateId(matchedTemplate.id);
            } else {
                setSelectedTemplateId(templates[0].id);
            }
        }

    }, [templates, selectedTemplateId, activityData.activityName]);

    const handlePrintPDF = () => {
        setLoading(true);
        const element = invoiceRef.current;

        window.html2pdf()
            .set({
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 4, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            })
            .from(element)
            .toPdf()
            .get('pdf')
            .then((pdf) => {
                const blob = pdf.output('blob');
                const blobUrl = URL.createObjectURL(blob);

                const printWindow = window.open(blobUrl, '_blank');
                printWindow.onload = function () {
                    printWindow.focus();
                    printWindow.print();
                };
            });
        setLoading(false);
    };

    const handleDownloadPDF = () => {
        setLoading(true);
        const element = invoiceRef.current;
        window.html2pdf()
            .set({
                filename: `Invoice-${instructorData.name}.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 4, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            })
            .from(element)
            .save();
        setLoading(false);
    };

    const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

    const preparedDescription = selectedTemplate
        ? replacePlaceholders(selectedTemplate.templateContent, {
            instructorData,
            studio,
            currentBranch,
            activityData,
            getLocalDateTime
        })
        : "";

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Instructor Contract
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="template-select-label">Select Template</InputLabel>
                    <Select
                        labelId="template-select-label"
                        value={selectedTemplateId || ""}
                        label="Select Template"
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                    >
                        {templates.map((t) => (
                            <MenuItem key={t.id} value={t.id}>
                                {t.templateName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogTitle>
            <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center' }}>
                {loading && <Loading />}
                <div
                    ref={invoiceRef}
                    style={{
                        display: 'flex',
                        margin: '20px',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '12px',
                        color: '#000',
                        lineHeight: 1.6,
                        width: '100%',
                    }}
                >
                    <div>
                        {/* Header */}
                        <h2 style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '10px' }}>
                            INSTRUCTOR UNDERTAKING
                        </h2>

                        {/* Personal Details */}
                        <h3 style={sectionTitle}>Instructor Personal Details</h3>
                        <table style={tableStyle}>
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
                                        <td style={labelStyle}>{label}</td>
                                        <td style={valueStyle}>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Bank Details */}
                        <h3 style={sectionTitle}>Bank Account Details</h3>
                        <table style={tableStyle}>
                            <tbody>
                                {[
                                    ['Account Number', instructorData?.bankAccountDetails?.accountNumber],
                                    ['Bank Name', instructorData?.bankAccountDetails?.bankName],
                                    ['IFSC Code', instructorData?.bankAccountDetails?.ifscCode],
                                    ['Branch', instructorData?.bankAccountDetails?.branchName],
                                    ['UPI ID', instructorData?.bankAccountDetails?.upiId],
                                ].map(([label, value], idx) => (
                                    <tr key={idx}>
                                        <td style={labelStyle}>{label}</td>
                                        <td style={valueStyle}>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Terms and Conditions */}
                        <div style={sectionTitle}>
                            <h3>Terms and Conditions</h3>
                            {preparedDescription ? (
                                <Typography
                                    variant="body2"
                                    sx={{ textAlign: 'justify', whiteSpace: 'pre-wrap' }}
                                    dangerouslySetInnerHTML={{ __html: preparedDescription.replace(/\n/g, "<br />") }}
                                />
                            ) : (
                                <p>No template selected.</p>
                            )}
                        </div>

                        {/* Signature Section */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10mm' }}>
                            <div>
                                <p>_________________________</p>
                                <p>Instructor Signature</p>
                                <p>Date: ____________</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p>_________________________</p>
                                <p>Authorized Studio Representative</p>
                                <p>{studio?.studioName}</p>
                                <p>{currentBranch?.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ textAlign: 'center', fontSize: '11px', color: '#777' }}>
                        <hr style={{ marginBottom: '5px', border: '0.5px solid #ccc' }} />
                        <p>Powered by Book & Manage</p>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <FlexBetween width={"100%"} mx={2} gap={2}>
                    <FlexBetween gap={1}>
                        <Button onClick={handleDownloadPDF} variant="contained">Download</Button>
                        <Button onClick={handlePrintPDF} variant="contained">Print</Button>
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
        }).isRequired,
    }).isRequired,
    activityData: PropTypes.shape({
        activityName: PropTypes.string.isRequired,
        assignedDate: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string,
    }).isRequired,
};

export default InstructorContract;
