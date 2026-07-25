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
import { StyledTableCell, StyledTableRow } from "@/core/components/tables/StyledTableComponents";
import { getBulkUploadJobsAPI } from "./BulkUploadJobs.api";
import { useAlert } from "@/core/components/feedback/Alert";
import Loading from "@/core/components/loading/Loading";
import { getLocalDateTime } from "@/core/utils/DateUtil";
import { useAppUI } from "@/context/UIContext";

const LIMIT = 7;
const UploadJobHistory = () => {
    const showAlert = useAlert();
    const { token, currentBranch } = useAppUI();
    const [page, setPage] = useState(1);
    const [data, setData] = useState<Record<string, unknown>[] | undefined>();
    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(0);

    const fetchUploadJobs = useCallback(
        async (page: number) => {
            setLoading(true);
            const { success, data, message, totalCount } = await getBulkUploadJobsAPI({
                branchId: currentBranch.branchId,
                token,
                page,
                size: LIMIT,
            });
            if (success) {
                setData(data);
                setTotalPage(Math.ceil(totalCount / LIMIT));
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
    const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
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
                            data.map((row) => (
                                <StyledTableRow key={String(row.id)}>
                                    <StyledTableCell>
                                        {String(row.entityType ?? "")}
                                    </StyledTableCell>
                                    <StyledTableCell>{String(row.status ?? "")}</StyledTableCell>
                                    <StyledTableCell>
                                        {String(row.totalRecords ?? "")}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {String(row.processedRecords ?? "")}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {String(row.successfulRecords ?? "")}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {String(row.failedRecords ?? "")}
                                    </StyledTableCell>
                                    <StyledTableCell>{String(row.fileName ?? "")}</StyledTableCell>
                                    <StyledTableCell>
                                        <Typography sx={{ wordBreak: "break-all" }}>
                                            {row.completedAt
                                                ? getLocalDateTime(
                                                      String(row.completedAt),
                                                      "DATETIME",
                                                  )
                                                : "—"}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {(row.errorMessages as string[]).length > 0
                                            ? (row.errorMessages as string[]).join(", ")
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
                    count={Math.max(1, totalPage || 1)}
                    page={Math.max(1, page || 1)}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default UploadJobHistory;
