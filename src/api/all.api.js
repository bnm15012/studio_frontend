import api from "../utils/api";
import { createCrud } from "./create_crud";

export const usersCruds = createCrud({ route: "users", idKey: "userId" });

export const instructorsCruds = createCrud({ route: "instructors", idKey: "instructorId" });

export const instructorsAssignmentsCruds = createCrud({
    route: "instructorActivities",
    idKey: "assignmentId",
});

export const studentsCruds = createCrud({ route: "students", idKey: "studentId" });

export const studentsAssignmentsCruds = createCrud({
    route: "studentActivities",
    idKey: "assignmentId",
    extraCruds: ({
        actions,
        getHeader,
        route,
    }) => ({
        markAttendanceBulk: (payload, token, showAlert, setLoading) => async (dispatch) => {
            try {
                setLoading(true);
                const { data } = await api.put(
                    `/${route}/mark_attendance/bulk`,
                    payload,
                    getHeader(token),
                );
                dispatch(actions.updateItems(data.data));
            } catch (err) {
                console.error(err);
                showAlert(
                    err?.response?.data?.status?.statusMessage || `Failed to mark attendance`,
                    "error",
                );
            } finally {
                setLoading(false);
            }
        },
        markAttendanceQR: (assignmentId, token, showAlert, setLoading, throwErro) => async (dispatch) => {
            try {
                setLoading(true);
                const { data } = await api.put(
                    `/${route}/mark_attendance/${assignmentId}`,
                    {},
                    getHeader(token),
                );
                dispatch(actions.updateItem(data.data[0]));
            } catch (err) {
                console.error(err);
                showAlert(
                    err?.response?.data?.status?.statusMessage || `Failed to mark attendance`,
                    "error",
                );
                if (throwErro) throw err;
            } finally {
                setLoading(false);
            }
        },
    })
});

export const clientCruds = createCrud({ route: "clients", idKey: "clientId" });

export const bookingCruds = createCrud({ route: "booking" });

export const expenseCruds = createCrud({ route: "expenses", idKey: "expenseId" });

export const membershipPackageCruds = createCrud({ route: "membershipPackages" });

export const enquiryCruds = createCrud({ route: "enquiries", idKey: "enquiryId" });

export const paymentCruds = createCrud({ route: "payments" });

export const genericTemplateCruds = createCrud({ route: "genericTemplate" });

export const branchCruds = createCrud({
    route: "branch",
    idKey: "branchId",
    extraState: {
        currentBranch: null,
        selectedBranch: null,
    },
    extraReducers: {
        setCurrentBranch(state, action) {
            state.currentBranch = action.payload;
        },
        setSelectedBranch(state, action) {
            state.selectedBranch = action.payload;
        },
    },
});
