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
    } catch (error: unknown) {
        console.error(error);
        return { data: null, success: false, message: "Error fetching plans" };
    }
};
