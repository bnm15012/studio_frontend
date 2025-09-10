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
