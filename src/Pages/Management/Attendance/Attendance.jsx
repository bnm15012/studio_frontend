import { FlexBetweenColumn } from '../../../core/components/layout/FlexBox';
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { studentsAssignmentsCruds } from "../../../api/all.api";
import { useUI } from "../../../context/UIContext";
import ActionBar from "../../../core/components/layout/ActionBar";
import { useMemo, useRef, useState } from "react";
import Views from "../../../core/crud/Views";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import StudentAttendence from "../Student/StudentAttendence";
import BulkAttendanceDialog from "./BulkAttendanceDialog";
import Loading from "../../../core/components/loading/Loading";
import { useAlert } from "../../../core/components/feedback/Alert";
import { getCurrentDateLocal } from "../../../core/utils/DateUtil";
import MarkPresentDialog from "../Student/MarkPresent";

const LIMIT = 50;

const FIELD_META = {
    primary: "assignmentId",
    root: "branchId",
};
const VIEWS = ["LIST", "CARD"];

const Attendance = () => {
    const { FEATURE_KEYS, isEnabled, isMobile } = useUI();
    const showAlert = useAlert();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const currentBranch = useSelector((state) => state.branch.currentBranch);
    const allActivities = useSelector((state) => state.activities.items);
    const api = useRef({});
    const [showAttendence, setShowAttendence] = useState(false);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(getCurrentDateLocal());
    const [showBulkAttendanceDialog, setShowBulkAttendanceDialog] = useState(false);

    const filterOptions = useMemo(
        () => [
            { name: "date", key: "date" },
            { name: "Limit", key: "size", values: [10, 20, 30, 100, 150, 200] },
            {
                name: "Activity",
                key: "activityName",
                values: allActivities.map((a) => a.activityType),
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
                getValue: (value) => (
                    <Box
                        sx={{
                            color: value === "ACTIVE" ? "green" : "red",
                            fontWeight: "bolder",
                        }}
                    >
                        {value}
                    </Box>
                ),
                extraProp: { readOnly: true },
            },
            {
                show: true,
                name: "present",
                label: "Present",
                type: "CHECK",
                getValue: (value, row) =>
                    row?.attendanceEntries?.filter(
                        (entry) => entry.date.split(" ")[0] === date,
                    )?.[0]?.present || false,
            },
        ],
        [isEnabled, FEATURE_KEYS, date],
    );

    const markBulkAttendance = async (data) => {
        dispatch(studentsAssignmentsCruds.markAttendanceBulk(data, token, showAlert, setLoading));
    };

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
                        { name: "delete", hide: true },
                        { name: "edit", hide: true },
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
                />
            </Box>
            {showAttendence && (
                <StudentAttendence
                    open={true}
                    onClose={() => setShowAttendence(false)}
                    activityData={showAttendence}
                />
            )}
            {showBulkAttendanceDialog && (
                <BulkAttendanceDialog
                    open={true}
                    onClose={() => setShowBulkAttendanceDialog(false)}
                    studentsList={showBulkAttendanceDialog}
                    date={date}
                    onConfirm={markBulkAttendance}
                />
            )}
        </FlexBetweenColumn>
    );
};

export default Attendance;
