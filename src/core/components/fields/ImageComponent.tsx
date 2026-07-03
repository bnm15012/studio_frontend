import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../state";
import { useAlert } from "../feedback/Alert";
import { uploadImageApiCall } from "../../api/uploadImg.api";
import FileDropZone from "./FileDropZone";

/**
 * ImageComponent
 *
 * A container wrapper around FileDropZone that handles the authentication,
 * image uploading API call, state/alert management, and default image fallback.
 */
export interface ImageComponentProps {
    value?: string;
    setValue?: (url: string) => void;
    size?: string;
    isCircular?: boolean | string;
    allowEdit?: boolean;
    dirName?: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
    value,
    setValue,
    size = "200px",
    isCircular = true,
    allowEdit = false,
    dirName = "default",
}) => {
    const showAlert = useAlert();
    const token = useAppSelector((state: { auth: { token: string | null } }) => state.auth.token);
    const [previewUrl, setPreviewUrl] = useState<string>(value || "/assets/defaultUserPic.png");
    const [uploading, setUploading] = useState<boolean>(false);

    useEffect(() => {
        setPreviewUrl(value || "/assets/defaultUserPic.png");
    }, [value]);

    const handleDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
            setUploading(true);

            try {
                const result = await uploadImageApiCall(file, token, dirName);

                if (result.success) {
                    showAlert(result.message, "success");
                    setValue?.((result.data as { data: string[] }).data[0]);
                    setPreviewUrl((result.data as { data: string[] }).data[0]);
                } else {
                    showAlert(result.message, "error");
                    setPreviewUrl(value || "/assets/defaultUserPic.png");
                }
            } catch (error: unknown) {
                console.error(error);
                showAlert("An error occurred during image upload.", "error");
                setPreviewUrl(value || "/assets/defaultUserPic.png");
            } finally {
                setUploading(false);
                URL.revokeObjectURL(preview);
            }
        }
    };

    return (
        <FileDropZone
            previewUrl={previewUrl}
            uploading={uploading}
            allowEdit={allowEdit}
            isCircular={isCircular}
            size={size}
            acceptedFileFormats={{
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"],
            }}
            onDrop={handleDrop}
        />
    );
};

export default ImageComponent;
