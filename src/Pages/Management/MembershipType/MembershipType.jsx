import { useState, useEffect, useCallback } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import { Add } from "@mui/icons-material";
import Loading from "../../../Components/Loading/Loading";
import { useAlert } from "../../../utils/Alert";
import { useDispatch, useSelector } from "react-redux";
import MembershipTypesTable from "./MembershipTypesTable";
import { getAllActivityMembershipTypesAPI } from "./MembershipType.api";
import { setMemberShipTypes } from "../../../state/activityMembershipTypeSlice";

const MembershipType = () => {
  const dispatch = useDispatch();
  const showAlert = useAlert();
  const [loading, setLoading] = useState(false);
  const [membershipTypes, setMembershipTypes] = useState();
  const token = useSelector((state) => state.auth.token);
  const studio = useSelector((state) => state.auth.studio);
  const cachedMembershipTypes = useSelector((state) => state.membershipTypes.data);

  const fetchMembershipTypesData = useCallback(async () => {
    try {
      if (cachedMembershipTypes.length) {
        setMembershipTypes(cachedMembershipTypes)
        return;
      }
      setLoading(true);
      const { data, success, message } = await getAllActivityMembershipTypesAPI({
        studioId: studio.studioId,
        token,
      });

      if (success) {
        setMembershipTypes(data);
        dispatch(setMemberShipTypes(data));
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to fetch expenses!", "error");
    } finally {
      setLoading(false);
    }
  }, [studio.studioId, token, showAlert]);
  const [newRow, setNewRow] = useState(null);

  useEffect(() => {
    !membershipTypes && fetchMembershipTypesData();
  }, [membershipTypes, loading, fetchMembershipTypesData]);
  
  const handleAddNew = () => {
    setNewRow({
      activityMembershipTypeId: undefined,
      activityMembershipType: "",
    });
  };

  return (
    <FlexBetweenColumn>
      {loading && <Loading />}
      <FlexBetween paddingBottom={2} gap={1} flexDirection={"row-reverse"}>
        <Button
          variant="contained"
          color="primary"
          disabled={newRow != null}
          onClick={() => handleAddNew()}
          sx={{ fontWeight: "bold", padding: ".8rem" }}
        >
          <Add sx={{ padding: 0, margin: "auto" }} />
        </Button>
      </FlexBetween>
      <Box>
        {membershipTypes && (
          <MembershipTypesTable
            initialData={(membershipTypes)}
            studioId={studio.studioId}
            token={token}
            newRow={newRow}
            setNewRow={setNewRow}
          />
        )}
      </Box>
    </FlexBetweenColumn>
  );
};

export default MembershipType;
