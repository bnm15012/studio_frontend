import { User2, FileText } from "lucide-react";
import PropTypes from "prop-types";
import ContactSection from "../../../Components/New/StyledCardComponents/ContactSection";
import CardHeader from "../../../Components/New/StyledCardComponents/CardHeader";
import CardChip from "../../../Components/New/StyledCardComponents/CardChip";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
const ClientCardComponent = ({ row }) => {
    const { groupName, pocName, pocPhone, pocEmail, clientType, notes } = row;

    return (
        <>
            <CardHeader
                badge={clientType}
                FieldIcon={PermContactCalendarIcon}
                fieldValue={groupName}
                enabled={true}
            />
            <CardChip value={pocName} ChipIcon={User2} label={"Contact Person"} />
            <ContactSection contact={pocPhone} />
            <ContactSection contact={pocEmail} />
            <CardChip value={notes} ChipIcon={FileText} label={"Notes"} />
        </>
    );
};

ClientCardComponent.propTypes = {
    row: PropTypes.shape({
        groupName: PropTypes.string.isRequired,
        pocName: PropTypes.string.isRequired,
        pocPhone: PropTypes.string.isRequired,
        pocEmail: PropTypes.string.isRequired,
        clientType: PropTypes.string.isRequired,
        notes: PropTypes.string,
    }).isRequired,
};

export default ClientCardComponent;
