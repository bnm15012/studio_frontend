import api from "../../utils/api";

export const createWhatsAppCredentialsAPI = async ({ branchId, token }) => {
    try {
        const response = await api.get(`/whatsapp/createSession/${branchId}`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        return response.data.data[0];
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.status?.statusMessage || "Failed to create QR code!",
        };
    }
};

export const checkWhatsAppConnectionAPI = async ({ branchId, token }) => {
    try {
        const response = await api.get(`/whatsapp/status/${branchId}`, {
            headers: { Authorization: `${token}` },
        });
        const { data } = response.data;
        return {
            data: data[0],
            success: true,
            message: "Connected !",
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.status?.statusMessage || "Failed to create QR code!",
        };
    }
};

export const logoutWhatsAppConnectionAPI = async ({ branchId, token }) => {
    try {
        const response = await api.get(`/whatsapp/logout/${branchId}`, {
            headers: { Authorization: `${token}` },
        });
        const { data } = response.data;
        return {
            data: data[0],
            success: true,
            message: "diconnected !",
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.status?.statusMessage || "Failed to Logout!",
        };
    }
};
