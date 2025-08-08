import {
  Table, TableBody, TableHead,
  Paper, Typography, Pagination, Box
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { StyledTableCell, StyledTableContainer, StyledTableRow } from '../../../Components/StyledTableComponents';
import { getBulkUploadJobsAPI } from './BulkUploadJobs.api';
import { useAlert } from '../../../utils/Alert';
import { useSelector } from 'react-redux';
import Loading from '../../../Components/Loading/Loading';

const size = 7;
const UploadJobHistory = () => {
  const [page, setPage] = useState(1);
  const showAlert = useAlert();
  const token = useSelector((state) => state.auth.token);

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false)

  const currentBranch = useSelector((state) => state.branch.currentBranch);

  const [totalPage, setTotalPage] = useState(0)
  const fetchUploadJobs = useCallback(async (page) => {
    setLoading(true);
    const { success, data, message, totalCount } = await getBulkUploadJobsAPI({
      branchId: currentBranch.branchId,
      token,
      page,
      size,
    });
    if (success) {
      setData(data);
      setTotalPage(Math.ceil(totalCount / size));
    } else {
      showAlert(message, "error");
    }
    setLoading(false);
  }, [currentBranch, token, showAlert]);

  useEffect(() => {
    !data && fetchUploadJobs();
  }, [fetchUploadJobs, data, page])
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
    fetchUploadJobs(newPage);
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Upload Job History
      </Typography>
      {loading && <Loading />}
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Entity Type</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Total</StyledTableCell>
              <StyledTableCell>Processed</StyledTableCell>
              <StyledTableCell>Success</StyledTableCell>
              <StyledTableCell>Failed</StyledTableCell>
              <StyledTableCell>File Name</StyledTableCell>
              <StyledTableCell>Completed At</StyledTableCell>
              <StyledTableCell>Error Messages</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data && data.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.id}</StyledTableCell>
                <StyledTableCell>{row.entityType}</StyledTableCell>
                <StyledTableCell>{row.status}</StyledTableCell>
                <StyledTableCell>{row.totalRecords}</StyledTableCell>
                <StyledTableCell>{row.processedRecords}</StyledTableCell>
                <StyledTableCell>{row.successfulRecords}</StyledTableCell>
                <StyledTableCell>{row.failedRecords}</StyledTableCell>
                <StyledTableCell>
                  {row.fileName}
                </StyledTableCell>
                <StyledTableCell>
                  {row.completedAt || "—"}
                </StyledTableCell>
                <StyledTableCell>
                  {row.errorMessages.length > 0
                    ? row.errorMessages.join(", ")
                    : "—"}
                </StyledTableCell>
              </StyledTableRow>
            ))}
            {
              data?.length === 0 && (
                <StyledTableRow>
                  <StyledTableCell colSpan={90} align="center">
                    No upload jobs found.
                  </StyledTableCell>
                </StyledTableRow>
              )
            }
          </TableBody>
        </Table>
      </StyledTableContainer>

      <Box display="flex" justifyContent="right" mt={2}>
        <Pagination
          count={totalPage}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default UploadJobHistory;
