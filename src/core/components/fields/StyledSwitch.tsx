import React from "react";
import { Switch, Typography } from "@mui/material";
import { FlexBetween } from "../layout/FlexBox";

interface StyledSwitchProps {
    label?: string;
    readOnly?: boolean;
    value: boolean;
    setValue: (val: boolean) => void;
}

const StyledSwitch: React.FC<StyledSwitchProps> = ({ label, readOnly, value, setValue }) => (
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

export default StyledSwitch;
