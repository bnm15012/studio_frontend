import { useState, useEffect, useCallback, useRef } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button, Pagination, Popover } from "@mui/material";
import SearchField from "../../../Components/SearchField";
import FlexBetween from "../../../Components/FlexBetween";
import { Add } from "@mui/icons-material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Loading from "../../../Components/Loading/Loading";
import { useAlert } from "../../../utils/Alert";
import { getAllBookingsAPI } from "./bookings.api.js";
import { useDispatch, useSelector } from "react-redux";
import BookingsTable from "./bookingsTable.jsx";
import { useNavigate } from "react-router-dom";
import CalendarView from "./Celendar/CalendarView.jsx";
import { setBookingPage } from "../../../state/bookingSlice.js";
const paymentTypes = [
  "CASH",
  "UPI",
  "CREDIT_CARD"
];
const paymentStatusTypes = [
  "COMPLETED",
  "PENDING"
];
const size = 7;
const Bookings = () => {
  const dispatch = useDispatch();
  const showAlert = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0)
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const [calendarAnchor, setCalendarAnchor] = useState(null);
  const calendarButtonRef = useRef(null);
  const cachedBookings = useSelector((state) => state.booking);

  const fetchBookings = useCallback(async (page = 1, searchTerm) => {
    try {
      if (!searchTerm && cachedBookings && page in cachedBookings.pages) {
        setBookings(cachedBookings.pages[page])
        setTotalPage(cachedBookings.totalCount)
        return;
      }
      setLoading(true);
      const { data, success, message, totalCount } = await getAllBookingsAPI({
        branchId: currentBranch.branchId,
        page,
        size,
        token,
        searchTerm,
      });

      if (success) {
        setBookings(data);
        setTotalPage(Math.ceil(totalCount / size));
        if (!searchTerm) {
          dispatch(setBookingPage({ page, bookings: data, totalCount: Math.ceil(totalCount / size) }))
        }
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to fetch bookings!", "error");
    } finally {
      setLoading(false);
    }
  }, [currentBranch.branchId, token, dispatch, showAlert]);
  const [newRow, setNewRow] = useState(null);

  useEffect(() => {
    !bookings && fetchBookings(page);
  }, [page, bookings, currentBranch.branchId, fetchBookings]);

  const handlePageChange = async (e, p) => {
    setLoading(true);
    setPage(p);
    await fetchBookings(p);
    setLoading(false);
  };

  const handleAddNew = () => {
    navigate("/management/bookings/NEW");
  };

  return (
    <FlexBetweenColumn>
      {loading && <Loading />}
      <FlexBetween paddingBottom={2} gap={1}>
        <SearchField handleSearch={(searchTerm) => fetchBookings(1, searchTerm)} />
        <Button
          variant="contained"
          color="primary"
          disabled={newRow != null}
          onClick={(e) => setCalendarAnchor(e.currentTarget)}
          sx={{ fontWeight: "bold", padding: "1px" }}
          ref={calendarButtonRef}
        >
          <CalendarMonthIcon sx={{ padding: 0, margin: "auto" }} />
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddNew}
          disabled={newRow != null}
        >
          <Add sx={{ padding: 0, margin: "auto" }} />
        </Button>
      </FlexBetween>
      <Box>
        {bookings && (
          <BookingsTable
            initialData={bookings}
            paymentTypes={paymentTypes}
            paymentStatusTypes={paymentStatusTypes}
            branchId={currentBranch.branchId}
            startIndex={(parseInt(page) - 1) * size}
            token={token}
            newRow={newRow}
            setNewRow={setNewRow}
          />
        )}
      </Box>
      <FlexBetween>
        <Box></Box>
        <Pagination
          count={totalPage}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ my: 2 }}
        />
      </FlexBetween>
      <Popover
        open={Boolean(calendarAnchor)}
        anchorEl={calendarAnchor}  // Use the actual button as anchor
        onClose={() => setCalendarAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <CalendarView />
      </Popover>
    </FlexBetweenColumn>
  );
};

export default Bookings;
