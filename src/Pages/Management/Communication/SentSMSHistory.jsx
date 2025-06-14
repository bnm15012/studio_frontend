import { IconButton, Pagination, Table, TableBody, TableHead } from "@mui/material";
import {
  StyledTableCell,
  StyledTableContainer,
  StyledTableRow,
} from "../../../Components/StyledTableComponents";
import GroupsIcon from '@mui/icons-material/Groups';

import { useAlert } from "../../../utils/Alert";
import { useCallback, useEffect, useState } from "react";
import { getMessageHistoryAPI } from "./communication.api";
import { useSelector } from "react-redux";
import Loading from "../../../Components/Loading/Loading";
import { getLocalDateTime } from "../../../utils/DateUtil";
import ReceipentsListDialog from "./ReceipentsListDialog";
import FlexBetween from "../../../Components/FlexBetween";

const size = 3;
const SentSMSHistory = () => {
  const showAlert = useAlert()
  const [page, setPage] = useState(1);
  const token = useSelector(state => state.auth.token)
  const [history, setHistory] = useState()
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(0)
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null)

  const getMessageHistory = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const { data, totalCount, success, message } = await getMessageHistoryAPI({ token, branchId: currentBranch.branchId, page, size });

      if (success) {
        setHistory(data);
        setTotalPage(Math.ceil(totalCount / size));
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to fetch expenses!", "error");
    } finally {
      setLoading(false);
    }
  }, [showAlert, currentBranch.branchId, token]);
  const handlePageChange = async (e, p) => {
    setLoading(true);
    setPage(p);
    await getMessageHistory(p);
    setLoading(false);
  };

  useEffect(() => {
    !history && getMessageHistory();
  }, [page, currentBranch.branchId, history, getMessageHistory]);

  return (
    <>
      {loading && <Loading />}
      <StyledTableContainer>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell sx={{ py: 1.5 }}>Title</StyledTableCell>
              <StyledTableCell sx={{ py: 1.5 }}>Sent Date</StyledTableCell>
              <StyledTableCell sx={{ py: 1.5 }}>Recipients</StyledTableCell>
              <StyledTableCell sx={{ py: 1.5 }}>NotificationType</StyledTableCell>
              <StyledTableCell sx={{ py: 1.5 }}>Action</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {history && history.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell sx={{ py: 1 }}>{row?.title}</StyledTableCell>
                <StyledTableCell sx={{ py: 1 }}>{getLocalDateTime(row?.sentDate, "DATETIME")}</StyledTableCell>
                <StyledTableCell sx={{ py: 1 }}>{row?.sentToAll ? "All" : "Few"}</StyledTableCell>
                <StyledTableCell sx={{ py: 1 }}>{row?.notificationType}</StyledTableCell>
                <StyledTableCell sx={{ py: 1 }}>
                  <IconButton disabled={row?.sentToAll} onClick={() => { setSelectedMessageId(row.id); setOpenDialog(true) }}>
                    <GroupsIcon color="primary" />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
            {
              history && history.length === 0 && (
                <StyledTableRow>
                  <StyledTableCell colSpan={5} align="center">
                    No Communication History available!
                  </StyledTableCell>
                </StyledTableRow>
              )
            }
          </TableBody>
        </Table>
      </StyledTableContainer >
      <FlexBetween p={2} flexDirection={"row-reverse"} >
        <Pagination
          count={totalPage}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="small"
        />
      </FlexBetween>
      {
        openDialog &&
        <ReceipentsListDialog open={openDialog} messageId={selectedMessageId} onClose={() => setOpenDialog(false)} />
      }

    </>
  );
};

export default SentSMSHistory;