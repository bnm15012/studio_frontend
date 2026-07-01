import api from "@/core/utils/api";

interface ReportsApiParams {
    startDate: any;
    startMonth: any;
    startYear: any;
    endDate: any;
    endMonth: any;
    endYear: any;
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
        let response = null;
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
        const data = response.data;
        return {
            success: true,
            data: data.data,
            message: data.message || "report data retrieved successfully!",
        };
    } catch (error: any) {
        console.error("report data fetch error:", error);
        const message =
            error?.response?.data?.status?.statusMessage || "Failed to fetch report data";
        return { success: false, message };
    }
};
