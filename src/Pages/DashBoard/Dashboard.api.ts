import api from "@/core/utils/api";

export const fetchDashBoardData = async ({
    token,
    branchId,
}: {
    token: string;
    branchId: number;
}) => {
    const today = new Date();
    try {
        const response = await api.get(
            `/dashboard/getDashboardDetails/${branchId}?currentMonth=${today.getMonth() + 1}&currentYear=${today.getFullYear()}`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                    "User-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
            },
        );

        const data = response.data;
        return {
            success: true,
            data,
            message: data.message || "Dashboard data retrieved successfully!",
        };
    } catch (error) {
        console.error("Dashboard data fetch error:", error);

        const message =
            error instanceof Error && "response" in error
                ? (error as { response?: { data?: { status?: { statusMessage?: string } } } })
                      .response?.data?.status?.statusMessage || "Failed to fetch dashboard data"
                : "Failed to fetch dashboard data";
        return { success: false, message };
    }
};
