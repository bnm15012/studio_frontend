import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { Circle, Business } from "@mui/icons-material";
import ContactSection from "../../../Components/New/StyledCardComponents/ContactSection";
import CardHeader from "../../../Components/New/StyledCardComponents/CardHeader";
import CardLocation from "../../../Components/New/StyledCardComponents/CardLocation";

const BranchCardView = ({ row }) => {
    const { name, address, city, state, pincode, phone, isActive } = row;

    return (
        <>
            <CardHeader
                fieldValue={name}
                FieldIcon={Business}
                badge={
                    <Box display="flex" alignItems="center" gap={1}>
                        <Circle
                            sx={{
                                fontSize: 10,
                                color: isActive ? "white" : "text.disabled",
                                animation: isActive ? "pulse 1.5s infinite" : "none",
                            }}
                        />
                        {isActive ? "Active" : "Inactive"}
                    </Box>
                }
                badgeSx={{ backgroundColor: isActive ? "green" : "grey.400" }}
            />
            <CardLocation address={address} city={city} state={state} pincode={pincode} />
            <ContactSection contact={phone} />
        </>
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
