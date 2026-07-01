import api from "../../../core/utils/api";

interface UpdatePaymentParams {
    paymentId: string | number;
    paymentData: any;
    token: string | null | undefined;
}

export const updatePaymentAPI = async ({ paymentId, paymentData, token }: UpdatePaymentParams) => {
    try {
        const response = await api.put(`/payments/update/${paymentId}`, paymentData, {
            headers: {
                Authorization: `${token}`,
            },
        });
        return {
            success: true,
            data: response.data.data[0],
            message: response.data.status.statusMessage,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to update payment",
        };
    }
};
