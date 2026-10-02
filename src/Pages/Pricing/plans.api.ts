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
    studioId: string | number;
    AMC?: string | boolean;
}

export const getStudioPlans = async ({ studioId, AMC }: GetStudioPlansParams) => {
    try {
        const response = await api.get("/plans/getByStudio", {
            headers: { "Content-Type": "application/json" },
            params: { studioId, AMC },
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
