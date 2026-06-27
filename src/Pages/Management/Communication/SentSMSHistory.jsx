import { Pagination } from "@mui/material";

import { useAlert } from "../../../core/util/Alert";
import { useCallback, useEffect, useState } from "react";
import { getMessageHistoryAPI } from "./communication.api";
import { useSelector } from "react-redux";
import Loading from "../../../Components/Loading/Loading";
import { FlexBetween } from "../../../Components/FlexBox";
import { useUI } from "../../../context/UIContext";
import PropTypes from "prop-types";
import HistoryMessageTable from "./HistoryMessageTable";
import MessageHistoryCard from "./MessageHistoryCard";
import ReceipentsListDialog from "./ReceipentsListDialog";

const SentSMSHistory = ({ newHistory }) => {
    const showAlert = useAlert();
    const { isMobile } = useUI();
    const [size] = useState(isMobile ? 6 : 3);
    const [page, setPage] = useState(1);
    const token = useSelector((state) => state.auth.token);
    const [history, setHistory] = useState(newHistory);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        if (newHistory) {
            setHistory(newHistory);
        }
    }, [newHistory]);

    const getMessageHistory = useCallback(
        async (page = 1) => {
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
            } catch (error) {
                console.error(error);
                showAlert("Failed to fetch expenses!", "error");
            } finally {
                setLoading(false);
            }
        },
        [token, currentBranch.branchId, size, showAlert],
    );
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
                <ReceipentsListDialog messageId={openDialog} onClose={() => setOpenDialog(false)} />
            )}
        </FlexBetween>
    );
};
SentSMSHistory.propTypes = {
    newHistory: PropTypes.array,
};

export default SentSMSHistory;
