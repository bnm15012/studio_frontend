import React from "react";
import CardHeader from "../../../core/components/cards/CardHeader";
import { BookTemplate } from "lucide-react";
import CardChip from "../../../core/components/cards/CardChip";
import { Subject } from "@mui/icons-material";
import { Box } from "@mui/material";

interface TemplateCardProps {
    row: {
        templateType?: string;
        templateName: string;
        templateSubject?: string;
        templateContent?: string;
    };
}

const TemplateCard: React.FC<TemplateCardProps> = ({ row }) => {
    const { templateType, templateName, templateSubject } = row;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                fieldValue={templateName}
                FieldIcon={BookTemplate}
                badge={templateType || ""}
                enabled={true}
            />
            {templateSubject && <CardChip ChipIcon={Subject} value={templateSubject} />}
        </Box>
    );
};

export default TemplateCard;
