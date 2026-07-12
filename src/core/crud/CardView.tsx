/** Card-grid view for entity data, rendering each row as an animated MUI Card with field labels, actions, checkboxes, and a select-all bar. */
import React, { memo, useEffect, useCallback, useRef, useState } from "react";
import { Box, Button, Checkbox, Skeleton } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { FieldContainer, FieldLabel } from "../components/fields/StyledField";
import {
    StyledMotionCard,
    StyledCardActions,
    StyledCardContainer,
    StyledCardContent,
} from "../components/cards/StyledCard";
import { getNestedValue } from "../../utils/objectHelpers";
import Actions from "./helper/Actions";
import { ActionItem } from "../types";
import { AnimatePresence } from "framer-motion";
import { FadeIn, EmptyState } from "./components/shared";
import { FlexBetween, FlexEvenly } from "../components/layout/FlexBox";
import { FieldDef } from "../types";
import { SelectAllBar } from "./components/SelectionToolbar";

export interface CardViewProps<T extends Record<string, unknown> = Record<string, unknown>> {
    fields: FieldDef<T>[];
    data: T[];
    fieldsMeta: {
        primary: string;
        root?: string;
    };
    loading?: boolean;
    actions: ActionItem<T>[];
    handleViewOpen?: (row: T) => void;
    tableState: Record<string, unknown>;
    handleLoadMore: () => void | Promise<void>;
    CardContentComponent?: React.ComponentType<{ row: T; handleViewOpen?: (row: T) => void }>;
    multi?: boolean;
    /** Enable infinite scroll (sentinel-based auto-load). Default: true */
    infiniteScroll?: boolean;
    // Selection state lifted to Views
    selectedRows: (string | number)[];
    isAllSelected: boolean;
    isIndeterminate: boolean;
    handleSelectRow: (id: string | number, checked: boolean) => void;
    handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/** Number of skeleton cards to show while initial data is loading. */
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

function CardView<T extends Record<string, unknown> = Record<string, unknown>>(
    props: CardViewProps<T>,
) {
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
    } = props;

    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const theme = useTheme();

    const isFirstLoad = useRef(true);
    const [scrollFetching, setScrollFetching] = useState(false);

    useEffect(() => {
        if (data.length > 0 && isFirstLoad.current) {
            isFirstLoad.current = false;
        }
    }, [data.length]);

    const visibleFields = fields.filter((f) => f.show);
    const hasClickRow = actions?.some((a) => a.name === "form" && !a.hide);
    const onClickRow = useCallback(
        (row: T) => actions?.find((a) => a.name === "form" && !a.hide)?.onClick?.(row),
        [actions],
    );

    const hasMore = data.length < Number(tableState.totalCount ?? 0);

    useEffect(() => {
        if (!infiniteScroll || !hasMore || loading || scrollFetching) return;
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
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
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [loading, data.length]);

    const showSkeletons = loading && isFirstLoad.current && data.length === 0;
    const showScrollLoader = scrollFetching;

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
                <FadeIn animKey={tableState?.currentPage ?? 0} y={0} duration={0.18}>
                    <StyledCardContainer>
                        {showSkeletons ? (
                            <CardSkeleton />
                        ) : (
                            data.map((row, index) => {
                                const rowId = row[fieldsMeta.primary] as string | number;
                                const isItemSelected = selectedRows.includes(rowId);

                                return (
                                    <StyledMotionCard
                                        key={String(rowId) || String(index)}
                                        onClick={() => {
                                            if (multi) {
                                                handleSelectRow(rowId, !isItemSelected);
                                            } else {
                                                if (onClickRow) onClickRow(row);
                                            }
                                        }}
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
                                            cursor: hasClickRow ? "pointer" : "auto",
                                            ...(isItemSelected && {
                                                backgroundColor: alpha(
                                                    theme.palette.primary.main,
                                                    0.04,
                                                ),
                                                boxShadow: [
                                                    `0 1px 3px rgba(0,0,0,0.08)`,
                                                    `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`,
                                                ].join(", "),
                                            }),
                                        }}
                                    >
                                        <FlexBetween sx={{ width: "100%", alignItems: "stretch" }}>
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
                                                        pr: 0.5,
                                                        backgroundColor: isItemSelected
                                                            ? alpha(
                                                                  theme.palette.primary.main,
                                                                  0.03,
                                                              )
                                                            : "transparent",
                                                    }}
                                                >
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        onChange={(e) =>
                                                            handleSelectRow(rowId, e.target.checked)
                                                        }
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
                                                        {...{ handleViewOpen }}
                                                    />
                                                ) : (
                                                    <>
                                                        {visibleFields.map((field) => (
                                                            <FieldContainer key={field.name}>
                                                                <FieldLabel>
                                                                    {field.label}
                                                                </FieldLabel>
                                                                {field?.getValue
                                                                    ? (() => {
                                                                          const resolved =
                                                                              field.getValue(
                                                                                  getNestedValue(
                                                                                      row,
                                                                                      field.name,
                                                                                  ),
                                                                                  row,
                                                                                  false,
                                                                              );
                                                                          return (
                                                                              resolved &&
                                                                              typeof resolved ===
                                                                                  "object" &&
                                                                              "value" in resolved
                                                                                  ? (
                                                                                        resolved as {
                                                                                            value: unknown;
                                                                                        }
                                                                                    ).value
                                                                                  : resolved
                                                                          ) as React.ReactNode;
                                                                      })()
                                                                    : (getNestedValue(
                                                                          row,
                                                                          field.name,
                                                                      ) as React.ReactNode)}
                                                            </FieldContainer>
                                                        ))}
                                                    </>
                                                )}
                                            </StyledCardContent>

                                            {/* Actions */}
                                            <Box
                                                sx={{
                                                    width: 35,
                                                    flexShrink: 0,
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <StyledCardActions>
                                                    <Actions
                                                        actions={actions.filter(
                                                            (a) => a.name !== "form",
                                                        )}
                                                        row={row}
                                                    />
                                                </StyledCardActions>
                                            </Box>
                                        </FlexBetween>
                                    </StyledMotionCard>
                                );
                            })
                        )}

                        {data.length === 0 && !loading && !showSkeletons && <EmptyState />}
                    </StyledCardContainer>
                </FadeIn>
            </AnimatePresence>

            {showScrollLoader && (
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
