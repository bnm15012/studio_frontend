import api from "../../../utils/api";

export const getStudentNamesAPI = async ({ branchId, token, page, size, birthday = false }) => {
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
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch students",
        };
    }
};

export const getStudentNamesOncePerDay = async ({
    branchId,
    token,
    page,
    size,
    birthday = false,
}) => {
    // const todayKey = `getStudentNames_${branchId}_${birthday ? 'birthday' : 'all'}_page${page}_size${size}`;
    // const dateKey = `${todayKey}_date`;

    // const lastCallDate = localStorage.getItem(dateKey);
    // const cachedResult = localStorage.getItem(todayKey);

    // const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    // if (lastCallDate === today && cachedResult) {
    //   const parsed = JSON.parse(cachedResult);
    //   return { ...parsed, message: "Fetched from cache" };
    // }

    const result = await getStudentNamesAPI({ branchId, token, page, size, birthday });

    // if (result.success) {
    //   localStorage.setItem(dateKey, today);
    //   localStorage.setItem(todayKey, JSON.stringify(result));
    // }

    return result;
};

export const addStudentAPI = async ({ newData, token }) => {
    try {
        const response = await api.post("/students/add", newData, {
            headers: {
                Authorization: `${token}`,
                "Form-Authorization": import.meta.env.VITE_APP_FORM_SIG,
            },
        });
        const { data, status } = response.data;
        return {
            data: data[0],
            success: true,
            message: status.statusMessage,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.status?.statusMessage || "Failed to add student",
        };
    }
};
