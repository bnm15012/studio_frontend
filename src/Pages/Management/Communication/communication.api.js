import api from "../../../utils/api";


const getErrorMessage = (error, defaultMessage) =>
    error.response?.data?.status?.statusMessage || defaultMessage;

const getHeaders = (token) => ({
    headers: { Authorization: `${token}`, },
});

// TODO: remove this function, not required anymore
export const getAllTemplatesApi = async ({ token, studioId }) => {
    try {
        const response = await api.get(
            `/getTemplates/${studioId}`,
            getHeaders(token)
        );
        const { data, status } = response.data;
        return {
            data,
            success: true,
            totalCount: status.totalCount,
            message: status.statusMessage || "Templates fetched successfully!",
        };
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to fetch Templates!"),
        };
    }
};

export const sendMessageApi = async ({ token, data }) => {
    try {
        const response = await api.post(
            `/sendMessage`,
            data,
            getHeaders(token)
        );
        const { status } = response.data;
        return {
            success: true,
            message: status.statusMessage || "Message sent successfully!",
        };
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to send message!"),
        };
    }
}

export const getMessageHistoryAPI = async ({ token, branchId, page, size }) => {
    try {
        const response = await api.get(
            `/getMessageHistory/${branchId}`,
            {
                headers: { Authorization: `${token}`, },
                params: { page: page - 1, size },
            }
        );
        const { data, status } = response.data;
        return {
            data,
            success: true,
            totalCount: status.totalCount,
            message: status.statusMessage || "Templates fetched successfully!",
        };
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to fetch Templates!"),
        };
    }
}

export const getMessageRecipientsAPI = async ({ token, messageId }) => {
    try {
        const response = await api.get(
            `/getMessageRecipients/${messageId}`,
            {
                headers: { Authorization: `${token}`, },
            }
        );
        const { data, status } = response.data;
        return {
            data,
            success: true,
            message: status.statusMessage || "Templates fetched successfully!",
        };
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to fetch Templates!"),
        };
    }
}
