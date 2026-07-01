import { useCallback, useState } from "react";
import { ShowAlertFn, SetLoadingFn, CrudThunks } from "../../types";

interface UseDeleteHandlerProps {
    tableCruds: CrudThunks;
    token: string | null | undefined;
    showAlert: ShowAlertFn;
    setLoading: SetLoadingFn;
    dispatch: unknown;
    navigate: (path: string) => void;
    tableName: string;
    consts: React.MutableRefObject<{
        primaryKey: string;
        [key: string]: unknown;
    }>;
    formKey?: string | number | null;
}

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
}: UseDeleteHandlerProps): {
    handleDeleteClick: (row: Record<string, unknown>) => void;
    deleteDialogOpen: boolean;
    deleteId: string | number | null;
    closeDeleteDialog: () => void;
    handleDeleteConfirm: () => Promise<void>;
} => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);

    const handleDeleteClick = useCallback(
        (row: Record<string, unknown>) => {
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
        } catch (error: unknown) {
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
