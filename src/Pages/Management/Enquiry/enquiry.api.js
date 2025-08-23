import api from "../../../utils/api";

// ✅ Add Enquiry
export const addEnquiryAPI = async ({ enquiryData, token }) => {
    try {
        const response = await api.post("/enquiries/add", enquiryData, {
            headers: {
                Authorization: `${token}`,
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
            message:
                error.response?.data?.status?.statusMessage ||
                "Failed to add Enquiry!",
        };
    }
};

// ✅ Update Enquiry
export const updateEnquiryAPI = async ({ enquiryData, token }) => {
    try {
        const response = await api.put(
            `/enquiries/update/${enquiryData["enquiryId"]}`,
            enquiryData,
            {
                headers: { Authorization: `${token}` },
            }
        );
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
            message:
                error.response?.data?.status?.statusMessage ||
                "Failed to update Enquiry!",
        };
    }
};

// ✅ Delete Enquiry
export const deleteEnquiryAPI = async ({ enquiryId, token }) => {
    try {
        await api.delete(`/enquiries/delete/${enquiryId}`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        return { success: true, message: "Enquiry deleted successfully!" };
    } catch (error) {
        const message =
            error?.response?.data?.status?.statusMessage ||
            "Error deleting Enquiry";
        return { success: false, message };
    }
};

// ✅ Get All Enquiries by Studio
export const getAllEnquirysAPI = async ({ branchId, token, page, size, searchTerm }) => {
    try {
        const response = await api.get(`/enquiries/getAll/${branchId}`, {
            headers: { Authorization: `${token}` },
            params: { page: page - 1, size, searchTerm },
        });
        const { data, status } = response.data;
        return {
            data,
            success: true,
            message: status.statusMessage,
            totalCount: status.totalCount,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.status?.statusMessage ||
                "Failed to get all Enquiries!",
        };
    }
};
