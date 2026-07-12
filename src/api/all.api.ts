import { createCrudModule } from "@/core/api/createCrudModule";
import api from "@/core/utils/api";
import { getApiMessage, withLoading } from "@/core/api/helper";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    Branch,
    User,
    Instructor,
    InstructorAssignment,
    Student,
    StudentAssignment,
    Client,
    Booking,
    Expense,
    MembershipPackage,
    Enquiry,
    Payment,
    Activity,
    GenericTemplate,
} from "@/api/types";
import { GenericState } from "@/core/state/stateTypes";
import type { AppDispatch } from "@/state";

export const usersCruds = createCrudModule<User>({ route: "users", idKey: "userId" });
export const instructorsCruds = createCrudModule<Instructor>({
    route: "instructors",
    idKey: "instructorId",
});
export const instructorsAssignmentsCruds = createCrudModule<InstructorAssignment>({
    route: "instructorActivities",
    idKey: "assignmentId",
});
export const studentsCruds = createCrudModule<Student>({ route: "students", idKey: "studentId" });
export const clientCruds = createCrudModule<Client>({ route: "clients", idKey: "clientId" });
export const bookingCruds = createCrudModule<Booking>({ route: "booking" });
export const expenseCruds = createCrudModule<Expense>({ route: "expenses", idKey: "expenseId" });
export const membershipPackageCruds = createCrudModule<MembershipPackage>({
    route: "membershipPackages",
});
export const enquiryCruds = createCrudModule<Enquiry>({ route: "enquiries", idKey: "enquiryId" });
export const paymentCruds = createCrudModule<Payment>({ route: "payments" });
export const genericTemplateCruds = createCrudModule<GenericTemplate>({ route: "genericTemplate" });
export const activityCruds = createCrudModule<Activity>({
    route: "activities",
    idKey: "activityId",
});

export const studentsAssignmentsCruds = createCrudModule<StudentAssignment>({
    route: "studentActivities",
    idKey: "assignmentId",
    extraCruds: ({ actions, getHeader, route }) => ({
        markAttendanceBulk:
            (
                payload: {
                    activityAssignmentIds: (string | number)[];
                    present: boolean;
                    date: string;
                },
                token: string | null | undefined,
                showAlert: (msg: string, type: string) => void,
                setLoading: (loading: boolean) => void,
            ) =>
            async (dispatch: AppDispatch) => {
                await withLoading(setLoading, async () => {
                    try {
                        const { data } = await api.put(
                            `/${route}/mark_attendance/bulk`,
                            payload,
                            getHeader(token),
                        );
                        dispatch(actions.updateItems(data.data));
                    } catch (err: unknown) {
                        console.error(err);
                        showAlert(
                            getApiMessage(
                                err as {
                                    response?: { data?: { status?: { statusMessage?: string } } };
                                },
                                "Failed to mark attendance",
                            ),
                            "error",
                        );
                    }
                });
            },
        markAttendanceQR:
            (
                assignmentId: string | number,
                token: string | null | undefined,
                showAlert: (msg: string, type: string) => void,
                setLoading: (loading: boolean) => void,
                throwErro?: boolean,
            ) =>
            async (dispatch: AppDispatch) => {
                await withLoading(setLoading, async () => {
                    try {
                        const { data } = await api.put(
                            `/${route}/mark_attendance/${assignmentId}`,
                            {},
                            getHeader(token),
                        );
                        dispatch(actions.updateItem(data.data[0]));
                    } catch (err: unknown) {
                        console.error(err);
                        showAlert(
                            getApiMessage(
                                err as {
                                    response?: { data?: { status?: { statusMessage?: string } } };
                                },
                                "Failed to mark attendance",
                            ),
                            "error",
                        );
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
                } catch (err: unknown) {
                    console.error(err);
                    showAlert(
                        getApiMessage(
                            err as {
                                response?: { data?: { status?: { statusMessage?: string } } };
                            },
                            "Failed to fetch invoice",
                        ),
                        "error",
                    );
                }
            }),
    }),
});

export interface BranchState extends GenericState<Branch> {
    currentBranch: Branch | null;
    selectedBranch: Branch | null;
}

export const branchCruds = createCrudModule<Branch, BranchState>({
    route: "branch",
    idKey: "branchId",
    extraState: { currentBranch: null, selectedBranch: null },
    extraReducers: {
        setCurrentBranch(state: BranchState, action: PayloadAction<Branch>) {
            state.currentBranch = action.payload;
        },
        setSelectedBranch(state: BranchState, action: PayloadAction<Branch>) {
            state.selectedBranch = action.payload;
        },
    },
});
