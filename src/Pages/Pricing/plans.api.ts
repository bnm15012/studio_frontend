import api from "@/core/utils/api";

interface GetAllPlansParams {
    AMC?: string | boolean;
}

export const getAllPlans = async ({ AMC }: GetAllPlansParams) => {
    try {
        const response = await api.get("/plans/getAll", {
            headers: { "Content-Type": "application/json" },
            params: { AMC },
        });
        return { data: response.data.data, success: true, message: "Plans fetched successfully" };
    } catch (error) {
        console.error(error);
        return { data: null, success: false, message: "Error fetching plans" };
    }
};

interface GetStudioPlansParams {
    AMC?: string | boolean;
    token: string;
    studioId: number;
}

export const getStudioPlans = async ({ AMC, token, studioId }: GetStudioPlansParams) => {
    try {
        const response = await api.get("/plans/getByStudio", {
            headers: { "Content-Type": "application/json", Authorization: token },
            params: { AMC, studioId },
        });
        return {
            data: response.data.data,
            success: true,
            message: "Studio plans fetched successfully",
        };
    } catch (error) {
        console.error(error);
        return { data: null, success: false, message: "Error fetching studio plans" };
    }
};
