import { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { useAlert } from '../../../utils/Alert';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FlexBetween from '../../../Components/FlexBetween';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Add, ArrowBack } from '@mui/icons-material';
import ManagerUserTable from './ManagerUser/ManagerUserTable';
import { getAllManagersAPI } from './ManagerUser/manageruser.api';
import Loading from '../../../Components/Loading/Loading';
import FlexBetweenColumn from '../../../Components/FlexBetweenColumn';

const BranchPage = ({ page, ID }) => {
  const showAlert = useAlert();
  const navigate = useNavigate();
  const studio = useSelector((state) => state.auth.studio)
  const selectedBranch = useSelector((state) => state.branch.selectedBranch)
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);

  const [managers, setMnagers] = useState();

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    try {
      const { data, success, message } = await getAllManagersAPI({
        branchId: ID,
        token,
      });

      if (success) {
        setMnagers(data);
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to fetch managers!", "error");
    } finally {
      setLoading(false);
    }
  }, [ID, token, showAlert]);
  const [newRow, setNewRow] = useState(null);

  useEffect(() => {
    !managers && fetchBranches();
    if (ID != selectedBranch.branchId)
      navigate(`/management/${page}`);
  }, [managers, ID, fetchBranches, selectedBranch.branchId, navigate, page]);


  const handleAddNew = () => {
    setNewRow({
      userName: null,
      email: null,
      phone: null,
      enabled: true,
      role: "MANAGER",
      password: "123456",
      studioEntry: {
        "studioId": studio.studioId,
        "branchList": [
          {
            "branchId": selectedBranch.branchId
          }
        ]
      }
    });
  };
  return (
    <FlexBetweenColumn gap={2} >
      <FlexBetween alignItems={"center"} gap={2}>
        <IconButton onClick={() => navigate(`/management/${page}`)}>
          <ArrowBack sx={{ color: "black" }} />
        </IconButton>
        <Typography variant="h5" fontWeight={"bold"}>
          Branch : {selectedBranch.name}
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={
            <Add />
          }
          disabled={newRow != null}
          onClick={() => handleAddNew()}
          sx={{ fontWeight: "bold", padding: 2 }}
        >
          Add new Manager
        </Button>
      </FlexBetween>
      {loading && <Loading />}
      {
        managers &&
        <ManagerUserTable
          selectedBranch={selectedBranch}
          token={token}
          newRow={newRow}
          setNewRow={setNewRow}
          initialData={managers}
        />
      }
    </FlexBetweenColumn>
  )
}
BranchPage.propTypes = {
  page: PropTypes.string.isRequired,
  ID: PropTypes.string.isRequired,
};

export default BranchPage
