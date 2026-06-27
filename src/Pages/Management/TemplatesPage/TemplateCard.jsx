import PropTypes from "prop-types";
import { Box, Button } from "@mui/material";
import CardHeader from "../../../core/components/cards/CardHeader";
import { BookTemplate, LucideBookTemplate } from "lucide-react";
import CardChip from "../../../core/components/cards/CardChip";
import { Subject } from "@mui/icons-material";

const TemplateCard = ({ row, handleViewOpen }) => {
    const { templateType, templateName, templateSubject } = row;

    return (
        <>
            <CardHeader FieldIcon={BookTemplate} badge={templateType} enabled={true} />
            <CardChip ChipIcon={Subject} label={"Subject"} value={templateSubject} />
            <CardChip ChipIcon={LucideBookTemplate} label={"Template Name"} value={templateName} />
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
