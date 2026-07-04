import React, { memo, useCallback, useState, useMemo, useEffect } from "react";
import {
    TableBody,
    TableHead,
    Paper,
    Pagination,
    Typography,
    Checkbox,
    Toolbar,
    Chip,
    Box,
} from "@mui/material";
import { alpha, useTheme, type Theme } from "@mui/material/styles";

import {
    StyledTable,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from "../components/tables/StyledTableComponents";
import { FlexBetween, FlexEvenly } from "../components/layout/FlexBox";
import Actions from "./helper/Actions";
import { ActionItem } from "../types";
import { useUI } from "@/context/UIContext";
import FieldCell from "./components/FieldCell";
import { getVisibleFields } from "../utils/fieldHelpers";
import { FieldDef } from "../types";
import { AnimatePresence, motion } from "framer-motion";
import { RowActions, getRowNumber, EmptyState } from "./components/shared";

// ── Shared motion variants ─────────────────────────────────────────────────
const rowVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.22, ease: "easeOut" as const, delay: i * 0.04 },
    }),
    exit: { opacity: 0, transition: { duration: 0.15 } },
};

// Motion-enhanced table row
const MotionTableRow = motion.create(StyledTableRow);

interface MobileRowCardProps<T extends Record<string, unknown> = Record<string, unknown>> {
    row: T;
    rowIndex: number;
    fields: FieldDef[];
    fieldsMeta: {
        primary: string;
        root?: string;
    };
    editingId?: string | number | null;
    multi?: boolean;
    tableState: Record<string, unknown>;
    handleSave?: (rowId: string | number) => void | Promise<void>;
    handleCancel?: () => void;
    handleChange: (value: unknown, rowId: string | number, fieldName: string) => void;
    handleViewOpen?: (row: T) => void;
    handleSelectRow: (event: React.ChangeEvent<HTMLInputElement>, id: string | number) => void;
    selectedRows: (string | number)[];
    theme: Theme;
    actions: ActionItem<T>[];
}

// ── Mobile card for a single row ───────────────────────────────────────────
function MobileRowCard<T extends Record<string, unknown> = Record<string, unknown>>({
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
}: MobileRowCardProps<T>) {
    const rowId = row[fieldsMeta.primary] as string | number;
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
            <FlexBetween
                mb={2}
                sx={{ pb: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}
            >
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
                        Record #{getRowNumber(tableState as { currentPage: string | number; pageSize: number }, rowIndex)}
                    </Typography>
                </Box>
                <Box
                    sx={{ display: "flex", alignItems: "center" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <RowActions
                        isEditing={isRowEditing}
                        rowId={rowId}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                        actions={actions}
                        row={row}
                    />
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
                            sx={{
                                minWidth: 0,
                                display: "flex",
                                justifyContent: "flex-end",
                                textAlign: "right",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
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
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}

interface DesktopTableProps<T extends Record<string, unknown> = Record<string, unknown>> {
    fields: FieldDef[];
    data: T[];
    fieldsMeta: {
        primary: string;
        root?: string;
    };
    editingId?: string | number | null;
    multi?: boolean;
    tableState: Record<string, unknown>;
    loading?: boolean;
    handleSave?: (rowId: string | number) => void | Promise<void>;
    handleCancel?: () => void;
    handleChange: (value: unknown, rowId: string | number, fieldName: string) => void;
    handleViewOpen?: (row: T) => void;
    handleSelectRow: (event: React.ChangeEvent<HTMLInputElement>, id: string | number) => void;
    handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedRows: (string | number)[];
    visibleRowIds: (string | number)[];
    actions: ActionItem<T>[];
    onClickRow?: (row: T) => void;
}

// ── Desktop table ──────────────────────────────────────────────────────────
function DesktopTable<T extends Record<string, unknown> = Record<string, unknown>>({
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
}: DesktopTableProps<T>) {
    const visibleFields = getVisibleFields(fields);
    const isAllSelected = visibleRowIds.length > 0 && selectedRows.length === visibleRowIds.length;
    const isIndeterminate = selectedRows.length > 0 && selectedRows.length < visibleRowIds.length;

    const TableContainerCo = StyledTableContainer as React.ComponentType<Record<string, unknown>>;

    return (
        <TableContainerCo component={Paper}>
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
                    <AnimatePresence mode="popLayout">
                        {data.map((row, rowIndex) => {
                            const rowId = row[fieldsMeta.primary] as string | number;
                            const isItemSelected = selectedRows.includes(rowId);
                            return (
                                <MotionTableRow
                                    key={String(rowId)}
                                    custom={rowIndex}
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    layout
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
                                        {getRowNumber(tableState as { currentPage: string | number; pageSize: number }, rowIndex)}
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
                                                handleChange={(v, _id, name) =>
                                                    handleChange(v, rowId, name)
                                                }
                                                handleViewOpen={handleViewOpen}
                                            />
                                        </StyledTableCell>
                                    ))}

                                    <StyledTableCell onClick={(e) => e.stopPropagation()}>
                                        <FlexEvenly>
                                            <RowActions
                                                isEditing={editingId === rowId}
                                                rowId={rowId}
                                                handleSave={handleSave}
                                                handleCancel={handleCancel}
                                                actions={actions}
                                                row={row}
                                            />
                                        </FlexEvenly>
                                    </StyledTableCell>
                                </MotionTableRow>
                            );
                        })}
                    </AnimatePresence>

                    {data?.length === 0 && !loading && (
                        <StyledTableRow>
                            <StyledTableCell colSpan={2 + visibleFields.length + (multi ? 1 : 0)}>
                                <FlexEvenly>
                                    <EmptyState />
                                </FlexEvenly>
                            </StyledTableCell>
                        </StyledTableRow>
                    )}
                </TableBody>
            </StyledTable>
        </TableContainerCo>
    );
}

interface ListViewProps<T extends Record<string, unknown> = Record<string, unknown>> {
    fields: FieldDef[];
    data: T[];
    editingId?: string | number | null;
    fieldsMeta: {
        primary: string;
        root?: string;
    };
    actions: ActionItem<T>[];
    handleChange: (value: unknown, rowId: string | number, fieldName: string) => void;
    handleSave?: (rowId: string | number) => void | Promise<void>;
    loading?: boolean;
    handleCancel?: () => void;
    tableState: Record<string, unknown>;
    handlePageChange: (page: number) => void;
    handleViewOpen?: (row: T) => void;
    multi?: boolean;
}

// ── ListView ───────────────────────────────────────────────────────────────
function ListView<T extends Record<string, unknown> = Record<string, unknown>>({
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
}: ListViewProps<T>) {
    const { isMobile } = useUI();
    const theme = useTheme();

    const onClickRow = useCallback(
        (row: T) => actions?.find((a) => a.name === "form" && !a.hide)?.onClick?.(row),
        [actions],
    );

    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

    useEffect(() => {
        setSelectedRows([]);
    }, [tableState?.currentPage, data]);

    const visibleRowIds = useMemo(
        () => (data?.map((row) => row[fieldsMeta.primary]) || []) as (string | number)[],
        [data, fieldsMeta.primary],
    );

    const selectedRowsData = useMemo(
        () => data?.filter((row) => selectedRows.includes(row[fieldsMeta.primary] as string | number)) || [],
        [data, selectedRows, fieldsMeta.primary],
    );

    const multiActions = useMemo(
        () => (actions || []).filter((action) => action.multi === true),
        [actions],
    );

    const handleSelectAll = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedRows(event.target.checked ? visibleRowIds : []);
        },
        [visibleRowIds],
    );

    const handleSelectRow = useCallback((event: React.ChangeEvent<HTMLInputElement>, id: string | number) => {
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

    const totalCount = Number(tableState.totalCount ?? 0);
    const pageSize = Number(tableState.pageSize ?? 10);
    const pageCount = Math.ceil(totalCount / pageSize) || 0;

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
                    <AnimatePresence mode="popLayout">
                        {data.map((row, rowIndex) => (
                            <motion.div
                                key={String(row[fieldsMeta.primary] ?? rowIndex)}
                                custom={rowIndex}
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                layout
                            >
                                <MobileRowCard row={row} rowIndex={rowIndex} {...sharedRowProps} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {data?.length === 0 && !loading && (
                        <Paper
                            sx={{
                                p: 4,
                                textAlign: "center",
                                borderRadius: "16px",
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <EmptyState />
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
                    page={Number(tableState.currentPage ?? 0)}
                    count={pageCount}
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
}

export default memo(ListView) as typeof ListView;
