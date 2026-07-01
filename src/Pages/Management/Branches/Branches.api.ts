import api from "../../../core/utils/api";

const getErrorMessage = (error, defaultMessage) =>
    error.response?.data?.status?.statusMessage || defaultMessage;

const getHeaders = (token) => ({
    headers: { Authorization: `${token}` },
});

export const getAllBranchAPI = async ({ studioId, token }) => {
    try {
        const response = await api.get(`/branch/getAll/${studioId}`, getHeaders(token));
        const { data, status } = response.data;
        return {
            data,
            success: true,
            totalCount: status.totalCount,
            message: status.statusMessage || "Branchs fetched successfully!",
        };
    } catch (error: any) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to fetch Branchs!"),
        };
    }
};

export const addBranchAPI = async ({ branchData, token }) => {
    try {
        const response = await api.post(`/branch/add`, branchData, getHeaders(token));
        const { data, status } = response.data;

        return {
            data: data[0],
            success: true,
            message: status.statusMessage || "Branch added successfully!",
        };
    } catch (error: any) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to add Branch!"),
        };
    }
};

export const updateBranchAPI = async ({ branchId, branchData, token }) => {
    try {
        const response = await api.put(`/branch/update/${branchId}`, branchData, getHeaders(token));
        const { data, status } = response.data;

        return {
            data: data[0],
            success: true,
            message: status.statusMessage || "Branch updated successfully!",
        };
    } catch (error: any) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to update Branch!"),
        };
    }
};

export const toggleBranchAPI = async ({ branchId, active, token }) => {
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
    } catch (error: any) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to update Branch!"),
        };
    }
};
