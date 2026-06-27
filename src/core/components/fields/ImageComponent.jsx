import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAlert } from "../feedback/Alert";
import { uploadImageApiCall } from "../../../api/uploadImg.api";
import FileDropZone from "./FileDropZone";

/**
 * ImageComponent
 *
 * A container wrapper around FileDropZone that handles the authentication,
 * image uploading API call, state/alert management, and default image fallback.
 */
const ImageComponent = ({
    value,
    setValue,
    size = "200px",
    isCircular = true,
    allowEdit = false,
    dirName = "default",
}) => {
    const showAlert = useAlert();
    const token = useSelector((state) => state.auth.token);
    const [previewUrl, setPreviewUrl] = useState(value || "/assets/defaultUserPic.png");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setPreviewUrl(value || "/assets/defaultUserPic.png");
    }, [value]);

    const handleDrop = async (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
            setUploading(true);

            try {
                const result = await uploadImageApiCall(file, token, dirName);

                if (result.success) {
                    showAlert(result.message, "success");
                    setValue(result.data.data[0]);
                    setPreviewUrl(result.data.data[0]);
                } else {
                    showAlert(result.message, "error");
                    setPreviewUrl(value || "/assets/defaultUserPic.png");
                }
            } catch (error) {
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

ImageComponent.propTypes = {
    value: PropTypes.string,
    setValue: PropTypes.func,
    size: PropTypes.string,
    isCircular: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    allowEdit: PropTypes.bool,
    dirName: PropTypes.string,
};

export default ImageComponent;
