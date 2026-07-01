import React from "react";
import { Delete, Edit, OpenInNew } from "@mui/icons-material";
import { ActionItem } from "../helper/Actions";

// Icon elements as module-level constants — created once, not on every defaultActions() call.
const EditIcon = <Edit />;
const DeleteIcon = <Delete />;
const FormIcon = <OpenInNew />;

interface DefaultActionsProps {
    loading: boolean;
    editMode?: "FORM" | "INLINE" | string;
    formKey?: any;
    handleEdit: (row: any) => void;
    handleDeleteClick: (row: any) => void;
    openFormView: (row: any) => void;
}

export const defaultActions = ({
    loading,
    editMode,
    formKey,
    handleEdit,
    handleDeleteClick,
    openFormView,
}: DefaultActionsProps): ActionItem[] => {
    const base = [
        { name: "edit", icon: EditIcon, sx: { color: "blue" }, onClick: handleEdit },
        { name: "delete", icon: DeleteIcon, sx: { color: "red" }, onClick: handleDeleteClick },
        {
            name: "form",
            icon: FormIcon,
            sx: { color: "blue" },
            onClick: openFormView,
            help: "Open form view",
        },
    ];

    return base.map((a) => ({
        ...a,
        enabled: !loading,
        hide:
            a.name === "edit"
                ? editMode === "FORM" && !formKey
                : a.name === "form"
                  ? editMode !== "FORM" || !!formKey
                  : false,
    }));
};
