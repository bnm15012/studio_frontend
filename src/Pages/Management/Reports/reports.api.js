import api from "../../../utils/api"

export const reportsAPi = async ({ startMonth, startYear, endMonth, endYear, studioId, branchId, token, type, status }) => {
    try {
        let response = null;
        if (type === "payment") {
            response = await api.get(`/reports/payments/${studioId}/${branchId}/${startMonth}/${startYear}/${endMonth}/${endYear}?status=${status}`
                , {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                        'User-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
                    },
                }
            )
        } else {
            response = await api.get(`/reports/${studioId}/${branchId}/${startMonth}/${startYear}/${endMonth}/${endYear}`
                , {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                        'User-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
                    },
                }
            )
        }
        const data = response.data;
        return {
            success: true,
            data: data.data,
            message: data.message || "report data retrieved successfully!",
        };
    } catch (error) {
        console.error("report data fetch error:", error);
        const message =
            error?.response?.data?.status?.statusMessage ||
            "Failed to fetch report data";
        return { success: false, message };
    }
}