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
import { setClientPage } from "../../../state/clientSlice.js";
import { getAllDataAPI } from "../../../api/common.api.js";

const clientTypes = [
  "GROUP",
  "INDIVIDUAL",
  "COMPANY"
];
const size = 7;
const Clients = () => {
  const showAlert = useAlert();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const cachedClients = useSelector((state) => state.client);
  const [newRow, setNewRow] = useState(null);

  const fetchClients = useCallback(async (page = 1, searchTerm = "") => {
    dispatch(getAllDataAPI({ rootId: currentBranch.branchId, token, showAlert, route: "clients", setData: setClientPage, setLoading, params: { size, page, searchTerm } }));
  }, [dispatch, currentBranch.branchId, token, showAlert]);

  useEffect(() => {
    !cachedClients.length && fetchClients();
  }, [cachedClients.length, fetchClients]);


  const handlePageChange = async (e, p) => {
    setLoading(true);
    setPage(p);
    await fetchClients(p);
    setLoading(false);
  };

  const handleAddNew = () => {
    setNewRow({
      "groupName": "",
      "pocName": "",
      "pocPhone": "",
      "pocEmail": "",
      "clientType": clientTypes[0],
      "notes": "",
      "branchId": currentBranch.branchId
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
          initialData={cachedClients.pages[page] ?? []}
          clientTypes={clientTypes}
          branchId={currentBranch.branchId}
          startIndex={(parseInt(page) - 1) * size}
          token={token}
          newRow={newRow}
          setNewRow={setNewRow}
        />
      </Box>
      <FlexBetween>
        <Box></Box>
        <Pagination
          count={cachedClients.totalPages}
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
