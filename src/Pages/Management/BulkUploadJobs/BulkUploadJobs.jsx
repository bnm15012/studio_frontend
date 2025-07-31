import { useState, useEffect, useCallback } from "react";
import FlexBetweenColumn from "../../../Components/FlexBetweenColumn";
import SearchField from "../../../Components/SearchField";
import { Box, Button, Pagination } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import { Add } from "@mui/icons-material";
import { useAlert } from "../../../utils/Alert";
import { useSelector } from "react-redux";
import Loading from "../../../Components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import UploadData from "../../../Components/UploadData";
import { generatePresignUrl } from "../../../api/s3.api";


const BulkUploadJobs = () => {
  const showAlert = useAlert();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const currentBranch = useSelector((state) => state.branch.currentBranch);

  const [loading, setLoading] = useState(false);

    // setLoading(true);
    //   const { data: s3Bucket, success } = await generatePresignUrl(`Invoice-${studentData.name}.pdf`, token);

    //   if (!success || !s3Bucket?.uploadUrl || !s3Bucket?.fileUrl) {
    //     showAlert("Failed to get upload URL", "error");
    //     return;
    //   } else {
    //     showAlert("Preparing to upload invoice...", "info");
    //   }
    // setLoading(false);
  
  

  return (
    <FlexBetweenColumn sx={{ overflow: "auto" }}>
      <FlexBetween paddingBottom={2} gap={1}>
        <UploadData />
       </FlexBetween>
      {loading && <Loading />}
    </FlexBetweenColumn>
  );
};

export default BulkUploadJobs;
