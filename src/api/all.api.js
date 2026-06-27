import api from "../utils/api";
import { createCrudModule } from "../core/api/createCrudModule";

export const usersCruds = createCrudModule({ route: "users", idKey: "userId" });

export const instructorsCruds = createCrudModule({ route: "instructors", idKey: "instructorId" });

export const instructorsAssignmentsCruds = createCrudModule({
    route: "instructorActivities",
    idKey: "assignmentId",
});

export const studentsCruds = createCrudModule({ route: "students", idKey: "studentId" });

export const studentsAssignmentsCruds = createCrudModule({
    route: "studentActivities",
    idKey: "assignmentId",
    extraCruds: ({ actions, getHeader, route }) => ({
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
        markAttendanceQR:
            (assignmentId, token, showAlert, setLoading, throwErro) => async (dispatch) => {
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
        fetchInvoiceApi: async (invoiceToken, showAlert, setLoading) => {
            try {
                setLoading(true);
                const { data } = await api.get(`/${route}/invoice?token=${invoiceToken}`);
                return data;
            } catch (err) {
                console.error(err);
                showAlert(
                    err?.response?.data?.status?.statusMessage || `Failed to fetch invoice`,
                    "error",
                );
            } finally {
                setLoading(false);
            }
        },
    }),
});

export const clientCruds = createCrudModule({ route: "clients", idKey: "clientId" });

export const bookingCruds = createCrudModule({ route: "booking" });

export const expenseCruds = createCrudModule({ route: "expenses", idKey: "expenseId" });

export const membershipPackageCruds = createCrudModule({ route: "membershipPackages" });

export const enquiryCruds = createCrudModule({ route: "enquiries", idKey: "enquiryId" });

export const paymentCruds = createCrudModule({ route: "payments" });

export const genericTemplateCruds = createCrudModule({ route: "genericTemplate" });

export const activityCruds = createCrudModule({ route: "activities", idKey: "activityId" });

export const branchCruds = createCrudModule({
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
