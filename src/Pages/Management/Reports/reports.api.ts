import api from "@/core/utils/api";

export interface IncomeReportEntry {
    studentName?: string;
    paymentMode?: string;
    activityName?: string;
    membershipType?: string;
    paymenDate?: string;
    amount?: number | string;
}

export interface ExpenseReportEntry {
    description?: string;
    expenseCategory?: string;
    paymentType?: string;
    expenseDate?: string;
    amount?: number | string;
}

export interface PaymentReportEntry {
    payeeType?: string;
    payeeName?: string;
    amount?: number | string;
    paymentType?: string;
    status?: string;
    paymentDate?: string;
}

export interface IEMonthlyReport {
    income?: number;
    expense?: number;
    incomeEntries?: IncomeReportEntry[];
    expenseEntries?: ExpenseReportEntry[];
}

export interface ReportResponseItem extends PaymentReportEntry {
    ieMonthlyReportEntry?: IEMonthlyReport;
}

interface ReportsApiParams {
    startDate: number;
    startMonth: number;
    startYear: number;
    endDate: number;
    endMonth: number;
    endYear: number;
    studioId: string | number;
    branchId: string | number;
    token: string | null | undefined;
    type: string;
    status: string;
    paymentMethod: string;
}

export const reportsAPi = async ({
    startDate,
    startMonth,
    startYear,
    endDate,
    endMonth,
    endYear,
    studioId,
    branchId,
    token,
    type,
    status,
    paymentMethod,
}: ReportsApiParams): Promise<{
    success: boolean;
    data?: ReportResponseItem[];
    message: string;
}> => {
    try {
        let response: { data: { data: ReportResponseItem[]; message?: string } } | null = null;
        if (type === "payment") {
            response = await api.get(
                `/reports/payments/${studioId}/${branchId}/${startDate}/${startMonth}/${startYear}/${endDate}/${endMonth}/${endYear}?status=${status}&paymentType=${paymentMethod}`,
                {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                        "User-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                    },
                },
            );
        } else {
            response = await api.get(
                `/reports/${studioId}/${branchId}/${startDate}/${startMonth}/${startYear}/${endDate}/${endMonth}/${endYear}?paymentType=${paymentMethod}`,
                {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                        "User-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                    },
                },
            );
        }
        if (!response) {
            return { success: false, data: [], message: "No response from server" };
        }
        const data = response.data;
        return {
            success: true,
            data: data.data,
            message: data.message || "report data retrieved successfully!",
        };
    } catch (error) {
        const err = error as { response?: { data?: { status?: { statusMessage?: string } } } };
        console.error("report data fetch error:", err);
        const message = err.response?.data?.status?.statusMessage || "Failed to fetch report data";
        return { success: false, data: [], message };
    }
};
