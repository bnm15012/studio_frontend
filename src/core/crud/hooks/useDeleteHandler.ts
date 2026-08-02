/** Hook encapsulating the delete flow: dispatches delete thunk, shows alerts, handles navigation after deletion. */
import { useCallback, useState } from "react";
import { ShowAlertFn, SetLoadingFn, CrudThunks, CrudRecord } from "@/core/types";
import type { AppDispatch } from "@/state";

interface UseDeleteHandlerProps<T extends CrudRecord> {
    tableCruds: CrudThunks<T>;
    token: string;
    showAlert: ShowAlertFn;
    setLoading: SetLoadingFn;
    dispatch: AppDispatch;
    navigate: (path: string) => void;
    tableName: string;
    consts: React.MutableRefObject<{ primaryKey: string }>;
    formKey?: number | null | undefined;
}

export const useDeleteHandler = <T extends CrudRecord>({
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
    deleteId: number;
    closeDeleteDialog: () => void;
    handleDeleteConfirm: () => Promise<void>;
} => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    /** 0 means no row selected for deletion */
    const [deleteId, setDeleteId] = useState<number>(0);

    const handleDeleteClick = useCallback(
        (row: T) => {
            setDeleteId(
                Number((row as unknown as Record<string, unknown>)[consts.current.primaryKey]) || 0,
            );
            setDeleteDialogOpen(true);
        },
        [consts],
    );

    const closeDeleteDialog = useCallback(() => {
        setDeleteDialogOpen(false);
        setDeleteId(0);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        try {
            if (deleteId === 0) return;
            tableCruds.remove(deleteId, token, showAlert, setLoading)(dispatch);
            if (formKey !== undefined) navigate(`/management/${tableName}`);
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
