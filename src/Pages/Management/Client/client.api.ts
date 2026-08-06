import { RequestParams } from "@/core/types";
import api from "@/core/utils/api";

export interface ApiErrorResponse {
    response?: {
        data?: {
            status?: {
                statusMessage?: string;
            };
            message?: string;
        };
    };
    message?: string;
}

const getErrorMessage = (
    error: ApiErrorResponse | Error | unknown,
    defaultMessage: string,
): string => {
    if (error && typeof error === "object" && "response" in error) {
        const axiosErr = error as ApiErrorResponse;
        return (
            axiosErr.response?.data?.status?.statusMessage ||
            axiosErr.response?.data?.message ||
            defaultMessage
        );
    }
    if (error instanceof Error) return error.message;
    return defaultMessage;
};

const getHeaders = (token: string | null | undefined) => ({
    headers: { Authorization: `${token}` },
});

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
