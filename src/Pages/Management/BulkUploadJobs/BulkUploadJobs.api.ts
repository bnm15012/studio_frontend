import api from "@/core/utils/api";

export const createBulkUploadJobAPI = async (
    jobData: Record<string, unknown>,
    token: string | null | undefined,
) => {
    try {
        const response = await api.post("/jobs/bulk-uploads/process", jobData, {
            headers: {
                Authorization: `${token}`,
            },
        });
        const { data, status } = response.data;
        return {
            success: true,
            data: data,
            message: status.statusMessage || "Started uploading data, will be processed shortly.",
        };
    } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        return {
            success: false,
            message: err.response
                ? err.response?.data?.message || ""
                : "Failed to create bulk upload job",
        };
    }
};

export const getBulkUploadJobsAPI = async ({
    token,
    branchId,
    size,
    page,
}: {
    token: string | null | undefined;
    branchId: string | number;
    size: number;
    page: number;
}) => {
    try {
        const response = await api.get(`/jobs/bulk-uploads/getAll/${branchId}`, {
            headers: {
                Authorization: `${token}`,
            },
            params: { size, page },
        });
        const { data, status } = response.data;
        return {
            data,
            success: true,
            totalCount: status.totalCount,
            message: status.statusMessage || "Fetched bulk upload jobs successfully!",
        };
    } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        return {
            success: false,
            message: err?.response?.data?.message || "Failed to fetch bulk upload jobs",
        };
    }
};
