import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useAlert } from '../../../utils/Alert';
import { generatePresignUrl } from '../../../api/s3.api';
import { sendMessageApi } from '../Communication/communication.api';
import Loading from '../../../Components/Loading/Loading';
import { getLocalDateTime } from '../../../utils/DateUtil';
import FlexBetween from '../../../Components/FlexBetween';
import { getAllTemplatesAPI } from '../TemplatesPage/Template.api';
import { replacePlaceholders } from '../../../utils/globalFuns';
import { Typography } from '@mui/material';

const sectionTitle = {
    marginTop: '8mm',
    marginBottom: '3mm',
    // borderBottom: '1px solid #ccc',
    paddingBottom: '2mm',
    fontSize: '14px',
};

const tableHeaderStyle = { textAlign: 'left', padding: '6px' };
const tableCellStyle = { padding: '6px' };

const BookingInvoice = ({ open, onClose, bookingData }) => {
    const studio = useSelector((state) => state.auth.studio);
    const token = useSelector((state) => state.auth.token);
    const showAlert = useAlert();
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const [loading, setLoading] = useState(false);
    const invoiceRef = useRef();
    const [templates, setTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await getAllTemplatesAPI({
                    studioId: studio.studioId,
                    token,
                    templateType: 'BOOKING',
                });
                if (res.success) {
                    setTemplates(res.data || []);
                } else {
                    showAlert(res.message || 'Failed to load templates', 'error');
                }
            } catch {
                showAlert('Error loading templates', 'error');
            }
        };
        if (open) fetchTemplates();
    }, [open, showAlert, studio.studioId, token]);

    useEffect(() => {
        if (templates.length && !selectedTemplateId) {
            const matchedTemplate = templates.find((t) =>
                t.templateType?.toLowerCase().includes('booking')
            );
            if (matchedTemplate) {
                setSelectedTemplateId(matchedTemplate.id);
            }
        }
    }, [templates, selectedTemplateId]);

    const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

    const preparedDescription = selectedTemplate
        ? replacePlaceholders(selectedTemplate.templateContent, {
            studio,
            branch: currentBranch,
            getLocalDateTime,
        })
        : '';

    const pdfOptions = {
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        // pagebreak: { mode: ['css', 'legacy'] },
    };

    const handlePrintPDF = () => {
        setLoading(true);
        const element = invoiceRef.current;
        window.html2pdf()
            .set(pdfOptions)
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
            })
            .finally(() => setLoading(false));
    };

    const handleSendMail = async () => {
        try {
            setLoading(true);
            const element = invoiceRef.current;
            const pdfBlob = await window.html2pdf()
                .set(pdfOptions)
                .from(element)
                .outputPdf('blob');

            const { data: s3Bucket, success } = await generatePresignUrl(
                `BookingInvoice-${bookingData.id}.pdf`,
                token
            );

            if (!success || !s3Bucket?.uploadUrl || !s3Bucket?.fileUrl) {
                showAlert('Failed to get upload URL', 'error');
                return;
            }
            showAlert('Preparing to upload invoice...', 'info');

            const uploadResponse = await fetch(s3Bucket.uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/pdf' },
                body: pdfBlob,
            });

            if (!uploadResponse.ok) {
                showAlert('Failed to upload invoice to S3', 'error');
                throw new Error('Upload to S3 failed');
            }
            showAlert('Invoice uploaded successfully', 'success');

            const payload = {
                branchId: currentBranch.branchId,
                notificationType: 'EMAIL',
                title: 'Booking Invoice',
                templateName: 'BOOKING_INVOICE',
                studioId: studio.studioId,
                invoiceUrl: s3Bucket.fileUrl,
                memberIds: [bookingData?.clientEntry?.clientId],
            };

            showAlert('Sending email...', 'info');
            const { success: emailSent, message } = await sendMessageApi({
                token,
                data: payload,
            });
            if (emailSent) {
                showAlert(message || 'Mail sent successfully', 'success');
            } else {
                showAlert('Failed to send email', 'error');
            }
        } catch (error) {
            console.error(error);
            showAlert('Something went wrong, please try again later', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        setLoading(true);
        const element = invoiceRef.current;
        window.html2pdf()
            .set({
                ...pdfOptions,
                filename: `BookingInvoice-${bookingData.id}.pdf`,
            })
            .from(element)
            .save()
            .finally(() => setLoading(false));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center' }}>
                {loading && <Loading />}
                <div
                    ref={invoiceRef}
                    style={{
                        fontSize: '12px',
                        width: '100%',
                        height: '297mm',
                        padding: '12mm',
                        color: '#000',
                        fontFamily: 'Arial, sans-serif',
                        backgroundColor: '#fff',
                        boxSizing: 'border-box',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            {/* Header */}
                            <div style={{ marginBottom: '2mm' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {studio?.logo && (
                                        <img
                                            src={studio.logo}
                                            alt="Studio Logo"
                                            style={{ width: '25mm', height: '25mm', marginRight: '4mm' }}
                                            crossOrigin="anonymous"
                                        />
                                    )}
                                    <h1 style={{ margin: 0 }}>{studio?.studioName}</h1>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div>
                                        <p style={{ margin: 0 }}>{currentBranch?.address}</p>
                                        <p style={{ margin: 0 }}>
                                            {currentBranch?.city}, {currentBranch?.state}{' '}
                                            {currentBranch?.pincode}
                                        </p>
                                        <p style={{ margin: 0 }}>{currentBranch?.phone}</p>
                                        <p style={{ margin: 0 }}>{studio?.email}</p>
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0 }}>Booking INVOICE</h2>
                                        <FlexBetween flexDirection="row-reverse">
                                            {studio?.gstNumber && (
                                                <p style={{ margin: 0 }}>GSTIN: {studio.gstNumber}</p>
                                            )}
                                        </FlexBetween>
                                    </div>
                                </div>
                            </div>
                            <hr />

                            {/* Invoice Info */}
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <p>
                                        <strong>Invoice #</strong>: INV-{bookingData?.id}
                                    </p>
                                    <p>
                                        <strong>Invoice Date</strong>:{' '}
                                        {getLocalDateTime(bookingData?.bookingDate)}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p>
                                        <strong>Bill To</strong>:
                                    </p>
                                    <p>{bookingData?.clientEntry?.pocName}</p>
                                    <p>{bookingData?.clientEntry?.pocPhone}</p>
                                    <p>{bookingData?.clientEntry?.pocEmail}</p>
                                </div>
                            </div>

                            {/* Booking Table */}
                            <table
                                border={1}
                                style={{ width: '100%', borderCollapse: 'collapse' }}
                            >
                                <thead>
                                    <tr>
                                        <th style={tableHeaderStyle}>Purpose</th>
                                        <th style={tableHeaderStyle}>Start Time</th>
                                        <th style={tableHeaderStyle}>End Time</th>
                                        <th style={tableHeaderStyle}>Amount</th>
                                        <th style={tableHeaderStyle}>Advance</th>
                                        <th style={tableHeaderStyle}>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={tableCellStyle}>{bookingData?.purpose}</td>
                                        <td style={tableCellStyle}>
                                            {getLocalDateTime(bookingData?.startTime, 'DATETIME')}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {getLocalDateTime(bookingData?.endTime, 'DATETIME')}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {bookingData?.totalAmount?.toFixed(2)}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {bookingData?.advanceAmount?.toFixed(2)}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {bookingData?.balanceAmount?.toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Payment Status */}
                            <div style={{ marginTop: '10px' }}>
                                <p>
                                    <strong>Payment Status:</strong> {bookingData?.paymentStatus}
                                </p>
                                <p>
                                    <strong>Payment Mode:</strong> {bookingData?.paymentMode}
                                </p>
                            </div>

                            {/* Notes
                            {bookingData?.notes && (
                                <p>
                                    <strong>Notes:</strong> {bookingData.notes}
                                </p>
                            )} */}


                            {/* Terms & Conditions */}
                            <div style={sectionTitle}>
                                <h3>Terms and Conditions</h3>
                                {preparedDescription ? (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            textAlign: 'justify',
                                            whiteSpace: 'pre-wrap',
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: preparedDescription.replace(/\n/g, '<br />'),
                                        }}
                                    />
                                ) : (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'red',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            fontSize: '20px',
                                        }}
                                    >
                                        No Contract Template Created.
                                    </Typography>
                                )}
                            </div>
                        </div>
                        {/* Footer */}

                        <div
                            style={{
                                textAlign: 'center',
                                marginTop: '10mm',
                                fontSize: '10px',
                                color: '#555',
                            }}
                        >
                            <p>Thank you for choosing {studio?.studioName}!</p>
                            <p>Powered by Book & Manage</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <FlexBetween width={'100%'} mx={2} gap={2}>
                    <FlexBetween gap={1}>
                        <Button onClick={handleDownloadPDF} variant="contained">
                            Download
                        </Button>
                        <Button onClick={handleSendMail} variant="contained">
                            E-mail
                        </Button>
                        <Button onClick={handlePrintPDF} variant="contained">
                            Print
                        </Button>
                    </FlexBetween>
                    <Button onClick={onClose} variant="outlined" color="primary">
                        Close
                    </Button>
                </FlexBetween>
            </DialogActions>
        </Dialog>
    );
};

BookingInvoice.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    bookingData: PropTypes.shape({
        id: PropTypes.number.isRequired,
        branchId: PropTypes.number.isRequired,
        purpose: PropTypes.string.isRequired,
        totalAmount: PropTypes.number.isRequired,
        paymentStatus: PropTypes.string.isRequired,
        advanceAmount: PropTypes.number,
        balanceAmount: PropTypes.number,
        bookingDate: PropTypes.string,
        startTime: PropTypes.string,
        endTime: PropTypes.string,
        advanceDate: PropTypes.string,
        advanceMode: PropTypes.string,
        paymentMode: PropTypes.string,
        notes: PropTypes.string,
        clientEntry: PropTypes.shape({
            clientId: PropTypes.number,
            pocName: PropTypes.string,
            pocPhone: PropTypes.string,
            pocEmail: PropTypes.string,
            groupName: PropTypes.string,
            clientType: PropTypes.string,
        }),
    }).isRequired,
};

export default BookingInvoice;
