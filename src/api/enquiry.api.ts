import api from "@/core/utils/api";
import { getApiMessage } from "@/core/api/helper";
import { Enquiry } from "@/api/types";

export interface EnquiryAPIParams {
    newData: Partial<Enquiry>;
    token: string;
}

export interface EnquiryAPIResponse {
    success: boolean;
    data?: Enquiry[];
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
    } catch (err) {
        return {
            success: false,
            message: getApiMessage(
                err as { response?: { data?: { status?: { statusMessage?: string } } } },
                "Failed to add Enquiry!",
            ),
        };
    }
};
