import PropTypes from 'prop-types';
import { useState } from "react";
import Dropzone from "react-dropzone";
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useAlert } from "../utils/Alert";

const MAX_FILE_SIZE_MB = 5;

const FileDropZone = ({
  file,
  setFile,
  size = "200px",
  isCircular = true,
  allowEdit = false,
  acceptedFileFormats = {
    'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
  },
}) => {
  const theme = useTheme();
  const showAlert = useAlert();
const [width, height] = size.split(" ");
  const [previewUrl, setPreviewUrl] = useState(file || null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const isImage = (type) => type.startsWith("image/");

  const handleDrop = async (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const rejected = rejectedFiles[0];
      const reason = rejected.errors?.[0]?.message || "Unsupported file.";
      showAlert(`File rejected: ${reason}`, "error");
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
        showAlert(`File size exceeds ${MAX_FILE_SIZE_MB}MB`, "error");
        return;
      }

      const isImg = isImage(file.type);
      const preview = isImg ? URL.createObjectURL(file) : null;
      setFile(file);
      setPreviewUrl(preview);
      setFileName(file.name);
      setUploading(true);
      setUploading(false);
      if (preview) URL.revokeObjectURL(preview);
    }
  };

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
            borderRadius: isCircular ? "50%" : "8px",
            overflow: "hidden",
            border: allowEdit
              ? `2px dashed ${theme.palette.primary.main}`
              : "none",
            cursor: allowEdit ? "pointer" : "default",
            "&:hover": allowEdit
              ? { borderColor: theme.palette.primary.dark }
              : undefined,
            backgroundColor: theme.palette.background.default,
            textAlign: "center",
            p: 1
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

          {previewUrl ? (
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: isImage(previewUrl) ? "block" : "none",
              }}
              alt="preview"
              src={previewUrl}
            />
          ) : fileName && !uploading ? (
            <Typography variant="body2" color="textSecondary">
              {fileName}
            </Typography>
          ) : (
            !uploading && (
              <Typography variant="body1" color="textSecondary">
                Drag & Drop or Click to Upload
              </Typography>
            )
          )}

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
              <Edit />
              <input {...getInputProps()} />
            </IconButton>
          )}
        </Box>
      )}
    </Dropzone>
  );
};

FileDropZone.propTypes = {
  file: PropTypes.object,
  uploadFileApiCall: PropTypes.func.isRequired,
  setFile: PropTypes.func.isRequired,
  size: PropTypes.string,
  isCircular: PropTypes.bool,
  allowEdit: PropTypes.bool,
  acceptedFileFormats: PropTypes.object,
};

export default FileDropZone;
