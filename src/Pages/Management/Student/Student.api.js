import api from "../../../utils/api";

export const getStudentNamesAPI = async ({ branchId, token, page, size, birthday=false }) => {
  try {
    const response = await api.get(`/students/getAllStudentsForCommunication/${branchId}?membershipStatus=ACTIVE&page=${page - 1}&size=${size}&birthday=${birthday ? 1 : 0}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
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

export const getStudentNamesOncePerDay = async ({ branchId, token, page, size, birthday = false }) => {
  const todayKey = `getStudentNames_${branchId}_${birthday ? 'birthday' : 'all'}_page${page}_size${size}`;
  const dateKey = `${todayKey}_date`;

  const lastCallDate = localStorage.getItem(dateKey);
  const cachedResult = localStorage.getItem(todayKey);

  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

  if (lastCallDate === today && cachedResult) {
    const parsed = JSON.parse(cachedResult);
    return { ...parsed, message: "Fetched from cache" };
  }

  const result = await getStudentNamesAPI({ branchId, token, page, size, birthday });

  if (result.success) {
    localStorage.setItem(dateKey, today);
    localStorage.setItem(todayKey, JSON.stringify(result));
  }

  return result;
};

export const getAllStudentsAPI = async ({
  branchId,
  token,
  size = 10,
  page = 1,
  searchTerm = "",
  membershipStatus,
}) => {
  try {
    const response = await api.get(`/students/getAllStudents/${branchId}`, {
      headers: {
        Authorization: `${token}`,
      },
      params: {
        size,
        page: page - 1,
        searchTerm,
        membershipStatus,
      },
    });
    const { data, status } = response.data;
    return {
      data,
      success: true,
      totalCount: status.totalCount,
      message: status?.statusMessage || "Fetched students successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch students",
    };
  }
};

export const addStudentAPI = async ({ studentData, token }) => {
  try {
    const response = await api.post("/students/add", studentData, {
      headers: {
        Authorization: `${token}`,
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
      message:
        error.response?.data?.status?.statusMessage || "Failed to add student",
    };
  }
};

export const updateStudentAPI = async ({ studentId, studentData, token }) => {
  try {
    const response = await api.put(
      `/students/update/${studentId}`,
      studentData,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    const { data, status } = response.data;
    return {
      data: data[0],
      success: true,
      message: status.statusMessage,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.status?.statusMessage ||
        "Failed to update student",
    };
  }
};

export const deleteStudentAPI = async ({ studentId, token }) => {
  try {
    const response = await api.delete(`/students/delete/${studentId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return { success: true, response: response };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete student",
    };
  }
};

export const assignActivityStudentAPI = async ({
  studentAcivityData,
  token,
}) => {
  try {
    const response = await api.post(
      "/studentActivities/add",
      studentAcivityData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const { data, status } = response.data;
    return {
      data: data[0],
      success: true,
      message: status.statusMessage,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.status?.statusMessage ||
        "Failed to assign new activity to student!",
    };
  }
};

export const editActivityStudentAPI = async ({
  assignmentId,
  assignedActivityData,
  token,
}) => {
  try {
    const response = await api.put(
      `/studentActivities/update/${assignmentId}`,
      assignedActivityData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { data, status } = response.data;
    return {
      data: data[0],
      success: true,
      message: status.statusMessage,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.status?.statusMessage ||
        "Failed to update student activity",
    };
  }
};

export const deleteStudentActivityAPI = async ({ assignmentId, token }) => {
  try {
    await api.delete(`/studentActivities/delete/${assignmentId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.status?.statusMessage ||
        "Failed to delete student activity",
    };
  }
};

export const getStudentByIdAPI = async ({ id, token }) => {
  try {
    const response = await api.get(`/students/get/${id}`, {
      headers: { Authorization: `${token}` },
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
      message:
        error.response?.data?.status?.statusMessage ||
        "Failed to update student",
    };
  }
};
