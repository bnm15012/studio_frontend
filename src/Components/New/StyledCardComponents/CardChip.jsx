import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { getLocalDateTime } from "../../../utils/DateUtil";
import { CalendarMonth } from "@mui/icons-material";

const CardChip = ({ label, value, type = "STR", ChipIcon = CalendarMonth }) => (
    <Box display="flex" alignItems="flex-start" gap={2}>
        <Box
            sx={{
                p: 1,
                borderRadius: 1,
                backgroundColor: "action.hover",
                display: "flex",
                alignItems: "center",
            }}
        >
            <ChipIcon color="blue" fontSize="small" />
        </Box>
        <Box>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                {label}
            </Typography>
            <Typography variant="body2" color="text.primary">
                {type === "STR" ? value || "-" : getLocalDateTime(value, type)}
            </Typography>
        </Box>
    </Box>
);

CardChip.propTypes = {
    ChipIcon: PropTypes.element,
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)])
        .isRequired,
    type: PropTypes.oneOf(["DATE", "DATETIME", "STR"]),
};

export default CardChip;
