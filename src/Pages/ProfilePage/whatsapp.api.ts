import api from "@/core/utils/api";

export const createWhatsAppCredentialsAPI = async ({ token, branchId }: { token: string; branchId: number }) => {
    try {
        const response = await api.get(`/whatsapp/createSession/${branchId}`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        return response.data.data[0];
    } catch (error: unknown) {
        return {
            success: false,
            message:
                error && typeof error === "object" && "response" in error
                    ? (error as { response: { data: { status: { statusMessage: string } } } }).response.data
                            ?.status?.statusMessage || "Failed to create QR code!"
                    : "Failed to create QR code!",
        };
    }
};

export const checkWhatsAppConnectionAPI = async ({ token, branchId }: { token: string; branchId: number }) => {
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
    } catch (error: unknown) {
        return {
            success: false,
            message:
                error && typeof error === "object" && "response" in error
                    ? (error as { response: { data: { status: { statusMessage: string } } } }).response.data
                            ?.status?.statusMessage || "Failed to create QR code!"
                    : "Failed to create QR code!",
        };
    }
};

export const logoutWhatsAppConnectionAPI = async ({ token, branchId }: { token: string; branchId: number }) => {
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
    } catch (error: unknown) {
        return {
            success: false,
            message:
                error && typeof error === "object" && "response" in error
                    ? (error as { response: { data: { status: { statusMessage: string } } } }).response.data
                            ?.status?.statusMessage || "Failed to Logout!"
                    : "Failed to Logout!",
        };
    }
};
