import api from '../utils/api';

export const generatePresignUrl = async (fileName, token, contentType = "application/pdf") => {
    const data = {
        data: {
            fileName,
            contentType,
        }
    };

    try {
        const response = await api.post("/generatePresignUrl", data, {
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
            },
        });
        return {
            success: true,
            data: response.data.data,
            message: response.status.statusMessage
        };
    } catch (error) {
        console.error("Report data fetch error:", error);

        const message =
            error?.response?.data?.status?.statusMessage ||
            "Failed to fetch dashboard data";
        return { success: false, message };
    }
};
