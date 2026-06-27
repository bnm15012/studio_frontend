import api from "../../../core/utils/api";

export const updatePaymentAPI = async ({ paymentId, paymentData, token }) => {
    try {
        const response = await api.put(`/payments/update/${paymentId}`, paymentData, {
            headers: {
                Authorization: token,
            },
        });
        return {
            success: true,
            data: response.data.data[0],
            message: response.data.status.statusMessage,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to update payment",
        };
    }
};
