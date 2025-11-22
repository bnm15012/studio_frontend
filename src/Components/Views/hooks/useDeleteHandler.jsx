import { useCallback, useState, useMemo } from "react";
import DeleteDialog from "../../DeleteDialog";

export const useDeleteHandler = ({
    tableCruds,
    token,
    showAlert,
    setLoading,
    dispatch,
    navigate,
    tableName,
    consts,
    data,
    fieldToDisplayOnDelete,
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
            await dispatch(tableCruds.delete(deleteId, token, showAlert, setLoading));
            navigate(`/management/${tableName}/`);
            showAlert(`${tableName} deleted successfully!`, "success");
        } catch (error) {
            console.error(error);
            showAlert(`Failed to delete ${tableName}!`, "error");
        } finally {
            closeDeleteDialog();
        }
    }, [
        deleteId,
        dispatch,
        navigate,
        setLoading,
        showAlert,
        tableName,
        tableCruds,
        token,
        closeDeleteDialog,
    ]);

    const DeleteDialogComponent = useMemo(
        () =>
            deleteDialogOpen &&
            deleteId && (
                <DeleteDialog
                    open={deleteDialogOpen}
                    onClose={closeDeleteDialog}
                    onConfirm={handleDeleteConfirm}
                    id={deleteId}
                    displayData={`${tableName} for ${
                        data.find((d) => d[consts.current.primaryKey] === deleteId)?.[
                            fieldToDisplayOnDelete
                        ]
                    }`}
                />
            ),
        [
            deleteDialogOpen,
            deleteId,
            handleDeleteConfirm,
            closeDeleteDialog,
            tableName,
            data,
            fieldToDisplayOnDelete,
            consts,
        ],
    );

    return {
        handleDeleteClick,
        DeleteDialogComponent,
    };
};
