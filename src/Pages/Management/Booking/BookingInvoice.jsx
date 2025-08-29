import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useAlert } from '../../../utils/Alert';
import Loading from '../../../Components/Loading/Loading';
import { getLocalDateTime } from '../../../utils/DateUtil';
import FlexBetween from '../../../Components/FlexBetween';
import { getAllTemplatesAPI } from '../TemplatesPage/Template.api';
import { replacePlaceholders } from '../../../utils/globalFuns';
import { Typography } from '@mui/material';
import HtmlToPdfViewer from '../../../Components/Html2PDF';

const sectionTitle = {
    marginTop: '10mm',
    marginBottom: '3mm',
    paddingBottom: '2mm',
    fontSize: '14px',
};

const tableHeaderStyle = { textAlign: 'left', padding: '6px' };
const tableCellStyle = { padding: '6px' };

const BookingInvoice = ({ open, onClose, bookingData }) => {
    const pdfViewerRef = useRef();
    const studio = useSelector((state) => state.auth.studio);
    const token = useSelector((state) => state.auth.token);
    const showAlert = useAlert();
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setLoading(true)
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
            } finally {
                setLoading(false)
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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center' }}>
                {loading && <Loading />}
                <HtmlToPdfViewer
                    ref={pdfViewerRef}
                    fileName="booking-invoice"
                    remainingPayload={{
                        title: 'Booking Invoice',
                        templateName: 'BOOKING_INVOICE',
                        memberIds: [bookingData?.clientEntry?.clientId]
                    }}
                    footer={<p>Thank you for choosing {studio?.studioName}!</p>}
                    header={
                        <>
                            <div>
                                <FlexBetween flexDirection="row-reverse">
                                    {studio?.gstNumber && (
                                        <p style={{ margin: 0 }}>GSTIN: {studio.gstNumber}</p>
                                    )}
                                </FlexBetween>
                                <div>
                                    <div>
                                        <strong>Invoice #</strong>: INV-{bookingData?.id}
                                    </div>
                                    <div>
                                        <strong>Invoice Date</strong>:{' '}
                                        {getLocalDateTime(bookingData?.bookingDate)}
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    content={
                        <div>
                            {/* Invoice Info */}
                            <FlexBetween gap={1} my={2}>
                                <div>
                                    <p style={{ margin: 0, textWrap: "wrap" }}>{currentBranch?.address}</p>
                                    <p style={{ margin: 0 }}>{currentBranch?.city}, {currentBranch?.state} {currentBranch?.pincode}</p>
                                    <p style={{ margin: 0 }}>{currentBranch?.phone}</p>
                                    <p style={{ margin: 0 }}>{studio?.email}</p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <strong>Bill To</strong>:
                                    <div>{bookingData?.clientEntry?.pocName}</div>
                                    <div>{bookingData?.clientEntry?.pocPhone}</div>
                                    <div>{bookingData?.clientEntry?.pocEmail}</div>
                                </div>
                            </FlexBetween>

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
                        </div>} />
            </DialogContent>
            <DialogActions>
                <FlexBetween width={'100%'} mx={2} gap={2}>
                    <FlexBetween gap={1}>
                        <Button onClick={() => pdfViewerRef.current.downloadPDF()} variant="contained">
                            Download
                        </Button>
                        <Button onClick={() => pdfViewerRef.current.sendMail()} variant="outlined">
                            E-mail
                        </Button>
                        <Button onClick={() => pdfViewerRef.current.sendWhatsApp()} variant="outlined">
                            WhatsApp
                        </Button>
                        <Button onClick={() => pdfViewerRef.current.printPDF()} variant="outlined">
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
