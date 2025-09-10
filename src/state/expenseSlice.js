import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pages: {}, // { 1: [...], 2: [...] }
  totalPages: 0,
  isLoading: false,
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setExpensePage: (state, action) => {
      const { page, data, totalPages } = action.payload;
      state.pages[page] = data;
      state.totalPages = totalPages;
    },
    clearExpensePages: (state) => {
      state.pages = {};
    },
    addExpense: (state, action) => {
      const { page, newExpense } = action.payload;
      if (!state.pages[page]) {
        state.pages[page] = [];
      }
      state.pages[page].push(newExpense);
      state.totalPages += 1;
    },
    deleteExpense: (state, action) => {
      const { page, expenseId } = action.payload;
      if (state.pages[page]) {
        state.pages[page] = state.pages[page].filter(expense => expense.expenseId !== expenseId);
        state.totalPages -= 1;
      }
    },
    updateExpense: (state, action) => {
      const { page, updatedExpense } = action.payload;
      if (state.pages[page]) {
        const index = state.pages[page].findIndex(expense => expense.expenseId === updatedExpense.expenseId);
        if (index !== -1) {
          state.pages[page][index] = updatedExpense;
        }
      }
    },
    setExpenseLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setExpensePage,
  clearExpensePages,
  addExpense,
  deleteExpense,
  updateExpense,
  setExpenseLoading,
} = expenseSlice.actions;

export default expenseSlice.reducer;
