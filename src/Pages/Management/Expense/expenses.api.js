import api from "../../../utils/api";

const getErrorMessage = (error, defaultMessage) =>
  error.response?.data?.status?.statusMessage || defaultMessage;

const getHeaders = (token) => ({
  headers: { Authorization: `${token}`, },
});

/**
 * Fetch all expenses with pagination.
 * @param {Object} params - Parameters for API call.
 * @param {number} params.branchId - Studio ID.
 * @param {number} params.page - Page number.
 * @param {number} params.size - Number of items per page.
 * @param {string} params.token - Authorization token.
 */
export const getAllExpensesAPI = async ({ branchId, page, size, token, searchTerm }) => {
  try {
    const response = await api.get(
      `/expenses/getAllExpenses/${branchId}`,
      {
        headers: { Authorization: `${token}`, },
        params: { page: page - 1, size, searchTerm }
      }
    );
    const { data, status } = response.data;
    return {
      data,
      success: true,
      totalCount: status.totalCount,
      message: status.statusMessage || "Expenses fetched successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch expenses!"),
    };
  }
};

/**
 * Add a new expense.
 * @param {Object} params - Parameters for API call.
 * @param {Object} params.expenseData - Expense data to be added.
 * @param {string} params.token - Authorization token.
 */
export const addExpenseAPI = async ({ expenseData, token }) => {
  try {
    const response = await api.post(`/expenses/add`, expenseData, getHeaders(token));
    const { data, status } = response.data;

    return {
      data: data[0],
      success: true,
      message: status.statusMessage || "Expense added successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to add expense!"),
    };
  }
};

/**
 * Update an expense by ID.
 * @param {Object} params - Parameters for API call.
 * @param {number} params.expenseId - Expense ID to update.
 * @param {Object} params.expenseData - Updated expense data.
 * @param {string} params.token - Authorization token.
 */
export const updateExpenseAPI = async ({ expenseId, expenseData, token }) => {
  try {
    const response = await api.put(
      `/expenses/update/${expenseId}`,
      expenseData,
      getHeaders(token)
    );
    const { data, status } = response.data;

    return {
      data: data[0],
      success: true,
      message: status.statusMessage || "Expense updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to update expense!"),
    };
  }
};

/**
 * Delete an expense by ID.
 * @param {Object} params - Parameters for API call.
 * @param {number} params.expenseId - Expense ID to delete.
 * @param {string} params.token - Authorization token.
 */
export const deleteExpenseAPI = async ({ expenseId, token }) => {
  try {
    await api.delete(`/expenses/delete/${expenseId}`, getHeaders(token));
    return {
      data: null,
      success: true,
      message: "Expense deleted successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to delete expense!"),
    };
  }
};
