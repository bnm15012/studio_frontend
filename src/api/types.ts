import { Setting } from "@/state/authSlice";

export type paymentType = "CASH" | "UPI";
export type paymentStatus = "COMPLETED" | "PENDING" | "PARTIALLY PAID";
export type genderType = "MALE" | "FEMALE" | "NOT_TO_SAY";
export type activityStatus = "ACTIVE" | "INACTIVE";
export type clientType = "GROUP" | "INDIVIDUAL" | "COMPANY";
export type userRights = "FULL" | "NONE";
export type bookingStatus = "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type expenseCategory =
    | "ELECTRICITY"
    | "SALARY"
    | "MAINTENANCE"
    | "RENT"
    | "SUPPLIES"
    | "MARKETING"
    | "OTHER";

export interface Branch {
    branchId: number;
    name: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
    isActive: boolean;
    studioId: number;
}

export interface User {
    userId: number;
    userName: string;
    email: string;
    phone?: string;
    password?: string;
    role: string;
    enabled?: boolean;
    imageUrl?: string;
    userAccessEntry: Record<string, userRights>;
    token: string;
}

export interface Studio {
    studioId: number;
    studioName: string;
    location: string;
    email: string;
    logo?: string;
    gstNumber?: string;
    passcode?: string;
    amcEnabled?: boolean;
    configuration: {
        configrationEntryList: Setting;
    };
    branchList: Branch[];
}

export interface SubscriptionPlan {
    id: number;
    subscriptionPlan: string;
    name: string;
    price: number;
    days: number;
    startDate: string;
    endDate: string;
    status?: string;
    orderId?: string;
    paymentId?: string;
}

export interface InstructorAssignment {
    assignmentId: number;
    instructorId: number;
    activityName: string;
    assignedDate: string;
    startDate: string;
    endDate?: string;
    contractDocument?: string;
    membershipStatus: activityStatus;
}

export interface Instructor {
    instructorId: number;
    branchId: number;
    imageUrl?: string;
    name: string;
    email: string;
    phone: string;
    dob?: string;
    instructorStatus: activityStatus;
    address?: string;
    emergencyContactNumber: string;
    bankAccountDetails?: {
        accountNumber?: string;
        bankName?: string;
        branchName?: string;
        ifscCode?: string;
        upiId?: string;
    };
    assignments?: InstructorAssignment[];
}

export interface AttendanceEntry {
    date: string;
    present: boolean;
}

export interface PaymentEntry {
    id: number;
    paymentDate: string;
    payeeType: string;
    status?: paymentStatus;
    paymentStatus?: paymentStatus;
    paymentType: paymentType;
    actualAmount?: number;
    amount: number;
    branchId: number;
    payeeName?: string;
    payeeId?: number;
}

export interface StudentAssignment {
    assignmentId: number;
    studentId: number;
    studentName?: string;
    activityName: string;
    membershipType: string;
    daysPerWeek: number;
    batchName: string;
    batchTime: string;
    activityAmount: number;
    registrationDate: string;
    membershipStartDate: string;
    membershipEndDate: string;
    membershipStatus: activityStatus;
    paymentEntry: PaymentEntry;
    attendanceEntries?: AttendanceEntry[];
    invoiceToken?: string;
}

export interface Student {
    studentId: number;
    branchId: number;
    imageUrl?: string;
    name: string;
    email: string;
    phone: string;
    dob?: string;
    age?: number;
    membershipStatus: activityStatus;
    gender?: genderType;
    address?: string;
    emergencyContactNumber: string;
    additionalData?: string;
    otherinfo?: string;
    assignments?: StudentAssignment[];
}

export interface Client {
    clientId: number;
    branchId: number;
    groupName: string;
    pocName: string;
    pocPhone: string;
    pocEmail: string;
    clientType: clientType;
    notes?: string;
}

export interface Booking {
    id: number;
    branchId: number;
    purpose: string;
    clientEntry: Partial<Client>;
    totalAmount: number;
    paymentStatus: paymentStatus;
    state: bookingStatus;
    paidAmount: number;
    dueAmount: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
    notes?: string;
    paymentEntries?: Payment[];
    invoiceToken?: string;
}

export interface Expense {
    expenseId: number;
    branchId: number;
    description?: string;
    expenseDate: string;
    expenseCategory: expenseCategory;
    paymentType: paymentType;
    amount: number;
}

export interface MembershipPackage {
    id: number;
    studioId: number;
    membershipPackage: string;
    days: number;
}

export interface Enquiry {
    enquiryId: number;
    branchId: number;
    enquiryDate: string;
    name: string;
    contact: string;
    enquiryPurpose: string;
}

export interface Payment {
    id: number;
    branchId: number;
    payeeType: string;
    payeeName: string;
    payeeId: number;
    status: paymentStatus;
    paymentDate: string;
    paymentType: paymentType;
    amount: number;
    actualAmount?: number;
    type?: string;
}

export interface BatchEntry {
    batchId: number;
    name: string;
    planType: string;
    startTime: string;
    endTime: string;
    daysPerWeek: number;
    price: number;
}

export interface Activity {
    activityId: number;
    activityType: string;
    description?: string;
    branchId: number;
    batchEntries: BatchEntry[];
    membershipPlanRequest: {
        membershipPlanEntryList?: {
            membershipType: string;
            daysPerWeek: number;
        }[];
    };
}

export interface GenericTemplate {
    id: number;
    studioId: number;
    templateType: string;
    templateName: string;
    templateSubject: string;
    templateContent: string;
}

export interface BulkUploadJob {
    id: number;
    entityType?: string;
    fileUrl?: string;
    status?: string;
    createdAt?: string;
    branchId?: number;
    totalRecords?: number;
    successCount?: number;
    failureCount?: number;
    fileName?: string;
    processedRecords?: number;
    successfulRecords?: number;
    failedRecords?: number;
    completedAt?: string;
    errorMessages?: string;
}

/** Every domain record that flows through the CRUD framework (list/table/form views). */
export type CrudRecord =
    | Branch
    | User
    | Studio
    | SubscriptionPlan
    | InstructorAssignment
    | Instructor
    | AttendanceEntry
    | PaymentEntry
    | StudentAssignment
    | Student
    | Client
    | Booking
    | Expense
    | MembershipPackage
    | Enquiry
    | Payment
    | BatchEntry
    | Activity
    | GenericTemplate
    | BulkUploadJob;
