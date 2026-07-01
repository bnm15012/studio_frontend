import api from "@/core/utils/api";

export interface EnquiryAPIParams {
    newData: any;
    token: string | null | undefined;
}

export interface EnquiryAPIResponse {
    success: boolean;
    data?: any;
    message: string;
    totalCount?: number;
}

// ✅ Add Enquiry form builder
export const addEnquiryAPI = async ({
    newData,
    token,
}: EnquiryAPIParams): Promise<EnquiryAPIResponse> => {
    try {
        const response = await api.post("/enquiries/add", newData, {
            headers: {
                Authorization: token ?? "",
                "Form-Authorization": import.meta.env.VITE_APP_FORM_SIG || "",
            },
        });
        const { data, status } = response.data;
        return {
            data: data[0],
            success: true,
            message: status.statusMessage,
            totalCount: status.totalCount,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.status?.statusMessage || "Failed to add Enquiry!",
        };
    }
};
