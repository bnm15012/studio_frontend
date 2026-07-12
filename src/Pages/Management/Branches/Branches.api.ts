import api from "@/core/utils/api";

const getErrorMessage = (error: unknown, defaultMessage: string): string =>
    error instanceof Error && "response" in error
        ? (error as { response?: { data?: { status?: { statusMessage?: string } } } }).response
              ?.data?.status?.statusMessage || defaultMessage
        : defaultMessage;

const getHeaders = (token: string) => ({
    headers: { Authorization: `${token}` },
});

export const getAllBranchAPI = async ({
    studioId,
    token,
}: {
    studioId: string | number;
    token: string;
}) => {
    try {
        const response = await api.get(`/branch/getAll/${studioId}`, getHeaders(token));
        const { data, status } = response.data;
        return {
            data,
            success: true,
            totalCount: status.totalCount,
            message: status.statusMessage || "Branchs fetched successfully!",
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to fetch Branchs!"),
        };
    }
};

export const addBranchAPI = async ({
    branchData,
    token,
}: {
    branchData: Record<string, unknown>;
    token: string;
}) => {
    try {
        const response = await api.post(`/branch/add`, branchData, getHeaders(token));
        const { data, status } = response.data;

        return {
            data: data[0],
            success: true,
            message: status.statusMessage || "Branch added successfully!",
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to add Branch!"),
        };
    }
};

export const updateBranchAPI = async ({
    branchId,
    branchData,
    token,
}: {
    branchId: string | number;
    branchData: Record<string, unknown>;
    token: string;
}) => {
    try {
        const response = await api.put(`/branch/update/${branchId}`, branchData, getHeaders(token));
        const { data, status } = response.data;

        return {
            data: data[0],
            success: true,
            message: status.statusMessage || "Branch updated successfully!",
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to update Branch!"),
        };
    }
};

export const toggleBranchAPI = async ({
    branchId,
    active,
    token,
}: {
    branchId: string | number;
    active: boolean;
    token: string;
}) => {
    try {
        const response = await api.put(
            `/branch/enableDisable/${branchId}/${active ? 1 : 0}`,
            {},
            getHeaders(token),
        );

        const { data, status } = response.data;

        return {
            data: data[0],
            success: true,
            message: status.statusMessage || "Branch updated successfully!",
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to update Branch!"),
        };
    }
};
