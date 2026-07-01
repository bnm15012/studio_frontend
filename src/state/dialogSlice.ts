import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// All dialogs your app supports
export const activeDialogs: string[] = [
    "forgotPassDialog",
    "changePassDialog",
    "loginDialog",
    "signupDialog",
    "profileDialog",
    "subscriptionDialog",
    "settingsDialog",
    "configurationDialog",
];

export interface DialogState {
    dialogStack: string[];
}

const initialState: DialogState = {
    dialogStack: [],
};

const dialogSlice = createSlice({
    name: "dialog",
    initialState,
    reducers: {
        openDialog: (state, action: PayloadAction<string>) => {
            const dialog = action.payload;
            if (activeDialogs.includes(dialog) && !state.dialogStack.includes(dialog)) {
                state.dialogStack.push(dialog);
            }
        },
        closeDialog: (state, action: PayloadAction<string>) => {
            const dialog = action.payload;
            state.dialogStack = state.dialogStack.filter((d) => d !== dialog);
        },
        closeLastDialog: (state: any) => {
            state.dialogStack.pop();
        },
        clearAllDialogs: (state: any) => {
            state.dialogStack = [];
        },
    },
});

export const { openDialog, closeDialog, closeLastDialog, clearAllDialogs } = dialogSlice.actions;

export const isDialogOnTop = (dialogName: string) => (state: { dialog: DialogState }) =>
    state.dialog.dialogStack[state.dialog.dialogStack.length - 1] === dialogName;
export const dialogOnTop = () => (state: { dialog: DialogState }) =>
    state.dialog.dialogStack[state.dialog.dialogStack.length - 1];

export default dialogSlice.reducer;
