import DialogForm from "./DialogForm";
import FormView from "./FormView";
import ListView from "./ListView";
import CardView from "./CardView";
import StyledDialog from "../components/dialogs/StyledDialog";
import DeleteDialog from "../components/dialogs/DeleteDialog";
import { useAlert } from "../components/feedback/Alert";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Typography, Box, Paper, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMergedActions } from "./hooks/useMergedActions";
import { useCrudAction } from "./hooks/useCrudAction";
import { useTableData } from "./hooks/useTableData";
import { useDeleteHandler } from "./hooks/useDeleteHandler";
import { FlexEvenly } from "../components/layout/FlexBox";
import { useUI } from "@/context/UIContext";
import { FieldDef, ActionItem, CrudThunks } from "../types";
import { useAppSelector, useAppDispatch } from "../../state";

export interface ViewsProps<T extends Record<string, unknown> = Record<string, unknown>> {
    formKey?: string | number | null;
    tableName: string;
    overRideOnChange?: (value: unknown, obj: T, field: string) => T;
    size?: number;
    rootId?: string | number | null;
    tableCruds?: CrudThunks<T>;
    fields: FieldDef[];
    fieldsMeta: {
        primary: string;
        root?: string;
    };
    apiRef?: React.MutableRefObject<Record<string, unknown>>;
    dialogProps?: Record<string, unknown>;
    defaultParams?: Record<string, unknown>;
    beforeAdd?: (row: T) => T | Promise<T>;
    beforeUpdate?: (row: T) => T | Promise<T>;
    cardLayout?: "vertical" | "horizontal";
    fieldToDisplayOnDelete?: string;
    currentView?: string;
    showAddButton?: boolean;
    CardContentComponent?: React.ComponentType<{ row: T; handleViewOpen?: (row: T) => void }>;
    actions?: ActionItem<T>[];
    multi?: boolean;
    editMode?: "FORM" | "DIALOG" | "INLINE";
}

function Views<T extends Record<string, unknown> = Record<string, unknown>>(props: ViewsProps<T>) {
    const {
        formKey,
        dialogProps,
        tableName,
        showAddButton = false,
        tableCruds,
        fields,
        fieldsMeta,
        apiRef = { current: {} },
        currentView = "LIST",
        fieldToDisplayOnDelete = "name",
        CardContentComponent,
        actions = [],
        editMode = "INLINE",
        multi = false,
        defaultParams = {},
        size = 10,
        rootId,
        beforeAdd,
        beforeUpdate,
        overRideOnChange,
    } = props;

    const consts = useRef({
        primaryKey: fieldsMeta.primary,
        rootKey: fieldsMeta.root,
        fields,
    });

    const dispatch = useAppDispatch();
    const showAlert = useAlert();
    const navigate = useNavigate();
    const { isMobile } = useUI();

    const token = useAppSelector((state) => state.auth.token);
    const [loading, setLoading] = useState(false);

    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [viewRow, setViewRow] = useState<T | null>(null);

    // Guard: tableCruds must be defined for CRUD operations
    const safeCruds = tableCruds as CrudThunks<T>;

    const { data, setData, tableState, fetchOne, handlePageChange, loadMore } = useTableData<T>({
        tableCruds: safeCruds,
        tableName,
        token,
        showAlert,
        size,
        rootId,
        currentView,
        setLoading,
        defaultParams,
    });

    const {
        editingId,
        record,
        setRecord,
        handleEdit,
        handleCancel,
        handleSave,
        addNewRow,
        handleChange,
    } = useCrudAction<T>({
        formKey,
        data,
        setData,
        dispatch,
        tableCruds: safeCruds,
        token,
        showAlert,
        setLoading,
        rootId,
        navigate,
        tableName,
        tableState,
        consts,
        beforeAdd,
        beforeUpdate,
        overRideOnChange,
    });

    const handleViewOpen = (row: T) => {
        setViewRow(row);
        setViewDialogOpen(true);
    };

    const handleViewClose = () => {
        setViewRow(null);
        setViewDialogOpen(false);
    };

    const {
        handleDeleteClick,
        deleteDialogOpen,
        deleteId,
        closeDeleteDialog,
        handleDeleteConfirm,
    } = useDeleteHandler({
        tableCruds: safeCruds,
        token,
        showAlert,
        setLoading,
        dispatch,
        navigate,
        formKey,
        tableName,
        consts,
    });

    const refreshData = useCallback(() => {
        safeCruds.refresh(showAlert, setLoading, token)(dispatch, () => ({}));
    }, [dispatch, showAlert, safeCruds, token]);

    const openFormView = useCallback(
        (row: T) => {
            navigate(`/management/${tableName}/${row[consts.current.primaryKey]}`);
        },
        [navigate, tableName],
    );

    const mergedActions = useMergedActions<T>(
        actions,
        useMemo(
            () => ({
                loading,
                editMode,
                formKey,
                handleEdit,
                handleDeleteClick,
                openFormView,
            }),
            [editMode, formKey, handleEdit, handleDeleteClick, loading, openFormView],
        ),
    );

    const commonStableProps = useMemo(
        () => ({
            fields,
            fieldsMeta,
            tableName,
            currentView,
            multi,
            CardContentComponent,
            handleChange,
            handleViewOpen,
            handleSave,
            handleCancel,
            handlePageChange,
            addNewRow: showAddButton ? addNewRow : undefined,
        }),
        [
            fields,
            fieldsMeta,
            tableName,
            currentView,
            multi,
            CardContentComponent,
            addNewRow,
            handleCancel,
            handleChange,
            handlePageChange,
            handleSave,
            showAddButton,
        ],
    );

    const commonProps = {
        data,
        tableState,
        loading,
        editingId,
        actions: mergedActions,
    };

    useEffect(() => {
        if (apiRef && "current" in apiRef) {
            apiRef.current.addNewRow = addNewRow;
            apiRef.current.refreshData = refreshData;
        }
    }, [addNewRow, apiRef, refreshData]);

    const didInitNewRow = useRef(false);
    useEffect(() => {
        if (formKey === "NEW" && !didInitNewRow.current) {
            didInitNewRow.current = true;
            addNewRow();
        }
    }, [formKey, addNewRow]);

    useEffect(() => {
        if (formKey && formKey !== "NEW") {
            fetchOne(formKey);
        }
    }, [formKey, fetchOne]);

    useEffect(() => {
        if (formKey && formKey !== "NEW") {
            setRecord((tableState.recordById as Record<string | number, T>)?.[formKey] ?? {} as T);
        }
    }, [formKey, setRecord, tableState.recordById]);

    return (
        <>
            {formKey ? (
                <FormView<T>
                    {...commonStableProps}
                    loading={loading}
                    editingId={editingId}
                    actions={mergedActions}
                    formKey={formKey}
                    data={record}
                    currentView={currentView}
                />
            ) : currentView === "CARD" ? (
                <CardView<T>
                    {...commonStableProps}
                    {...commonProps}
                    CardContentComponent={CardContentComponent}
                    handleLoadMore={loadMore}
                />
            ) : (
                <ListView<T>
                    {...commonStableProps}
                    {...commonProps}
                    editingId={editMode === "INLINE" ? editingId : null}
                />
            )}
            {editMode !== "FORM" &&
                (editMode === "DIALOG" || currentView === "CARD") &&
                editingId && (
                    <DialogForm<T>
                        setClose={handleCancel}
                        tableState={tableState}
                        loading={loading}
                        editingId={editingId}
                        actions={mergedActions}
                        {...commonStableProps}
                        {...dialogProps}
                        data={data.find((d) => d[consts.current.primaryKey] === editingId) ?? {} as T}
                    />
                )}
            {viewDialogOpen && (
                <StyledDialog
                    open={viewDialogOpen}
                    onClose={handleViewClose}
                    closeIcon={true}
                    title="View"
                    maxWidth="md"
                    fullScreen={isMobile}
                >
                    {viewRow && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                            {fields.map((field) => (
                                <Typography key={field.name} variant="subtitle1">
                                    <strong>{field.label}:</strong>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 1,
                                            maxHeight: "20rem",
                                            overflowY: "auto",
                                            whiteSpace: "pre-wrap",
                                            background: "#fafafa",
                                        }}
                                    >
                                        {viewRow[field.name] as React.ReactNode}
                                    </Paper>
                                </Typography>
                            ))}
                        </Box>
                    )}
                </StyledDialog>
            )}
            {loading && (
                <FlexEvenly>
                    <CircularProgress />
                </FlexEvenly>
            )}

            {deleteDialogOpen && deleteId && (
                <DeleteDialog
                    open={deleteDialogOpen}
                    onClose={closeDeleteDialog}
                    onConfirm={handleDeleteConfirm}
                    id={deleteId}
                    displayData={`${tableName} for ${data.find((d) => d[consts.current.primaryKey] === deleteId)?.[
                        fieldToDisplayOnDelete
                        ]}`}
                />
            )}
        </>
    );
}

export default Views;
