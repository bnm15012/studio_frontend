import { Checkbox, Typography } from "@mui/material";
import PropTypes from "prop-types";
import FlexBetween from "../../FlexBetween";

const StyledCheckbox = ({
    label,
    readOnly = false,
    value = false,
    setValue,
}) => (
    <FlexBetween>
        {label && (
            <Typography
                variant="body1"
                my={"auto"}
                color="textSecondary"
            >
                {label}:
            </Typography>
        )}

        <Checkbox
            disabled={readOnly}
            checked={value}
            onChange={(e) => {
                setValue(e.target.checked);
            }}
            sx={{ color: "blue" }}
        />
    </FlexBetween>
);

StyledCheckbox.propTypes = {
    readOnly: PropTypes.bool,
    label: PropTypes.string,
    value: PropTypes.bool,
    setValue: PropTypes.func.isRequired,
};

export default StyledCheckbox;
