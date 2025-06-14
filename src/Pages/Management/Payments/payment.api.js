import api from "../../../utils/api";

export const addPaymentAPI = async ({ paymentData, token }) => {
  try {
    const response = await api.post("/payments/add", paymentData, {
      headers: {
        Authorization: token,
      },
    });
    return {
      success: true,
      data: response.data.data[0],
      message: response.data.status.statusMessage,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to add payment",
    };
  }
};

export const updatePaymentAPI = async ({ paymentId, paymentData, token }) => {
  try {
    const response = await api.put(
      `/payments/update/${paymentId}`,
      paymentData,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return {
      success: true,
      data: response.data.data[0],
      message: response.data.status.statusMessage,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update payment",
    };
  }
};

export const deletePaymentAPI = async ({ paymentId, token }) => {
  try {
    const response = await api.delete(`/payments/delete/${paymentId}`, {
      headers: {
        Authorization: token,
      },
    });
    return {
      success: true,
      message: response?.data?.status?.statusMessage || "Deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete payment",
    };
  }
};

export const getAllpaymentsAPI = async ({
  branchId,
  token,
  size = 10,
  page = 1,
  searchTerm = "",
}) => {
  try {
    const response = await api.get(`/payments/getAllPayments/${branchId}/0/0/0/0`, {
      headers: {
        Authorization: token,
      },
      params: { size, page: page - 1, searchTerm },
    });
    const { data, status } = response.data;
    return {
      data,
      success: true,
      totalCount: status.totalCount,
      message: status.statusMessage,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch payments",
    };
  }
};
