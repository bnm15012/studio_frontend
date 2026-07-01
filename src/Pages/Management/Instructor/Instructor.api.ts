import api from "../../../core/utils/api";

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
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch instructors",
        };
    }
};
