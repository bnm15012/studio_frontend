import PropTypes from "prop-types";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { Box, CircularProgress, Typography, IconButton, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import { useAlert } from "../utils/Alert";
import { uploadImageApiCall } from "../utils/uploadImg.api";

const ImageComponent = ({
    image,
    setImage,
    size = "200px",
    isCircular = true,
    allowEdit = false,
    dirName = "default",
}) => {
    const theme = useTheme();
    const showAlert = useAlert();
    const token = useSelector((state) => state.auth.token);

    const [previewUrl, setPreviewUrl] = useState(image || "/assets/defaultUserPic.png");
    const [uploading, setUploading] = useState(false);

    const handleDrop = async (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
            setUploading(true);

            try {
                // Upload Image
                const result = await uploadImageApiCall(file, token, dirName);

                if (result.success) {
                    showAlert(result.message, "success");
                    setImage(result.data.data[0]);
                    setPreviewUrl(result.data.data[0]);
                } else {
                    showAlert(result.message, "error");
                    setPreviewUrl(image || "/assets/defaultUserPic.png");
                }
            } catch (error) {
                console.error(error);
                showAlert("An error occurred during image upload.", "error");
                setPreviewUrl(image || "/assets/defaultUserPic.png");
            }

            setUploading(false);
            URL.revokeObjectURL(preview);
        }
    };

    return (
        <Dropzone
            accept={{
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"],
            }}
            multiple={false}
            onDrop={handleDrop}
            disabled={!allowEdit}
        >
            {({ getRootProps, getInputProps }) => (
                <Box
                    {...getRootProps()}
                    position="relative"
                    width={size}
                    height={size}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        borderRadius: isCircular ? "50%" : "0",
                        overflow: "hidden",
                        border: allowEdit ? `2px dashed ${theme.palette.primary.main}` : "none",
                        cursor: allowEdit ? "pointer" : "default",
                        "&:hover": allowEdit
                            ? { borderColor: theme.palette.primary.dark }
                            : undefined,
                    }}
                >
                    {uploading && (
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            width="100%"
                            height="100%"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            bgcolor="rgba(255, 255, 255, 0.8)"
                            zIndex={2}
                        >
                            <CircularProgress />
                        </Box>
                    )}
                    <img
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: previewUrl ? "block" : "none",
                        }}
                        alt="userImage"
                        src={previewUrl}
                    />
                    {!previewUrl && !uploading && (
                        <Typography variant="body2" color="textSecondary">
                            Drag & Drop or Click to Upload
                        </Typography>
                    )}
                    {allowEdit && !uploading && (
                        <IconButton
                            sx={{
                                position: "absolute",
                                backgroundColor: "rgba(255, 255, 255, 0.5)",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                },
                            }}
                        >
                            <EditIcon />
                            <input {...getInputProps()} />
                        </IconButton>
                    )}
                </Box>
            )}
        </Dropzone>
    );
};

ImageComponent.propTypes = {
    image: PropTypes.string,
    setImage: PropTypes.func,
    size: PropTypes.string,
    isCircular: PropTypes.bool,
    allowEdit: PropTypes.bool,
    dirName: PropTypes.string,
};

export default ImageComponent;
