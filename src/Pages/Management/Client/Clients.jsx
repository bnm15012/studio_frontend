import { useState, useEffect, useCallback } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button, Pagination } from "@mui/material";
import SearchField from "../../../Components/SearchField";
import FlexBetween from "../../../Components/FlexBetween";
import { Add } from "@mui/icons-material";
import Loading from "../../../Components/Loading/Loading";
import { useAlert } from "../../../utils/Alert";
import { getAllClientsAPI } from "./client.api";
import { useDispatch, useSelector } from "react-redux";
import TableWithEditAddDelete from "./CLientTable.jsx";
import { setClientPage } from "../../../state/clientSlice.js";

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
  const [clients, setClients] = useState();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0)
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const cachedClients = useSelector((state) => state.client);

  const fetchClients = useCallback(async (page = 1, searchTerm) => {
    try {
      if (!searchTerm && cachedClients && page in cachedClients.pages) {
        setClients(cachedClients.pages[page])
        setTotalPage(cachedClients.totalCount)
        return;
      }
      setLoading(true);
      const { data, success, message, totalCount } = await getAllClientsAPI({
        branchId: currentBranch.branchId,
        page,
        size,
        token,
        searchTerm,
      });

      if (success) {
        setClients(data);
        if (!searchTerm) {
          dispatch(setClientPage({ page, clients: data, totalCount: Math.ceil(totalCount / size) }))
        }
        setTotalPage(Math.ceil(totalCount / size));
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to fetch clients!", "error");
    } finally {
      setLoading(false);
    }
  }, [currentBranch.branchId, token, dispatch, showAlert]);
  const [newRow, setNewRow] = useState(null);

  useEffect(() => {
    !clients && fetchClients(page);
  }, [page, clients, currentBranch.branchId, fetchClients]);

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
          <Add sx={{ padding: 0, margin: "auto" }} />
        </Button>
      </FlexBetween>
      <Box>
        {clients && (
          <TableWithEditAddDelete
            initialData={clients}
            clientTypes={clientTypes}
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
    </FlexBetweenColumn>
  );
};

export default Clients;
