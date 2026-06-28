import { LocationOn } from "@mui/icons-material";
import PropTypes from "prop-types";
import CardInfoRow from "./CardInfoRow";

const CardLocation = ({ address, city, state, pincode }) => {
    const displayValue = address || `${city || ""}, ${state || ""} ${pincode || ""}` || "-";

    return (
        <CardInfoRow
            Icon={<LocationOn sx={{ fontSize: "1.2rem" }} />}
            label="Location"
            value={displayValue}
        />
    );
};

CardLocation.propTypes = {
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    pincode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CardLocation;
