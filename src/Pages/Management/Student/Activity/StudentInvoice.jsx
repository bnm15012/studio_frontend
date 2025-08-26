import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import { getLocalDateTime } from '../../../../utils/DateUtil';
import FlexBetween from '../../../../Components/FlexBetween';
import { useAlert } from '../../../../utils/Alert';
import Loading from '../../../../Components/Loading/Loading';
import { generatePresignUrl } from '../../../../api/s3.api';
import { sendMessageApi } from '../../Communication/communication.api';
import { useUI } from '../../../../context/UIContext';
import HtmlToPdfViewer from '../../../../Components/Html2PDF';

const StudentInvoice = ({ open, onClose, studentData, activityData }) => {
  const pdfViewerRef = useRef();
  const { isBatchEnabled } = useUI();
  const studio = useSelector((state) => state.auth.studio);
  const token = useSelector((state) => state.auth.token);
  const showAlert = useAlert()
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const [loading, setLoading] = useState(false)
  const invoiceRef = useRef();

  const handleSendMail = async () => {
    try {
      setLoading(true);

      const element = invoiceRef.current;
      const pdfBlob = await window.html2pdf()
        .set({
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: [148, 210], orientation: 'portrait' }
        })
        .from(element)
        .outputPdf('blob');

      const { data: s3Bucket, success } = await generatePresignUrl(`Invoice-${studentData.name}.pdf`, token);

      if (!success || !s3Bucket?.uploadUrl || !s3Bucket?.fileUrl) {
        showAlert("Failed to get upload URL", "error");
        return;
      } else {
        showAlert("Preparing to upload invoice...", "info");
      }

      const uploadResponse = await fetch(s3Bucket.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/pdf'
        },
        body: pdfBlob
      });

      if (!uploadResponse.ok) {
        showAlert("Failed to upload invoice to S3", "error");
        throw new Error('Upload to S3 failed');
      } else {
        showAlert("Invoice uploaded successfully", "success");
      }

      const payload = {
        branchId: currentBranch.branchId,
        notificationType: "EMAIL",
        title: "Invoice",
        templateName: "MEMBERSHIP_INVOICE",
        studioId: studio.studioId,
        invoiceUrl: s3Bucket.fileUrl,
        activityType: activityData?.activityName,
        memberIds: [studentData.studentId],
      };

      showAlert("Sending email...", "info");

      const { success: emailSent, message } = await sendMessageApi({ token, data: payload });

      if (emailSent) {
        showAlert(message || "Mail sent successfully", "success");
      } else {
        showAlert("Failed to send email", "error");
      }

    } catch (error) {
      console.error(error);
      showAlert("Something went wrong, please try again later", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogContent sx={{ display: 'flex', justifyContent: 'center'}}>
        {loading && <Loading />}
        <HtmlToPdfViewer
          ref={pdfViewerRef}
          footer={<p>Thank you for choosing {studio?.studioName}!</p>}
          header={
            <>
              <div>
                <h1>
                  INVOICE
                </h1>
                {studio?.gstNumber && <p style={{ margin: 0 }}>GSTIN: {studio.gstNumber}</p>}
              </div>
            </>
          }
          content={
            <div style={{ display: "flex", height: "100%", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                {/* Invoice Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2mm' }}>
                  <div>
                    <p><strong>Invoice #</strong>: INV-{activityData?.paymentEntry?.invoiceId || Math.floor(1000 + Math.random() * 9000)}</p>
                    <p><strong>Invoice Date</strong>: {getLocalDateTime(activityData?.registrationDate) || '-'}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p><strong>Bill To</strong>:</p>
                    <p>{studentData?.name}</p>
                    <p>{studentData?.phone}</p>
                    <p>{studentData?.email}</p>
                  </div>
                </div>
                {/* Table */}
                <table border={1} style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2mm' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Activity</th>
                      <th style={tableHeaderStyle}>Plan</th>
                      <th style={tableHeaderStyle}>Start Date</th>
                      <th style={tableHeaderStyle}>End Date</th>
                      {!isBatchEnabled && <th style={tableHeaderStyle}>Days Per Week</th>}
                      <th style={tableHeaderStyle}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tableCellStyle}>{activityData?.activityName}</td>
                      <td style={tableCellStyle}>{activityData?.membershipType}</td>
                      <td style={tableCellStyle}>{getLocalDateTime(activityData?.membershipStartDate)}</td>
                      <td style={tableCellStyle}>{getLocalDateTime(activityData?.membershipEndDate)}</td>
                      {!isBatchEnabled && <td style={tableCellStyle}>{activityData?.daysPerWeek || '-'}</td>}
                      <td style={tableCellStyle}>{activityData?.activityAmount?.toFixed(2) || '0.00'}</td>
                    </tr>
                  </tbody>
                </table>
                {isBatchEnabled && <>
                  Batch details:
                  <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={tableHeaderStyle}>Batch Name</th>
                        <th style={tableHeaderStyle}>Days Per Week</th>
                        <th style={tableHeaderStyle}>Batch Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={tableCellStyle}>{activityData?.batchName || '-'}</td>
                        <td style={tableCellStyle}>{activityData?.daysPerWeek || '-'}</td>
                        <td style={tableCellStyle}>{activityData?.batchTime || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </>
                }

                {/* Subtotal & Total */}
                <div style={{ display: "flex", flexDirection: "row-reverse", textAlign: 'right', marginTop: '10mm', fontSize: '14px', paddingRight: "5px" }}>
                  <table border={1} style={{ width: '35%', borderCollapse: 'collapse', border: '1px solid #000' }}>
                    <tbody>

                      {/* GST calculation */}
                      {(() => {
                        const total = Number(activityData?.activityAmount || 0);
                        const gstRate = 0.18;
                        const baseAmount = total / (1 + gstRate);
                        const gst = total - baseAmount;

                        return (
                          <>
                            {studio?.gstNumber && (
                              <>
                                <tr>
                                  <td style={{ textAlign: 'left', padding: '2px 5px' }}>
                                    Base Amount
                                  </td>
                                  <td style={{ textAlign: 'right', padding: '2px 5px' }}>
                                    {baseAmount.toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td style={{ textAlign: 'left', padding: '2px 5px' }}>
                                    GST (18%)
                                  </td>
                                  <td style={{ textAlign: 'right', padding: '2px 5px' }}>
                                    {gst.toFixed(2)}
                                  </td>
                                </tr>
                              </>
                            )}
                            <tr>
                              <td style={{ textAlign: 'left', padding: '2px 5px' }}>Discount</td>
                              <td style={{ textAlign: 'right', padding: '2px 5px' }}>
                                {Math.abs((
                                  Number(activityData?.paymentEntry?.amount || 0) -
                                  Number(activityData?.activityAmount || 0)
                                ).toFixed(2))}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: 'left', padding: '2px 5px', fontWeight: 'bold' }}>
                                Total
                              </td>
                              <td style={{ textAlign: 'right', padding: '2px 5px', fontWeight: 'bold' }}>
                                {Number(activityData?.paymentEntry?.amount || 0).toFixed(2)}
                              </td>
                            </tr>
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{ flexGrow: 1 }}></div>
            </div>
          }
        />
      </DialogContent>

      <DialogActions>
        <FlexBetween width={"100%"} mx={2} gap={2}>
          <FlexBetween gap={1}>
            <Button onClick={() => pdfViewerRef.current.downloadPDF()} variant="contained">Download</Button>
            <Button onClick={handleSendMail} variant="contained">E-mail</Button>
            <Button onClick={() => pdfViewerRef.current.printPDF()} variant="contained">Print</Button>
          </FlexBetween>
          <Button onClick={onClose} variant='outlined' color="primary">Close</Button>
        </FlexBetween>
      </DialogActions>
    </Dialog>
  );
};

const tableHeaderStyle = {
  textAlign: 'left',
  padding: '8px',
};

const tableCellStyle = {
  padding: '8px',
};

StudentInvoice.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  studentData: PropTypes.shape({
    studentId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
  activityData: PropTypes.shape({
    activity: PropTypes.object,
    activityName: PropTypes.string.isRequired,
    activityAmount: PropTypes.number,
    membershipType: PropTypes.string,
    batchName: PropTypes.string,
    batchTime: PropTypes.string,
    daysPerWeek: PropTypes.number,
    registrationDate: PropTypes.string,
    membershipStartDate: PropTypes.string,
    membershipEndDate: PropTypes.string,
    membershipStatus: PropTypes.string,
    paymentEntry: PropTypes.shape({
      amount: PropTypes.number,
      paymentDate: PropTypes.string,
      status: PropTypes.string,
      registrationFee: PropTypes.number,
      totalBeforeTax: PropTypes.number,
      totalAmount: PropTypes.number,
      invoiceId: PropTypes.string,
    }),
  })
};

export default StudentInvoice;
