import { Button, Box, useTheme } from "@mui/material";
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
import { Delete, Edit } from "@mui/icons-material";

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
        handleEdit,
        handleViewOpen,
        setDeleteDialogOpen,
        setDeleteId,
        tableState,
        handleLoadMore,
        CardContentComponent,
        edit,
        del,
    } = props;
    const hasMore = data.length < tableState.totalCount;
    const visibleFields = fields.filter((f) => f.show !== false);
    const { palette } = useTheme();

    return (
        <Box>
            <StyledCardContainer>
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
                                                    ? field.getValue(row[field.name]).value
                                                    : row[field.name]}
                                            </FieldContainer>
                                        ))}
                                    </>
                                )}
                            </StyledCardContent>
                            <StyledCardActions>
                                <FlexBetween width={"100%"} gap={2}>
                                    {
                                        <>
                                            <Button
                                                size="small"
                                                fullWidth
                                                disabled={!edit}
                                                onClick={() => {
                                                    handleEdit(rowId);
                                                }}
                                                sx={{
                                                    color: "primary",
                                                    "&:hover": {
                                                        color: "white",
                                                        background: palette.primary.main,
                                                    },
                                                }}
                                            >
                                                <Edit />
                                            </Button>
                                            <Button
                                                size="small"
                                                fullWidth
                                                disabled={!del}
                                                onClick={() => {
                                                    setDeleteDialogOpen(true);
                                                    setDeleteId(rowId);
                                                }}
                                                sx={{
                                                    color: "#f87171",
                                                    "&:hover": {
                                                        color: "white",
                                                        background: "rgba(242, 38, 38)",
                                                    },
                                                }}
                                            >
                                                <Delete />
                                            </Button>
                                        </>
                                    }{" "}
                                </FlexBetween>
                            </StyledCardActions>
                        </StyledMotionCard>
                    );
                })}
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
    fields: PropTypes.array,
    editingId: PropTypes.number,
    fieldsMeta: PropTypes.shape({
        primary: PropTypes.string,
        root: PropTypes.string,
    }),
    handleChange: PropTypes.func,
    handleSave: PropTypes.func,
    handleCancel: PropTypes.func,
    handleEdit: PropTypes.func,
    setDeleteDialogOpen: PropTypes.func,
    setDeleteId: PropTypes.func,
    handleLoadMore: PropTypes.func,
    CardContentComponent: PropTypes.node,
    handleViewOpen: PropTypes.func,
    edit: PropTypes.bool,
    del: PropTypes.bool,
};

export default CardView;
