import api from "../../../utils/api";
import { validMembershipTypes } from "./Activities.constants";

export const addActivityAPI = async ({ activityData, token }) => {
  try {
    const response = await api.post(`/activities/add`, activityData, {
      headers: {
        Authorization: `${token}`,
      },
    });

    const { data, status } = response.data;

    return {
      data: data[0],
      success: true,
      message: status.statusMessage || "Activity added successfully!"
    };
  } catch (error) {
    console.error(error)
    return { success: false, message: error.response?.data?.status?.statusMessage || "Error adding activity" };
  }
};



export const updateActivityAPI = async ({ activityId, activityData, token }) => {
  try {
    const sortedActivity = sortMembershipPlans(activityData);
    const response = await api.put(`/activities/update/${activityId}`, sortedActivity, {
      headers: {
        Authorization: `${token}`,
      },
    });

    const { data, status } = response.data;
    return {
      data: data[0],
      success: true,
      message: status.statusMessage || "Activity updated successfully!"
    };
  } catch (error) {
    return { success: false, message: error.response?.data?.status?.statusMessage || "Error updating activity" };
  }
};


export const deleteActivityAPI = async ({ activityId, token }) => {
  try {
    await api.delete(`/activities/delete/${activityId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    // const { status } = response.data;
    return {
      success: true,
      message: "Activity deleted successfully!"
    };
  } catch (error) {
    return { success: false, message: error.response?.data?.status?.statusMessage || "Error deleting activity" }
  }
};


export const getAllActivitiesAPI = async ({ branchId, token, search, page, limit }) => {
  try {
    const response = await api.get(`/activities/getAllActivities/${branchId}`, {
      headers: {
        Authorization: `${token}`,
      }, params: { search, page, limit },
    });
    const { data, status } = response.data;
    return {
      data,
      success: true,
      message: status.statusMessage
    };
  } catch (error) {
    return { success: false, message: error.response?.data?.status?.statusMessage || "Failed to fetch activity data!" };
  }
};




export function sortMembershipPlans(activity) {
  if (
    !activity ||
    !activity.membershipPlanRequest ||
    !Array.isArray(activity.membershipPlanRequest.membershipPlanEntryList)
  ) {
    return activity;
  }

  const clonedActivity = structuredClone(activity);

  clonedActivity.membershipPlanRequest.membershipPlanEntryList.sort((a, b) => {
    const typeOrderA = validMembershipTypes.indexOf(a.membershipType);
    const typeOrderB = validMembershipTypes.indexOf(b.membershipType);

    if (typeOrderA !== typeOrderB) return typeOrderA - typeOrderB;
    return (a.daysPerWeek ?? 0) - (b.daysPerWeek ?? 0);
  });

  return clonedActivity;
}
