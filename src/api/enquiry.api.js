import api from "../utils/api";

// ✅ Add Enquiry form builder
export const addEnquiryAPI = async ({ newData, token }) => {
    try {
        const response = await api.post("/enquiries/add", newData, {
            headers: {
                Authorization: `${token}`,
                "Form-Authorization": import.meta.env.VITE_APP_FORM_SIG,
            },
        });
        const { data, status } = response.data;
        return {
            data: data[0],
            success: true,
            message: status.statusMessage,
            totalCount: status.totalCount,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.status?.statusMessage || "Failed to add Enquiry!",
        };
    }
};
