import api from "../../../../utils/api";

const getErrorMessage = (error, defaultMessage) =>
    error.response?.data?.status?.statusMessage || defaultMessage;

const getHeaders = (token) => ({
    headers: { Authorization: `${token}` },
});

export const getAllManagersAPI = async ({ branchId, token }) => {
    try {
        const response = await api.get(`/users/getUsersByBranchId/${branchId}`, getHeaders(token));
        const { data, status } = response.data;
        return {
            data,
            success: true,
            message: status.statusMessage || "Branchs fetched successfully!",
        };
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to fetch Branchs!"),
        };
    }
};

export const addManagerAPI = async ({ managerData, token }) => {
    try {
        const response = await api.post(`/users/register`, managerData, getHeaders(token));
        const { data, status } = response.data;

        return {
            data: data[0],
            success: true,
            message: status.statusMessage || "Manager added successfully!",
        };
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to add Manager!"),
        };
    }
};

export const updateManagerAPI = async ({ userId, managerData, token }) => {
    try {
        const response = await api.put(`/users/update/${userId}`, managerData, getHeaders(token));
        const { data, status } = response.data;

        return {
            data: data[0],
            success: true,
            message: status.statusMessage || "Manager updated successfully!",
        };
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to update Manager!"),
        };
    }
};
