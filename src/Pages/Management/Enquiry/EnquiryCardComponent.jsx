import PropTypes from "prop-types";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { getTimePassed, isToday } from "../../../core/utils/DateUtil";
import ContactSection from "../../../core/components/cards/ContactSection";
import CardHeader from "../../../core/components/cards/CardHeader";
import CardChip from "../../../core/components/cards/CardChip";
import { FileText } from "lucide-react";

const EnquiryCard = ({ row }) => {
    const { enquiryDate, name, contact, enquiryPurpose } = row;

    return (
        <>
            <CardHeader
                FieldIcon={QuestionAnswerIcon}
                fieldValue={enquiryPurpose}
                enabled={isToday(enquiryDate)}
                badge={getTimePassed(enquiryDate)}
            />
            <CardChip value={enquiryDate} type={"DATETIME"} label={"Enquiry Date"} />
            <CardChip value={name} label={"Enquire Name"} ChipIcon={FileText} />
            <ContactSection contact={contact} />
        </>
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
