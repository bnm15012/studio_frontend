/** Main orchestration component that wires together ListView, CardView, DialogForm, FormView, DeleteDialog, and the action bar for a full CRUD interface. */
import DialogForm from "./DialogForm";
import FormView from "./FormView";
import ListView from "./ListView";
import CardView from "./CardView";
import StyledDialog from "../components/dialogs/StyledDialog";
import DeleteDialog from "../components/dialogs/DeleteDialog";
import { useAlert } from "../components/feedback/Alert";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Typography, Box, Paper, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useMergedActions } from "./hooks/useMergedActions";
import { useCrudAction } from "./hooks/useCrudAction";
import { useTableData } from "./hooks/useTableData";
import { useDeleteHandler } from "./hooks/useDeleteHandler";
import { FlexEvenly } from "../components/layout/FlexBox";
import { useAppUI } from "@/context/UIContext";
import { FieldDef, ActionItem, CrudThunks, Entity } from "../types";
import { useAppDispatch } from "../../state";
import { useRowSelection } from "./hooks/useRowSelection";
import { SelectionToolbar } from "./components/SelectionToolbar";
import ActionBar, { ActionBarProps } from "../components/layout/ActionBar";
import {
    applyVisibility,
    ColumnVisibilityMap,
    getStoredVisibility,
} from "../components/layout/columnVisibilityHelper";

export interface ViewsProps<T extends Entity = Entity> {
    formKey?: string | number | null;
    tableName: string;
    overRideOnChange?: (value: unknown, obj: T, field: string) => T;
    size?: number;
    rootId?: string | number | null;
    tableCruds?: CrudThunks<T>;
    fields: FieldDef<T>[];
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
    CardContentComponent?: React.ComponentType<{
        row: T;
        handleViewOpen?: (row: T) => void;
    }>;
    actions?: ActionItem<T>[];
    multi?: boolean;
    editMode?: "FORM" | "DIALOG" | "INLINE";
    /** Pass ActionBar display options here — api is auto-wired from the internal ref. */
    actionBarProps?: Omit<ActionBarProps, "api">;
    infiniteScroll?: boolean;
}

function Views<T extends Entity = Entity>(props: ViewsProps<T>) {
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
        actionBarProps,
        infiniteScroll = true,
    } = props;

    const consts = useRef({
        primaryKey: fieldsMeta.primary,
        rootKey: fieldsMeta.root,
        fields,
    });

    const dispatch = useAppDispatch();
    const showAlert = useAlert();
    const navigate = useNavigate();
    const theme = useTheme();
    const { isMobile, token } = useAppUI();
    const [loading, setLoading] = useState(false);

    const [visibilityMap, setVisibilityMap] = useState<ColumnVisibilityMap>(() =>
        getStoredVisibility(tableName),
    );

    const visibleFields = useMemo(
        () => applyVisibility(fields, visibilityMap),
        [fields, visibilityMap],
    );

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

    const handleViewOpen = useCallback((row: T) => {
        setViewRow(row);
        setViewDialogOpen(true);
    }, []);

    const handleViewClose = useCallback(() => {
        setViewRow(null);
        setViewDialogOpen(false);
    }, []);

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
        dispatch(safeCruds.refresh(showAlert, setLoading, token));
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

    const {
        selectedRows,
        selectedRowsData,
        multiActions,
        visibleRowIds,
        isAllSelected,
        isIndeterminate,
        handleSelectRow,
        handleSelectRowEvent,
        handleSelectAll,
    } = useRowSelection({
        data,
        primaryKey: fieldsMeta.primary,
        resetOn: [tableState?.currentPage, data],
        actions: mergedActions,
    });

    const commonStableProps = useMemo(
        () => ({
            fields: visibleFields,
            fieldsMeta,
            tableName,
            currentView,
            multi,
            CardContentComponent,
            handleChange,
            infiniteScroll,
            handleViewOpen,
            handleSave,
            handleCancel,
            handlePageChange,
            addNewRow: showAddButton ? addNewRow : undefined,
        }),
        [
            visibleFields,
            fieldsMeta,
            tableName,
            currentView,
            multi,
            handlePageChange,
            CardContentComponent,
            infiniteScroll,
            handleSave,
            handleCancel,
            handleChange,
            handleViewOpen,
            showAddButton,
            addNewRow,
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
            setRecord(
                (tableState.recordById as Record<string | number, T>)?.[formKey] ?? ({} as T),
            );
        }
    }, [formKey, setRecord, tableState.recordById]);

    return (
        <>
            {actionBarProps && !formKey && (
                <Box
                    sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        bgcolor: "background.default",
                        py: 1,
                    }}
                >
                    <ActionBar
                        {...actionBarProps}
                        api={apiRef}
                        columnVisibility={{
                            currentView: formKey ? "FORM" : currentView,
                            tableKey: tableName,
                            fields: fields as unknown as FieldDef[],
                            onVisibilityChange: setVisibilityMap,
                        }}
                    />
                </Box>
            )}
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
            ) : (
                <>
                    {multi && selectedRows.length > 0 && (
                        <SelectionToolbar
                            selectedCount={selectedRows.length}
                            selectedRowsData={selectedRowsData}
                            multiActions={multiActions}
                            labelVariant={currentView === "CARD" ? "text" : "chip"}
                        />
                    )}
                    {currentView === "CARD" ? (
                        <CardView<T>
                            {...commonStableProps}
                            {...commonProps}
                            CardContentComponent={CardContentComponent}
                            handleLoadMore={loadMore}
                            selectedRows={selectedRows}
                            isAllSelected={isAllSelected}
                            isIndeterminate={isIndeterminate}
                            handleSelectRow={handleSelectRow}
                            handleSelectAll={handleSelectAll}
                        />
                    ) : (
                        <ListView<T>
                            {...commonStableProps}
                            {...commonProps}
                            editingId={editMode === "INLINE" ? editingId : null}
                            selectedRows={selectedRows}
                            visibleRowIds={visibleRowIds}
                            handleSelectRow={handleSelectRowEvent}
                            handleSelectAll={handleSelectAll}
                        />
                    )}
                </>
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
                        data={
                            data.find((d) => d[consts.current.primaryKey] === editingId) ??
                            ({} as T)
                        }
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
                                            background: theme.palette.background.odd,
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
                    displayData={`${tableName} for ${
                        data.find((d) => d[consts.current.primaryKey] === deleteId)?.[
                            fieldToDisplayOnDelete
                        ]
                    }`}
                />
            )}
        </>
    );
}

export default Views;
