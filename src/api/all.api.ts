import { createCrudModule } from "@/core/api/createCrudModule";
import api from "@/core/utils/api";
import { getApiMessage, withLoading } from "@/core/api/helper";

interface CrudConfig {
    key: string;
    route: string;
    idKey?: string;
}

const crudConfigs: CrudConfig[] = [
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

const modules: Record<string, any> = {};
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
} = modules as {
    usersCruds: any;
    instructorsCruds: any;
    instructorsAssignmentsCruds: any;
    studentsCruds: any;
    clientCruds: any;
    bookingCruds: any;
    expenseCruds: any;
    membershipPackageCruds: any;
    enquiryCruds: any;
    paymentCruds: any;
    genericTemplateCruds: any;
    activityCruds: any;
};

export const studentsAssignmentsCruds = createCrudModule({
    route: "studentActivities",
    idKey: "assignmentId",
    extraCruds: ({ actions, getHeader, route }) => ({
        markAttendanceBulk:
            (
                payload: any,
                token: string | null | undefined,
                showAlert: (msg: string, type: string) => void,
                setLoading: (loading: boolean) => void,
            ) =>
                async (dispatch: any) => {
                    await withLoading(setLoading, async () => {
                        try {
                            const { data } = await api.put(
                                `/${route}/mark_attendance/bulk`,
                                payload,
                                getHeader(token),
                            );
                            dispatch(actions.updateItems(data.data));
                        } catch (err: any) {
                            console.error(err);
                            showAlert(getApiMessage(err, "Failed to mark attendance"), "error");
                        }
                    });
                },
        markAttendanceQR:
            (
                assignmentId: any,
                token: string | null | undefined,
                showAlert: (msg: string, type: string) => void,
                setLoading: (loading: boolean) => void,
                throwErro?: boolean,
            ) =>
                async (dispatch: any) => {
                    await withLoading(setLoading, async () => {
                        try {
                            const { data } = await api.put(
                                `/${route}/mark_attendance/${assignmentId}`,
                                {},
                                getHeader(token),
                            );
                            dispatch(actions.updateItem(data.data[0]));
                        } catch (err: any) {
                            console.error(err);
                            showAlert(getApiMessage(err, "Failed to mark attendance"), "error");
                            if (throwErro) throw err;
                        }
                    });
                },
        fetchInvoiceApi: async (
            invoiceToken: string,
            showAlert: (msg: string, type: string) => void,
            setLoading: (loading: boolean) => void,
        ) =>
            withLoading(setLoading, async () => {
                try {
                    const { data } = await api.get(`/${route}/invoice?token=${invoiceToken}`);
                    return data;
                } catch (err: any) {
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
        setCurrentBranch(state, action: any) {
            state.currentBranch = action.payload;
        },
        setSelectedBranch(state, action: any) {
            state.selectedBranch = action.payload;
        },
    },
});
