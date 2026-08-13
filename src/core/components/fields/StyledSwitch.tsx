/** Simple toggle switch with label, supporting read-only mode. */
import React from "react";
import { Switch, Typography } from "@mui/material";
import { FlexBetween } from "@/core/components/layout/FlexBox";

export interface StyledSwitchProps {
    label?: string | undefined;
    readOnly?: boolean | undefined;
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
            disabled={Boolean(readOnly)}
            checked={value}
            onChange={(e) => {
                setValue(e.target.checked);
            }}
            color="primary"
        />
    </FlexBetween>
);

export default StyledSwitch;
