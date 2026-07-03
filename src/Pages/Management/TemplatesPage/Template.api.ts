import api from "@/core/utils/api";

interface GetAllTemplatesParams {
    studioId: string | number;
    token: string | null | undefined;
    searchTerm?: string;
    templateType?: string;
    page?: number;
    size?: number;
}

export const getAllTemplatesAPI = async ({
    studioId,
    token,
    searchTerm = "",
    templateType = "",
    page = 1,
    size = 10,
}: GetAllTemplatesParams) => {
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
    } catch (error: unknown) {
        const err = error as { response?: { data?: { status?: { statusMessage?: string } } } };
        return {
            success: false,
            message:
                err.response?.data?.status?.statusMessage || "Failed to get all template data!",
        };
    }
};
