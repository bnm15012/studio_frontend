import api from "../../core/utils/api";

interface CreateOrderProps {
    token: string | null | undefined;
    plan: string;
    studioId: string | number;
    branchId: string | number;
}

export const createOrder = async ({ token, plan, studioId, branchId }: CreateOrderProps) => {
    try {
        const response = await api.post(
            `/subscription/createOrder`,
            { subscriptionPlan: plan, studioId, branchId },
            {
                headers: {
                    Authorization: `${token}`,
                },
            },
        );
        return {
            success: true,
            data: response.data.data[0],
            message:
                response.data?.status?.statusMessage || "Order created successfully of amount!",
        };
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

export const verifyPayment = async (token: string | null | undefined, paymentDetails: any) => {
    try {
        const response = await api.post(`/subscription/verifyPayment`, paymentDetails, {
            headers: {
                Authorization: `${token}`,
            },
        });
        return {
            success: true,
            data: response.data.data[0],
            message: response.data?.status?.statusMessage || "Payment done successfully !",
        };
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw error;
    }
};
