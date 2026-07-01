import React from "react";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { getTimePassed, isToday } from "@/core/utils/DateUtil";
import ContactSection from "@/core/components/cards/ContactSection";
import CardHeader from "@/core/components/cards/CardHeader";
import CardChip from "@/core/components/cards/CardChip";
import { FileText } from "lucide-react";
import { Box } from "@mui/material";

interface EnquiryRow {
    enquiryDate: string | Date;
    name: string;
    contact: string;
    enquiryPurpose: string;
}

interface EnquiryCardProps {
    row: Record<string, any>;
}

const EnquiryCard: React.FC<EnquiryCardProps> = ({ row }) => {
    const { enquiryDate, name, contact, enquiryPurpose } = row;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                FieldIcon={QuestionAnswerIcon}
                fieldValue={enquiryPurpose}
                enabled={isToday(enquiryDate as any)}
                badge={getTimePassed(enquiryDate as any)}
            />
            <Box display="flex" alignItems="center" gap={1.5}>
                <CardChip value={name} ChipIcon={FileText} />
                <CardChip value={enquiryDate as any} type={"DATETIME"} />
            </Box>
            {contact && <ContactSection contact={contact} />}
        </Box>
    );
};

export default EnquiryCard;
