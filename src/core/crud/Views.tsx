/** Main orchestration component that wires together ListView, CardView, DialogForm, FormView, DeleteDialog, and the action bar for a full CRUD interface. */
import DialogForm from "@/core/crud/DialogForm";
import FormView from "@/core/crud/FormView";
import ListView from "@/core/crud/ListView";
import CardView from "@/core/crud/CardView";
import StyledDialog, { type StyledDialogProps } from "@/core/components/dialogs/StyledDialog";
import DeleteDialog from "@/core/components/dialogs/DeleteDialog";
import { useAlert } from "@/core/components/feedback/Alert";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Typography, Box, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TopProgressBar from "@/core/components/loading/TopProgressBar";
import { useNavigate } from "react-router-dom";
import { useMergedActions } from "@/core/crud/hooks/useMergedActions";
import { useCrudAction } from "@/core/crud/hooks/useCrudAction";
import { useTableData } from "@/core/crud/hooks/useTableData";
import { useDeleteHandler } from "@/core/crud/hooks/useDeleteHandler";
import { useAppUI } from "@/context/UIContext";
import {
    FieldDef,
    FieldMeta,
    ActionItem,
    CrudThunks,
    CrudRecord,
    ViewMode,
    ViewsApiRef,
    BaseViewProps,
    RequestParams,
    FieldValue,
} from "@/core/types";
import { FilterKeys } from "@/core/state/stateTypes";
import { useAppDispatch } from "@/state";
import { useRowSelection } from "@/core/crud/hooks/useRowSelection";
import { SelectionToolbar } from "@/core/crud/components/SelectionToolbar";
import ActionBar, { ActionBarProps } from "@/core/components/layout/ActionBar";
import {
    applyVisibility,
    ColumnVisibilityMap,
    getStoredVisibility,
} from "@/core/components/layout/columnVisibilityHelper";

export interface ViewsProps<T extends CrudRecord> {
    /** 0 = new record, positive integer = existing record id, undefined = list mode */
    formKey?: number;
    tableName: string;
    overRideOnChange?: (value: FieldValue, obj: Partial<T> | T, field: string) => Partial<T> | T;
    size: number;
    /** 0 means "no root context yet" — fetch will be skipped until non-zero */
    rootId: number;
    tableCruds: CrudThunks<T>;
    fields: FieldDef<T>[];
    fieldsMeta: FieldMeta;
    apiRef?: React.MutableRefObject<ViewsApiRef>;
    dialogProps?: Partial<StyledDialogProps>;
    defaultParams?: RequestParams & FilterKeys;
    beforeAdd?: (row: T) => T | Promise<T>;
    beforeUpdate?: (row: T) => T | Promise<T>;
    cardLayout?: "vertical" | "horizontal";
    fieldToDisplayOnDelete?: string;
    currentView?: ViewMode;
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
    /**
     * Plug in a fully custom view component.
     * It will receive the same `BaseViewProps<T>` that ListView and CardView get,
     * so it has access to data, fields, actions, handlers, and layout hints.
     *
     * The component is rendered when `currentView` is not "LIST" or "CARD".
     *
     * Example:
     * ```tsx
     * import type { BaseViewProps } from "@/core/types";
     *
     * function KanbanView<T extends CrudRecord>(props: BaseViewProps<T>) {
     *   return <div>{props.data.map(row => ...)}</div>;
     * }
     *
     * <Views ... currentView="KANBAN" customView={KanbanView} />
     * ```
     */
    customView?: React.ComponentType<BaseViewProps<T>>;
}

function Views<T extends CrudRecord>(props: ViewsProps<T>) {
    const {
        formKey,
        dialogProps,
        tableName,
        showAddButton = false,
        tableCruds,
        fields,
        currentView: currentViewProp = "LIST",
        fieldsMeta,
        apiRef = { current: {} },
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
        customView: CustomView,
    } = props;

    const currentView = currentViewProp;

    const consts = useRef({ primaryKey: fieldsMeta.primary, rootKey: fieldsMeta.root, fields });

    const dispatch = useAppDispatch();
    const showAlert = useAlert();
    const navigate = useNavigate();
    const theme = useTheme();
    const { isMobile, token: rawToken } = useAppUI();
    const token = rawToken ?? "";
    const [fetchLoading, setFetchLoading] = useState(false);
    const [mutateLoading, setMutateLoading] = useState(false);
    const loading = fetchLoading || mutateLoading;

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
        setLoading: setFetchLoading,
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
        submitAttempted,
    } = useCrudAction<T>({
        formKey,
        data,
        setData,
        dispatch,
        tableCruds: safeCruds,
        token,
        showAlert,
        setLoading: setMutateLoading,
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
        setLoading: setMutateLoading,
        dispatch,
        navigate,
        formKey,
        tableName,
        consts,
    });

    const refreshData = useCallback(() => {
        dispatch(safeCruds.refresh(showAlert, setFetchLoading, token));
    }, [dispatch, showAlert, safeCruds, token, setFetchLoading]);

    const openFormView = useCallback(
        (row: T) => {
            navigate(
                `/management/${tableName}/${
                    (row as unknown as Record<string, unknown>)[consts.current.primaryKey]
                }`,
            );
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
        resetOn: [tableState.currentPage, data],
        actions: mergedActions,
    });

    /** Shared "open form view for this row" handler — used by both ListView and CardView
     *  to navigate when the user clicks a row or the "form" action. */
    const onClickRow = useCallback(
        (row: T) => mergedActions.find((a) => a.name === "form" && !a.hide)?.onClick?.(row),
        [mergedActions],
    );

    const commonStableProps = useMemo(
        () => ({
            fields: visibleFields,
            fieldsMeta,
            tableName,
            currentView,
            multi,
            ...(CardContentComponent ? { CardContentComponent } : {}),
            handleChange,
            infiniteScroll,
            handleViewOpen,
            handleSave,
            handleCancel,
            handlePageChange,
            ...(showAddButton ? { addNewRow } : {}),
            onClickRow,
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
            onClickRow,
        ],
    );

    const commonProps = {
        data,
        tableState,
        loading,
        editingId,
        actions: mergedActions,
        submitAttempted,
    };

    useEffect(() => {
        if (apiRef && "current" in apiRef) {
            apiRef.current.addNewRow = addNewRow;
            apiRef.current.refreshData = refreshData;
        }
    }, [addNewRow, apiRef, refreshData]);

    const didInitNewRow = useRef(false);
    useEffect(() => {
        if (formKey === 0) {
            if (!didInitNewRow.current) {
                didInitNewRow.current = true;
                addNewRow();
            }
        } else {
            didInitNewRow.current = false;
        }
    }, [formKey, addNewRow]);

    useEffect(() => {
        if (formKey && formKey !== 0) {
            fetchOne(formKey);
        }
    }, [formKey, fetchOne]);

    useEffect(() => {
        if (formKey && formKey !== 0) {
            setRecord((tableState.recordById as Record<string | number, T>)[formKey] ?? ({} as T));
        }
    }, [formKey, setRecord, tableState.recordById]);

    return (
        <>
            <TopProgressBar loading={fetchLoading} />
            {formKey !== undefined ? (
                <FormView<T>
                    {...commonStableProps}
                    loading={loading}
                    editingId={editingId}
                    actions={mergedActions}
                    formKey={formKey}
                    data={record}
                    currentView={currentView}
                    submitAttempted={submitAttempted}
                />
            ) : (
                <>
                    {multi && selectedRows.length > 0 ? (
                        <SelectionToolbar
                            selectedCount={selectedRows.length}
                            selectedRowsData={selectedRowsData}
                            multiActions={multiActions}
                            labelVariant={currentView === "CARD" ? "text" : "chip"}
                        />
                    ) : (
                        actionBarProps && (
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
                                        currentView: formKey !== undefined ? "FORM" : currentView,
                                        tableKey: tableName,
                                        fields: fields as unknown as FieldDef<CrudRecord>[],
                                        onVisibilityChange: setVisibilityMap,
                                    }}
                                />
                            </Box>
                        )
                    )}
                    {currentView === "CARD" ? (
                        <CardView<T>
                            {...commonStableProps}
                            {...commonProps}
                            handleLoadMore={loadMore}
                            selectedRows={selectedRows}
                            isAllSelected={isAllSelected}
                            isIndeterminate={isIndeterminate}
                            handleSelectRow={handleSelectRow}
                            handleSelectAll={handleSelectAll}
                        />
                    ) : currentView === "LIST" ? (
                        <ListView<T>
                            {...commonStableProps}
                            {...commonProps}
                            editingId={editMode === "INLINE" ? editingId : -1}
                            selectedRows={selectedRows}
                            visibleRowIds={visibleRowIds}
                            handleSelectRow={handleSelectRowEvent}
                            handleSelectAll={handleSelectAll}
                        />
                    ) : CustomView ? (
                        <CustomView {...commonStableProps} {...commonProps} />
                    ) : null}
                </>
            )}
            {editMode !== "FORM" &&
                (editMode === "DIALOG" || currentView === "CARD") &&
                editingId >= 0 && (
                    <DialogForm<T>
                        setClose={handleCancel}
                        tableState={tableState}
                        loading={loading}
                        editingId={editingId}
                        actions={mergedActions}
                        {...commonStableProps}
                        {...dialogProps}
                        submitAttempted={submitAttempted}
                        data={
                            data.find(
                                (d) =>
                                    (d as unknown as Record<string, unknown>)[
                                        consts.current.primaryKey
                                    ] === editingId,
                            ) ?? ({} as T)
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
                                        {
                                            (viewRow as unknown as Record<string, unknown>)[
                                                field.name
                                            ] as React.ReactNode
                                        }
                                    </Paper>
                                </Typography>
                            ))}
                        </Box>
                    )}
                </StyledDialog>
            )}

            {deleteDialogOpen && deleteId > 0 && (
                <DeleteDialog
                    open={deleteDialogOpen}
                    onClose={closeDeleteDialog}
                    onConfirm={handleDeleteConfirm}
                    id={deleteId}
                    displayData={`${tableName} for ${
                        (
                            data.find(
                                (d) =>
                                    (d as unknown as Record<string, unknown>)[
                                        consts.current.primaryKey
                                    ] === deleteId,
                            ) as unknown as Record<string, unknown> | undefined
                        )?.[fieldToDisplayOnDelete] ?? deleteId
                    }`}
                />
            )}
        </>
    );
}

export default Views;
