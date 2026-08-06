import { useState } from "react";

import {
    Button,
    DialogContent,
    DialogActions,
    TableHead,
    TableRow,
    TableCell,
    TablePagination,
    Box,
    TableBody,
    Select,
    MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FileDropZone from "@/core/components/fields/FileDropZone";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import Papa from "papaparse";
import { StyledTable } from "@/core/components/tables/StyledTableComponents";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import { useAlert } from "@/core/components/feedback/Alert";

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

interface UploadDataProps {
    handleUploadFile: (file: File | null, entityType: string) => void | Promise<void>;
    sampleFIlePath: string;
}

const UploadData: React.FC<UploadDataProps> = ({ handleUploadFile, sampleFIlePath }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const showAlert = useAlert();
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<Record<string, string>[]>([]);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>[]>([]);
    const [entityType, setEntityType] = useState("STUDENT");

    const [page, setPage] = useState(0);
    const rowsPerPage = 5;
    const startIndex = page * rowsPerPage;
    const handleChangePage = (
        _: React.ChangeEvent<unknown> | React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const parseCsv = (file: File) => {
        Papa.parse<Record<string, string>>(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const data = results.data;
                setParsedData(data);

                const errors = data.map((row) => {
                    const rowErrors: Record<string, string> = {};
                    (Object.keys(validationSchema) as Array<keyof typeof validationSchema>).forEach(
                        (key) => {
                            const { regex, required } = validationSchema[key];
                            const rawValue = row[key];
                            const value = rawValue ? rawValue.trim() : "";

                            if (required && value === "") {
                                rowErrors[key] = "Required";
                            } else if (value && !regex.test(value)) {
                                rowErrors[key] = "Invalid";
                            }
                        },
                    );
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
            <StyledDialog
                title={"Upload File"}
                closeIcon={true}
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent sx={{ p: 2 }}>
                    <FileDropZone
                        fileName={file?.name}
                        onDrop={(acceptedFiles) => {
                            if (acceptedFiles.length > 0) {
                                const f = acceptedFiles[0];
                                if (!f || f.type !== "text/csv") {
                                    showAlert("Please upload a valid CSV file.", "error");
                                    return;
                                }

                                setFile(f);
                                parseCsv(f);
                            }
                        }}
                        size="100% 5rem"
                        isCircular={false}
                        allowEdit={true}
                        acceptedFileFormats={{
                            "text/csv": [".csv"],
                        }}
                    />

                    {parsedData.length > 0 && (
                        <>
                            <Box sx={{ mt: 3, maxHeight: "300px", overflowY: "auto" }}>
                                <StyledTable size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Index</TableCell>
                                            {Object.keys(validationSchema).map((header) => (
                                                <TableCell key={header}>{header}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {parsedData
                                            .slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage,
                                            )
                                            .map((row, rowIndexGlobal) => {
                                                const rowIndex =
                                                    page * rowsPerPage + rowIndexGlobal;
                                                return (
                                                    <TableRow key={rowIndex}>
                                                        <TableCell>
                                                            {startIndex + rowIndex + 1}
                                                        </TableCell>
                                                        {Object.keys(validationSchema).map(
                                                            (key: string) => (
                                                                <TableCell
                                                                    key={key}
                                                                    sx={{
                                                                        color: validationErrors[
                                                                            rowIndex
                                                                        ]?.[key]
                                                                            ? "error.main"
                                                                            : "inherit",
                                                                    }}
                                                                >
                                                                    {validationErrors[rowIndex]?.[
                                                                        key
                                                                    ]
                                                                        ? row[key] || "*Required"
                                                                        : row[key]}
                                                                </TableCell>
                                                            ),
                                                        )}
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </StyledTable>
                            </Box>

                            <TablePagination
                                component="div"
                                count={parsedData.length ?? 0}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[5]}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <FlexBetween width="100%">
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
                                sx={{ minWidth: 150, mr: 2, padding: "0.42rem" }}
                            >
                                <MenuItem value="STUDENT">STUDENT</MenuItem>
                                <MenuItem value="INSTRUCTOR">INSTRUCTOR</MenuItem>
                            </Select>
                            <Button
                                variant="contained"
                                onClick={async () => {
                                    const hasErrors = validationErrors.some((row) =>
                                        Object.values(row).some((err) => !!err),
                                    );
                                    if (!hasErrors) {
                                        if (!entityType) {
                                            alert("Please select an entity type.");
                                            return;
                                        }

                                        await handleUploadFile(file, entityType);
                                        setOpenDialog(false);
                                        setEntityType("");
                                        setFile(null);
                                        setParsedData([]);
                                        setValidationErrors([]);
                                        setPage(0);
                                    } else {
                                        alert("Fix validation errors before uploading.");
                                    }
                                }}
                                disabled={!file || parsedData.length === 0}
                            >
                                Upload
                            </Button>
                        </Box>
                    </FlexBetween>
                </DialogActions>
            </StyledDialog>
        </>
    );
};

export default UploadData;
