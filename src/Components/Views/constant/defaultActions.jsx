import { Delete, Edit, OpenInNew } from "@mui/icons-material";

export const defaultActions = ({
    loading,
    editMode,
    formKey,
    handleEdit,
    handleDeleteClick,
    openFormView,
}) => {
    const base = [
        { name: "edit", icon: <Edit />, sx: { color: "blue" }, onClick: handleEdit },
        { name: "delete", icon: <Delete />, sx: { color: "red" }, onClick: handleDeleteClick },
        { name: "form", icon: <OpenInNew />, sx: { color: "blue" }, onClick: openFormView },
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
