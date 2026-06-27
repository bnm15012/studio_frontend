import { Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { FieldContainer, FieldLabel } from "../New/StyledField";
import {
    StyledMotionCard,
    StyledCardActions,
    StyledCardContainer,
    StyledCardContent,
} from "../New/StyledCard";
import FlexBetween from "../FlexBetween";
import { getNestedValue } from "../../utils/objectHelpers";
import { memo } from "react";
import Actions from "./helper/Actions";
import { AnimatePresence } from "framer-motion";
import { FadeIn, EmptyState } from "./components/shared";

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
    } = props;
    const hasMore = data.length < tableState.totalCount;
    const visibleFields = fields.filter((f) => f.show);

    return (
        <Box>
            <AnimatePresence mode="wait">
                <FadeIn animKey={tableState?.currentPage ?? 0} y={0} duration={0.18}>
                    <StyledCardContainer>
                        {data.map((row, index) => {
                            const rowId = row[fieldsMeta.primary];

                            return (
                                <StyledMotionCard key={rowId || index}>
                                    {" "}
                                    <StyledCardContent sx={{ flexGrow: "1" }}>
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
                                                                  getNestedValue(row, field.name),
                                                                  row,
                                                              )?.value
                                                            : getNestedValue(row, field.name)}
                                                    </FieldContainer>
                                                ))}
                                            </>
                                        )}
                                    </StyledCardContent>
                                    <StyledCardActions>
                                        <FlexBetween>
                                            <Actions actions={actions} row={row} />
                                        </FlexBetween>
                                    </StyledCardActions>
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
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            onClick: PropTypes.func,
            icon: PropTypes.element,
            sx: PropTypes.object,
            enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        }),
    ),
};

export default memo(CardView);
