import Field from "../../../../Components/Fields/Field";
import ContactSection from "../../../../Components/New/StyledCardComponents/ContactSection";
import UserAccessButton from "./UserAccessButton";
import PropTypes from "prop-types";
import CardHeader from "../../../../Components/New/StyledCardComponents/CardHeader";

const UserCard = ({ row }) => {
    const { userName, email, role, enabled, phone, userAccessEntry, imageUrl } = row;
    return (
        <>
            <CardHeader badge={role} fieldValue={userName} image={imageUrl} enabled={enabled} />
            <ContactSection contact={email} />
            <ContactSection contact={phone} />
            <Field
                value={userAccessEntry}
                type="CUSTOM"
                isEdit={false}
                extraProp={{ CustomComponent: UserAccessButton }}
            />
        </>
    );
};

UserCard.propTypes = {
    row: PropTypes.shape({
        userName: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
        enabled: PropTypes.bool,
        phone: PropTypes.string,
        userAccessEntry: PropTypes.any,
        imageUrl: PropTypes.string,
    }).isRequired,
};

export default UserCard;
