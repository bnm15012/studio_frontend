import api from "@/core/utils/api";

const getErrorMessage = (error: any, defaultMessage: string) =>
    error.response?.data?.status?.statusMessage || defaultMessage;

const getHeaders = (token: string | null | undefined) => ({
    headers: { Authorization: `${token}` },
});

interface GetClientParams {
    branchId: string | number;
    token: string | null | undefined;
    params?: any;
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
    } catch (error: any) {
        return {
            success: false,
            message: getErrorMessage(error, "Failed to fetch client!"),
        };
    }
};
