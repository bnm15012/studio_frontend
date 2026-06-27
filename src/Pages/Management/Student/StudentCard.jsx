import PropTypes from "prop-types";
import CardHeader from "../../../core/components/cards/CardHeader";
import ContactSection from "../../../core/components/cards/ContactSection";
import CardChip from "../../../core/components/cards/CardChip";
import CardLocation from "../../../core/components/cards/CardLocation";

const StudentCard = ({ row }) => {
    const { name, email, phone, membershipStatus, imageUrl, dob, address } = row;

    return (
        <>
            <CardHeader
                badge={membershipStatus}
                enabled={membershipStatus === "ACTIVE"}
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

StudentCard.propTypes = {
    row: PropTypes.shape({
        name: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        dob: PropTypes.string,
        membershipStatus: PropTypes.string,
        address: PropTypes.string,
        emergencyContactNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
};

export default StudentCard;
