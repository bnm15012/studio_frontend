import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  DialogActions,
} from '@mui/material';
import { Close, UploadFile } from '@mui/icons-material';
import FileDropZone from './FileDropZone';
import FlexBetween from './FlexBetween';

const UploadData = ({ handleUploadFile }) => {
  const [fileUrl, setFileUrl] = useState()
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <>
      <Button variant="contained" onClick={() => setOpenDialog(true)} >
        <UploadFile />
      </Button>
      <Dialog open={openDialog}>
        <DialogTitle>
          <FlexBetween>
            <Typography my={"auto"} variant="h5">
              Upload File
            </Typography>
            <IconButton
              onClick={() => setOpenDialog(false)}
              sx={{ p: 1 }}
            >
              <Close />
            </IconButton>
          </FlexBetween>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <FileDropZone
            file={fileUrl}
            setFile={setFileUrl}
            size="250px"
            isCircular={false}
            allowEdit={true}
            uploadFileApiCall={handleUploadFile}
            acceptedFileFormats={{
              'text/csv': ['.csv']
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              handleUploadFile(fileUrl);
              setOpenDialog(false);
            }}
            disabled={!fileUrl}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

UploadData.propTypes = {
  handleUploadFile: PropTypes.func,
};

export default UploadData;
