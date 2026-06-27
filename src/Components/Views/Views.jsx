import DialogForm from "./DialogForm";
import FormView from "./FormView";
import PropTypes from "prop-types";
import ListView from "./ListView";
import CardView from "./CardView";
import StyledDialog from "../../core/components/StyledDialog";
import DeleteDialog from "../DeleteDialog";
import { useAlert } from "../../core/util/Alert";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Box, Paper, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMergedActions } from "./hooks/useMergedActions";
import { useCrudAction } from "./hooks/useCrudAction";
import { useTableData } from "./hooks/useTableData";
import { useDeleteHandler } from "./hooks/useDeleteHandler";
import { FlexEvenly } from "../FlexBox";
import { useUI } from "../../context/UIContext";

const Views = (props) => {
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
        size,
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

    const dispatch = useDispatch();
    const showAlert = useAlert();
    const navigate = useNavigate();
    const { isMobile } = useUI();

    const token = useSelector((state) => state.auth.token);
    const [loading, setLoading] = useState(false);

    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [viewRow, setViewRow] = useState(null);

    const { data, setData, tableState, fetchOne, handlePageChange, loadMore } = useTableData({
        tableCruds,
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
    } = useCrudAction({
        formKey,
        data,
        setData,
        dispatch,
        tableCruds,
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

    const handleViewOpen = (row) => {
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
        tableCruds,
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
        dispatch(tableCruds.refresh(showAlert, setLoading, token));
    }, [dispatch, showAlert, tableCruds, token]);

    const openFormView = useCallback(
        (row) => {
            navigate(`/management/${tableName}/${row[consts.current.primaryKey]}`);
        },
        [navigate, tableName],
    );

    const mergedActions = useMergedActions(
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
        apiRef.current.addNewRow = addNewRow;
        apiRef.current.refreshData = refreshData;
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
            setRecord(tableState.recordById[formKey]);
        }
    }, [formKey, setRecord, tableState.recordById]);

    return (
        <>
            {formKey ? (
                <FormView
                    {...commonStableProps}
                    {...commonProps}
                    formKey={formKey}
                    data={record}
                    currentView={currentView}
                />
            ) : currentView === "CARD" ? (
                <CardView
                    {...commonStableProps}
                    {...commonProps}
                    CardContentComponent={CardContentComponent}
                    handleLoadMore={loadMore}
                />
            ) : (
                <ListView
                    {...commonStableProps}
                    {...commonProps}
                    editingId={editMode === "INLINE" ? editingId : false}
                />
            )}
            {editMode !== "FORM" &&
                (editMode === "DIALOG" || currentView === "CARD") &&
                editingId && (
                    <DialogForm
                        setClose={handleCancel}
                        {...commonProps}
                        {...commonStableProps}
                        {...dialogProps}
                        data={data.find((d) => d[consts.current.primaryKey] === editingId)}
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
                                        {viewRow[field.name]}
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
};

Views.propTypes = {
    formKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableName: PropTypes.string.isRequired,
    overRideOnChange: PropTypes.func,
    size: PropTypes.number.isRequired,
    rootId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableCruds: PropTypes.any,
    fields: PropTypes.array,
    fieldsMeta: PropTypes.shape({
        primary: PropTypes.string,
        root: PropTypes.string,
    }),
    apiRef: PropTypes.shape({
        current: PropTypes.object,
    }),
    dialogProps: PropTypes.object,
    defaultParams: PropTypes.object,
    beforeAdd: PropTypes.func,
    beforeUpdate: PropTypes.func,
    cardLayout: PropTypes.oneOf(["vertical", "horizontal"]),
    fieldToDisplayOnDelete: PropTypes.string,
    currentView: PropTypes.string,
    showAddButton: PropTypes.bool,
    CardContentComponent: PropTypes.elementType,
    actions: PropTypes.arrayOf(Object),
    multi: PropTypes.bool,
    editMode: PropTypes.oneOf(["FORM", "DIALOG", "INLINE"]),
};

export default Views;
