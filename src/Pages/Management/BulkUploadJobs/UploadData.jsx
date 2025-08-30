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
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
} from '@mui/material';
import { Link } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileDropZone from '../../../Components/FileDropZone';
import FlexBetween from '../../../Components/FlexBetween';
import Papa from 'papaparse';
import { TablePagination, Box } from '@mui/material'; // Make sure this is imported
import { StyledTable } from '../../../Components/StyledTableComponents';


const validationSchema = {
  name: {
    regex: /^[a-zA-Z\s]{2,50}$/,
    required: true,
  },
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: true,
  },
  phone: {
    regex: /^\d{10}$/,
    required: true,
  },
  address: {
    regex: /^.{5,100}$/,
    required: true,
  },
  emergencyContactNumber: {
    regex: /^\d{10}$/,
    required: true,
  },
};


// State for pagination


const UploadData = ({ handleUploadFile, sampleFIlePath }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [entityType, setEntityType] = useState('STUDENT');


  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const startIndex = (parseInt(page)) * rowsPerPage
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const parseCsv = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data;
        setParsedData(data);

        const errors = data.map((row) => {
          const rowErrors = {};
          Object.keys(validationSchema).forEach((key) => {
            const { regex, required } = validationSchema[key];
            const rawValue = row[key];
            const value = rawValue ? rawValue.trim() : '';

            if (required && value === '') {
              rowErrors[key] = 'Required';
            } else if (value && !regex.test(value)) {
              rowErrors[key] = 'Invalid';
            }
          });
          return rowErrors;
        });


        setValidationErrors(errors);
      },
    });
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpenDialog(true)}>
        <UploadFileIcon />
      </Button>
      <Dialog open={openDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <FlexBetween>
            <Typography my="auto" variant="h5">
              Upload File
            </Typography>
            <IconButton onClick={() => setOpenDialog(false)} sx={{ p: 1 }}>
              <CloseIcon />
            </IconButton>
          </FlexBetween>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <FileDropZone
            file={file}
            setFile={(f) => {
              setFile(f);
              parseCsv(f);
            }}
            size="100% 5rem"
            isCircular={false}
            allowEdit={true}
            acceptedFileFormats={{
              'text/csv': ['.csv'],
            }}
          />

          {parsedData.length > 0 && (
            <>
              <Box sx={{ mt: 3, maxHeight: '300px', overflowY: 'auto' }}>
                <StyledTable size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        Index
                      </TableCell>
                      {Object.keys(validationSchema).map((header) => (
                        <TableCell key={header}>{header}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parsedData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, rowIndexGlobal) => {
                        const rowIndex = page * rowsPerPage + rowIndexGlobal;
                        return (
                          <TableRow key={rowIndex}>
                            <TableCell>
                              {startIndex + rowIndex + 1}
                            </TableCell>
                            {Object.keys(validationSchema).map((key) => (
                              <TableCell
                                key={key}
                                sx={{
                                  color: validationErrors[rowIndex]?.[key]
                                    ? 'error.main'
                                    : 'inherit',
                                }}
                              >
                                {validationErrors[rowIndex]?.[key]
                                  ? row[key] || '*Required'
                                  : row[key]}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </StyledTable>
              </Box>

              <TablePagination
                component="div"
                count={parsedData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5]}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <FlexBetween width="100%" >
            <Box my="auto">
              <Link to={sampleFIlePath} target="_blank" download>
                Downloan Sample File
              </Link>
            </Box>
            <Box>
              <Select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                displayEmpty
                size="small"
                sx={{ minWidth: 150, mr: 2, padding: '0.42rem' }}
              >
                <MenuItem value="STUDENT">STUDENT</MenuItem>
                <MenuItem value="INSTRUCTOR">INSTRUCTOR</MenuItem>
              </Select>
              <Button
                variant="contained"
                onClick={async () => {
                  const hasErrors = validationErrors.some((row) =>
                    Object.values(row).some((err) => !!err)
                  );
                  if (!hasErrors) {
                    if (!entityType) {
                      alert('Please select an entity type.');
                      return;
                    }

                    await handleUploadFile(file, entityType);
                    setOpenDialog(false);
                    setEntityType('');
                    setFile(null);
                    setParsedData([]);
                    setValidationErrors([]);
                    setPage(0);
                  } else {
                    alert('Fix validation errors before uploading.');
                  }
                }}
                disabled={!file || parsedData.length === 0}
              >
                Upload
              </Button>
            </Box></FlexBetween>
        </DialogActions>
      </Dialog>
    </>
  );
};

UploadData.propTypes = {
  sampleFIlePath: PropTypes.string,
  handleUploadFile: PropTypes.func,
};

export default UploadData;
