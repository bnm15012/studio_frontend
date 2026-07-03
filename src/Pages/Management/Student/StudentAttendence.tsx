import { useAppDispatch, useAppSelector } from "@/state";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import { studentsAssignmentsCruds } from "../../../api/all.api";
import { useAlert } from "@/core/components/feedback/Alert";
import {
    formatDate,
    getLocalDateTime,
    parseDateTime,
} from "@/core/utils/DateUtil";
import QrForm from "@/core/components/forms/QrForm";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface StudentAttendenceProps {
    open: boolean;
    onClose: () => void;
    activityData: any;
}

const StudentAttendence: React.FC<StudentAttendenceProps> = ({ open, onClose, activityData }) => {
    const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);
    const showAlert = useAlert();

    // const allDates = useMemo(() => {
    //     if (!activityData) return [];

    //     return getDateRangeLocal(activityData.membershipStartDate, activityData.membershipEndDate);
    // }, [activityData]);

    useEffect(() => {
        if (!activityData) return;

        const map: Record<string, boolean> = {};

        activityData.attendanceEntries?.forEach((entry: any) => {
            const key = entry.date;
            map[key] = entry.present;
        });

        setAttendanceMap(map);
    }, [activityData]);

    const toggleAttendance = (date: Date) => {
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
        const attendanceEntries = Object.entries(attendanceMap).map(([date, present]) => ({
            date,
            present,
        }));
        dispatch(
            (studentsAssignmentsCruds as any).update(
                activityData.assignmentId,
                {
                    attendanceEntries,
                },
                token,
                showAlert,
                () => { },
            ),
        );
        onClose();
    };

    const hasChange = useCallback(
        (currentMap: Record<string, boolean>) => {
            const originalMap: Record<string, boolean> = {};

            activityData.attendanceEntries?.forEach((entry: any) => {
                originalMap[entry.date] = entry.present;
            });

            const allKeys = new Set([...Object.keys(originalMap), ...Object.keys(currentMap)]);

            return [...allKeys].some(
                (key) => (originalMap[key] ?? false) !== (currentMap[key] ?? false),
            );
        },
        [activityData],
    );

    const [currentMonth, setCurrentMonth] = useState(new Date());

    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const membershipStartMonth = useMemo(() => {
        const d = parseDateTime(activityData?.membershipStartDate || "");
        return d ? new Date(d.getFullYear(), d.getMonth(), 1) : new Date();
    }, [activityData]);

    const membershipEndMonth = useMemo(() => {
        const d = parseDateTime(activityData?.membershipEndDate || "");
        return d ? new Date(d.getFullYear(), d.getMonth(), 1) : new Date();
    }, [activityData]);

    const visibleMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

    const daysInMonth: Date[] = [];
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
        daysInMonth.push(new Date(d));
    }

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    return (
        <>
            <StyledDialog
                open={open}
                onClose={onClose}
                title={`Student Attendance for activity: ${activityData?.activityName}`}
                maxWidth={"sm"}
                onConfirm={handleSave}
                confirmText="Save"
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
                            qrValue={activityData?.activityName + "/" + activityData?.assignmentId}
                        />
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
                            <Typography variant="caption" color="text.secondary">
                                Start Date
                            </Typography>

                            <Typography fontWeight={600}>
                                {getLocalDateTime(activityData?.membershipStartDate)}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                End Date
                            </Typography>

                            <Typography fontWeight={600}>
                                {getLocalDateTime(activityData?.membershipEndDate)}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Membership
                            </Typography>

                            <Typography fontWeight={600}>{activityData?.membershipType}</Typography>
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
                        <IconButton
                            onClick={handlePrevMonth}
                            sx={{ color: "white" }}
                            disabled={visibleMonth.getTime() <= membershipStartMonth.getTime()}
                        >
                            <ChevronLeftIcon />
                        </IconButton>

                        <Typography variant="h6" fontWeight={700}>
                            {currentMonth.toLocaleDateString("en-IN", {
                                month: "long",
                                year: "numeric",
                            })}
                        </Typography>

                        <IconButton
                            onClick={handleNextMonth}
                            sx={{ color: "white" }}
                            disabled={visibleMonth.getTime() >= membershipEndMonth.getTime()}
                        >
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
                            <Box key={day} py={1} textAlign="center">
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

                            const membershipStart = parseDateTime(activityData?.membershipStartDate || "");
                            const membershipEnd = parseDateTime(activityData?.membershipEndDate || "");

                            // remove time part
                            if (membershipStart) membershipStart.setHours(0, 0, 0, 0);
                            if (membershipEnd) membershipEnd.setHours(0, 0, 0, 0);

                            const currentDate = new Date(date);
                            currentDate.setHours(0, 0, 0, 0);

                            const isDisabled = !membershipStart || !membershipEnd ||
                                currentDate.getTime() < membershipStart.getTime() ||
                                currentDate.getTime() > membershipEnd.getTime();

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
                                        cursor: isDisabled ? "not-allowed" : "pointer",
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
                                    <Typography variant="body2" fontWeight={700}>
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

const isToday = (date: Date) => {
    const today = new Date();

    return (
        today.getFullYear() === date.getFullYear() &&
        today.getMonth() === date.getMonth() &&
        today.getDate() === date.getDate()
    );
};

export default StudentAttendence;
