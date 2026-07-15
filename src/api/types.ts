import { Entity } from "@/core/types";
import { Setting } from "@/state/authSlice";

export type paymentType = "CASH" | "UPI";
export type paymentStatus = "COMPLETED" | "PENDING" | "PARTIALLY PAID";
export type genderType = "MALE" | "FEMALE" | "NOT_TO_SAY";
export type activityStatus = "ACTIVE" | "INACTIVE";
export type clientType = "GROUP" | "INDIVIDUAL" | "COMPANY";
export type expenseCategory =
    | "ELECTRICITY"
    | "SALARY"
    | "MAINTENANCE"
    | "RENT"
    | "SUPPLIES"
    | "MARKETING"
    | "OTHER";

export interface Branch extends Entity {
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

export interface User extends Entity {
    userId: number;
    userName: string;
    email: string;
    phone?: string;
    password?: string;
    role: string;
    enabled?: boolean;
    imageUrl?: string;
    userAccessEntry: Record<string, "NONE" | "FULL">;
    token: string;
}

export interface Studio extends Entity {
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

export interface SubscriptionPlan extends Entity {
    id: string | number;
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

export interface InstructorAssignment extends Entity {
    assignmentI?: number;
    instructorId: number;
    activityName: string;
    assignedDate: string;
    startDate: string;
    endDate?: string;
    contractDocument?: string;
    membershipStatus: activityStatus;
}

export interface Instructor extends Entity {
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

export interface AttendanceEntry extends Entity {
    date: string;
    present: boolean;
}

export interface PaymentEntry extends Entity {
    paymentDate: string;
    payeeType: string;
    statu?: paymentStatus;
    paymentType: paymentType;
    actualAmount?: number;
    amount: number;
    branchId: number;
    payeeName?: string;
    payeeId?: number;
}

export interface StudentAssignment extends Entity {
    assignmentId: number;
    studentId: number;
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
    attendanceEntries: AttendanceEntry[];
    invoiceToken?: string;
}

export interface Student extends Entity {
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
    assignments?: StudentAssignment[];
}

export interface Client extends Entity {
    clientId: number;
    branchId: number;
    groupName: string;
    pocName: string;
    pocPhone: string;
    pocEmail: string;
    clientType: clientType;
    notes?: string;
}

export interface Booking extends Entity {
    id: number;
    branchId: number;
    purpose: string;
    clientEntr?: Partial<Client>;
    totalAmount: number;
    paymentStatus: paymentStatus;
    paidAmount: number;
    dueAmount: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
    notes?: string;
    paymentEntries?: Payment[];
    invoiceToken?: string;
}

export interface Expense extends Entity {
    expenseId: number;
    branchId: number;
    description?: string;
    expenseDate: string;
    expenseCategory: expenseCategory;
    paymentType: paymentType;
    amount: number;
}

export interface MembershipPackage extends Entity {
    id: number;
    studioId: number;
    membershipPackage: string;
    days: number;
}

export interface Enquiry extends Entity {
    enquiryId: number;
    branchId: number;
    enquiryDate: string;
    name: string;
    contact: string;
    enquiryPurpose: string;
}

export interface Payment extends Entity {
    id: number | string;
    branchId: number;
    payeeType: string;
    payeeName: string;
    payeeId: number;
    status: paymentStatus;
    paymentDate: string;
    paymentType: paymentType;
    amount: number;
    actualAmount?: number;
}

export interface BatchEntry extends Entity {
    batchId?: number;
    name?: string;
    planType?: string;
    startTime?: string;
    endTime?: string;
    daysPerWeek?: number;
    price?: number;
}

export interface Activity extends Entity {
    activityId: number | string;
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

export interface GenericTemplate extends Entity {
    id: number;
    studioId: number;
    templateType: string;
    templateName: string;
    templateSubject: string;
    templateContent: string;
}

export interface BulkUploadJob extends Entity {
    id: number | string;
    entityType?: string;
    fileUrl?: string;
    status?: string;
    createdAt?: string;
    branchId?: number;
    totalRecords?: number;
    successCount?: number;
    failureCount?: number;
}
