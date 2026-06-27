import {
    TableBody,
    TableHead,
    Paper,
    IconButton,
    Pagination,
    Typography,
    Checkbox,
    Toolbar,
    Chip,
    Box,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

import {
    StyledTable,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from "../StyledTableComponents";
import PropTypes from "prop-types";
import FlexEvenly from "../FlexEvenly";
import { memo, useCallback, useState, useMemo, useEffect } from "react";
import FlexBetween from "../FlexBetween";
import Actions from "./helper/Actions";
import { useUI } from "../../context/UIContext";
import FieldCell from "./components/FieldCell";
import { getVisibleFields, EMPTY_DATA_MSG } from "./utils/fieldHelpers";
import { useTheme } from "@emotion/react";

// ── Save/Cancel inline row controls ───────────────────────────────────────
const InlineEditControls = ({ rowId, handleSave, handleCancel }) => (
    <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton size="small" color="primary" onClick={() => handleSave(rowId)}>
            <SaveIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error" onClick={handleCancel}>
            <CancelIcon fontSize="small" />
        </IconButton>
    </Box>
);

InlineEditControls.propTypes = {
    rowId: PropTypes.any,
    handleSave: PropTypes.func,
    handleCancel: PropTypes.func,
};

// ── Mobile card for a single row ───────────────────────────────────────────
const MobileRowCard = ({
    row,
    rowIndex,
    fields,
    fieldsMeta,
    editingId,
    multi,
    tableState,
    handleSave,
    handleCancel,
    handleChange,
    handleViewOpen,
    handleSelectRow,
    selectedRows,
    theme,
    actions,
}) => {
    const rowId = row[fieldsMeta.primary];
    const isItemSelected = selectedRows.includes(rowId);
    const isRowEditing = editingId === rowId;
    const visibleFields = getVisibleFields(fields);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: "16px",
                border: `1px solid ${theme.palette.divider}`,
                borderLeft: isItemSelected
                    ? `6px solid ${theme.palette.primary.main}`
                    : `6px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                position: "relative",
                backgroundColor: theme.palette.background.paper,
                boxShadow: isItemSelected
                    ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`
                    : "0 4px 12px rgba(0, 0, 0, 0.02)",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                    transform: "translateY(-2px)",
                },
            }}
        >
            <FlexBetween mb={2} sx={{ pb: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {multi && (
                        <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onChange={(e) => handleSelectRow(e, rowId)}
                            onClick={(e) => e.stopPropagation()}
                            size="small"
                            sx={{ p: 0.5 }}
                        />
                    )}
                    <Typography variant="subtitle2" sx={{ color: "text.primary", fontWeight: 700 }}>
                        Record #{(parseInt(tableState.currentPage) - 1) * tableState.pageSize + rowIndex + 1}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
                    {isRowEditing ? (
                        <InlineEditControls rowId={rowId} handleSave={handleSave} handleCancel={handleCancel} />
                    ) : (
                        <Actions actions={actions} row={row} />
                    )}
                </Box>
            </FlexBetween>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {visibleFields.map((field) => (
                    <Box
                        key={field.name}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                            borderBottom: `1px solid rgba(0,0,0,0.03)`,
                            pb: 1,
                            "&:last-child": { borderBottom: "none", pb: 0 },
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.text.secondary,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                flexShrink: 0,
                            }}
                        >
                            {field.label}
                        </Typography>
                        <Box
                            sx={{ minWidth: 0, display: "flex", justifyContent: "flex-end", textAlign: "right" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FieldCell
                                field={field}
                                row={row}
                                isEdit={editingId === rowId && (field?.editable ? field.editable(row) : true)}
                                handleChange={(v, _id, name) => handleChange(v, rowId, name)}
                                handleViewOpen={handleViewOpen}
                            />
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

MobileRowCard.propTypes = {
    row: PropTypes.object,
    rowIndex: PropTypes.number,
    fields: PropTypes.array,
    fieldsMeta: PropTypes.object,
    editingId: PropTypes.any,
    multi: PropTypes.bool,
    tableState: PropTypes.object,
    handleSave: PropTypes.func,
    handleCancel: PropTypes.func,
    handleChange: PropTypes.func,
    handleViewOpen: PropTypes.func,
    handleSelectRow: PropTypes.func,
    selectedRows: PropTypes.array,
    theme: PropTypes.object,
    actions: PropTypes.array,
};

// ── Desktop table ──────────────────────────────────────────────────────────
const DesktopTable = ({
    fields,
    data,
    fieldsMeta,
    editingId,
    multi,
    tableState,
    loading,
    handleSave,
    handleCancel,
    handleChange,
    handleViewOpen,
    handleSelectRow,
    handleSelectAll,
    selectedRows,
    visibleRowIds,
    actions,
    onClickRow,
}) => {
    const visibleFields = getVisibleFields(fields);
    const isAllSelected = visibleRowIds.length > 0 && selectedRows.length === visibleRowIds.length;
    const isIndeterminate = selectedRows.length > 0 && selectedRows.length < visibleRowIds.length;

    return (
        <StyledTableContainer component={Paper}>
            <StyledTable>
                <TableHead>
                    <StyledTableRow>
                        {multi && (
                            <StyledTableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={isIndeterminate}
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                />
                            </StyledTableCell>
                        )}
                        <StyledTableCell>S. No.</StyledTableCell>
                        {visibleFields.map(({ label }) => (
                            <StyledTableCell key={label}>{label}</StyledTableCell>
                        ))}
                        <StyledTableCell sx={{ textAlign: "center" }}>Actions</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, rowIndex) => {
                        const rowId = row[fieldsMeta.primary];
                        const isItemSelected = selectedRows.includes(rowId);
                        return (
                            <StyledTableRow
                                key={rowId}
                                sx={{ cursor: onClickRow ? "pointer" : "auto" }}
                                onClick={() => onClickRow && onClickRow(row)}
                                selected={isItemSelected}
                            >
                                {multi && (
                                    <StyledTableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            onChange={(e) => handleSelectRow(e, rowId)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </StyledTableCell>
                                )}
                                <StyledTableCell>
                                    {(parseInt(tableState.currentPage) - 1) * tableState.pageSize + rowIndex + 1}
                                </StyledTableCell>

                                {visibleFields.map((field) => (
                                    <StyledTableCell key={field.name}>
                                        <FieldCell
                                            field={field}
                                            row={row}
                                            isEdit={
                                                editingId === rowId &&
                                                (field?.editable ? field.editable(row) : true)
                                            }
                                            handleChange={(v, _id, name) => handleChange(v, rowId, name)}
                                            handleViewOpen={handleViewOpen}
                                        />
                                    </StyledTableCell>
                                ))}

                                <StyledTableCell onClick={(e) => e.stopPropagation()}>
                                    <FlexEvenly>
                                        {editingId === rowId ? (
                                            <InlineEditControls
                                                rowId={rowId}
                                                handleSave={handleSave}
                                                handleCancel={handleCancel}
                                            />
                                        ) : (
                                            <Actions actions={actions} row={row} />
                                        )}
                                    </FlexEvenly>
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })}

                    {data?.length === 0 && !loading && (
                        <StyledTableRow>
                            <StyledTableCell
                                colSpan={2 + visibleFields.length + (multi ? 1 : 0)}
                            >
                                <FlexEvenly>
                                    <Typography>{EMPTY_DATA_MSG}</Typography>
                                </FlexEvenly>
                            </StyledTableCell>
                        </StyledTableRow>
                    )}
                </TableBody>
            </StyledTable>
        </StyledTableContainer>
    );
};

DesktopTable.propTypes = {
    fields: PropTypes.array,
    data: PropTypes.array,
    fieldsMeta: PropTypes.object,
    editingId: PropTypes.any,
    multi: PropTypes.bool,
    tableState: PropTypes.object,
    loading: PropTypes.bool,
    handleSave: PropTypes.func,
    handleCancel: PropTypes.func,
    handleChange: PropTypes.func,
    handleViewOpen: PropTypes.func,
    handleSelectRow: PropTypes.func,
    handleSelectAll: PropTypes.func,
    selectedRows: PropTypes.array,
    visibleRowIds: PropTypes.array,
    actions: PropTypes.array,
    onClickRow: PropTypes.func,
};

// ── ListView ───────────────────────────────────────────────────────────────
const ListView = ({
    fields,
    data,
    editingId,
    fieldsMeta,
    actions,
    handleChange,
    handleSave,
    loading,
    handleCancel,
    tableState,
    handlePageChange,
    handleViewOpen,
    multi = false,
}) => {
    const { isMobile } = useUI();
    const theme = useTheme();

    const onClickRow = useCallback(
        (row) => actions?.find((a) => a.name === "form" && !a.hide)?.onClick(row),
        [actions],
    );

    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        setSelectedRows([]);
    }, [tableState?.currentPage, data]);

    const visibleRowIds = useMemo(
        () => data?.map((row) => row[fieldsMeta.primary]) || [],
        [data, fieldsMeta.primary],
    );

    const selectedRowsData = useMemo(
        () => data?.filter((row) => selectedRows.includes(row[fieldsMeta.primary])) || [],
        [data, selectedRows, fieldsMeta.primary],
    );

    const multiActions = useMemo(
        () => (actions || []).filter((action) => action.multi === true),
        [actions],
    );

    const handleSelectAll = useCallback(
        (event) => {
            setSelectedRows(event.target.checked ? visibleRowIds : []);
        },
        [visibleRowIds],
    );

    const handleSelectRow = useCallback((event, id) => {
        event.stopPropagation();
        setSelectedRows((prev) =>
            event.target.checked ? [...prev, id] : prev.filter((rowId) => rowId !== id),
        );
    }, []);

    // Shared props for both mobile card and desktop table
    const sharedRowProps = {
        fields,
        fieldsMeta,
        editingId,
        multi,
        tableState,
        handleSave,
        handleCancel,
        handleChange,
        handleViewOpen,
        handleSelectRow,
        selectedRows,
        theme,
        actions,
    };

    return (
        <>
            {/* ── Multi-select toolbar ── */}
            {multi && selectedRows.length > 0 && (
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                        py: 1.5,
                        px: 2,
                        mb: 2,
                        borderRadius: "12px",
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        animation: "fadeIn 0.2s ease-in-out",
                        "@keyframes fadeIn": {
                            from: { opacity: 0, transform: "translateY(-10px)" },
                            to: { opacity: 1, transform: "translateY(0)" },
                        },
                    }}
                >
                    <Chip color="primary" label={`${selectedRows.length} selected`} />
                    <FlexEvenly>
                        <Actions actions={multiActions} row={selectedRowsData} />
                    </FlexEvenly>
                </Toolbar>
            )}

            {/* ── View: mobile cards or desktop table ── */}
            {isMobile ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                    {data.map((row, rowIndex) => (
                        <MobileRowCard
                            key={row[fieldsMeta.primary] || rowIndex}
                            row={row}
                            rowIndex={rowIndex}
                            {...sharedRowProps}
                        />
                    ))}
                    {data?.length === 0 && !loading && (
                        <Paper
                            sx={{
                                p: 4,
                                textAlign: "center",
                                borderRadius: "16px",
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <Typography color="text.secondary">{EMPTY_DATA_MSG}</Typography>
                        </Paper>
                    )}
                </Box>
            ) : (
                <DesktopTable
                    data={data}
                    loading={loading}
                    onClickRow={onClickRow}
                    visibleRowIds={visibleRowIds}
                    handleSelectAll={handleSelectAll}
                    {...sharedRowProps}
                />
            )}

            {/* ── Pagination ── */}
            <FlexBetween m={1} flexDirection={"row-reverse"} sx={{ flexWrap: "wrap", gap: 1 }}>
                <Pagination
                    page={tableState.currentPage ?? 0}
                    count={Math.ceil(tableState.totalCount / tableState.pageSize) ?? 0}
                    onChange={(e, p) => handlePageChange(p)}
                    color="primary"
                    shape="rounded"
                    size={isMobile ? "small" : "medium"}
                    siblingCount={isMobile ? 0 : 1}
                    boundaryCount={1}
                />
            </FlexBetween>
        </>
    );
};

ListView.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    tableState: PropTypes.object,
    fields: PropTypes.array,
    loading: PropTypes.bool,
    editingId: PropTypes.any,
    fieldsMeta: PropTypes.shape({
        primary: PropTypes.string,
        root: PropTypes.string,
    }),
    handleChange: PropTypes.func,
    handleSave: PropTypes.func,
    handleCancel: PropTypes.func,
    handlePageChange: PropTypes.func,
    handleViewOpen: PropTypes.func,
    multi: PropTypes.bool,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            onClick: PropTypes.func,
            icon: PropTypes.element,
            sx: PropTypes.object,
            enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
            multi: PropTypes.bool,
        }),
    ),
};

export default memo(ListView);
