import api from "@/core/utils/api";

const getErrorMessage = (error: unknown, defaultMessage: string) => {
    if (error && typeof error === "object" && "response" in error) {
        const axiosErr = error as { response?: { data?: { status?: { statusMessage?: string } } } };
        return axiosErr.response?.data?.status?.statusMessage || defaultMessage;
    }
    return defaultMessage;
};

const getHeaders = (token: string | null | undefined) => ({
    headers: { Authorization: `${token}` },
});

import { RequestParams } from "@/core/types";

interface GetClientParams {
    branchId: string | number;
    token: string | null | undefined;
    params: RequestParams;
}

export const getCLientByNamesAPI = async ({ branchId, token, params }: GetClientParams) => {
    try {
        const response = await api.get(`/clients/search/${branchId}`, {
            ...getHeaders(token),
            params,
        });
        const { data, status } = response.data;
        return {
            data: data,
            success: true,
            message: status.statusMessage || "Client fetched successfully!",
        };
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to fetch client!"),
        };
    }
};
