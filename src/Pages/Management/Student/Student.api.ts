import api from "@/core/utils/api";

interface StudentApiParams {
    branchId: string | number;
    token: string | null | undefined;
    page: number | string;
    size: number | string;
    birthday?: boolean;
}

export const getStudentNamesAPI = async ({
    branchId,
    token,
    page,
    size,
    birthday = false,
}: StudentApiParams) => {
    try {
        const response = await api.get(
            `/students/getAllStudentsForCommunication/${branchId}?membershipStatus=ACTIVE&page=${page}&size=${size}&birthday=${birthday ? 1 : 0}`,
            {
                headers: {
                    Authorization: `${token}`,
                },
            },
        );
        const { data, status } = response.data;
        return {
            data,
            success: true,
            totalCount: status.totalCount,
            message: status.statusMessage || "Fetched students successfully!",
        };
    } catch (error: unknown) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? (error as { response?: { data?: { message?: string } } }).response?.data
                          ?.message || error.message
                    : "Failed to fetch students",
        };
    }
};

export const getStudentNamesOncePerDay = async ({
    branchId,
    token,
    page,
    size,
    birthday = false,
}: StudentApiParams) => {
    const result = await getStudentNamesAPI({ branchId, token, page, size, birthday });
    return result;
};

interface AddStudentParams {
    newData: Record<string, unknown>;
    token: string | null | undefined;
}

export const addStudentAPI = async ({ newData, token }: AddStudentParams) => {
    try {
        const response = await api.post("/students/add", newData, {
            headers: {
                Authorization: `${token}`,
                "Form-Authorization": import.meta.env.VITE_APP_FORM_SIG || "",
            },
        });
        const { data, status } = response.data;
        return {
            data: data[0],
            success: true,
            message: status.statusMessage,
        };
    } catch (error: unknown) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? (error as { response?: { data?: { status?: { statusMessage?: string } } } })
                          .response?.data?.status?.statusMessage || error.message
                    : "Failed to add student",
        };
    }
};
