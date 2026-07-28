/** Card-grid view for entity data, rendering each row as an animated MUI Card with field labels, actions, checkboxes, and a select-all bar. */
import React, { memo, useEffect, useRef, useState } from "react";
import { Box, Button, Checkbox, Skeleton } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { FieldContainer, FieldLabel } from "@/core/components/fields/StyledField";
import {
    StyledMotionCard,
    StyledCardActions,
    StyledCardContainer,
    StyledCardContent,
} from "@/core/components/cards/StyledCard";
import { resolveFieldValue } from "@/core/utils/fieldHelpers";
import Actions from "@/core/crud/helper/Actions";
import { BaseViewProps, Entity } from "@/core/types";
import { AnimatePresence } from "framer-motion";
import { FadeIn, EmptyState } from "@/core/crud/components/shared";
import { FlexEvenly } from "@/core/components/layout/FlexBox";
import { SelectAllBar } from "@/core/crud/components/SelectionToolbar";

export interface CardViewProps<T extends Entity = Entity> extends BaseViewProps<T> {
    // ── Card-only props ────────────────────────────────────────────────
    /** Trigger loading the next page of results (infinite scroll or manual). */
    handleLoadMore: () => void | Promise<void>;
    /** Optional override for the default field-label card layout. */
    CardContentComponent?: React.ComponentType<{ row: T; handleViewOpen?: (row: T) => void }>;
    // ── Card-only: selection (boolean-based, not event-based like ListView) ─
    selectedRows: number[];
    isAllSelected: boolean;
    isIndeterminate: boolean;
    /** Boolean-based select handler (card taps, not checkbox change events). */
    handleSelectRow: (id: number, checked: boolean) => void;
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

function CardView<T extends Entity = Entity>(props: CardViewProps<T>) {
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

    const isFirstLoad = useRef(true);
    const [scrollFetching, setScrollFetching] = useState(false);

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
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [loading, data.length]);

    const showSkeletons = loading && isFirstLoad.current && data.length === 0;

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
                                const rowId = Number(row[fieldsMeta.primary]) || 0;
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
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    width: "100%",
                                                    alignItems: "flex-start",
                                                    flex: 1,
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
                                                            onChange={(e) =>
                                                                handleSelectRow(
                                                                    rowId,
                                                                    e.target.checked,
                                                                )
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
                                                                    {(() => {
                                                                        const resolved =
                                                                            resolveFieldValue(
                                                                                field,
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

                                            {/* Horizontal Card Actions Footer */}
                                            <StyledCardActions onClick={(e) => e.stopPropagation()}>
                                                <Actions
                                                    actions={actions.filter(
                                                        (a) => a.name !== "form",
                                                    )}
                                                    row={row}
                                                    maxVisible={4}
                                                />
                                            </StyledCardActions>
                                        </Box>
                                    </StyledMotionCard>
                                );
                            })
                        )}

                        {data.length === 0 && !loading && !showSkeletons && <EmptyState />}
                    </StyledCardContainer>
                </FadeIn>
            </AnimatePresence>

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
