import api from "../../../utils/api";

const getErrorMessage = (error, defaultMessage) =>
    error.response?.data?.status?.statusMessage || defaultMessage;

const getHeaders = (token) => ({
    headers: { Authorization: `${token}` },
});

/**
 * Fetch all clients with pagination.
 * @param {Object} params - Parameters for API call.
 * @param {number} params.branchId - Studio ID.
 * @param {number} params.page - Page number.
 * @param {number} params.size - Number of items per page.
 * @param {string} params.token - Authorization token.
 */
export const getAllClientsAPI = async ({ branchId, page, size, token, searchTerm }) => {
    try {
        const response = await api.get(`/clients/getAll/${branchId}`, {
            headers: { Authorization: `${token}` },
            params: { page, size, searchTerm },
        });
        const { data, status } = response.data;
        return {
            data,
            success: true,
            totalCount: status.totalCount,
            message: status.statusMessage || "Clients fetched successfully!",
        };
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to fetch clients!"),
        };
    }
};

export const getCLientByNamesAPI = async ({ token, params }) => {
    try {
        const response = await api.get(`/clients/search`, getHeaders(token), params);
        const { data, status } = response.data;
        return {
            data: data,
            success: true,
            message: status.statusMessage || "Client fetched successfully!",
        };
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to fetch client!"),
        };
    }
};
