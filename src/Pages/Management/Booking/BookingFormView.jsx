import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FlexBetween from "../../../Components/FlexBetween";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../utils/Alert";
import Loading from "../../../Components/Loading/Loading";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import EditableData from "../../../Components/EditableData";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";
import DeleteDialog from "../../../Components/DeleteDialog";
import { addBookingAPI, deleteBookingAPI, updateBookingAPI, getBookingByIdAPI } from "./bookings.api";
import { getCurrentDateTimeUTC } from "../../../utils/DateUtil";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { getAllClientsAPI } from "../Client/client.api";
import PaymentEntryDialog from "../Payments/PaymentEntryDialog";
import { clearBookingPages } from "../../../state/bookingSlice";
import { clearPaymentPages } from "../../../state/paymentSlice";
const paymentTypes = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "CREDIT_CARD", label: "Credit Card" }
];
const paymentStatusTypes = [
  { value: "PENDING", label: "PENDING" },
  { value: "COMPLETED", label: "COMPLETED" },
];

const initialData = {
  "purpose": null,
  "totalAmount": null,
  "paymentStatus": paymentStatusTypes[0].value,
  "advanceAmount": 0,
  "bookingDate": getCurrentDateTimeUTC(),
  "startTime": null,
  "endTime": null,
  "advanceDate": getCurrentDateTimeUTC(),
  "advanceMode": paymentTypes[0].value,
  "paymentMode": paymentTypes[0].value,
  "balanceAmount": 0,
  "notes": null,
  "finalPaymentDate": null,
  "branchId": null,
  paymentEntry: {
    payeeType: "BOOKING",
    actualAmount: 0,
    amount: 0,
    paymentDate: getCurrentDateTimeUTC(),
    status: paymentStatusTypes[0].value,
    paymentType: paymentTypes[0].value,
  },
  "clientEntry": {
    clientId: 0
  }
};
const BookingFormView = ({ page, ID }) => {
  const theme = useTheme();
  const showAlert = useAlert();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState();
  const [isEdit, setIsEdit] = useState(ID === "NEW");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentEntry, setPaymentEntry] = useState(initialData.paymentEntry);
  const [openPaymentEntryDialog, setOpenPaymentEntryDialog] = useState(false);


  const fetchBookingData = useCallback(async () => {
    setLoading(true);
    try {
      const { success, data, message } = await getBookingByIdAPI({
        bookingId: ID,
        token,
      });
      if (success) {
        setBookingData(data);
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to fetch booking", "error");
    }
    setLoading(false);
  }, [ID, showAlert, token]);


  // const getClientsByName = async (name) => {
  //   const { success, data, message } = await getCLientByNamesAPI({
  //     clientName: name,
  //     token,
  //   });
  //   if (success) {
  //     return data;
  //   } else {
  //     showAlert(message, "error");
  //   }
  // }

  const getAllClients = async (page, size) => {
    try {
      const { data, totalCount } = await getAllClientsAPI({
        token,
        page,
        branchId: currentBranch.branchId,
        size,
      });
      return { data, total: totalCount };
    }
    catch (error) {
      console.error(error);
      showAlert("Failed to fetch clients", "error");
      return { data: [], total: 0 };
    }
  }
  const calculateBalanceAmount = (row) => {
    row.balanceAmount = parseFloat(row.totalAmount) - parseFloat(row.advanceAmount);
  }

  const validateRow = (row) => {
    const requiredFields = [
      'purpose',
      'totalAmount',
      'paymentStatus',
      // 'advanceAmount',
      'bookingDate',
      'startTime',
      'endTime',
      'advanceDate',
      'advanceMode'
    ];

    const missingFields = requiredFields.filter(field => !row[field]);

    if (missingFields.length > 0) {
      showAlert(
        `Please fill in the following fields:\n${missingFields.map(field => `        - ${field}`).join('\n')}`,
        "error"
      );
      return false;
    }

    // if (parseFloat(row.advanceAmount) > parseFloat(row.totalAmount)) {
    //   showAlert("Advance amount less than total amount", "error");
    //   return false;
    // }
    calculateBalanceAmount(row);
    return true;
  };

  const saveBookingData = async () => {
    if (!validateRow(bookingData)) {
      return;
    }
    else {
      if (ID == "NEW") {
        paymentEntry["amount"] = bookingData.totalAmount;
        paymentEntry["actualAmount"] = bookingData.totalAmount;
        paymentEntry["branchId"] = currentBranch.branchId;
        bookingData["paymentEntry"] = paymentEntry;
        bookingData["advanceAmount"] = bookingData.totalAmount;
        bookingData["clientEntry"]["clientId"] = bookingData.clientId;
        bookingData["balanceAmount"] = parseFloat(bookingData.totalAmount) + parseFloat(bookingData.advanceAmount);
        delete bookingData.clientId;

        setOpenPaymentEntryDialog(true);
      }
      else {
        saveNewEditBookingData();
      }
    }
  }

  const saveNewEditBookingData = async () => {
    if (!validateRow(bookingData)) {
      return;
    }
    try {
      setLoading(true);
      if (ID === "NEW") {
        const { success, message } = await addBookingAPI({
          bookingData: bookingData,
          token,
        });
        if (success) {
          showAlert(message, "success");
          setIsEdit(false);
          dispatch(clearBookingPages())
          dispatch(clearPaymentPages())
          navigate(`/management/bookings`);
        } else {
          showAlert(message, "error");
          navigate(`/management/bookings`);
        }
      } else {
        const { success, message } = await updateBookingAPI({
          bookingId: parseInt(ID),
          bookingData,
          token,
        });
        if (success) {
          setIsEdit(false);
          setBookingData(bookingData);
          showAlert(message, "success");
        } else {
          showAlert(message, "error");
        }
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to save/update booking", "error");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    try {
      const { success, message } = await deleteBookingAPI({
        bookingId: parseInt(ID),
        token,
      });
      if (success) {
        navigate(`/management/bookings`);
        showAlert(message, "success");
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to delete booking", "error");
    }
  };

  useEffect(() => {
    if (!bookingData) {
      if (ID === "NEW") {
        initialData["branchId"] = currentBranch.branchId;
        setBookingData(initialData);
      } else fetchBookingData();
    }
  }, [ID, fetchBookingData, bookingData, currentBranch.branchId]);

  return (
    <FlexBetweenColumn sx={{ p: 1, gap: 1 }}>
      {loading && <Loading />}
      <FlexBetween sx={{ width: '100%', p: 2, backgroundColor: theme.palette.background.paper, borderRadius: 2, boxShadow: theme.shadows[2] }}>
        <FlexBetween alignItems={"center"} gap={2}>
          <IconButton onClick={() => navigate(`/management/${page}`)}>
            <ArrowBackIcon sx={{ color: "black" }} />
          </IconButton>
          <Typography variant="h5" fontWeight={"bold"}>
            Booking Info
          </Typography>
        </FlexBetween>

        <Box>
          {!isEdit ? (
            <FlexBetween gap={2}>
              <IconButton
                disabled={loading}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ '&:hover': { backgroundColor: 'rgba(255,0,0,0.1)' } }}
              >
                <DeleteIcon sx={{ color: "red" }} />
              </IconButton>
              <IconButton
                disabled={loading}
                onClick={() => setIsEdit(true)}
                sx={{ '&:hover': { backgroundColor: 'rgba(0,0,255,0.1)' } }}
              >
                <EditIcon sx={{ color: "blue" }} />
              </IconButton>
              <IconButton>
                <CloudDoneIcon sx={{ color: "green" }} />
              </IconButton>
            </FlexBetween>
          ) : (
            <FlexBetween gap={2}>
              <IconButton
                disabled={loading}
                onClick={() => { setIsEdit(false); if (ID == "NEW") navigate("/management/bookings/"); }}
                sx={{ '&:hover': { backgroundColor: 'rgba(255,0,0,0.1)' } }}
              >
                <CancelIcon sx={{ color: "red" }} />
              </IconButton>
              <IconButton
                disabled={loading}
                onClick={() =>
                  saveBookingData()
                }
                sx={{ '&:hover': { backgroundColor: 'rgba(0,0,255,0.1)' } }}
              >
                <CloudUploadIcon sx={{ color: "green" }} />
              </IconButton>
            </FlexBetween>
          )}
        </Box>
      </FlexBetween>
      <Divider />
      {bookingData && (
        <FlexBetween
          my={1}
          p={4}
          sx={{
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            width: '100%'
          }}
        >
          <FlexBetweenColumn flexGrow={1} gap={3}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" fontWeight={"bolder"} sx={{ mb: 2 }}>
                Booking Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <FlexBetween flexWrap={"wrap"} gap={3}>
                <EditableData
                  fieldName={"purpose"}
                  data={bookingData}
                  setData={setBookingData}
                  setIsEdit={setIsEdit}
                  isEdit={isEdit}
                  validation={{
                    pattern: "^[a-zA-Z ]{2,50}$",
                    errorMessage: "Purpose should be 2-50 characters.",
                  }}
                />
                <EditableData
                  fieldName={"advanceDate"}
                  data={bookingData}
                  setData={setBookingData}
                  setIsEdit={setIsEdit}
                  isEdit={isEdit && ID === "NEW"}
                  inputType="DATE"
                />
              </FlexBetween>
              <FlexBetween flexWrap={"wrap"} gap={3} sx={{ mt: 3 }}>
                <EditableData
                  label={"Client"}
                  fieldName={"clientId"}
                  valueField={ID === "NEW" ? "groupName" : "clientEntry.groupName"}
                  data={bookingData}
                  setData={setBookingData}
                  setIsEdit={setIsEdit}
                  isEdit={isEdit && ID === "NEW"}
                  inputType="INFINITE_SELECT"
                  getOptions={getAllClients}
                />
                <EditableData
                  fieldName={"notes"}
                  data={bookingData}
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  setData={setBookingData}
                />
              </FlexBetween>
              <FlexBetween flexWrap={"wrap"} gap={3} sx={{ mt: 3 }}>
                <EditableData
                  fieldName={"bookingDate"}
                  data={bookingData}
                  inputType="DATE"
                  setData={setBookingData}
                  setIsEdit={setIsEdit}
                  isEdit={isEdit}
                />
                <EditableData
                  fieldName={"totalAmount"}
                  inputType="NUMBER"
                  data={bookingData}
                  setData={setBookingData}
                  setIsEdit={setIsEdit}
                  isEdit={isEdit && ID === "NEW"}
                />
              </FlexBetween>
              <FlexBetween flexWrap={"wrap"} gap={3} sx={{ mt: 3 }}>
                <EditableData
                  fieldName={"startTime"}
                  data={bookingData}
                  inputType="DATETIME"
                  setData={setBookingData}
                  setIsEdit={setIsEdit}
                  isEdit={isEdit}
                />
                <EditableData
                  fieldName={"endTime"}
                  data={bookingData}
                  inputType="DATETIME"
                  setData={setBookingData}
                  setIsEdit={setIsEdit}
                  isEdit={isEdit}
                />
              </FlexBetween>
            </Box>

            <Box sx={{ width: '100%', mt: 4 }}>
              <Typography variant="h6" fontWeight={"bolder"} sx={{ mb: 2 }}>
                Payment Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <FlexBetween flexWrap={"wrap"} gap={3}>
                {/* <EditableData
                  inputType="NUMBER"
                  fieldName={"advanceAmount"}
                  data={bookingData}
                  setData={setBookingData}
                  setIsEdit={setIsEdit}
                  isEdit={isEdit && ID === "NEW"}
                /> */}
                <EditableData
                  label={"PaymentMode"}
                  fieldName={"advanceMode"}
                  inputType="SELECT"
                  isEdit={isEdit && ID === "NEW"}
                  setIsEdit={setIsEdit}
                  options={paymentTypes}
                  data={bookingData}
                  setData={setBookingData}
                />
              </FlexBetween>
              {/* <FlexBetween flexWrap={"wrap"} gap={3} sx={{ mt: 3 }}>
                <EditableData
                  fieldName={"paymentMode"}
                  inputType="SELECT"
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  options={paymentTypes}
                  data={bookingData}
                  setData={setBookingData}
                />
                <EditableData
                  fieldName={"balanceAmount"}
                  data={bookingData}
                  setData={setBookingData}
                  setIsEdit={setIsEdit}
                  isEdit={false}
                />
              </FlexBetween> */}
              <FlexBetween flexWrap={"wrap"} gap={3} sx={{ mt: 3 }}>
                {/* <EditableData
                  fieldName={"finalPaymentDate"}
                  data={bookingData}
                  inputType="DATE"
                  setData={setBookingData}
                  setIsEdit={setIsEdit}
                  isEdit={isEdit}
                /> */}
                <EditableData
                  fieldName={"paymentStatus"}
                  inputType="SELECT"
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  options={paymentStatusTypes}
                  diffStyle={{
                    fontWeight: "bold",
                    color:
                      bookingData["paymentStatus"] === "COMPLETED"
                        ? "green"
                        : "red",
                  }}
                  data={bookingData}
                  setData={setBookingData}
                />
              </FlexBetween>
            </Box>
          </FlexBetweenColumn>
        </FlexBetween>
      )}
      {ID !== "NEW" && bookingData && (
        <>
          <DeleteDialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleDelete}
            displayData={bookingData.purpose}
            id={ID}
          />
        </>
      )}
      <PaymentEntryDialog open={openPaymentEntryDialog} setOpen={setOpenPaymentEntryDialog} onSave={() => {
        setOpenPaymentEntryDialog(false);
        saveNewEditBookingData();
      }} paymentEntry={paymentEntry} setPaymentEntry={setPaymentEntry} paymentStatus={paymentStatusTypes} paymentType={paymentTypes} />
    </FlexBetweenColumn>
  );
};

BookingFormView.propTypes = {
  page: PropTypes.string.isRequired,
  ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
export default BookingFormView;



