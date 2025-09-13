import api from "../../../utils/api";

const getErrorMessage = (error, defaultMessage) =>
  error.response?.data?.status?.statusMessage || defaultMessage;

const getHeaders = (token) => ({
  headers: { Authorization: `${token}`, },
});

/**
 * Fetch all bookings with pagination.
 * @param {Object} params - Parameters for API call.
 * @param {number} params.branchId - Studio ID.
 * @param {number} params.page - Page number.
 * @param {number} params.size - Number of items per page.
 * @param {string} params.token - Authorization token.
 */
export const getAllBookingsAPI = async ({ branchId, page, size, token, searchTerm }) => {
  try {
    const response = await api.get(
      `/booking/getAll/${branchId}`,
      {
        headers: { Authorization: `${token}`, },
        params: { page, size, searchTerm }
      }
    );
    const { data, status } = response.data;
    return {
      data,
      success: true,
      totalCount: status.totalCount,
      message: status.statusMessage || "Bookings fetched successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch bookings!"),
    };
  }
};

/**
 * Add a new booking.
 * @param {Object} params - Parameters for API call.
 * @param {Object} params.bookingData - booking data to be added.
 * @param {string} params.token - Authorization token.
 */
export const addBookingAPI = async ({ bookingData, token }) => {
  try {
    const response = await api.post(`/booking/add`, bookingData, getHeaders(token));
    const { data, status } = response.data;

    return {
      data: data[0],
      success: true,
      message: status.statusMessage || "Booking added successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to add booking!"),
    };
  }
};

/**
 * Update an booking by ID.
 * @param {Object} params - Parameters for API call.
 * @param {number} params.bookingId - Booking ID to update.
 * @param {Object} params.bookingData - Updated booking data.
 * @param {string} params.token - Authorization token.
 */
export const updateBookingAPI = async ({ bookingId, bookingData, token }) => {
  try {
    const response = await api.put(
      `/booking/update/${bookingId}`,
      bookingData,
      getHeaders(token)
    );
    const { data, status } = response.data;

    return {
      data: data[0],
      success: true,
      message: status.statusMessage || "Booking updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to update booking!"),
    };
  }
};

/**
 * Delete an booking by ID.
 * @param {Object} params - Parameters for API call.
 * @param {number} params.bookingId - Booking ID to delete.
 * @param {string} params.token - Authorization token.
 */
export const deleteBookingAPI = async ({ bookingId, token }) => {
  try {
    await api.delete(`/booking/delete/${bookingId}`, getHeaders(token));
    return {
      data: null,
      success: true,
      message: "Booking deleted successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to delete booking!"),
    };
  }
};

export const getBookingByIdAPI = async ({ bookingId, token }) => {
  try {
    const response = await api.get(`/booking/get/${bookingId}`, getHeaders(token));
    const { data, status } = response.data;
    return {
      data: data[0],
      success: true,
      message: status.statusMessage || "Booking fetched successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch booking!"),
    };
  }
};
