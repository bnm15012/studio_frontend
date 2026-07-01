import Field from "../../../../core/components/fields/Field";
import ContactSection from "../../../../core/components/cards/ContactSection";
import UserAccessButton from "./UserAccessButton";
import PropTypes from "prop-types";
import CardHeader from "../../../../core/components/cards/CardHeader";
import { Box } from "@mui/material";

const UserCard = ({ row }) => {
    const { userName, email, role, enabled, phone, userAccessEntry, imageUrl } = row;
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader badge={role} fieldValue={userName} image={imageUrl} enabled={enabled} />
            {email && <ContactSection contact={email} />}
            <Box display="flex" alignItems="center" gap={1.5}>
                {phone && <ContactSection contact={phone} />}
                <Field
                    value={userAccessEntry}
                    type="CUSTOM"
                    isEdit={false}
                    extraProp={{ CustomComponent: UserAccessButton }}
                />
            </Box>
        </Box>
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
