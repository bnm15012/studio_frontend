import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { getLocalDateTime } from '../../../../utils/DateUtil';
import FlexBetween from '../../../../Components/FlexBetween';
import Loading from '../../../../Components/Loading/Loading';

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

const termsListStyle = {
    paddingLeft: '18px',
    lineHeight: '1.6',
    marginTop: '5mm',
};


const InstructorContract = ({ open, onClose, instructorData, activityData }) => {
    const studio = useSelector((state) => state.auth.studio);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const [loading, setLoading] = useState(false)
    const invoiceRef = useRef();

    const handlePrintPDF = () => {
        setLoading(true)
        const element = invoiceRef.current;

        html2pdf()
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
        setLoading(false)
    };


    const handleDownloadPDF = () => {
        setLoading(true)
        const element = invoiceRef.current;
        html2pdf()
            .set({
                filename: `Invoice-${instructorData.name}.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 4, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            })
            .from(element)
            .save();
        setLoading(false)
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
                                    ['Date of Birth', instructorData?.dob],
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

                        {/* Terms */}
                        <h3 style={sectionTitle}>Terms and Conditions</h3>
                        <p style={{ textAlign: 'justify' }}>
                            I, <strong>{instructorData?.name}</strong>, hereby agree to serve as an Instructor at
                            <strong> {studio?.studioName}</strong> starting from <strong>{getLocalDateTime(activityData?.startDate)}</strong> until further notice. I understand and agree to the following terms and conditions:
                        </p>

                        <ol style={termsListStyle}>
                            <li>Conduct classes as per the assigned schedule with dedication and discipline.</li>
                            <li>Maintain professional behavior toward students, parents, and staff.</li>
                            <li>Comply with the studio’s curriculum, policies, and dress code.</li>
                            <li>Protect the confidentiality of student and studio-related information.</li>
                            <li>Receive payment as mutually agreed by both parties.</li>
                            <li>Allow either party to terminate this agreement with a 15-day written notice.</li>
                            <li>Acknowledge that any breach of the terms may result in immediate termination.</li>
                        </ol>

                        <p style={{ marginTop: '5mm' }}>
                            I confirm that the personal and bank details provided above are true and accurate to the best of my knowledge.
                        </p>

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
