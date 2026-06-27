import PropTypes from "prop-types";
import CardHeader from "../../../core/components/cards/CardHeader";
import ContactSection from "../../../core/components/cards/ContactSection";
import CardChip from "../../../core/components/cards/CardChip";
import CardLocation from "../../../core/components/cards/CardLocation";

const InstructorCard = ({ row }) => {
    const { name, email, phone, instructorStatus, imageUrl, dob, address } = row;

    return (
        <>
            <CardHeader
                badge={instructorStatus}
                enabled={instructorStatus === "ACTIVE"}
                fieldValue={name}
                image={imageUrl}
            />
            <ContactSection contact={email} />
            <ContactSection contact={phone} />
            <CardChip value={dob} type={"DATE"} label={"Date of Birth"} />
            <CardLocation address={address} />
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
