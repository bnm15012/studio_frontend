import api from "@/core/utils/api";

interface GetInstructorNamesParams {
    branchId: string | number;
    token: string | null | undefined;
    page: number | string;
    size: number | string;
}

export const getInstructorNamesAPI = async ({ branchId, token, page, size }: GetInstructorNamesParams) => {
    try {
        const response = await api.get(
            `/instructors/getAllInstructorsForCommunication/${branchId}?membershipStatus=ACTIVE&page=${page}&size=${size}`,
            {
                headers: {
                    Authorization: `${token}`,
                },
            },
        );
        const { data, status } = response.data;
        return {
            data,
            success: true,
            totalCount: status.totalCount,
            message: status.statusMessage || "Fetched instructors successfully!",
        };
    } catch (error: unknown) {
        const message = error && typeof error === "object" && "response" in error
            ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
            : error instanceof Error ? error.message : String(error);
        return {
            success: false,
            message: message || "Failed to fetch instructors",
        };
    }
};
