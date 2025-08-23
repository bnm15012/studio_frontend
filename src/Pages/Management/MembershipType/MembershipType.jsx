import { useState, useEffect, useCallback } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import { Box, Button } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import { Add } from "@mui/icons-material";
import Loading from "../../../Components/Loading/Loading";
import { useAlert } from "../../../utils/Alert";
import { useDispatch, useSelector } from "react-redux";
import MembershipTypesTable from "./MembershipTypesTable";
import { setMemberShipTypes } from "../../../state/activityMembershipTypeSlice";
import { getAllDataAPI } from "../../../api/common.api";

const MembershipType = () => {
  const dispatch = useDispatch();
  const showAlert = useAlert();
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const studio = useSelector((state) => state.auth.studio);
  const cachedMembershipTypes = useSelector((state) => state.membershipTypes.data);
  const [newRow, setNewRow] = useState(null);

  const fetchMembershipTypesData = useCallback(async () => {
    dispatch(getAllDataAPI({ rootId: studio.studioId, token, showAlert, route: "activity-membership-type", setData: setMemberShipTypes, setLoading }));
  }, [dispatch, studio.studioId, token, showAlert]);

  useEffect(() => {
    !cachedMembershipTypes.length && fetchMembershipTypesData();
  }, [cachedMembershipTypes.length, fetchMembershipTypesData]);

  function handleAddNew() {
    setNewRow({
      activityMembershipTypeId: undefined,
      activityMembershipType: "",
    });
  }

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
        <MembershipTypesTable
          initialData={(cachedMembershipTypes)}
          studioId={studio.studioId}
          token={token}
          newRow={newRow}
          setNewRow={setNewRow}
        />
      </Box>
    </FlexBetweenColumn>
  );
};

export default MembershipType;
