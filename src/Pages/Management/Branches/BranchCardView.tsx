import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { Circle, Business } from "@mui/icons-material";
import ContactSection from "../../../core/components/cards/ContactSection";
import CardHeader from "../../../core/components/cards/CardHeader";
import CardLocation from "../../../core/components/cards/CardLocation";

const BranchCardView = ({ row }) => {
    const { name, address, city, state, pincode, phone, isActive } = row;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                fieldValue={name}
                FieldIcon={Business}
                enabled={isActive}
                badge={
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <Circle
                            sx={{
                                fontSize: 8,
                                color: isActive ? "success.main" : "text.disabled",
                                animation: isActive ? "pulse 1.5s infinite" : "none",
                            }}
                        />
                        {isActive ? "Active" : "Inactive"}
                    </Box>
                }
            />
            <Box display="flex" alignItems="center" gap={1.5}>
                {phone && <ContactSection contact={phone} />}
                <CardLocation address={address} city={city} state={state} pincode={pincode} />
            </Box>
        </Box>
    );
};

BranchCardView.propTypes = {
    row: PropTypes.shape({
        name: PropTypes.string,
        address: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        pincode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        phone: PropTypes.string,
        isActive: PropTypes.bool,
    }).isRequired,
};

export default BranchCardView;
