/** Card-grid view for entity data, rendering each row as an animated MUI Card with field labels, actions, checkboxes, and a select-all bar. */
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Skeleton,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { FieldContainer, FieldLabel } from "@/core/components/fields/StyledField";
import {
    StyledMotionCard,
    StyledCardContainer,
    StyledCardContent,
} from "@/core/components/cards/StyledCard";
import { resolveFieldValue } from "@/core/utils/fieldHelpers";
import Actions from "@/core/crud/helper/Actions";
import { BaseViewProps, CrudRecord, ActionItem, FieldDef } from "@/core/types";
import { AnimatePresence } from "framer-motion";
import { FadeIn, EmptyState } from "@/core/crud/components/shared";
import { FlexEvenly } from "@/core/components/layout/FlexBox";
import { SelectAllBar } from "@/core/crud/components/SelectionToolbar";
import { useLongPress } from "@/core/hooks/useLongPress";
import { useAppUI } from "@/context/UIContext";

export interface CardViewProps<T extends CrudRecord = CrudRecord> extends BaseViewProps<T> {
    handleLoadMore: () => void | Promise<void>;
    CardContentComponent?: React.ComponentType<{ row: T; handleViewOpen?: (row: T) => void }>;
    selectedRows: number[];
    isAllSelected: boolean;
    isIndeterminate: boolean;
    handleSelectRow: (id: number, checked: boolean) => void;
    handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SKELETON_COUNT = 6;

const CardSkeleton = () =>
    Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <Box
            key={`skeleton-${i}`}
            sx={{
                borderRadius: "12px",
                overflow: "hidden",
                bgcolor: "background.paper",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                p: 1.5,
                display: "flex",
                flexDirection: "column",
                gap: 1,
            }}
        >
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="85%" height={16} />
            <Skeleton variant="text" width="40%" height={16} />
            <Skeleton variant="rectangular" height={28} sx={{ borderRadius: 1, mt: 0.5 }} />
        </Box>
    ));

// ── Per-card context menu state ─────────────────────────────────────────────
interface ContextMenuState<T> {
    anchor: HTMLElement;
    row: T;
}

// ── CardRow — extracted so useLongPress can be called per card ──────────────
interface CardRowProps<T extends CrudRecord> {
    row: T;
    rowId: number;
    index: number;
    isItemSelected: boolean;
    isTouchMode: boolean;
    multi: boolean;
    hasClickRow: boolean;
    onClickRow?: ((row: T) => void) | undefined;
    handleSelectRow: (id: number, checked: boolean) => void;
    visibleFields: FieldDef<T>[];
    CardContentComponent?:
        | React.ComponentType<{ row: T; handleViewOpen?: (row: T) => void }>
        | undefined;
    handleViewOpen?: ((row: T) => void) | undefined;
    actions: ActionItem<T>[];
    onOpenContextMenu: (anchor: HTMLElement, row: T) => void;
}

function CardRow<T extends CrudRecord>({
    row,
    rowId,
    index,
    isItemSelected,
    isTouchMode,
    multi,
    hasClickRow,
    onClickRow,
    handleSelectRow,
    visibleFields,
    CardContentComponent,
    handleViewOpen,
    actions,
    onOpenContextMenu,
}: CardRowProps<T>) {
    const theme = useTheme();
    const cardRef = useRef<HTMLDivElement>(null);

    const { fired, ...longPressHandlers } = useLongPress(
        useCallback(
            (_e: React.MouseEvent | React.TouchEvent) => {
                if (cardRef.current) onOpenContextMenu(cardRef.current, row);
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
            if (multi) handleSelectRow(rowId, !isItemSelected);
        } else {
            if (multi) {
                handleSelectRow(rowId, !isItemSelected);
            } else {
                if (onClickRow) onClickRow(row);
            }
        }
    }, [isTouchMode, fired, multi, rowId, isItemSelected, handleSelectRow, onClickRow, row]);

    const handleDoubleClick = useCallback(() => {
        if (isTouchMode && onClickRow) onClickRow(row);
    }, [isTouchMode, onClickRow, row]);

    const filteredActions = actions.filter((a) => a.name !== "form");

    return (
        <StyledMotionCard
            key={String(rowId) || String(index)}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            {...(isTouchMode ? longPressHandlers : {})}
            role="button"
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (multi) {
                        handleSelectRow(rowId, !isItemSelected);
                    } else {
                        if (onClickRow) onClickRow(row);
                    }
                }
            }}
            sx={{
                cursor: isTouchMode
                    ? hasClickRow
                        ? "pointer"
                        : "auto"
                    : hasClickRow
                      ? "pointer"
                      : "auto",
                ...(isItemSelected && {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    boxShadow: [
                        `0 1px 3px rgba(0,0,0,0.08)`,
                        `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`,
                    ].join(", "),
                }),
            }}
        >
            <Box
                ref={cardRef}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    height: "100%",
                }}
            >
                {/* Left: checkbox + content */}
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        alignItems: "flex-start",
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    {/* Selection */}
                    {multi && (
                        <Box
                            sx={{
                                width: 30,
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pl: 1.5,
                                pt: 1.5,
                                pr: 0.5,
                            }}
                        >
                            <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                onChange={(e) => handleSelectRow(rowId, e.target.checked)}
                                onClick={(e) => e.stopPropagation()}
                                size="small"
                                sx={{ p: 0.5 }}
                            />
                        </Box>
                    )}

                    {/* Content */}
                    <StyledCardContent sx={{ flex: 1, minWidth: 0 }}>
                        {CardContentComponent ? (
                            <CardContentComponent
                                row={row}
                                {...(handleViewOpen ? { handleViewOpen } : {})}
                            />
                        ) : (
                            <>
                                {visibleFields.map((field) => (
                                    <FieldContainer key={field.name}>
                                        <FieldLabel>{field.label}</FieldLabel>
                                        {(() => {
                                            const resolved = resolveFieldValue(field, row, false);
                                            return (
                                                resolved &&
                                                typeof resolved === "object" &&
                                                "value" in resolved
                                                    ? (
                                                          resolved as {
                                                              value: React.ReactNode;
                                                          }
                                                      ).value
                                                    : resolved
                                            ) as React.ReactNode;
                                        })()}
                                    </FieldContainer>
                                ))}
                            </>
                        )}
                    </StyledCardContent>
                </Box>

                {/* Right: vertical action strip — desktop only */}
                {!isTouchMode && filteredActions.length > 0 && (
                    <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            pt: 1,
                            pb: 1,
                            px: 0.75,
                            gap: 0.5,
                            minWidth: 44,
                            flexShrink: 0,
                        }}
                    >
                        <Actions
                            actions={filteredActions}
                            row={row}
                            maxVisible={2}
                            direction="column"
                        />
                    </Box>
                )}
            </Box>
        </StyledMotionCard>
    );
}

// ── CardView ────────────────────────────────────────────────────────────────
function CardView<T extends CrudRecord = CrudRecord>(props: CardViewProps<T>) {
    const {
        fields,
        data,
        fieldsMeta,
        loading,
        actions,
        handleViewOpen,
        tableState,
        handleLoadMore,
        CardContentComponent,
        multi = false,
        infiniteScroll = true,
        selectedRows,
        isAllSelected,
        isIndeterminate,
        handleSelectRow,
        handleSelectAll,
        onClickRow,
    } = props;

    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const theme = useTheme();
    const { isTouchMode } = useAppUI();

    const isFirstLoad = useRef(true);
    const [scrollFetching, setScrollFetching] = useState(false);
    const [contextMenu, setContextMenu] = useState<ContextMenuState<T> | null>(null);

    useEffect(() => {
        if (data.length > 0 && isFirstLoad.current) {
            isFirstLoad.current = false;
        }
    }, [data.length]);

    const visibleFields = fields.filter((f) => f.show);
    const hasClickRow = !!onClickRow;

    const hasMore = data.length < Number(tableState.totalCount ?? 0);

    useEffect(() => {
        if (!infiniteScroll || !hasMore || loading || scrollFetching) return;
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0] && entries[0].isIntersecting) {
                    setScrollFetching(true);
                    handleLoadMore();
                }
            },
            { threshold: 0.1 },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [infiniteScroll, hasMore, loading, scrollFetching, handleLoadMore]);

    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                setScrollFetching(false);
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [loading, data.length]);

    const showSkeletons = loading && isFirstLoad.current && data.length === 0;

    const handleOpenContextMenu = useCallback((anchor: HTMLElement, row: T) => {
        setContextMenu({ anchor, row });
    }, []);

    const handleCloseContextMenu = useCallback(() => {
        setContextMenu(null);
    }, []);

    const contextMenuActions = contextMenu
        ? actions.filter((a) => {
              if (a.name === "form") return false;
              if (typeof a.hide === "function")
                  return !(a.hide as (r: T) => boolean)(contextMenu.row);
              return !a.hide;
          })
        : [];

    return (
        <Box>
            {multi && data.length > 0 && (
                <SelectAllBar
                    totalCount={data.length}
                    isAllSelected={isAllSelected}
                    isIndeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                />
            )}

            <AnimatePresence mode="wait">
                <FadeIn animKey="card-view-content" y={0} duration={0.18}>
                    <StyledCardContainer>
                        {showSkeletons ? (
                            <CardSkeleton />
                        ) : (
                            data.map((row, index) => {
                                const rowId = Number(row[fieldsMeta.primary as keyof T]) || 0;
                                const isItemSelected = selectedRows.includes(rowId);

                                return (
                                    <CardRow<T>
                                        key={String(rowId) || String(index)}
                                        row={row}
                                        rowId={rowId}
                                        index={index}
                                        isItemSelected={isItemSelected}
                                        isTouchMode={isTouchMode}
                                        multi={multi}
                                        hasClickRow={hasClickRow}
                                        onClickRow={onClickRow}
                                        handleSelectRow={handleSelectRow}
                                        visibleFields={visibleFields}
                                        CardContentComponent={CardContentComponent}
                                        handleViewOpen={handleViewOpen}
                                        actions={actions}
                                        onOpenContextMenu={handleOpenContextMenu}
                                    />
                                );
                            })
                        )}

                        {data.length === 0 && !loading && !showSkeletons && <EmptyState />}
                    </StyledCardContainer>
                </FadeIn>
            </AnimatePresence>

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

            {scrollFetching && (
                <Box
                    sx={{
                        width: "100%",
                        height: 3,
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        mt: 1,
                    }}
                >
                    <Box
                        sx={{
                            height: "100%",
                            width: "40%",
                            bgcolor: "primary.main",
                            borderRadius: 2,
                            animation: "slideBar 1s ease-in-out infinite",
                            "@keyframes slideBar": {
                                "0%": { transform: "translateX(-100%)" },
                                "100%": { transform: "translateX(350%)" },
                            },
                        }}
                    />
                </Box>
            )}

            {hasMore &&
                (infiniteScroll ? (
                    <Box ref={sentinelRef} sx={{ height: "1px" }} />
                ) : (
                    <Box pb={2}>
                        <FlexEvenly>
                            <Button variant="outlined" onClick={handleLoadMore}>
                                Load More
                            </Button>
                        </FlexEvenly>
                    </Box>
                ))}
        </Box>
    );
}

export default memo(CardView) as typeof CardView;
