import { useState } from "react";

import {
    Box,
    Typography,
    Divider,
    RadioGroup,
    FormControlLabel,
    Radio,
    Stack,
    Avatar,
    Chip,
    Paper,
    DialogContentText,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

import StyledDialog from "@/core/components/dialogs/StyledDialog";
import { getLocalDateTime } from "@/core/utils/DateUtil";

interface BulkAttendanceDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (arg: {
        activityAssignmentIds: (string | number)[];
        present: boolean;
        date: string;
    }) => void;
    studentsList?: { assignmentId?: string | number; studentName?: string }[];
    date: string;
}

const BulkAttendanceDialog: React.FC<BulkAttendanceDialogProps> = ({
    open,
    onClose,
    onConfirm,
    studentsList = [],
    date,
}) => {
    const [attendanceType, setAttendanceType] = useState("PRESENT");

    const isPresent = attendanceType === "PRESENT";

    return (
        <StyledDialog
            open={open}
            title="Bulk Attendance"
            confirmText={isPresent ? "Mark Present" : "Mark Absent"}
            cancelText="Cancel"
            onClose={onClose}
            onConfirm={() => {
                onConfirm({
                    activityAssignmentIds: studentsList
                        .map((student) => student.assignmentId)
                        .filter((id): id is string | number => id != null),
                    present: isPresent,
                    date,
                });

                onClose();
            }}
            maxWidth="sm"
            fullWidth
        >
            <Stack spacing={2}>
                {/* Header Info */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: "background.default",
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                            sx={{
                                bgcolor: "primary.main",
                            }}
                        >
                            <GroupsRoundedIcon />
                        </Avatar>

                        <Box flex={1}>
                            <Typography variant="subtitle1" fontWeight={700}>
                                {studentsList.length} Students Selected
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Date: {getLocalDateTime(date, "DATE")}
                            </Typography>
                        </Box>

                        <Chip
                            color={isPresent ? "success" : "error"}
                            icon={isPresent ? <CheckCircleRoundedIcon /> : <CancelRoundedIcon />}
                            label={isPresent ? "Present" : "Absent"}
                        />
                    </Stack>
                </Paper>

                {/* Description */}
                <DialogContentText>
                    This action will update attendance for all selected students.
                </DialogContentText>

                {/* Attendance Selection */}
                <Box>
                    <Typography variant="subtitle2" fontWeight={700} mb={1}>
                        Attendance Status
                    </Typography>

                    <RadioGroup
                        value={attendanceType}
                        onChange={(e) => setAttendanceType(e.target.value)}
                    >
                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={2}
                        >
                            <Paper
                                variant="outlined"
                                sx={{
                                    flex: 1,
                                    borderRadius: 3,
                                    px: 1,
                                }}
                            >
                                <FormControlLabel
                                    value="PRESENT"
                                    control={<Radio />}
                                    label={
                                        <Stack>
                                            <Typography fontWeight={600}>
                                                Mark All Present
                                            </Typography>

                                            <Typography variant="caption" color="text.secondary">
                                                Students will be marked as attended
                                            </Typography>
                                        </Stack>
                                    }
                                    sx={{
                                        width: "100%",
                                        m: 0,
                                        py: 1,
                                    }}
                                />
                            </Paper>

                            <Paper
                                variant="outlined"
                                sx={{
                                    flex: 1,
                                    borderRadius: 3,
                                    px: 1,
                                }}
                            >
                                <FormControlLabel
                                    value="ABSENT"
                                    control={<Radio />}
                                    label={
                                        <Stack>
                                            <Typography fontWeight={600}>
                                                Mark All Absent
                                            </Typography>

                                            <Typography variant="caption" color="text.secondary">
                                                Students will be marked as absent
                                            </Typography>
                                        </Stack>
                                    }
                                    sx={{
                                        width: "100%",
                                        m: 0,
                                        py: 1,
                                    }}
                                />
                            </Paper>
                        </Stack>
                    </RadioGroup>
                </Box>

                <Divider />

                {/* Student List */}
                <Box>
                    <Typography variant="subtitle2" fontWeight={700} mb={1}>
                        Selected Students
                    </Typography>

                    <Paper
                        variant="outlined"
                        sx={{
                            borderRadius: 1,
                            p: 1,
                            maxHeight: 300,
                            overflowY: "auto",
                        }}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 1fr",
                                },
                                gap: 1,
                            }}
                        >
                            {studentsList.map((student, index) => (
                                <Paper
                                    key={student.assignmentId || index}
                                    variant="outlined"
                                    sx={{
                                        minWidth: 0,
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Avatar sx={{ fontSize: 14 }}>
                                        {student.studentName?.[0]}
                                    </Avatar>

                                    <Typography
                                        variant="body2"
                                        fontWeight={500}
                                        noWrap
                                        sx={{
                                            minWidth: 0,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {student.studentName}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>
                    </Paper>
                </Box>
            </Stack>
        </StyledDialog>
    );
};

export default BulkAttendanceDialog;
