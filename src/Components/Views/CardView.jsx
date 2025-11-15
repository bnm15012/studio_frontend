import { Button, Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { FieldContainer, FieldLabel } from "../New/StyledField";
import {
    StyledMotionCard,
    StyledCardActions,
    StyledCardContainer,
    StyledCardContent,
} from "../New/StyledCard";
import FlexEvenly from "../FlexEvenly";
import { getNestedValue } from "../../utils/objectHelpers";

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
        actions,
        handleViewOpen,
        tableState,
        handleLoadMore,
        cardLayout = "vertical",
        CardContentComponent,
    } = props;
    const hasMore = data.length < tableState.totalCount;
    const visibleFields = fields.filter((f) => f.show);

    return (
        <Box>
            <StyledCardContainer
                sx={
                    cardLayout === "horizontal" && {
                        gridAutoFlow: "column",
                        gridAutoColumns: "22rem",
                        width: "100%",
                        overflowX: "auto",
                    }
                }
            >
                {data.map((row, index) => {
                    const rowId = row[fieldsMeta.primary];

                    return (
                        <StyledMotionCard key={rowId || index}>
                            {" "}
                            <StyledCardContent sx={{ flexGrow: "1" }}>
                                {CardContentComponent ? (
                                    <CardContentComponent row={row} {...{ handleViewOpen }} />
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
                                <FlexEvenly width={"100%"} gap={2}>
                                    {actions
                                        .filter((f) => !f.hide)
                                        .map(({ name, enabled, onClick, icon, sx }) => (
                                            <IconButton
                                                disabled={
                                                    typeof enabled === "function"
                                                        ? !enabled(row)
                                                        : !enabled
                                                }
                                                key={name}
                                                sx={sx}
                                                onClick={() => onClick(row)}
                                            >
                                                {icon || name}
                                            </IconButton>
                                        ))}
                                </FlexEvenly>
                            </StyledCardActions>
                        </StyledMotionCard>
                    );
                })}
                {data.length === 0 && <StyledCardContent>No Data Available</StyledCardContent>}
            </StyledCardContainer>
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
    cardLayout: PropTypes.oneOf(["vertical", "horizontal"]),
    fields: PropTypes.array,
    fieldsMeta: PropTypes.shape({
        primary: PropTypes.string,
        root: PropTypes.string,
    }),
    handleLoadMore: PropTypes.func,
    CardContentComponent: PropTypes.elementType,
    handleViewOpen: PropTypes.func,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            onClick: PropTypes.func,
            icon: PropTypes.element,
            sx: PropTypes.object,
            enabled: PropTypes.bool,
        }),
    ),
};

export default CardView;
