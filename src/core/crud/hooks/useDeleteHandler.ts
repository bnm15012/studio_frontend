import { useCallback, useState } from "react";
import { ShowAlertFn, SetLoadingFn, CrudThunks } from "../../types";
import type { AppDispatch } from "../../../state";

interface UseDeleteHandlerProps<T extends Record<string, unknown> = Record<string, unknown>> {
    tableCruds: CrudThunks<T>;
    token: string | null | undefined;
    showAlert: ShowAlertFn;
    setLoading: SetLoadingFn;
    dispatch: AppDispatch;
    navigate: (path: string) => void;
    tableName: string;
    consts: React.MutableRefObject<{
        primaryKey: string;
        [key: string]: unknown;
    }>;
    formKey?: string | number | null;
}

export const useDeleteHandler = <T extends Record<string, unknown> = Record<string, unknown>>({
    tableCruds,
    token,
    showAlert,
    setLoading,
    dispatch,
    navigate,
    tableName,
    consts,
    formKey,
}: UseDeleteHandlerProps<T>): {
    handleDeleteClick: (row: T) => void;
    deleteDialogOpen: boolean;
    deleteId: string | number | null;
    closeDeleteDialog: () => void;
    handleDeleteConfirm: () => Promise<void>;
} => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);

    const handleDeleteClick = useCallback(
        (row: T) => {
            setDeleteId(row[consts.current.primaryKey] as string | number | null);
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
            tableCruds.remove(deleteId, token, showAlert, setLoading)(dispatch);
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
