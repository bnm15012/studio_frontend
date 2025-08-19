import api from "../../../utils/api";

// ✅ Add Activity Membership Type
export const addActivityMembershipTypeAPI = async ({ membershipTypeData, token }) => {
  try {
    const response = await api.post("/activity-membership-type/add", membershipTypeData, {
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
      message:
        error.response?.data?.status?.statusMessage ||
        "Failed to add Activity Membership Type!",
    };
  }
};

// ✅ Update Activity Membership Type
export const updateActivityMembershipTypeAPI = async ({ membershipTypeData, token }) => {
  try {
    const response = await api.put(
      `/activity-membership-type/update/${membershipTypeData["activityMembershipTypeId"]}`,
      membershipTypeData,
      {
        headers: { Authorization: `${token}` },
      }
    );
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
        error.response?.data?.status?.statusMessage ||
        "Failed to update Activity Membership Type!",
    };
  }
};

// ✅ Delete Activity Membership Type
export const deleteActivityMembershipTypeAPI = async ({ membershipTypeId, token }) => {
  try {
    await api.delete(`/activity-membership-type/delete/${membershipTypeId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return { success: true, message: "Activity Membership Type deleted successfully!" };
  } catch (error) {
    const message =
      error?.response?.data?.status?.statusMessage ||
      "Error deleting Activity Membership Type";
    return { success: false, message };
  }
};

// ✅ Get All Activity Membership Types by Studio
export const getAllActivityMembershipTypesAPI = async ({ studioId, token }) => {
  try {
    const response = await api.get(`/activity-membership-type/getAll/${studioId}`, {
      headers: { Authorization: `${token}` },
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
        error.response?.data?.status?.statusMessage ||
        "Failed to get all Activity Membership Types!",
    };
  }
};
