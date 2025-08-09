import { useState, useEffect, useCallback } from "react";
import DataTable from "../../../Components/TableMui";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import SearchField from "../../../Components/SearchField";
import { Box, Button, Pagination } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import { Add } from "@mui/icons-material";
import { useAlert } from "../../../utils/Alert";
import { useSelector } from "react-redux";
import { getAllStudentsAPI } from "./Student.api";
import Loading from "../../../Components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import Filter from "../../../Components/Filter";
import QrForm from "../../../Components/QrForm";

const size = 7;
const Students = () => {
  const showAlert = useAlert();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const fetchStudents = useCallback(
    async (page = 1, searchTerm, membershipStatus) => {
      setLoading(true);
      const { data, success, totalCount } = await getAllStudentsAPI({
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
        showAlert("failed to fetch student data !", "error");
      }
      setLoading(false);
    },
    [showAlert, currentBranch.branchId, token]
  );

  useEffect(() => {
    currentBranch && fetchStudents();
  }, [fetchStudents, currentBranch]);

  const handlePageChange = async (e, p) => {
    setLoading(true);
    setPage(p);
    fetchStudents(p);
    setLoading(false);
  };

  const handleSearch = async (searchTerm) => {
    setLoading(true);
    await fetchStudents(page, searchTerm);
    setLoading(false);
  };
  const onClickOnRow = (row) => {
    navigate(`/management/student/${row.studentId}`);
  };

  const onApplyFIlter = (x) => {
    Object.keys(x).length > 0 ?
      fetchStudents(page, null, Object.keys(x).length == 1 ? Object.keys(x)[0] : null) : fetchStudents(page);
  }
  return (
    <FlexBetweenColumn sx={{ overflow: "auto" }}>
      <FlexBetween paddingBottom={2} gap={1}>
        <SearchField handleSearch={handleSearch} />
        <QrForm
          qrSize={500}
          title="Student Form"
          link={"student-form"}
        />
        <Filter onChange={onApplyFIlter} checkboxes={[{ key: 'ACTIVE', label: 'Active' }, { key: 'INACTIVE', label: 'Inactive' }]} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/management/student/NEW`)}
          sx={{ fontWeight: "bold", padding: "1px" }}
        >
          <Add sx={{ padding: 0, margin: "auto" }} />
        </Button>
      </FlexBetween>

      <Box>
        {data && (
          <DataTable
            data={data}
            imageFieldName={"imageUrl"}
            statusFieldName="membershipStatus"
            startIndex={(parseInt(page) - 1) * size}
            onClickOnRow={onClickOnRow}
            columns={["imageUrl", "name", "email", "phone", "dob", "membershipStatus"]}
          />
        )}
      </Box>
      <FlexBetween>
        <Box></Box>
        <Pagination
          count={totalPage}
          onChange={handlePageChange}
          page={page}
          color="primary"
          sx={{ my: 2 }}
        />
      </FlexBetween>
      {loading && <Loading />}
    </FlexBetweenColumn>
  );
};

export default Students;
