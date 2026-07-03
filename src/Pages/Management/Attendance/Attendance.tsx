import { useAppDispatch, useAppSelector } from "@/state";
import { FlexBetweenColumn } from "@/core/components/layout/FlexBox";
import { Box, Chip } from "@mui/material";
import { studentsAssignmentsCruds } from "../../../api/all.api";
import { useUI } from "../../../context/UIContext";
import ActionBar from "@/core/components/layout/ActionBar";
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
import type { StudentAssignment } from "../../../api/types";

const LIMIT = 50;

const FIELD_META = {
    primary: "assignmentId",
    root: "branchId",
};
const VIEWS = ["LIST", "CARD"];

const Attendance = () => {
    const { FEATURE_KEYS, isEnabled, isMobile, token, currentBranch } = useUI()
    const showAlert = useAlert();
    const dispatch = useAppDispatch();

    const allActivities = useAppSelector((state) => state.activities.items);
    const api = useRef({});
    const [showAttendence, setShowAttendence] = useState<boolean | StudentAssignment>(false);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(getCurrentDateLocal());
    const [showBulkAttendanceDialog, setShowBulkAttendanceDialog] = useState<StudentAssignment[] | null>(null);

    const filterOptions = useMemo(
        () => [
            { name: "date", key: "date" },
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
        () => [
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
                label: "Days Per week",
                extraProp: { readOnly: true },
            },
            {
                show: isEnabled(FEATURE_KEYS.BATCH),
                name: "batchName",
                label: "Batch Name",
                extraProp: { readOnly: true },
            },
            {
                show: isEnabled(FEATURE_KEYS.BATCH),
                name: "batchTime",
                label: "Batch Time",
                extraProp: { readOnly: true },
            },
            {
                show: true,
                name: "membershipStatus",
                label: "Membership Status",
                defaultValue: "INACTIVE",
                getValue: (value: unknown) => (
                    <Box
                        sx={{
                            color: value === "ACTIVE" ? "green" : "red",
                            fontWeight: "bolder",
                        }}
                    >
                        {value as React.ReactNode}
                    </Box>
                ),
                extraProp: { readOnly: true },
            },
            {
                show: true,
                name: "present",
                label: "Present",
                type: "CHECK",
                getValue: (value: unknown, row: Record<string, unknown>) =>
                    (row?.attendanceEntries as Array<Record<string, unknown>>)
                        ?.filter(
                            (entry: Record<string, unknown>) => (entry.date as string).split(" ")[0] === date,
                        )?.[0]?.present || false,
            },
        ],
        [isEnabled, FEATURE_KEYS, date],
    );

    const markBulkAttendance = async (data: { activityAssignmentIds: (string | number)[]; present: boolean; date: string }) => {
        dispatch((studentsAssignmentsCruds as any).markAttendanceBulk(data, token, showAlert, setLoading));
    };

    const AttendanceCard = useMemo(() => {
        const Comp = ({ row }: { row: Record<string, unknown> }) => {
            const isPresent =
                (row?.attendanceEntries as Array<Record<string, unknown>>)
                    ?.filter((entry: Record<string, unknown>) => (entry.date as string).split(" ")[0] === date)?.[0]
                    ?.present || false;

            return (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                    <CardHeader
                        fieldValue={String(row.studentName ?? "")}
                        badge={row.membershipStatus as string}
                        enabled={(row.membershipStatus as string) === "ACTIVE"}
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
                        {!!isEnabled(FEATURE_KEYS.BATCH) && !!row.batchName && (
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
    }, [date, isEnabled, FEATURE_KEYS]);

    return (
        <FlexBetweenColumn>
            {loading && <Loading />}
            <ActionBar
                api={api}
                filterOptions={filterOptions}
                add={false}
                handleFilterKeys={(keys) => {
                    setDate(keys["date"]);
                }}
            >
                <MarkPresentDialog />
            </ActionBar>
            <Box>
                <Views
                    defaultParams={{ rootType: "BRANCH" }}
                    tableName={"studentActivities"}
                    tableCruds={studentsAssignmentsCruds}
                    size={LIMIT}
                    multi={true}
                    apiRef={api}
                    actions={[
                        { name: "delete", hide: true, onClick: () => { } },
                        { name: "edit", hide: true, onClick: () => { } },
                        {
                            multi: true,
                            name: "Attendance",
                            icon: <HowToRegIcon />,
                            enabled: (row) => true,
                            sx: { color: "blue" },
                            onClick: (row) => {
                                if (Array.isArray(row)) {
                                    setShowBulkAttendanceDialog(row);
                                } else {
                                    setShowAttendence(row);
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
