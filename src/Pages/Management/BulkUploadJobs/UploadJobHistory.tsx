import {
    TableBody,
    TableHead,
    Table,
    Pagination,
    Box,
    TableContainer,
    Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { StyledTableCell, StyledTableRow } from "../../../core/components/tables/StyledTableComponents";
import { getBulkUploadJobsAPI } from "./BulkUploadJobs.api";
import { useAlert } from "../../../core/components/feedback/Alert";
import { useSelector } from "react-redux";
import Loading from "../../../core/components/loading/Loading";
import { getLocalDateTime } from "../../../core/utils/DateUtil";

const size = 7;
const UploadJobHistory = () => {
    const [page, setPage] = useState(1);
    const showAlert = useAlert();
    const token = useSelector((state: any) => state.auth.token);

    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState(false);

    const currentBranch = useSelector((state: any) => state.branch.currentBranch);

    const [totalPage, setTotalPage] = useState(0);
    const fetchUploadJobs = useCallback(
        async (page) => {
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
        },
        [currentBranch, token, showAlert],
    );

    useEffect(() => {
        if (!data) fetchUploadJobs(page);
    }, [fetchUploadJobs, data, page]);
    const handleChangePage = (_, newPage) => {
        setPage(newPage);
        fetchUploadJobs(newPage);
    };

    return (
        <Box>
            {loading && <Loading />}
            <TableContainer>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell sx={{ textWrap: "nowrap" }}>S. No</StyledTableCell>
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
                        {data &&
                            data.map((row, index) => (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>{row.entityType}</StyledTableCell>
                                    <StyledTableCell>{row.status}</StyledTableCell>
                                    <StyledTableCell>{row.totalRecords}</StyledTableCell>
                                    <StyledTableCell>{row.processedRecords}</StyledTableCell>
                                    <StyledTableCell>{row.successfulRecords}</StyledTableCell>
                                    <StyledTableCell>{row.failedRecords}</StyledTableCell>
                                    <StyledTableCell>{row.fileName}</StyledTableCell>
                                    <StyledTableCell>
                                        <Typography sx={{ wordBreak: "break-all" }}>
                                            {row?.completedAt
                                                ? getLocalDateTime(row.completedAt, "DATETIME")
                                                : "—"}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.errorMessages.length > 0
                                            ? row.errorMessages.join(", ")
                                            : "—"}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        {data?.length === 0 && (
                            <StyledTableRow>
                                <StyledTableCell colSpan={90} align="center">
                                    No upload jobs found.
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box display="flex" justifyContent="right" mt={2}>
                <Pagination
                    count={totalPage ?? 0}
                    page={page ?? 0}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default UploadJobHistory;
