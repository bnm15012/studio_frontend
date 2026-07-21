/** Table-based list view component using MUI Table, with animated row transitions (framer-motion), pagination, checkboxes for row selection, and field rendering via FieldCell. */
import React, { memo, useCallback } from "react";
import { TableBody, TableHead, Paper, Pagination, Checkbox } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import {
    StyledTable,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from "../components/tables/StyledTableComponents";
import { FlexBetween, FlexEvenly } from "../components/layout/FlexBox";
import { ActionItem, Entity, FieldDef, FieldMeta } from "../types";
import { useUI } from "@/context/UIContext";
import FieldCell from "./components/FieldCell";
import { getVisibleFields } from "../utils/fieldHelpers";
import { AnimatePresence } from "framer-motion";
import { RowActions, EmptyState } from "./components/shared";
import { getRowNumber } from "./components/getRowNumber";

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

interface DesktopTableProps<T extends Entity> {
    fields: FieldDef<T>[];
    data: T[];
    fieldsMeta: FieldMeta;
    /** -1 = nothing editing, 0 = new row, positive = existing row */
    editingId?: number;
    multi?: boolean;
    tableState: Record<string, unknown>;
    loading?: boolean;
    handleSave?: (rowId: number) => void | Promise<void>;
    handleCancel?: () => void;
    handleChange: (value: unknown, rowId: number, fieldName: string) => void;
    handleViewOpen?: (row: T) => void;
    handleSelectRow: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
    handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedRows: number[];
    visibleRowIds: number[];
    actions: ActionItem<T>[];
    onClickRow?: (row: T) => void;
    submitAttempted?: boolean;
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
    submitAttempted,
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
                            const rowId = Number(row[fieldsMeta.primary]) || 0;
                            const isItemSelected = selectedRows.includes(rowId);
                            return (
                                <StyledTableRow
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
                                        {getRowNumber(
                                            tableState as {
                                                currentPage: string | number;
                                                pageSize: number;
                                            },
                                            rowIndex,
                                        )}
                                    </StyledTableCell>

                                    {visibleFields.map((field) => (
                                        <StyledTableCell key={field.name}>
                                            <FieldCell
                                                field={field}
                                                row={row}
                                                isEdit={
                                                    editingId === rowId &&
                                                    (field.editable ? field.editable(row) : true)
                                                }
                                                handleChange={(v, _id, name) =>
                                                    handleChange(v, rowId, name)
                                                }
                                                handleViewOpen={handleViewOpen}
                                                submitAttempted={submitAttempted}
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
                                </StyledTableRow>
                            );
                        })}
                    </AnimatePresence>

                    {data.length === 0 && !loading && (
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

export interface ListViewProps<T extends Record<string, unknown> = Record<string, unknown>> {
    fields: FieldDef<T>[];
    data: T[];
    /** -1 = nothing editing, 0 = new row, positive = existing row */
    editingId?: number;
    fieldsMeta: FieldMeta;
    actions: ActionItem<T>[];
    handleChange: (value: unknown, rowId: number, fieldName: string) => void;
    handleSave?: (rowId: number) => void | Promise<void>;
    loading?: boolean;
    handleCancel?: () => void;
    tableState: Record<string, unknown>;
    handlePageChange: (page: number) => void;
    handleViewOpen?: (row: T) => void;
    multi?: boolean;
    selectedRows: number[];
    visibleRowIds: number[];
    handleSelectRow: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
    handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
    submitAttempted?: boolean;
}

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
    selectedRows,
    visibleRowIds,
    handleSelectRow,
    handleSelectAll,
    submitAttempted,
}: ListViewProps<T>) {
    const { isMobile } = useUI();
    const theme = useTheme();

    const onClickRow = useCallback(
        (row: T) => actions.find((a) => a.name === "form" && !a.hide)?.onClick?.(row),
        [actions],
    );

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
        submitAttempted,
    };

    const totalCount = Number(tableState.totalCount ?? 0);
    const pageSize = Number(tableState.pageSize ?? 10);
    const pageCount = Math.ceil(totalCount / pageSize) || 0;

    return (
        <>
            <DesktopTable
                data={data}
                loading={loading}
                onClickRow={onClickRow}
                visibleRowIds={visibleRowIds}
                handleSelectAll={handleSelectAll}
                {...sharedRowProps}
            />

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
