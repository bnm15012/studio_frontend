import api from "../../../../utils/api";

export const assignActivityInstructorAPI = async ({ assignementData, token }) => {
  try {
    const response = await api.post("/instructorActivities/add", assignementData, {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json'
      },
    });
    const { data, status } = response.data;
    return {
      data: data[0],
      success: true,
      message: status.statusMessage
    };
  } catch (error) {
    return { success: false, message: error.response?.data?.status?.statusMessage || "Failed to assign instructor activity data!" };
  }
};

export const editAssignedActivityInstructorAPI = async ({ assignmentID, assignementData, token }) => {
  try {
    const response = await api.put(`/instructorActivities/update/${assignmentID}`, assignementData, {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json'
      },
    });
    const { data, status } = response.data;
    return {
      data: data[0],
      success: true,
      message: status.statusMessage
    };
  } catch (error) {
    return { success: false, message: error.response?.data?.status?.statusMessage || "Failed to assign instructor activity data!" };
  }
};

export const deletAassignedActivityInstructorAPI = async ({ assignmentID, token }) => {
  try {
    await api.delete(`/instructorActivities/delete/${assignmentID}`, {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json'
      },
    });
    return {
      success: true,
      message: "Instructor activity data deleted successfully!"
    };
  } catch (error) {
    return { success: false, message: error.response?.data?.status?.statusMessage || "Failed to delete instructor activity data!" };
  }
};
