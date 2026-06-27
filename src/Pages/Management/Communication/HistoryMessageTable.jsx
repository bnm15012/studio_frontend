import {
    StyledTable,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from "../../../Components/StyledTableComponents";
import { Avatar, IconButton, TableBody, TableHead } from "@mui/material";
import { getLocalDateTime } from "../../../core/util/DateUtil";

import GroupsIcon from "@mui/icons-material/Groups";
import { Email, WhatsApp } from "@mui/icons-material";
import PropTypes from "prop-types";

const HistoryMessageTable = ({ onViewRecipients, history }) => (
    <StyledTableContainer>
        <StyledTable>
            <TableHead>
                <StyledTableRow>
                    <StyledTableCell sx={{ py: 1.5 }}>Title</StyledTableCell>
                    <StyledTableCell sx={{ py: 1.5 }}>Sent Date</StyledTableCell>
                    <StyledTableCell sx={{ py: 1.5 }}>Recipients</StyledTableCell>
                    <StyledTableCell sx={{ py: 1.5 }}>NotificationType</StyledTableCell>
                    <StyledTableCell sx={{ py: 1.5 }}>Action</StyledTableCell>
                </StyledTableRow>
            </TableHead>
            <TableBody>
                {history &&
                    history.map((row, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell sx={{ py: 1 }}>{row?.title}</StyledTableCell>
                            <StyledTableCell sx={{ py: 1 }}>
                                {getLocalDateTime(row?.sentDate, "DATETIME")}
                            </StyledTableCell>
                            <StyledTableCell sx={{ py: 1 }}>
                                {row?.memberType ? "All" : "Few"}
                            </StyledTableCell>
                            <StyledTableCell sx={{ py: 1 }}>
                                <Avatar
                                    size="small"
                                    sx={{
                                        p: 2,
                                        backgroundColor:
                                            row?.notificationType === "EMAIL" ? "blue" : "green",
                                    }}
                                >
                                    {row?.notificationType === "EMAIL" ? <Email /> : <WhatsApp />}
                                </Avatar>
                            </StyledTableCell>
                            <StyledTableCell sx={{ py: 1 }}>
                                <IconButton
                                    disabled={row?.memberType}
                                    onClick={() => {
                                        onViewRecipients(row.id);
                                    }}
                                >
                                    <GroupsIcon color="primary" />
                                </IconButton>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                {history && history.length === 0 && (
                    <StyledTableRow>
                        <StyledTableCell colSpan={5} align="center">
                            No Communication History available!
                        </StyledTableCell>
                    </StyledTableRow>
                )}
            </TableBody>
        </StyledTable>
    </StyledTableContainer>
);

HistoryMessageTable.propTypes = {
    history: PropTypes.arrayOf(PropTypes.object),
    onViewRecipients: PropTypes.func,
};

export default HistoryMessageTable;
