import PropTypes from "prop-types";
import CardHeader from "../../../core/components/cards/CardHeader";
import { BookTemplate } from "lucide-react";
import CardChip from "../../../core/components/cards/CardChip";
import { Subject } from "@mui/icons-material";
import { Box } from "@mui/material";

const TemplateCard = ({ row }) => {
    const { templateType, templateName, templateSubject } = row;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                fieldValue={templateName}
                FieldIcon={BookTemplate}
                badge={templateType}
                enabled={true}
            />
            {templateSubject && (
                <CardChip ChipIcon={Subject} value={templateSubject} />
            )}
        </Box>
    );
};

TemplateCard.propTypes = {
    row: PropTypes.shape({
        templateType: PropTypes.string,
        templateName: PropTypes.string.isRequired,
        templateSubject: PropTypes.string,
        templateContent: PropTypes.string,
    }).isRequired,
};

export default TemplateCard;
