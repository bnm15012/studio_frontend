import api from "../../../core/util/api";

const getErrorMessage = (error, defaultMessage) =>
    error.response?.data?.status?.statusMessage || defaultMessage;

const getHeaders = (token) => ({
    headers: { Authorization: `${token}` },
});

export const getCLientByNamesAPI = async ({ branchId, token, params }) => {
    try {
        const response = await api.get(`/clients/search/${branchId}`, getHeaders(token), params);
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
