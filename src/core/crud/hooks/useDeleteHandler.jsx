import { useCallback, useState } from "react";

export const useDeleteHandler = ({
    tableCruds,
    token,
    showAlert,
    setLoading,
    dispatch,
    navigate,
    tableName,
    consts,
    formKey,
}) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleDeleteClick = useCallback(
        (row) => {
            setDeleteId(row[consts.current.primaryKey]);
            setDeleteDialogOpen(true);
        },
        [consts],
    );

    const closeDeleteDialog = useCallback(() => {
        setDeleteDialogOpen(false);
        setDeleteId(null);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        try {
            await dispatch(tableCruds.remove(deleteId, token, showAlert, setLoading));
            if (formKey) navigate(`/management/${tableName}`);
        } catch (error) {
            console.error(error);
            showAlert(`Failed to delete ${tableName}!`, "error");
        } finally {
            closeDeleteDialog();
        }
    }, [
        dispatch,
        tableCruds,
        deleteId,
        token,
        showAlert,
        setLoading,
        formKey,
        navigate,
        tableName,
        closeDeleteDialog,
    ]);

    return {
        handleDeleteClick,
        deleteDialogOpen,
        deleteId,
        closeDeleteDialog,
        handleDeleteConfirm,
    };
};
