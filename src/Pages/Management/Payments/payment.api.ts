import api from "@/core/utils/api";

interface UpdatePaymentParams {
    paymentId: string | number;
    paymentData: Record<string, unknown>;
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
    } catch (error) {
        const message =
            error && typeof error === "object" && "response" in error
                ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message
                : error instanceof Error
                  ? error.message
                  : String(error);
        return {
            success: false,
            message: message || "Failed to update payment",
        };
    }
};
