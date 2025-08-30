import { useState, useEffect, useCallback } from "react";
import DataTable from "../../../Components/TableMui";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import SearchField from "../../../Components/SearchField";
import { Box, Button, Pagination } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import AddIcon from "@mui/icons-material/Add";
import { useAlert } from "../../../utils/Alert";
import { useSelector } from "react-redux";
import { getAllInstructorsAPI } from "./Instructor.api";
import Loading from "../../../Components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import Filter from "../../../Components/Filter";
// import QrForm from "../../../Components/QrForm";

const size = 7;

const Instructors = () => {
  const showAlert = useAlert();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const onClickOnRow = (row) => {
    navigate(`/management/instructor/${row.instructorId}`);
  };
  const fetchInstructors = useCallback(async (membershipStatus, searchTerm) => {
    setLoading(true);
    const { success, data, message, totalCount } = await getAllInstructorsAPI({
      branchId: currentBranch.branchId,
      token,
      page,
      size,
      searchTerm,
      membershipStatus
    });
    if (success) {
      setData(data);
      setTotalPage(Math.ceil(totalCount / size));
    } else {
      showAlert(message, "error");
    }
    setLoading(false);
  }, [currentBranch, token, page, showAlert]);

  useEffect(() => {
    currentBranch && fetchInstructors();
  }, [fetchInstructors, currentBranch]);

  const handleSearch = async (searchTerm) => {
    fetchInstructors(null, searchTerm);
  };


  const onApplyFIlter = (x) => {
    Object.keys(x).length > 0 ?
      fetchInstructors(Object.keys(x).length == 1 ? Object.keys(x)[0] : null) : fetchInstructors(page);
  }

  return (
    <FlexBetweenColumn sx={{ overflow: "auto" }}>
      <FlexBetween paddingBottom={2} gap={1}>
        <SearchField handleSearch={handleSearch} />
        {/* <QrForm
          title="Instructor Form"
          link={"instructor-form"}
        /> */}
        <Filter onChange={onApplyFIlter} checkboxes={[{ key: 'ACTIVE', label: 'Active' }, { key: 'INACTIVE', label: 'Inactive' }]} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/management/instructor/NEW")}
          sx={{
            fontWeight: "bold",
            padding: "1px",
          }}
        >
          <AddIcon sx={{ padding: 0, margin: "auto" }} />
        </Button>
      </FlexBetween>

      {data && (
        <DataTable
          data={data}
          statusFieldName={"instructorStatus"}
          imageFieldName={"imageUrl"}
          startIndex={(parseInt(page) - 1) * size}
          onClickOnRow={onClickOnRow}
          columns={["imageUrl", "name", "email", "phone", "dob", "instructorStatus"]}
        />
      )}

      <FlexBetween>
        <Box></Box>
        <Pagination
          count={totalPage}
          page={page}
          onChange={setPage}
          color="primary"
          sx={{ my: 2 }}
        />
      </FlexBetween>
      {loading && <Loading />}
    </FlexBetweenColumn>
  );
};

export default Instructors;
