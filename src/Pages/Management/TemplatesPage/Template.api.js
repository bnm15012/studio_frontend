import api from "../../../utils/api";

export const getAllTemplatesAPI = async ({
    studioId,
    token,
    searchTerm = "",
    templateType = "",
    page = 1,
    size = 10,
}) => {
    try {
        const response = await api.get(`/genericTemplate/getAll/${studioId}`, {
            headers: { Authorization: `${token}` },
            params: {
                searchTerm,
                templateType,
                page,
                size,
            },
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
                error.response?.data?.status?.statusMessage || "Failed to get all template data!",
        };
    }
};
