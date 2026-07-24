import { Pagination } from "@mui/material";
import { useAlert } from "@/core/components/feedback/Alert";
import { useCallback, useEffect, useState } from "react";
import { getMessageHistoryAPI } from "./communication.api";
import Loading from "@/core/components/loading/Loading";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { useAppUI } from "@/context/UIContext";

import HistoryMessageTable from "./HistoryMessageTable";
import MessageHistoryCard from "./MessageHistoryCard";
import ReceipentsListDialog from "./ReceipentsListDialog";

interface SentSMSHistoryProps {
    newHistory?: Record<string, unknown>[] | Record<string, unknown>;
}

const SentSMSHistory: React.FC<SentSMSHistoryProps> = ({ newHistory }) => {
    const showAlert = useAlert();
    const { isMobile, token, currentBranch } = useAppUI();
    const [size] = useState(isMobile ? 6 : 3);
    const [page, setPage] = useState(1);
    const [history, setHistory] = useState<Record<string, unknown>[] | null | undefined>(
        Array.isArray(newHistory) ? newHistory : null,
    );

    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [openDialog, setOpenDialog] = useState<boolean | number | string>(false);

    useEffect(() => {
        if (newHistory) {
            setHistory(Array.isArray(newHistory) ? newHistory : null);
        }
    }, [newHistory]);

    const getMessageHistory = useCallback(
        async (page: number = 1) => {
            try {
                setLoading(true);
                const { data, totalCount, success, message } = await getMessageHistoryAPI({
                    token,
                    branchId: currentBranch.branchId,
                    page,
                    size,
                });

                if (success) {
                    setHistory(data);
                    setTotalPage(Math.ceil(totalCount / size));
                } else {
                    showAlert(message, "error");
                }
            } catch (error: unknown) {
                console.error(error);
                showAlert("Failed to fetch expenses!", "error");
            } finally {
                setLoading(false);
            }
        },
        [token, currentBranch.branchId, size, showAlert],
    );
    const handlePageChange = async (e: React.ChangeEvent<unknown>, p: number) => {
        setLoading(true);
        setPage(p);
        await getMessageHistory(p);
        setLoading(false);
    };

    useEffect(() => {
        if (!history) getMessageHistory();
    }, [page, currentBranch.branchId, history, getMessageHistory]);

    return (
        <FlexBetween flexDirection={"column"} mt={2}>
            {loading && <Loading />}
            {isMobile ? (
                <MessageHistoryCard onViewRecipients={setOpenDialog} history={history} />
            ) : (
                <HistoryMessageTable onViewRecipients={setOpenDialog} history={history} />
            )}
            <FlexBetween p={2} flexDirection={"row-reverse"}>
                <Pagination
                    count={totalPage ?? 0}
                    page={page ?? 0}
                    onChange={handlePageChange}
                    color="primary"
                    size="small"
                />
            </FlexBetween>
            {openDialog && (
                <ReceipentsListDialog
                    messageId={openDialog as string | number}
                    onClose={() => setOpenDialog(false)}
                />
            )}
        </FlexBetween>
    );
};

export default SentSMSHistory;
