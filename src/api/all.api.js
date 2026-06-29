import { createCrudModule } from "../core/api/createCrudModule";
import api from "../core/utils/api";
import { getApiMessage, withLoading } from "../core/api/helper";

const crudConfigs = [
    { key: "users", route: "users", idKey: "userId" },
    { key: "instructors", route: "instructors", idKey: "instructorId" },
    { key: "instructorsAssignments", route: "instructorActivities", idKey: "assignmentId" },
    { key: "students", route: "students", idKey: "studentId" },
    { key: "client", route: "clients", idKey: "clientId" },
    { key: "booking", route: "booking" },
    { key: "expense", route: "expenses", idKey: "expenseId" },
    { key: "membershipPackage", route: "membershipPackages" },
    { key: "enquiry", route: "enquiries", idKey: "enquiryId" },
    { key: "payment", route: "payments" },
    { key: "genericTemplate", route: "genericTemplate" },
    { key: "activity", route: "activities", idKey: "activityId" },
];

const modules = {};
crudConfigs.forEach(({ key, route, idKey }) => {
    modules[`${key}Cruds`] = createCrudModule({ route, idKey });
});

export const {
    usersCruds,
    instructorsCruds,
    instructorsAssignmentsCruds,
    studentsCruds,
    clientCruds,
    bookingCruds,
    expenseCruds,
    membershipPackageCruds,
    enquiryCruds,
    paymentCruds,
    genericTemplateCruds,
    activityCruds,
} = modules;

export const studentsAssignmentsCruds = createCrudModule({
    route: "studentActivities",
    idKey: "assignmentId",
    extraCruds: ({ actions, getHeader, route }) => ({
        markAttendanceBulk: (payload, token, showAlert, setLoading) => async (dispatch) => {
            await withLoading(setLoading, async () => {
                try {
                    const { data } = await api.put(
                        `/${route}/mark_attendance/bulk`,
                        payload,
                        getHeader(token),
                    );
                    dispatch(actions.updateItems(data.data));
                } catch (err) {
                    console.error(err);
                    showAlert(getApiMessage(err, "Failed to mark attendance"), "error");
                }
            });
        },
        markAttendanceQR:
            (assignmentId, token, showAlert, setLoading, throwErro) => async (dispatch) => {
                await withLoading(setLoading, async () => {
                    try {
                        const { data } = await api.put(
                            `/${route}/mark_attendance/${assignmentId}`,
                            {},
                            getHeader(token),
                        );
                        dispatch(actions.updateItem(data.data[0]));
                    } catch (err) {
                        console.error(err);
                        showAlert(getApiMessage(err, "Failed to mark attendance"), "error");
                        if (throwErro) throw err;
                    }
                });
            },
        fetchInvoiceApi: async (invoiceToken, showAlert, setLoading) =>
            withLoading(setLoading, async () => {
                try {
                    const { data } = await api.get(`/${route}/invoice?token=${invoiceToken}`);
                    return data;
                } catch (err) {
                    console.error(err);
                    showAlert(getApiMessage(err, "Failed to fetch invoice"), "error");
                }
            }),
    }),
});

export const branchCruds = createCrudModule({
    route: "branch",
    idKey: "branchId",
    extraState: { currentBranch: null, selectedBranch: null },
    extraReducers: {
        setCurrentBranch(state, action) {
            state.currentBranch = action.payload;
        },
        setSelectedBranch(state, action) {
            state.selectedBranch = action.payload;
        },
    },
});
