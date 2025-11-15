import PropTypes from "prop-types";
import CardHeader from "../../../Components/New/StyledCardComponents/CardHeader";
import ContactSection from "../../../Components/New/StyledCardComponents/ContactSection";
import CardChip from "../../../Components/New/StyledCardComponents/CardChip";
import { MapPin } from "lucide-react";

const InstructorCard = ({ row }) => {
    const { name, email, phone, instructorStatus, imageUrl, dob, address } = row;

    return (
        <>
            <CardHeader
                badge={instructorStatus}
                enabled={instructorStatus === "ACTIVE" ? "Active" : "Inactive"}
                fieldValue={name}
                image={imageUrl}
                badgeSx={{ backgroundColor: instructorStatus === "ACTIVE" ? "green" : "grey.400" }}
            />
            <ContactSection contact={email} />
            <ContactSection contact={phone} />
            <CardChip value={dob} type={"DATE"} label={"Date of Birth"} />
            <CardChip address={address} label={"Address"} ChipIcon={MapPin} />
        </>
    );
};

InstructorCard.propTypes = {
    row: PropTypes.shape({
        name: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        dob: PropTypes.string,
        instructorStatus: PropTypes.string,
        address: PropTypes.string,
        emergencyContactNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
};

export default InstructorCard;
