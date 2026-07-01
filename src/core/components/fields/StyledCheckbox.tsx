import React from "react";
import { Checkbox, Typography } from "@mui/material";
import { FlexBetween } from "../layout/FlexBox";

interface StyledCheckboxProps {
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
            sx={{ color: "blue" }}
        />
    </FlexBetween>
);

export default StyledCheckbox;
