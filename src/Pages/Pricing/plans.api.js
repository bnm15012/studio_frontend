import api from "../../utils/api";

export const getAllPlans = async () => {
    try {
        const response = await api.get("/plans/getAllPlans", {
            headers: {
                "Content-Type": "application/json",
            }
        });
        return { data: response.data.data, success: true, message: "Plans fetched successfully" };
    } catch (error) {
        console.error(error);
        return { data: null, success: false, message: "Error fetching plans" };
    }
};
