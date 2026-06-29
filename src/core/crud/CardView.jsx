import { Button, Box, Checkbox, Toolbar, Chip, Typography } from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import { FieldContainer, FieldLabel } from "../components/fields/StyledField";
import {
    StyledMotionCard,
    StyledCardActions,
    StyledCardContainer,
    StyledCardContent,
} from "../components/cards/StyledCard";
import { getNestedValue } from "../../utils/objectHelpers";
import { memo, useState, useEffect, useMemo, useCallback } from "react";
import Actions from "./helper/Actions";
import { AnimatePresence } from "framer-motion";
import { FadeIn, EmptyState } from "./components/shared";
import { FlexBetween, FlexEvenly } from "../components/layout/FlexBox";

const LoadMoreContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(4, 0),
}));

const LoadMoreButton = styled(Button)(({ theme }) => ({
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    padding: theme.spacing(1.5, 4),
    fontSize: "1rem",
    fontWeight: 600,
    borderRadius: 30,
    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
    transition: "all 0.3s ease",
    "&:hover": {
        background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
        transform: "scale(1.05)",
        boxShadow: "0 12px 32px rgba(102, 126, 234, 0.6)",
    },
}));

const CardView = (props) => {
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
    const hasMore = data.length < tableState.totalCount;
    const visibleFields = fields.filter((f) => f.show);

    const [selectedRows, setSelectedRows] = useState([]);
    const onClickRow = useCallback(
        (row) => actions?.find((a) => a.name === "form" && !a.hide)?.onClick(row),
        [actions],
    );

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

    const handleSelectRow = useCallback((id, checked) => {
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

            {/* ── Select All Checkbox row ── */}
            {multi && data.length > 0 && (
                <Box display="flex" alignItems="center" gap={1} mb={1.5} px={1}>
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
                        fontWeight={500}
                        color="text.secondary"
                        sx={{ fontSize: "0.85rem" }}
                    >
                        Select All ({data.length})
                    </Typography>
                </Box>
            )}

            <AnimatePresence mode="wait">
                <FadeIn animKey={tableState?.currentPage ?? 0} y={0} duration={0.18}>
                    <StyledCardContainer>
                        {data.map((row, index) => {
                            const rowId = row[fieldsMeta.primary];
                            const isItemSelected = selectedRows.includes(rowId);

                            return (
                                <StyledMotionCard
                                    key={rowId || index}
                                    onClick={() => {
                                        if (multi) {
                                            handleSelectRow(rowId, !isItemSelected);
                                        } else {
                                            onClickRow && onClickRow(row);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
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
                                        cursor: onClickRow ? "pointer" : "auto",
                                        transition: "all 0.2s ease",
                                        ...(isItemSelected && {
                                            borderColor: theme.palette.primary.main,
                                            backgroundColor: alpha(
                                                theme.palette.primary.main,
                                                0.015,
                                            ),
                                            boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.08)}`,
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
                                                                ? field.getValue(
                                                                      getNestedValue(
                                                                          row,
                                                                          field.name,
                                                                      ),
                                                                      row,
                                                                  )?.value
                                                                : getNestedValue(row, field.name)}
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
};

CardView.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    tableState: PropTypes.object,
    fields: PropTypes.array,
    fieldsMeta: PropTypes.shape({
        primary: PropTypes.string,
        root: PropTypes.string,
    }),
    loading: PropTypes.bool,
    handleLoadMore: PropTypes.func,
    CardContentComponent: PropTypes.elementType,
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

export default memo(CardView);
