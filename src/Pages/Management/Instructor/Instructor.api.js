import api from "../../../utils/api";

export const addInstructorAPI = async ({ instructorData, token }) => {
    try {
        const response = await api.post("/instructors/add", instructorData, {
            headers: {
                Authorization: `${token}`,
            },
        });
        const { data, status } = response.data;
        return {
            data: data[0],
            success: true,
            message: status.statusMessage,
            totalCount: status.totalCount,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.status?.statusMessage || "Failed to add instructor!",
        };
    }
};

export const updateInstructorAPI = async ({ instructorId, instructorNewData, token }) => {
    try {
        delete instructorNewData["assignments"];
        const response = await api.put(`/instructors/update/${instructorId}`, instructorNewData, {
            headers: { Authorization: `${token}` },
        });
        const { data, status } = response.data;
        return {
            data: data[0],
            success: true,
            message: status.statusMessage,
            totalCount: status.totalCount,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.status?.statusMessage || "Failed to update instructor data!",
        };
    }
};

export const deleteInstructorAPI = async ({ instructorId, token }) => {
    try {
        await api.delete(`/instructors/delete/${instructorId}`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        return { success: true, message: "Instructor deleted successfully!" };
    } catch (error) {
        const message = error?.response?.data?.status?.statusMessage || "Error deleting instructor";
        return { success: false, message };
    }
};

export const getAllInstructorsAPI = async ({
    branchId,
    token,
    searchTerm = "",
    page = 1,
    size = 10,
    membershipStatus,
}) => {
    try {
        const response = await api.get(`/instructors/getAll/${branchId}`, {
            headers: { Authorization: `${token}` },
            params: {
                searchTerm,
                page,
                size,
                membershipStatus,
            },
        });
        const { data, status } = response.data;
        return {
            data,
            success: true,
            message: status.statusMessage,
            totalCount: status.totalCount,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.status?.statusMessage || "Failed to get all instructor data!",
        };
    }
};

export const getInstructorByIdAPI = async ({ id, token }) => {
    try {
        const response = await api.get(`/instructors/get/${id}`, {
            headers: { Authorization: `${token}` },
        });
        const { data, status } = response.data;
        return {
            data: data[0],
            success: true,
            message: status.statusMessage,
            totalCount: status.totalCount,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.status?.statusMessage || "Failed to get all instructor data!",
        };
    }
};

export const getInstructorNamesAPI = async ({ branchId, token, page, size }) => {
    try {
        const response = await api.get(
            `/instructors/getAllInstructorsForCommunication/${branchId}?membershipStatus=ACTIVE&page=${page}&size=${size}`,
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
            message: status.statusMessage || "Fetched instructors successfully!",
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch instructors",
        };
    }
};
