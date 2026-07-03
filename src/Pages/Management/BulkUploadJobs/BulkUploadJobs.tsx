import { useState, useCallback } from "react";
import { FlexBetweenColumn } from '../../../core/components/layout/FlexBox';
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { useAlert } from "@/core/components/feedback/Alert";
import Loading from "@/core/components/loading/Loading";
import UploadData from "./UploadData";
import { generatePresignUrl, uploadToS3 } from "../../../api/s3.api";
import { createBulkUploadJobAPI } from "./BulkUploadJobs.api";
import UploadJobHistory from "./UploadJobHistory";
import { useUI } from "@/context/UIContext";

const BulkUploadJobs = () => {
    const showAlert = useAlert();
    const { token, currentBranch } = useUI();
    const [loading, setLoading] = useState(false);

    const handleUploadFile = useCallback(
        async (file: File | null, entityType: string) => {
            setLoading(true);
            try {
                const result = await generatePresignUrl(
                    `BulkUpload-${currentBranch.name ?? "default"}.csv`,
                    token,
                    "text/csv",
                );
                const s3Bucket = result.data as { uploadUrl?: string; fileUrl?: string } | undefined;
                const success = result.success;

                if (!success || !s3Bucket?.uploadUrl || !s3Bucket?.fileUrl) {
                    throw new Error("Failed to get upload URL");
                } else {
                    showAlert("Preparing to upload file...", "info");
                }

                if (!file) {
                    throw new Error("No file selected for upload");
                }

                const uploadResponse = await uploadToS3(file, s3Bucket.uploadUrl, token, showAlert as any);
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
            } catch (error: unknown) {
                showAlert("Error uploading file: " + (error instanceof Error ? error.message : String(error)), "error");
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
