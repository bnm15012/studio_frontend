/** Table-based list view component using MUI Table, with animated row transitions (framer-motion), pagination, checkboxes for row selection, and field rendering via FieldCell. */
import React, { memo, useCallback, useState } from "react";
import {
    TableBody,
    TableHead,
    Paper,
    Pagination,
    Checkbox,
    Skeleton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import {
    StyledTable,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from "@/core/components/tables/StyledTableComponents";
import { FlexBetween, FlexEvenly } from "@/core/components/layout/FlexBox";
import {
    ActionItem,
    CrudRecord,
    FieldDef,
    FieldMeta,
    BaseViewProps,
    CrudState,
    FieldValue,
    ViewMode,
} from "@/core/types";
import { useAppUI } from "@/context/UIContext";
import FieldCell from "@/core/crud/components/FieldCell";
import { getVisibleFields, isActionVisibleInView } from "@/core/utils/fieldHelpers";
import { AnimatePresence } from "framer-motion";
import { RowActions, EmptyState } from "@/core/crud/components/shared";
import { getRowNumber } from "@/core/crud/components/getRowNumber";
import { useLongPress } from "@/core/hooks/useLongPress";
import { useTheme } from "@mui/material/styles";

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

const SKELETON_ROWS = 6;

function TableSkeletonRows({ colCount }: { colCount: number }) {
    return (
        <>
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <StyledTableRow key={`skel-${i}`}>
                    {Array.from({ length: colCount }).map((__, j) => (
                        <StyledTableCell key={j}>
                            <Skeleton
                                variant="text"
                                width={j === 0 ? 30 : `${60 + Math.random() * 30}%`}
                                height={18}
                                sx={{ borderRadius: 1 }}
                            />
                        </StyledTableCell>
                    ))}
                </StyledTableRow>
            ))}
        </>
    );
}

interface DesktopTableProps<T extends CrudRecord> {
    fields: FieldDef<T>[];
    data: T[];
    fieldsMeta: FieldMeta;
    editingId?: number | undefined;
    multi?: boolean | undefined;
    tableState: CrudState;
    loading?: boolean | undefined;
    handleSave?: ((rowId: number) => void | Promise<void>) | undefined;
    handleCancel?: (() => void) | undefined;
    handleChange: (value: FieldValue, rowId: number, fieldName: string) => void;
    handleViewOpen?: ((row: T) => void) | undefined;
    handleSelectRow: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
    handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedRows: number[];
    visibleRowIds: number[];
    actions: ActionItem<T>[];
    onClickRow?: ((row: T) => void) | undefined;
    submitAttempted?: boolean | undefined;
    isTouchMode: boolean;
    currentView?: ViewMode | undefined;
}

// ── DesktopRow — extracted so useLongPress can be called per row ────────────
interface DesktopRowProps<T extends CrudRecord> {
    row: T;
    rowId: number;
    rowIndex: number;
    isItemSelected: boolean;
    isTouchMode: boolean;
    multi: boolean;
    fields: FieldDef<T>[];
    visibleFields: FieldDef<T>[];
    tableState: CrudState;
    editingId?: number | undefined;
    handleSave?: ((rowId: number) => void | Promise<void>) | undefined;
    handleCancel?: (() => void) | undefined;
    handleChange: (value: FieldValue, rowId: number, fieldName: string) => void;
    handleViewOpen?: ((row: T) => void) | undefined;
    handleSelectRow: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
    submitAttempted?: boolean | undefined;
    actions: ActionItem<T>[];
    onClickRow?: ((row: T) => void) | undefined;
    onOpenContextMenu: (anchor: HTMLElement, row: T) => void;
    currentView?: ViewMode | undefined;
}

function DesktopRow<T extends CrudRecord>({
    row,
    rowId,
    rowIndex,
    isItemSelected,
    isTouchMode,
    multi,
    visibleFields,
    tableState,
    editingId,
    handleSave,
    handleCancel,
    handleChange,
    handleViewOpen,
    handleSelectRow,
    submitAttempted,
    actions,
    onClickRow,
    onOpenContextMenu,
    currentView,
}: DesktopRowProps<T>) {
    const rowRef = React.useRef<HTMLTableRowElement>(null);

    const { fired, ...longPressHandlers } = useLongPress(
        useCallback(
            (_e: React.MouseEvent | React.TouchEvent) => {
                if (rowRef.current) onOpenContextMenu(rowRef.current, row);
            },
            [row, onOpenContextMenu],
        ),
        { delay: 700 },
    );

    const handleClick = useCallback(() => {
        if (isTouchMode) {
            if (fired.current) {
                fired.current = false;
                return;
            }
            if (multi) {
                const fakeEvent = {
                    target: { checked: !isItemSelected },
                } as React.ChangeEvent<HTMLInputElement>;
                handleSelectRow(fakeEvent, rowId);
            }
        } else {
            if (onClickRow) onClickRow(row);
        }
    }, [isTouchMode, fired, multi, rowId, isItemSelected, handleSelectRow, onClickRow, row]);

    const handleDoubleClick = useCallback(() => {
        if (isTouchMode && onClickRow) onClickRow(row);
    }, [isTouchMode, onClickRow, row]);

    return (
        <StyledTableRow
            ref={rowRef}
            key={String(rowId)}
            custom={rowIndex}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            sx={{ cursor: onClickRow ? "pointer" : "auto" }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            {...(isTouchMode ? longPressHandlers : {})}
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
                    tableState as { currentPage: string | number; pageSize: number },
                    rowIndex,
                )}
            </StyledTableCell>

            {visibleFields.map((field) => (
                <StyledTableCell key={field.name}>
                    <FieldCell
                        field={field}
                        row={row}
                        isEdit={
                            editingId === rowId && (field.editable ? field.editable(row) : true)
                        }
                        handleChange={(v, _id, name) => handleChange(v, rowId, name)}
                        handleViewOpen={handleViewOpen}
                        submitAttempted={submitAttempted}
                    />
                </StyledTableCell>
            ))}

            {!isTouchMode && (
                <StyledTableCell onClick={(e) => e.stopPropagation()}>
                    <FlexEvenly>
                        <RowActions
                            isEditing={editingId === rowId}
                            rowId={rowId}
                            handleSave={handleSave}
                            handleCancel={handleCancel}
                            actions={actions}
                            row={row}
                            isTouchMode={false}
                            currentView={currentView ?? "LIST"}
                        />
                    </FlexEvenly>
                </StyledTableCell>
            )}

            {isTouchMode && editingId === rowId && (
                <StyledTableCell onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        isEditing={true}
                        rowId={rowId}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                        actions={actions}
                        row={row}
                        isTouchMode={true}
                        currentView={currentView ?? "LIST"}
                    />
                </StyledTableCell>
            )}
        </StyledTableRow>
    );
}

// ── Desktop table ──────────────────────────────────────────────────────────
function DesktopTable<T extends CrudRecord = CrudRecord>({
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
    isTouchMode,
    currentView = "LIST",
}: DesktopTableProps<T>) {
    const theme = useTheme();
    const visibleFields = getVisibleFields(fields);
    const isAllSelected = visibleRowIds.length > 0 && selectedRows.length === visibleRowIds.length;
    const isIndeterminate = selectedRows.length > 0 && selectedRows.length < visibleRowIds.length;

    const [contextMenu, setContextMenu] = useState<{ anchor: HTMLElement; row: T } | null>(null);

    const handleOpenContextMenu = useCallback((anchor: HTMLElement, row: T) => {
        setContextMenu({ anchor, row });
    }, []);

    const handleCloseContextMenu = useCallback(() => {
        setContextMenu(null);
    }, []);

    const contextMenuActions = contextMenu
        ? actions.filter((a) => {
              if (!isActionVisibleInView(a, currentView)) return false;
              if (a.name === "form") return false;
              if (typeof a.hide === "function")
                  return !(a.hide as (r: T) => boolean)(contextMenu.row);
              return !a.hide;
          })
        : [];

    const TableContainerCo = StyledTableContainer as React.ElementType;

    return (
        <>
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
                            {!isTouchMode && (
                                <StyledTableCell sx={{ textAlign: "center" }}>
                                    Actions
                                </StyledTableCell>
                            )}
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        <AnimatePresence mode="sync">
                            {data.length === 0 && loading ? (
                                <TableSkeletonRows
                                    colCount={2 + visibleFields.length + (multi ? 1 : 0)}
                                />
                            ) : (
                                data.map((row, rowIndex) => {
                                    const rowId = Number(row[fieldsMeta.primary as keyof T]) || 0;
                                    const isItemSelected = selectedRows.includes(rowId);
                                    return (
                                        <DesktopRow<T>
                                            key={String(rowId)}
                                            row={row}
                                            rowId={rowId}
                                            rowIndex={rowIndex}
                                            isItemSelected={isItemSelected}
                                            isTouchMode={isTouchMode}
                                            multi={!!multi}
                                            fields={fields}
                                            visibleFields={visibleFields}
                                            tableState={tableState}
                                            editingId={editingId}
                                            handleSave={handleSave}
                                            handleCancel={handleCancel}
                                            handleChange={handleChange}
                                            handleViewOpen={handleViewOpen}
                                            handleSelectRow={handleSelectRow}
                                            submitAttempted={submitAttempted}
                                            actions={actions}
                                            onClickRow={onClickRow}
                                            onOpenContextMenu={handleOpenContextMenu}
                                            currentView={currentView}
                                        />
                                    );
                                })
                            )}
                        </AnimatePresence>

                        {data.length === 0 && !loading && (
                            <StyledTableRow>
                                <StyledTableCell
                                    colSpan={2 + visibleFields.length + (multi ? 1 : 0)}
                                >
                                    <FlexEvenly>
                                        <EmptyState />
                                    </FlexEvenly>
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </StyledTable>
            </TableContainerCo>

            {/* Long-press context menu (mobile only) */}
            {isTouchMode && (
                <Menu
                    anchorEl={contextMenu?.anchor ?? null}
                    open={Boolean(contextMenu)}
                    onClose={handleCloseContextMenu}
                    onClick={(e) => e.stopPropagation()}
                    slotProps={{
                        paper: {
                            sx: {
                                borderRadius: 2,
                                minWidth: 180,
                                boxShadow: theme.shadows[8],
                                p: 0.5,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: "center", vertical: "top" }}
                    anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
                >
                    {contextMenuActions.map(({ name, enabled, onClick, icon, sx, help }, i) => {
                        const resolveColor = (colorStr?: string) => {
                            if (!colorStr) return theme.palette.text.secondary;
                            if (colorStr === "success.main") return theme.palette.success.main;
                            if (colorStr === "error.main") return theme.palette.error.main;
                            if (colorStr === "primary.main") return theme.palette.primary.main;
                            if (colorStr === "warning.main") return theme.palette.warning.main;
                            return colorStr;
                        };
                        const isEnabled =
                            typeof enabled === "function"
                                ? enabled(contextMenu!.row)
                                : (enabled ?? true);
                        const actionColor = resolveColor(sx?.color);

                        return (
                            <React.Fragment key={name}>
                                {i > 0 && i === contextMenuActions.length - 1 && (
                                    <Divider sx={{ my: 0.5 }} />
                                )}
                                <MenuItem
                                    disabled={!isEnabled}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCloseContextMenu();
                                        onClick?.(contextMenu!.row);
                                    }}
                                    sx={{
                                        borderRadius: 1,
                                        py: 0.75,
                                        px: 1.25,
                                        "&:hover": {
                                            backgroundColor: alpha(actionColor, 0.08),
                                        },
                                    }}
                                >
                                    {icon && (
                                        <ListItemIcon sx={{ minWidth: 28, color: actionColor }}>
                                            {React.isValidElement(icon)
                                                ? React.cloneElement(icon as React.ReactElement, {
                                                      fontSize: "small",
                                                  })
                                                : icon}
                                        </ListItemIcon>
                                    )}
                                    <ListItemText
                                        primary={help ?? name}
                                        primaryTypographyProps={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: isEnabled ? "text.primary" : "text.disabled",
                                        }}
                                    />
                                </MenuItem>
                            </React.Fragment>
                        );
                    })}
                </Menu>
            )}
        </>
    );
}

export interface ListViewProps<T extends CrudRecord = CrudRecord> extends BaseViewProps<T> {
    // ── List-only: row selection ────────────────────────────────────────
    selectedRows: number[];
    /** IDs of all rows currently visible on this page (used for select-all). */
    visibleRowIds: number[];
    /** Per-row checkbox change event (event-based, for table rows). */
    handleSelectRow: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
    handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function ListView<T extends CrudRecord = CrudRecord>({
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
    onClickRow,
    currentView = "LIST",
}: ListViewProps<T>) {
    const { isTouchMode, isMobile } = useAppUI();

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
        actions,
        submitAttempted,
        currentView,
    };

    const totalCount = Number(tableState.totalCount ?? 0);
    const pageSize = Number(tableState.pageSize ?? 10) || 10;
    const pageCount = Math.max(1, Math.ceil(totalCount / pageSize)) || 1;
    const currentPage = Math.max(1, Number(tableState.currentPage ?? 1) || 1);

    return (
        <>
            <DesktopTable
                data={data}
                loading={loading}
                onClickRow={onClickRow}
                visibleRowIds={visibleRowIds}
                handleSelectAll={handleSelectAll}
                isTouchMode={isTouchMode}
                {...sharedRowProps}
            />

            {/* ── Pagination ── */}
            <FlexBetween m={1} flexDirection={"row-reverse"} sx={{ flexWrap: "wrap", gap: 1 }}>
                <Pagination
                    page={currentPage}
                    count={pageCount}
                    onChange={(e, p) => handlePageChange(Math.max(1, p))}
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
