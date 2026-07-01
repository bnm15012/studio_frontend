import { useAppSelector } from "@/state";
import { useState, useCallback } from "react";
import { FlexBetweenColumn } from '../../../core/components/layout/FlexBox';
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { useAlert } from "@/core/components/feedback/Alert";
import { useSelector } from "react-redux";
import Loading from "@/core/components/loading/Loading";
import UploadData from "./UploadData";
import { generatePresignUrl, uploadToS3 } from "../../../api/s3.api";
import { createBulkUploadJobAPI } from "./BulkUploadJobs.api";
import UploadJobHistory from "./UploadJobHistory";

const BulkUploadJobs = () => {
    const showAlert = useAlert();
    const token = useAppSelector((state) => state.auth.token);
    const currentBranch = useAppSelector((state) => state.branch.currentBranch);

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
                    throw new Error("Failed to get upload URL");
                } else {
                    showAlert("Preparing to upload file...", "info");
                }

                const uploadResponse = await uploadToS3(file, s3Bucket.uploadUrl, token, showAlert);
                if (!uploadResponse) {
                    throw new Error("Failed to upload file to S3");
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
                    throw new Error(message || "Failed to create bulk upload job");
                }
                showAlert("File uploaded successfully!", "success");
            } catch (error: any) {
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
