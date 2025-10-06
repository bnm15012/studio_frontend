import { createSlice } from "@reduxjs/toolkit";

// All dialogs your app supports
export const activeDialogs = [
    "forgotPassDialog",
    "changePassDialog",
    "loginDialog",
    "signupDialog",
    "profileDialog",
    "subscriptionDialog",
    "settingsDialog",
    "configurationDialog",
];

const initialState = {
    dialogStack: [],
};

const dialogSlice = createSlice({
    name: "dialog",
    initialState,
    reducers: {
        openDialog: (state, action) => {
            const dialog = action.payload;
            if (activeDialogs.includes(dialog) && !state.dialogStack.includes(dialog)) {
                state.dialogStack.push(dialog);
            }
        },
        closeDialog: (state, action) => {
            const dialog = action.payload;
            state.dialogStack = state.dialogStack.filter((d) => d !== dialog);
        },
        closeLastDialog: (state) => {
            state.dialogStack.pop();
        },
        clearAllDialogs: (state) => {
            state.dialogStack = [];
        },
    },
});

export const { openDialog, closeDialog, closeLastDialog, clearAllDialogs } = dialogSlice.actions;

export const isDialogOnTop = (dialogName) => (state) =>
    state.dialog.dialogStack[state.dialog.dialogStack.length - 1] === dialogName;
export const dialogOnTop = () => (state) =>
    state.dialog.dialogStack[state.dialog.dialogStack.length - 1];

export default dialogSlice.reducer;
