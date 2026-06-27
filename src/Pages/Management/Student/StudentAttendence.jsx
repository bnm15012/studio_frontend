import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Box,
    IconButton,
    Paper,
    Typography,
} from "@mui/material";
import StyledDialog from "../../../core/components/StyledDialog";
import { studentsAssignmentsCruds } from "../../../api/all.api";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "../../../core/util/Alert";
import { formatDate, getDateRangeLocal, getLocalDateTime, parseDateTime } from "../../../core/util/DateUtil";
import QrForm from "../../../Components/QrForm";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const StudentAttendence = ({ open, onClose, activityData }) => {
    const [attendanceMap, setAttendanceMap] = useState({});
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const showAlert = useAlert();

    const allDates = useMemo(() => {
        if (!activityData) return [];

        return getDateRangeLocal(
            activityData.membershipStartDate,
            activityData.membershipEndDate
        );
    }, [activityData]);

    useEffect(() => {
        if (!activityData) return;

        const map = {};

        activityData.attendanceEntries?.forEach((entry) => {
            const key = entry.date;
            map[key] = entry.present;
        });

        setAttendanceMap(map);
    }, [activityData]);

    const toggleAttendance = (date) => {
        const key = formatDate(date);
        setAttendanceMap((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSave = () => {
        const isChange = hasChange(attendanceMap);
        if (!isChange) {
            showAlert("No changes", "error");
            return;
        }
        const attendanceEntries = Object.entries(attendanceMap).map(
            ([date, present]) => ({
                date,
                present,
            })
        );
        dispatch(studentsAssignmentsCruds.update(activityData.assignmentId, {
            attendanceEntries
        }, token, showAlert, () => { }))
        onClose();
    };

    const hasChange = useCallback((attendanceMap) => {

        const originalMap = {};

        activityData.attendanceEntries?.forEach(entry => {
            originalMap[entry.date] = entry.present;
        });

        const allKeys = new Set([
            ...Object.keys(originalMap),
            ...Object.keys(attendanceMap),
        ]);

        return [...allKeys].some(key => {
            return (originalMap[key] ?? false) !== (attendanceMap[key] ?? false);
        });

    }, [activityData]);

    const [currentMonth, setCurrentMonth] = useState(new Date());

    const startOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    );

    const endOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    );

    const membershipStartMonth = new Date(
        parseDateTime(activityData.membershipStartDate).getFullYear(),
        parseDateTime(activityData.membershipStartDate).getMonth(),
        1
    );

    const membershipEndMonth = new Date(
        parseDateTime(activityData.membershipEndDate).getFullYear(),
        parseDateTime(activityData.membershipEndDate).getMonth(),
        1
    );

    const visibleMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    );

    const daysInMonth = [];
    for (
        let d = new Date(startOfMonth);
        d <= endOfMonth;
        d.setDate(d.getDate() + 1)
    ) {
        daysInMonth.push(new Date(d));
    }

    const handlePrevMonth = () => {
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1
            )
        );
    };

    const handleNextMonth = () => {
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1
            )
        );
    };

    return (
        <>
            <StyledDialog
                open={open}
                onClose={onClose}
                title={`Student Attendance for activity: ${activityData?.activityName}`}
                maxWidth={"sm"}
                onConfirm={handleSave}
                confirmText="Save Attendance"
            >
                {/* Header Info */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 1,
                        p: 1,
                        borderRadius: 1,
                        bgcolor: "grey.50",
                    }}
                >
                    <Box display={"flex"} gap={1}>
                        <QrForm
                            title="Attendance QR"
                            qrValue={activityData.activityName + "/" + activityData.assignmentId} />
                        <Box>
                            <Typography variant="h6" fontWeight={700}>
                                {activityData?.activityName}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                {activityData?.batchName} • {activityData?.batchTime}
                            </Typography>
                        </Box>
                    </Box>

                    <Box display="flex" gap={3} flexWrap="wrap">
                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Start Date
                            </Typography>

                            <Typography fontWeight={600}>
                                {getLocalDateTime(activityData.membershipStartDate)}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                End Date
                            </Typography>

                            <Typography fontWeight={600}>
                                {getLocalDateTime(activityData.membershipEndDate)}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Membership
                            </Typography>

                            <Typography fontWeight={600}>
                                {(activityData?.membershipType)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Attendance Grid */}
                <Paper
                    variant="outlined"
                    sx={{
                        mt: 5,
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    {/* Header */}
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        px={1}
                        py={1}
                        bgcolor="primary.main"
                        color="white"
                    >
                        <IconButton onClick={handlePrevMonth} sx={{ color: "white" }} disabled={visibleMonth <= membershipStartMonth}>
                            <ChevronLeftIcon />
                        </IconButton>

                        <Typography variant="h6" fontWeight={700}>
                            {currentMonth.toLocaleDateString("en-IN", {
                                month: "long",
                                year: "numeric",
                            })}
                        </Typography>

                        <IconButton onClick={handleNextMonth} sx={{ color: "white" }} disabled={visibleMonth >= membershipEndMonth}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Box>

                    {/* Week Days */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 1fr)",
                            bgcolor: "grey.100",
                            borderBottom: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <Box
                                key={day}
                                py={1}
                                textAlign="center"
                            >
                                <Typography variant="caption" fontWeight={700}>
                                    {day}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Calendar Grid */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 1fr)",
                            gap: 1,
                            p: 1,
                        }}
                    >
                        {/* Empty spaces before month starts */}
                        {Array.from({ length: startOfMonth.getDay() }).map((_, i) => (
                            <Box key={`empty-${i}`} />
                        ))}

                        {daysInMonth.map((date) => {
                            const key = formatDate(date);
                            const present = attendanceMap[key] || false;
                            const today = isToday(date);

                            const membershipStart = parseDateTime(
                                activityData.membershipStartDate
                            );

                            const membershipEnd = parseDateTime(
                                activityData.membershipEndDate
                            );

                            // remove time part
                            membershipStart.setHours(0, 0, 0, 0);
                            membershipEnd.setHours(0, 0, 0, 0);

                            const currentDate = new Date(date);
                            currentDate.setHours(0, 0, 0, 0);

                            const isDisabled =
                                currentDate < membershipStart ||
                                currentDate > membershipEnd;

                            return (
                                <Paper
                                    key={key}
                                    onClick={() => {
                                        if (!isDisabled) {
                                            toggleAttendance(date);
                                        }
                                    }}
                                    elevation={today ? 4 : 1}
                                    sx={{
                                        height: 30,
                                        minHeight: 30,
                                        cursor: isDisabled
                                            ? "not-allowed"
                                            : "pointer",

                                        borderRadius: 1.5,

                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        transition: "all 0.15s ease",

                                        border: "1px solid",

                                        borderColor: isDisabled
                                            ? "grey.300"
                                            : present
                                                ? "success.main"
                                                : "divider",

                                        bgcolor: isDisabled
                                            ? "grey.50"
                                            : today
                                                ? present
                                                    ? "primary.dark"
                                                    : "primary.light"
                                                : present
                                                    ? "primary.main"
                                                    : "background.paper",

                                        color: isDisabled
                                            ? "text.disabled"
                                            : present || today
                                                ? "white"
                                                : "text.primary",

                                        opacity: isDisabled ? 0.45 : 1,

                                        "&:hover": isDisabled
                                            ? {}
                                            : {
                                                transform: "translateY(-1px)",
                                                boxShadow: 2,
                                            },
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        fontWeight={700}
                                    >
                                        {date.getDate()}
                                    </Typography>
                                </Paper>
                            );
                        })}
                    </Box>
                </Paper>
            </StyledDialog>
        </>
    );
};

export default StudentAttendence;

const isToday = (date) => {
    const today = new Date();

    return (
        today.getFullYear() === date.getFullYear() &&
        today.getMonth() === date.getMonth() &&
        today.getDate() === date.getDate()
    );
};