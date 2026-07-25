import { useAppDispatch, useAppSelector } from "@/state";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { Box, Chip } from "@mui/material";
import { studentsAssignmentsCruds } from "../../../api/all.api";
import { useAppUI } from "@/context/UIContext";
import { useMemo, useRef, useState } from "react";
import Views from "@/core/crud/Views";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import StudentAttendence from "../Student/StudentAttendence";
import BulkAttendanceDialog from "./BulkAttendanceDialog";
import Loading from "@/core/components/loading/Loading";
import { useAlert } from "@/core/components/feedback/Alert";
import { getCurrentDateLocal } from "@/core/utils/DateUtil";
import MarkPresentDialog from "../Student/MarkPresent";
import CardHeader from "@/core/components/cards/CardHeader";
import CardChip from "@/core/components/cards/CardChip";
import { CalendarMonth, Class, AccessTime } from "@mui/icons-material";
import type { AttendanceEntry, StudentAssignment } from "../../../api/types";
import type { FieldDef, FieldMeta } from "@/core/types";

const LIMIT = 50;
const FIELD_META: FieldMeta = {
    primary: "assignmentId",
    root: "branchId",
};
const VIEWS = ["LIST", "CARD"] as const;

const Attendance = () => {
    const { permissions, isMobile, token, currentBranch } = useAppUI();
    const showAlert = useAlert();
    const dispatch = useAppDispatch();

    const allActivities = useAppSelector((state) => state.activities.items);
    const api = useRef({});
    const [showAttendence, setShowAttendence] = useState<boolean | StudentAssignment>(false);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(getCurrentDateLocal());
    const [showBulkAttendanceDialog, setShowBulkAttendanceDialog] = useState<
        StudentAssignment[] | null
    >(null);

    const filterOptions = useMemo(
        () => [
            { name: "date", key: "date", values: [] },
            { name: "Limit", key: "size", values: ["10", "20", "30", "100", "150", "200"] },
            {
                name: "Activity",
                key: "activityName",
                values: allActivities.map((a) => a.activityType).filter((v): v is string => !!v),
            },
        ],
        [allActivities],
    );

    const FIELDS = useMemo(
        (): FieldDef<StudentAssignment>[] => [
            {
                show: true,
                name: "studentName",
                label: "Student Name",
                extraProp: { readOnly: true },
            },
            {
                show: true,
                name: "activityName",
                label: "Activity",
                extraProp: { readOnly: true },
            },
            {
                show: true,
                name: "membershipType",
                label: "Membership Type",
                extraProp: { readOnly: true },
            },
            {
                show: true,
                name: "daysPerWeek",
                label: "Days / week",
                extraProp: { readOnly: true },
            },
            {
                show: permissions.BATCH,
                name: "batchName",
                label: "Batch Name",
                extraProp: { readOnly: true },
            },
            {
                show: permissions.BATCH,
                name: "batchTime",
                label: "Batch Time",
                extraProp: { readOnly: true },
            },
            {
                show: true,
                name: "membershipStatus",
                label: "Membership Status",
                defaultValue: "INACTIVE",
                getValue: (value) => (
                    <Box
                        sx={{
                            color: value === "ACTIVE" ? "green" : "red",
                            fontWeight: "bolder",
                        }}
                    >
                        {String(value)}
                    </Box>
                ),
                extraProp: { readOnly: true },
            },
            {
                show: true,
                name: "present",
                label: "Present",
                type: "CHECK",
                getValue: (_value, row) => {
                    if (!row.attendanceEntries) return false;
                    return row.attendanceEntries.filter(
                        (entry) => entry.date.split(" ")[0] === date,
                    )?.[0]?.present;
                },
            },
        ],
        [permissions, date],
    );

    const markBulkAttendance = async (data: {
        activityAssignmentIds: (string | number)[];
        present: boolean;
        date: string;
    }) => {
        dispatch(studentsAssignmentsCruds.markAttendanceBulk(data, token, showAlert, setLoading));
    };

    const AttendanceCard = useMemo(() => {
        const Comp = ({ row }: { row: StudentAssignment }) => {
            const isPresent =
                row.attendanceEntries?.filter(
                    (entry: AttendanceEntry) => entry.date.split(" ")[0] === date,
                )?.[0]?.present || false;

            return (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                    <CardHeader
                        fieldValue={String(row.studentName ?? "")}
                        badge={row.membershipStatus}
                        enabled={row.membershipStatus === "ACTIVE"}
                    />
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        gap={1.5}
                    >
                        <CardChip
                            value={`${row.activityName} (${row.membershipType})`}
                            ChipIcon={Class}
                        />
                        <Chip
                            size="small"
                            label={isPresent ? "Present" : "Absent"}
                            color={isPresent ? "success" : "error"}
                            variant="outlined"
                            sx={{
                                height: 20,
                                fontSize: "0.65rem",
                                fontWeight: "bold",
                                borderRadius: "10px",
                                textTransform: "capitalize",
                            }}
                        />
                    </Box>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <CardChip value={`${row.daysPerWeek} days/week`} ChipIcon={CalendarMonth} />
                        {!!permissions.BATCH && !!row.batchName && (
                            <CardChip
                                value={`${String(row.batchName)} (${String(row.batchTime)})`}
                                ChipIcon={AccessTime}
                            />
                        )}
                    </Box>
                </Box>
            );
        };
        Comp.displayName = "AttendanceCard";
        return Comp;
    }, [date, permissions]);

    return (
        <FlexBetweenColumn>
            {loading && <Loading />}
            <Box>
                <Views<StudentAssignment>
                    actionBarProps={{
                        filterOptions,
                        add: false,
                        handleFilterKeys: (keys) => {
                            setDate(keys["date"]);
                        },
                        children: <MarkPresentDialog />,
                    }}
                    defaultParams={{ rootType: "BRANCH" }}
                    tableName={"studentActivities"}
                    tableCruds={studentsAssignmentsCruds}
                    size={LIMIT}
                    multi={true}
                    apiRef={api}
                    actions={[
                        { name: "delete", hide: true, onClick: () => {} },
                        { name: "edit", hide: true, onClick: () => {} },
                        {
                            multi: true,
                            name: "Attendance",
                            icon: <HowToRegIcon />,
                            enabled: () => true,
                            sx: { color: "primary.main" },
                            onClick: (row) => {
                                if (Array.isArray(row)) {
                                    setShowBulkAttendanceDialog(row);
                                } else {
                                    setShowAttendence(row as StudentAssignment);
                                }
                            },
                        },
                    ]}
                    key={"studentActivities"}
                    fields={FIELDS}
                    rootId={currentBranch.branchId}
                    fieldsMeta={FIELD_META}
                    currentView={VIEWS[!isMobile ? 0 : 1]}
                    CardContentComponent={AttendanceCard}
                />
            </Box>
            {showAttendence && (
                <StudentAttendence
                    open={true}
                    onClose={() => setShowAttendence(false)}
                    activityData={showAttendence as StudentAssignment}
                />
            )}
            {showBulkAttendanceDialog && (
                <BulkAttendanceDialog
                    open={true}
                    onClose={() => setShowBulkAttendanceDialog(null)}
                    studentsList={showBulkAttendanceDialog}
                    date={date}
                    onConfirm={markBulkAttendance}
                />
            )}
        </FlexBetweenColumn>
    );
};

export default Attendance;
