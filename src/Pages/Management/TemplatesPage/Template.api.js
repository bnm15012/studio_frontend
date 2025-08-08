import api from "../../../utils/api";

export const addTemplateAPI = async ({ templateData, token }) => {
  try {
    const response = await api.post("/conditions/add", templateData, {
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
        "Failed to add template!",
    };
  }
};

export const updateTemplateAPI = async ({
  templateNewData,
  token,
}) => {
  try {
    delete templateNewData["assignments"];
    const response = await api.put(
      `/conditions/update/${templateNewData["id"]}`,
      templateNewData,
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
        "Failed to update template data!",
    };
  }
};

export const deleteTemplateAPI = async ({ templateId, token }) => {
  try {
    await api.delete(`/conditions/delete/${templateId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return { success: true, message: "Template deleted successfully!" };
  } catch (error) {
    const message =
      error?.response?.data?.status?.statusMessage ||
      "Error deleting template";
    return { success: false, message };
  }
};

export const getAllTemplatesAPI = async ({
  branchId,
  token,
  searchTerm = "",
  page = 1,
  size = 10,
}) => {
  try {
    const response = await api.get(
      `/conditions/getAllConditions/${branchId}`,
      {
        headers: { Authorization: `${token}` },
        params: {
          searchTerm,
          page: page - 1,
          size,
        },
      }
    );
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
        "Failed to get all template data!",
    };
  }
};

export const getTemplateByIdAPI = async ({ id, token }) => {
  try {
    const response = await api.get(`/conditions/get/${id}`, {
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
        error.response?.data?.status?.statusMessage ||
        "Failed to get all template data!",
    };
  }
};
