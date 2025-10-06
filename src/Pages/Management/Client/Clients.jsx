import { useState, useEffect, useCallback } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button, Pagination } from "@mui/material";
import SearchField from "../../../Components/SearchField";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import Loading from "../../../Components/Loading/Loading";
import { useAlert } from "../../../utils/Alert";
import { useDispatch, useSelector } from "react-redux";
import TableWithEditAddDelete from "./CLientTable.jsx";
import { useAppSelector } from "../../../state/index.js";
import { clientCruds } from "../../../api/all.api.js";

const clientTypes = ["GROUP", "INDIVIDUAL", "COMPANY"];
const size = 7;
const Clients = () => {
    const showAlert = useAlert();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const token = useSelector((state) => state.auth.token);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const clientState = useAppSelector((state) => state.clients);
    const [newRow, setNewRow] = useState(null);
    // debugger;

    const fetchClients = useCallback(
        async (page = 1, searchTerm = "") => {
            dispatch(
                clientCruds.getAll(
                    clientState,
                    showAlert,
                    setLoading,
                    token,
                    { page, size, searchTerm },
                    currentBranch.branchId,
                ),
            );
        },
        [dispatch, clientState, showAlert, token, currentBranch.branchId],
    );

    useEffect(() => {
        !clientState.items.length && fetchClients();
    }, [clientState.items.length, fetchClients]);

    const handlePageChange = async (e, p) => {
        setLoading(true);
        setPage(p);
        await fetchClients(p);
        setLoading(false);
    };

    const handleAddNew = () => {
        setNewRow({
            groupName: "test",
            pocName: "test",
            pocPhone: "test",
            pocEmail: "test",
            clientType: clientTypes[0],
            notes: "",
            branchId: currentBranch.branchId,
        });
    };

    return (
        <FlexBetweenColumn>
            {loading && <Loading />}
            <FlexBetween paddingBottom={2} gap={1}>
                <SearchField handleSearch={(searchTerm) => fetchClients(1, searchTerm)} />
                <Button
                    variant="contained"
                    color="primary"
                    disabled={newRow != null}
                    onClick={() => handleAddNew()}
                    sx={{ fontWeight: "bold", padding: "1px" }}
                >
                    <AddIcon sx={{ padding: 0, margin: "auto" }} />
                </Button>
            </FlexBetween>
            <Box>
                <TableWithEditAddDelete
                    initialData={clientState.items ?? []}
                    clientTypes={clientTypes}
                    startIndex={(parseInt(page) - 1) * size}
                    token={token}
                    newRow={newRow}
                    setNewRow={setNewRow}
                />
            </Box>
            <FlexBetween>
                <Box></Box>
                <Pagination
                    count={clientState.totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{ my: 2 }}
                />
            </FlexBetween>
        </FlexBetweenColumn>
    );
};

export default Clients;
