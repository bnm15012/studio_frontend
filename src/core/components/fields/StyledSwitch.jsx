import { Switch, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { FlexBetween } from "../layout/FlexBox";

const StyledSwitch = ({ label, readOnly, value, setValue }) => (
    <FlexBetween>
        {label && (
            <Typography variant="body1" my={"auto"} color="textSecondary">
                {label}:
            </Typography>
        )}
        <Switch
            disabled={readOnly}
            checked={value}
            onChange={(e) => {
                setValue(e.target.checked);
            }}
            sx={{ color: "blue" }}
        />
    </FlexBetween>
);

StyledSwitch.propTypes = {
    readOnly: PropTypes.bool,
    label: PropTypes.string,
    value: PropTypes.bool.isRequired,
    setValue: PropTypes.func.isRequired,
};

export default StyledSwitch;
