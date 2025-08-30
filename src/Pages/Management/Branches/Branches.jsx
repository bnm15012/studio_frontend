import { useState } from "react";
import { Box, Button } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon  from "@mui/icons-material/Add";
// import Loading from "../../../Components/Loading/Loading";
// import { useAlert } from "../../../utils/Alert";
// import { getAllBranchAPI } from "./Branches.api";
import { useSelector } from "react-redux";
import TableWithEditAddDelete from "./TableBranches";

const Branches = () => {
  // const showAlert = useAlert();
  // const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const studio = useSelector((state) => state.auth.studio);
  const branches = useSelector(state => state.branch.branches)
  // const [branches, setBranches] = useState();

  // const fetchBranches = useCallback(async (page = 1) => {
  //   setLoading(true);
  //   try {
  //     const { data, success, message } = await getAllBranchAPI({
  //       studioId: studio.studioId,
  //       page,
  //       token,
  //     });

  //     if (success) {
  //       setBranches(data);
  //     } else {
  //       showAlert(message, "error");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     showAlert("Failed to fetch branches!", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [studio.studioId, token, showAlert]);
  const [newRow, setNewRow] = useState(null);

  // useEffect(() => {
  //   !branches && fetchBranches();
  // }, [branches, currentBranch.branchId, fetchBranches]);


  const handleAddNew = () => {
    setNewRow({
      name: null,
      address: null,
      city: null,
      state: null,
      pincode: null,
      phone: null,
      studioId: studio.studioId,
      isActive: true,
    });
  };

  return (
    <Box>
      {/* {loading && <Loading />} */}
      <FlexBetween paddingBottom={2} flexDirection={"row-reverse"} gap={1}>
        <Button
          variant="contained"
          color="primary"
          startIcon={
            <AddIcon />
          }
          disabled={newRow != null}
          onClick={() => handleAddNew()}
          sx={{ fontWeight: "bold", padding: 2 }}
        >
          Add new Branch
        </Button>
      </FlexBetween>
      {branches && (
        <TableWithEditAddDelete
          initialData={branches}
          currentBranch={currentBranch}
          token={token}
          newRow={newRow}
          setNewRow={setNewRow}
          studioId={studio.studioId}
        />
      )}
    </Box>
  );
};

export default Branches;
