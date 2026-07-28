/** Simple checkbox with label, supporting read-only mode. */
import React from "react";
import { Checkbox, Typography } from "@mui/material";
import { FlexBetween } from "@/core/components/layout/FlexBox";

export interface StyledCheckboxProps {
    label?: string;
    readOnly?: boolean;
    value?: boolean;
    setValue: (val: boolean) => void;
}

const StyledCheckbox: React.FC<StyledCheckboxProps> = ({
    label,
    readOnly = false,
    value = false,
    setValue,
}) => (
    <FlexBetween>
        {label && (
            <Typography variant="body1" my={"auto"} color="textSecondary">
                {label}:
            </Typography>
        )}

        <Checkbox
            disabled={readOnly}
            checked={value}
            onChange={(e) => {
                setValue(e.target.checked);
            }}
            color="primary"
        />
    </FlexBetween>
);

export default StyledCheckbox;
