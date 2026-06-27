import { useState, useCallback } from "react";
import { FlexBetween }Column from "../../../Components/FlexBoxColumn";
import { FlexBetween } from "../../../Components/FlexBox";
import { useAlert } from "../../../core/util/Alert";
import { useSelector } from "react-redux";
import Loading from "../../../Components/Loading/Loading";
import UploadData from "./UploadData";
import { generatePresignUrl, uploadToS3 } from "../../../api/s3.api";
import { createBulkUploadJobAPI } from "./BulkUploadJobs.api";
import UploadJobHistory from "./UploadJobHistory";

const BulkUploadJobs = () => {
    const showAlert = useAlert();
    const token = useSelector((state) => state.auth.token);
    const currentBranch = useSelector((state) => state.branch.currentBranch);

    const [loading, setLoading] = useState(false);

    const handleUploadFile = useCallback(
        async (file, entityType) => {
            setLoading(true);
            try {
                const { data: s3Bucket, success } = await generatePresignUrl(
                    `BulkUpload-${currentBranch.name}.csv`,
                    token,
                    "text/csv",
                );

                if (!success || !s3Bucket?.uploadUrl || !s3Bucket?.fileUrl) {
                    throw Error("Failed to get upload URL", "error");
                } else {
                    showAlert("Preparing to upload file...", "info");
                }

                const uploadResponse = await uploadToS3(file, s3Bucket.uploadUrl, token, showAlert);
                if (!uploadResponse) {
                    throw Error("Failed to upload file to S3", "error");
                }

                showAlert("File uploaded to S3 successfully!", "success");

                const payload = {
                    branchEntry: currentBranch,
                    entityType: entityType,
                    fileUrl: s3Bucket.fileUrl,
                };

                const { success: successFileUpload, message } = await createBulkUploadJobAPI(
                    payload,
                    token,
                );

                if (!successFileUpload) {
                    throw Error(message || "Failed to create bulk upload job", "error");
                }
                showAlert("File uploaded successfully!", "success");
            } catch (error) {
                showAlert("Error uploading file: " + error.message, "error");
            } finally {
                setLoading(false);
            }
        },
        [currentBranch, token, showAlert],
    );

    return (
        <FlexBetweenColumn sx={{ overflow: "auto" }}>
            <FlexBetween paddingBottom={2} gap={1} flexDirection={"row-reverse"}>
                <UploadData
                    sampleFIlePath={"/assets/sample_file.csv"}
                    handleUploadFile={handleUploadFile}
                />
            </FlexBetween>
            {loading && <Loading />}
            <UploadJobHistory />
        </FlexBetweenColumn>
    );
};

export default BulkUploadJobs;
