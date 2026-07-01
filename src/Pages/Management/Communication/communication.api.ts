import api from "../../../core/utils/api";

const getErrorMessage = (error, defaultMessage) =>
    error.response?.data?.status?.statusMessage || defaultMessage;

const getHeaders = (token, otherHeader = {}, params = {}) => ({
    headers: { Authorization: `${token}`, ...otherHeader },
    params: params,
});

// TODO: remove this function, not required anymore
// export const getAllTemplatesApi = async ({ token, studioId }) => {
//     try {
//         const response = await api.get(
//             `/getTemplates/${studioId}`,
//             getHeaders(token)
//         );
//         const { data, status } = response.data;
//         return {
//             data,
//             success: true,
//             totalCount: status.totalCount,
//             message: status.statusMessage || "Templates fetched successfully!",
//         };
//     } catch (error: any) {
//         return {
//             success: false,
//             message: getErrorMessage(error, "Failed to fetch Templates!"),
//         };
//     }
// };

export const sendMessageApi = async ({ token, payload, file = null, page = 1, size = 1 }) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((item) => formData.append(`${key}[]`, item));
        } else if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    });

    // Append file if provided
    if (file) {
        formData.append("file", file);
    }

    try {
        const response = await api.post(
            `/sendMessage/${payload["branchId"]}`,
            formData,
            getHeaders(token, { "Content-Type": "multipart/form-data" }, { page, size }),
        );
        const { status, data } = response.data;
        return {
            data,
            success: true,
            message: status.statusMessage || "Message sent successfully!",
        };
    } catch (error: any) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to send message!"),
        };
    }
};

export const getMessageHistoryAPI = async ({ token, branchId, page, size }) => {
    try {
        const response = await api.get(`/getMessageHistory/${branchId}`, {
            headers: { Authorization: `${token}` },
            params: { page, size },
        });
        const { data, status } = response.data;
        return {
            data,
            success: true,
            totalCount: status.totalCount,
            message: status.statusMessage || "Templates fetched successfully!",
        };
    } catch (error: any) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to fetch Templates!"),
        };
    }
};

export const getMessageRecipientsAPI = async ({ token, messageId }) => {
    try {
        const response = await api.get(`/getMessageRecipients/${messageId}`, {
            headers: { Authorization: `${token}` },
        });
        const { data, status } = response.data;
        return {
            data,
            success: true,
            message: status.statusMessage || "Templates fetched successfully!",
        };
    } catch (error: any) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to fetch Templates!"),
        };
    }
};

export const sendWhatsAppMessage = async ({ token, phone, message, payload }) => {
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    try {
        await sendMessageApi({ token, payload });
    } catch (error: any) {

    }
    return {
        success: true,
        message: "Message sent successfully!",
    };
};
