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
