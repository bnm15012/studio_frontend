import PropTypes from "prop-types";
import { TableBody, TableHead, IconButton, Tooltip, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FlexEvenly from "./FlexEvenly";
import ImageComponent from "./ImageComponent";
import {
    StyledTable,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from "./StyledTableComponents";
import { getLocalDateTime } from "../utils/DateUtil";

const StatusCell = ({ status }) => {
    const statusStyle = {
        color: status === "ACTIVE" ? "green" : "red",
        fontWeight: "bold",
        textTransform: "capitalize",
    };

    return <span style={statusStyle}>{status}</span>;
};

const DataTable = ({
    data,
    columns: visibleColumns = [],
    imageFieldName,
    onEdit,
    onDelete,
    startIndex,
    statusFieldName = "status",
    onClickOnRow = undefined,
}) => (
    <StyledTableContainer component={Paper}>
        <StyledTable>
            <TableHead>
                <StyledTableRow>
                    <StyledTableCell>S. No</StyledTableCell>
                    {visibleColumns.map((header, index) => (
                        <StyledTableCell
                            sx={{ textAlign: "center" }}
                            key={`header-${header}-${index}`}
                        >
                            {header === imageFieldName
                                ? "Image"
                                : header.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
                        </StyledTableCell>
                    ))}
                    {(onEdit || onDelete) && (
                        <StyledTableCell sx={{ textAlign: "center" }} key="actions-header">
                            Actions
                        </StyledTableCell>
                    )}
                </StyledTableRow>
            </TableHead>

            <TableBody>
                {data.map((row, index) => (
                    <StyledTableRow
                        onClick={onClickOnRow != undefined ? () => onClickOnRow(row) : undefined}
                        sx={{
                            cursor: onClickOnRow != undefined ? "pointer" : "default",
                        }}
                        key={index}
                    >
                        <StyledTableCell>{startIndex + index + 1}</StyledTableCell>
                        {visibleColumns.map((header, index) => (
                            <StyledTableCell
                                sx={{ textAlign: "center" }}
                                key={`${row.id}-${header}-${index}`}
                            >
                                {header === imageFieldName ? (
                                    <FlexEvenly width={"100%"}>
                                        <ImageComponent size={"30px"} image={row.imageUrl} />
                                    </FlexEvenly>
                                ) : header === statusFieldName ? (
                                    <StatusCell status={row[header]} />
                                ) : header === "dob" ? (
                                    getLocalDateTime(row[header])
                                ) : (
                                    row[header]
                                )}
                            </StyledTableCell>
                        ))}
                        {(onEdit || onDelete) && (
                            <StyledTableCell key={`actions-${row.id}`}>
                                <FlexEvenly>
                                    {onEdit && (
                                        <Tooltip title="Edit" arrow>
                                            <IconButton
                                                color="primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(row);
                                                }}
                                                sx={{
                                                    ":hover": {
                                                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                                                    },
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {onDelete && (
                                        <Tooltip title="Delete" arrow>
                                            <IconButton
                                                sx={{
                                                    color: "red",
                                                    ":hover": {
                                                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                                                    },
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(row);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </FlexEvenly>
                            </StyledTableCell>
                        )}
                    </StyledTableRow>
                ))}

                {data.length === 0 && (
                    <StyledTableRow>
                        <StyledTableCell colSpan={7}>
                            <FlexEvenly>
                                No data available. Add by clicking the &quot;+&quot; button!
                            </FlexEvenly>
                        </StyledTableCell>
                    </StyledTableRow>
                )}
            </TableBody>
        </StyledTable>
    </StyledTableContainer>
);
StatusCell.propTypes = {
    status: PropTypes.string.isRequired,
};

DataTable.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array,
    imageFieldName: PropTypes.string,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    startIndex: PropTypes.number,
    statusFieldName: PropTypes.string,
    onClickOnRow: PropTypes.func,
};

export default DataTable;
