import api from "@/core/utils/api";

const getErrorMessage = (
    error: { response?: { data?: { status?: { statusMessage?: string } } } },
    defaultMessage: string,
) => error.response?.data?.status?.statusMessage || defaultMessage;

export interface SendMessagePayload {
    branchId?: string | number;
    [key: string]: unknown;
}

const getHeaders = (
    token: string | null | undefined,
    otherHeader: Record<string, string> = {},
    params: Record<string, string | number | boolean> = {},
) => ({
    headers: { Authorization: `${token}`, ...otherHeader },
    params: params,
});

export const sendMessageApi = async ({
    token,
    payload,
    file = null,
    page = 1,
    size = 1,
}: {
    token: string | null | undefined;
    payload: SendMessagePayload;
    file?: File | null;
    page?: number;
    size?: number;
}) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((item) => formData.append(`${key}[]`, String(item)));
        } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
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
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(
                error as { response?: { data?: { status?: { statusMessage?: string } } } },
                "Failed to send message!",
            ),
        };
    }
};

export const getMessageHistoryAPI = async ({
    token,
    branchId,
    page,
    size,
}: {
    token: string | null | undefined;
    branchId: string | number;
    page: number;
    size: number;
}) => {
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
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(
                error as { response?: { data?: { status?: { statusMessage?: string } } } },
                "Failed to fetch Templates!",
            ),
        };
    }
};

export const getMessageRecipientsAPI = async ({
    token,
    messageId,
}: {
    token: string | null | undefined;
    messageId: string | number;
}) => {
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
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(
                error as { response?: { data?: { status?: { statusMessage?: string } } } },
                "Failed to fetch Templates!",
            ),
        };
    }
};

export const sendWhatsAppMessage = async ({
    token,
    phone,
    message,
    payload,
}: {
    token: string | null | undefined;
    phone: string;
    message: string;
    payload: SendMessagePayload;
}) => {
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    try {
        await sendMessageApi({ token, payload });
    } catch (error) {
        console.error(error);
    }
    return {
        success: true,
        message: "Message sent successfully!",
    };
};
