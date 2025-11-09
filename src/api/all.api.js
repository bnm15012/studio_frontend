import { createCrud } from "./create_crud";

export const usersCruds = createCrud({ route: "users", idKey: "userId" });

export const instructorsCruds = createCrud({ route: "instructors", idKey: "instructorId" });

export const instructorsAssignmentsCruds = createCrud({
    route: "instructorActivities",
    idKey: "assignmentId",
});

export const studentsCruds = createCrud({ route: "students", idKey: "studentId" });

const base = createCrud({
    route: "studentActivities",
    idKey: "studentId",
});

export const studentsAssignmentsCruds = {
    ...base,
    add:
        (...args) =>
        async (dispatch, getState) => {
            const [newData, token, showAlert, setLoading, prepend] = args;

            const modifiedData = { ...newData };

            const allActivities = getState()?.activity?.activities || [];

            const batchEntry = allActivities
                ?.find((a) => a.activityType === modifiedData["activityName"])
                ?.batchEntries?.find(
                    (b) =>
                        b.planType === modifiedData["membershipType"] &&
                        b.name === modifiedData["batchName"] &&
                        b.daysPerWeek === modifiedData["daysPerWeek"],
                );

            if (batchEntry) {
                modifiedData.activityAmount = batchEntry.price;
                modifiedData.batchTime = batchEntry.startTime + "-" + batchEntry.endTime;
            }

            await base.add(modifiedData, token, showAlert, setLoading, prepend)(dispatch, getState);
        },
};

export const clientCruds = createCrud({ route: "clients", idKey: "clientId" });

export const expenseCruds = createCrud({ route: "expenses", idKey: "expenseId" });

export const enquiryCruds = createCrud({ route: "enquiries", idKey: "enquiryId" });

export const paymentCruds = createCrud({ route: "payments", idKey: "paymentId" });

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
