import PropTypes from "prop-types";
import { getLocalDateTime } from "../../utils/DateUtil";
import { CalendarMonth } from "@mui/icons-material";
import CardInfoRow from "./CardInfoRow";

const CardChip = ({ label, value, type = "STR", ChipIcon = CalendarMonth }) => {
    const displayValue = type === "STR" ? value || "-" : getLocalDateTime(value, type);

    return (
        <CardInfoRow
            Icon={<ChipIcon sx={{ fontSize: "1.2rem" }} />}
            label={label}
            value={displayValue}
        />
    );
};

CardChip.propTypes = {
    ChipIcon: PropTypes.elementType,
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    type: PropTypes.oneOf(["DATE", "DATETIME", "STR"]),
};

export default CardChip;
