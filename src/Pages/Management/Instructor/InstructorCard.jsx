import PropTypes from "prop-types";
import CardHeader from "../../../core/components/cards/CardHeader";
import ContactSection from "../../../core/components/cards/ContactSection";
import CardLocation from "../../../core/components/cards/CardLocation";
import { Box } from "@mui/material";

const InstructorCard = ({ row }) => {
    const { name, email, phone, instructorStatus, imageUrl, address } = row;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                badge={instructorStatus}
                enabled={instructorStatus === "ACTIVE"}
                fieldValue={name}
                image={imageUrl}
            />
            {email && <ContactSection contact={email} />}
            <Box display="flex" alignItems="center" gap={1.5}>
                {phone && <ContactSection contact={phone} />}
                {address && <CardLocation address={address} />}
            </Box>
        </Box>
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
