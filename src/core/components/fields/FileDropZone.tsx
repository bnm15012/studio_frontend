import React from "react";
import Dropzone, { DropzoneProps } from "react-dropzone";
import { Box, CircularProgress, Typography, IconButton, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

/**
 * FileDropZone
 *
 * A pure presentation component for drag & drop file/image uploading.
 * Handles drop interaction and UI rendering (hover borders, preview image,
 * upload overlay, file name, and edit button) but delegates all upload
 * logic, state management, and side-effects to the parent wrapper.
 */
interface FileDropZoneProps {
    previewUrl?: string;
    fileName?: string;
    uploading?: boolean;
    allowEdit?: boolean;
    isCircular?: boolean | string;
    size?: string;
    acceptedFileFormats?: DropzoneProps["accept"];
    onDrop: (acceptedFiles: File[], rejectedFiles?: any[]) => void;
    placeholderText?: string;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
    previewUrl,
    fileName,
    uploading = false,
    allowEdit = false,
    isCircular = true,
    size = "200px",
    acceptedFileFormats,
    onDrop,
    placeholderText = "Drag & Drop or Click to Upload",
}) => {
    const theme = useTheme();
    const [width, height] = size ? size.split(" ") : ["200px", "200px"];

    const handleDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
        onDrop?.(acceptedFiles, rejectedFiles);
    };

    const borderRadius =
        isCircular === true ? "50%" : isCircular === false ? "8px" : isCircular || "0";

    return (
        <Dropzone
            accept={acceptedFileFormats}
            multiple={false}
            maxFiles={1}
            onDrop={handleDrop}
            disabled={!allowEdit}
        >
            {({ getRootProps, getInputProps }) => (
                <Box
                    {...getRootProps()}
                    position="relative"
                    width={width}
                    height={height || width}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        borderRadius,
                        overflow: "hidden",
                        border: allowEdit ? `2px dashed ${theme.palette.primary.main}` : "none",
                        cursor: allowEdit ? "pointer" : "default",
                        "&:hover": allowEdit
                            ? {
                                  borderColor:
                                      theme.palette.secondary.main || theme.palette.primary.dark,
                              }
                            : undefined,
                        backgroundColor: previewUrl
                            ? "transparent"
                            : theme.palette.background.default,
                        textAlign: "center",
                        p: previewUrl ? 0 : 1,
                    }}
                >
                    <input {...getInputProps()} />

                    {/* Loading Overlay */}
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

                    {/* Content Display: Preview Image, File Name, or Placeholder */}
                    {previewUrl ? (
                        <img
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: previewUrl ? "block" : "none",
                            }}
                            alt="preview"
                            src={previewUrl}
                        />
                    ) : fileName && !uploading ? (
                        <Typography variant="body2" color="textSecondary" sx={{ px: 2 }}>
                            {fileName}
                        </Typography>
                    ) : (
                        !uploading && (
                            <Typography variant="body1" color="textSecondary" sx={{ px: 2 }}>
                                {placeholderText}
                            </Typography>
                        )
                    )}

                    {/* Floating Edit Button Overlay */}
                    {allowEdit && !uploading && (
                        <IconButton
                            sx={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                backgroundColor: "rgba(255, 255, 255, 0.7)",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                },
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    )}
                </Box>
            )}
        </Dropzone>
    );
};

export default FileDropZone;
