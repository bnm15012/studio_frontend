import PropTypes from "prop-types";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { getTimePassed, isToday } from "../../../core/utils/DateUtil";
import ContactSection from "../../../core/components/cards/ContactSection";
import CardHeader from "../../../core/components/cards/CardHeader";
import CardChip from "../../../core/components/cards/CardChip";
import { FileText } from "lucide-react";
import { Box } from "@mui/material";

const EnquiryCard = ({ row }) => {
    const { enquiryDate, name, contact, enquiryPurpose } = row;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                FieldIcon={QuestionAnswerIcon}
                fieldValue={enquiryPurpose}
                enabled={isToday(enquiryDate)}
                badge={getTimePassed(enquiryDate)}
            />
            <Box display="flex" alignItems="center" gap={1.5}>
                <CardChip value={name} ChipIcon={FileText} />
                <CardChip value={enquiryDate} type={"DATETIME"} />
            </Box>
            {contact && <ContactSection contact={contact} />}
        </Box>
    );
};

EnquiryCard.propTypes = {
    row: PropTypes.shape({
        enquiryDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
        name: PropTypes.string.isRequired,
        contact: PropTypes.string.isRequired,
        enquiryPurpose: PropTypes.string.isRequired,
    }).isRequired,
};

export default EnquiryCard;
