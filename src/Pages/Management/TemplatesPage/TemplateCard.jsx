import PropTypes from "prop-types";
import { Typography, Box, Button } from "@mui/material";

const TemplateCard = ({ row, handleViewOpen }) => {
    const { templateType, templateName, templateSubject } = row;

    return (
        <>
            <Box
                display="flex"
                flexDirection={"column"}
                justifyContent="space-between"
                alignItems="flex-start"
                mb={1}
            >
                <Typography variant="h6" fontWeight={600} noWrap>
                    {templateName}
                </Typography>
                <Typography variant="body2" color="primary" noWrap>
                    {templateType}
                </Typography>
            </Box>

            {/* Subject */}
            <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                    Subject:
                </Typography>
                <Typography variant="body2" color="text.primary" sx={{ wordBreak: "break-word" }}>
                    {templateSubject}
                </Typography>
            </Box>

            <Box display="flex" justifyContent={"center"}>
                <Button onClick={() => handleViewOpen(row)}>View</Button>
            </Box>
        </>
    );
};

TemplateCard.propTypes = {
    row: PropTypes.shape({
        templateType: PropTypes.string,
        templateName: PropTypes.string.isRequired,
        templateSubject: PropTypes.string,
        templateContent: PropTypes.string,
    }).isRequired,
    handleViewOpen: PropTypes.func,
};

export default TemplateCard;
