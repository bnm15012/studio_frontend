import api from "../utils/api";

// not used
export const sendInvoiceMail = async ({ studioId, invoiceUrl, activityType, memberIds, token }) => {
    const data = {
        studioId,
        invoiceUrl,
        memberIds,
        activityType,
        templateName: "MEMBERSHIP_INVOICE",
        sentToAll: true,
    };

    try {
        const response = await api.post("/sendEmail", data, {
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
            },
        });
        return {
            success: true,
            data: response.data.data,
            message: response.status.statusMessage,
        };
    } catch (error) {
        console.error("Report data fetch error:", error);

        const message =
            error?.response?.data?.status?.statusMessage || "Failed to fetch dashboard data";
        return { success: false, message };
    }
};
