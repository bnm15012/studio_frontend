import { useCallback, useState } from "react";

interface UseDeleteHandlerProps {
    tableCruds: any;
    token: string | null | undefined;
    showAlert: (msg: string, type?: any) => void;
    setLoading: (loading: boolean) => void;
    dispatch: any;
    navigate: (path: string) => void;
    tableName: string;
    consts: React.MutableRefObject<{
        primaryKey: string;
        [key: string]: any;
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
}: UseDeleteHandlerProps) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<any>(null);

    const handleDeleteClick = useCallback(
        (row: any) => {
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
