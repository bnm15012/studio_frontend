import { Switch, Typography } from "@mui/material";
import PropTypes from "prop-types";
import FlexBetween from "../../FlexBetween";

const StyledSwitch = ({ label, disabled, value, setValue }) => (
    <FlexBetween>
        {label && (
            <Typography variant="body1" color="textSecondary">
                {label}:
            </Typography>
        )}
        <Switch
            disabled={disabled}
            checked={value}
            onChange={(e) => {
                setValue(e.target.checked);
            }}
            sx={{ color: "blue" }}
        />
    </FlexBetween>
);

StyledSwitch.propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string,
    value: PropTypes.bool.isRequired,
    setValue: PropTypes.func.isRequired,
};

export default StyledSwitch;
