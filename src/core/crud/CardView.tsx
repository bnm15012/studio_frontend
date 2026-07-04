import React, { memo, useState, useEffect, useMemo, useCallback } from "react";
import { Button, Box, Checkbox, Toolbar, Typography } from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
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

const LoadMoreContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(4, 0),
}));

const LoadMoreButton = styled(Button)(({ theme }) => ({
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    padding: theme.spacing(1.5, 4),
    fontSize: "0.875rem",
    fontWeight: 500,
    borderRadius: 24,
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
    transition: "box-shadow 0.2s ease",
    "&:hover": {
        background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
        boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
    },
}));

interface CardViewProps<T extends Record<string, unknown> = Record<string, unknown>> {
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
}

function CardView<T extends Record<string, unknown> = Record<string, unknown>>(props: CardViewProps<T>) {
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
    } = props;
    const theme = useTheme();
    const hasMore = data.length < Number(tableState.totalCount ?? 0);
    const visibleFields = fields.filter((f) => f.show);

    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
    const hasClickRow = actions?.some((a) => a.name === "form" && !a.hide);
    const onClickRow = useCallback(
        (row: T) => actions?.find((a) => a.name === "form" && !a.hide)?.onClick?.(row),
        [actions],
    );

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

    const handleSelectRow = useCallback((id: string | number, checked: boolean) => {
        setSelectedRows((prev) => (checked ? [...prev, id] : prev.filter((rowId) => rowId !== id)));
    }, []);

    const isAllSelected = visibleRowIds.length > 0 && selectedRows.length === visibleRowIds.length;
    const isIndeterminate = selectedRows.length > 0 && selectedRows.length < visibleRowIds.length;

    return (
        <Box>
            {multi && selectedRows.length > 0 && (
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                        py: 1,
                        px: 1.5,
                        mb: 1.5,
                        borderRadius: "12px",
                        backgroundColor: alpha(theme.palette.primary.main, 0.06),
                        minHeight: 48,
                        animation: "fadeIn 0.15s ease-in-out",
                        "@keyframes fadeIn": {
                            from: { opacity: 0, transform: "translateY(-8px)" },
                            to: { opacity: 1, transform: "translateY(0)" },
                        },
                    }}
                >
                    <Typography variant="body2" fontWeight={500} color="primary.main">
                        {selectedRows.length} selected
                    </Typography>
                    <FlexEvenly>
                        <Actions actions={multiActions} row={selectedRowsData} />
                    </FlexEvenly>
                </Toolbar>
            )}

            {/* ── Select All Checkbox row ── */}
            {multi && data.length > 0 && (
                <Box display="flex" alignItems="center" gap={0.75} mb={1} px={0.5}>
                    <Checkbox
                        color="primary"
                        indeterminate={isIndeterminate}
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        size="small"
                        sx={{ p: 0.5 }}
                    />
                    <Typography
                        variant="body2"
                        fontWeight={450}
                        color="text.secondary"
                        sx={{ fontSize: "0.8125rem" }}
                    >
                        Select all ({data.length})
                    </Typography>
                </Box>
            )}

            <AnimatePresence mode="wait">
                <FadeIn animKey={tableState?.currentPage ?? 0} y={0} duration={0.18}>
                    <StyledCardContainer>
                        {data.map((row, index) => {
                            const rowId = row[fieldsMeta.primary] as string | number;
                            const isItemSelected = selectedRows.includes(rowId);

                            return (
                                <StyledMotionCard
                                    key={String(rowId) || String(index)}
                                    onClick={() => {
                                        if (multi) {
                                            handleSelectRow(rowId, !isItemSelected);
                                        } else {
                                            onClickRow && onClickRow(row);
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
                                                onClickRow && onClickRow(row);
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
                                                    width: 30, // Fixed width
                                                    flexShrink: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    pl: 1.5,
                                                    pr: 0.5,
                                                    backgroundColor: isItemSelected
                                                        ? alpha(theme.palette.primary.main, 0.03)
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
                                        <StyledCardContent
                                            sx={{
                                                flex: 1,
                                                minWidth: 0,
                                            }}
                                        >
                                            {CardContentComponent ? (
                                                <CardContentComponent
                                                    row={row}
                                                    {...{ handleViewOpen }}
                                                />
                                            ) : (
                                                <>
                                                    {visibleFields.map((field) => (
                                                        <FieldContainer key={field.name}>
                                                            <FieldLabel>{field.label}</FieldLabel>
                                                            {field?.getValue
                                                                ? (() => {
                                                                      const resolved = field.getValue(
                                                                          getNestedValue(
                                                                              row,
                                                                              field.name,
                                                                          ),
                                                                          row,
                                                                          false,
                                                                      );
                                                                      return (resolved && typeof resolved === "object" && "value" in resolved
                                                                          ? (resolved as { value: unknown }).value
                                                                          : resolved) as React.ReactNode;
                                                                  })()
                                                                : (getNestedValue(row, field.name) as React.ReactNode)}
                                                        </FieldContainer>
                                                    ))}
                                                </>
                                            )}
                                        </StyledCardContent>

                                        {/* Actions */}
                                        <Box
                                            sx={{
                                                width: 35, // Fixed width
                                                flexShrink: 0,
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <StyledCardActions>
                                                <Actions actions={actions} row={row} />
                                            </StyledCardActions>
                                        </Box>
                                    </FlexBetween>
                                </StyledMotionCard>
                            );
                        })}
                        {data.length === 0 && !loading && <EmptyState />}
                    </StyledCardContainer>
                </FadeIn>
            </AnimatePresence>
            {hasMore && (
                <LoadMoreContainer>
                    <LoadMoreButton onClick={handleLoadMore} variant="contained">
                        Load More
                    </LoadMoreButton>
                </LoadMoreContainer>
            )}
        </Box>
    );
}

export default memo(CardView) as typeof CardView;
