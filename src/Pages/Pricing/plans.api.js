import api from "../../utils/api";

export const getAllPlans = async ({ AMC }) => {
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
