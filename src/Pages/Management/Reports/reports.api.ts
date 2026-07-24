import api from "@/core/utils/api";

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
}: ReportsApiParams) => {
    try {
        let response: { data: { data: Record<string, unknown>[]; message?: string } } | null = null;
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
            return { success: false, message: "No response from server" };
        }
        const data = response.data;
        return {
            success: true,
            data: data.data,
            message: data.message || "report data retrieved successfully!",
        };
    } catch (error: unknown) {
        const err = error as { response?: { data?: { status?: { statusMessage?: string } } } };
        console.error("report data fetch error:", err);
        const message = err.response?.data?.status?.statusMessage || "Failed to fetch report data";
        return { success: false, message };
    }
};
