import { useTheme } from "@emotion/react";
import { Chip, Box, Divider, Typography } from "@mui/material";
import PropTypes from "prop-types";
import FlexBetween from "../../FlexBetween";
import Field from "../../Fields/Field";
import PersonIcon from "@mui/icons-material/Person";

const CardHeader = ({ enabled, FieldIcon = PersonIcon, image, fieldValue, badge, badgeSx }) => {
    const theme = useTheme();
    return (
        <>
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: enabled
                        ? "linear-gradient(90deg, #018605ff, #81c784, #21f344ff)"
                        : "linear-gradient(90deg, #bdbdbd, #e0e0e0)",
                }}
            />
            <FlexBetween minHeight={60} padding={0.5}>
                <FlexBetween sx={{ flexGrow: 1, my: "auto" }}>
                    {image ? (
                        <Field
                            value={image}
                            type="IMAGE"
                            isEdit={false}
                            extraProp={{ size: "35px" }}
                        />
                    ) : (
                        <FieldIcon />
                    )}
                    <Typography m={"auto"} ml={2}>
                        {fieldValue}
                    </Typography>
                </FlexBetween>
                <Chip
                    label={badge}
                    sx={{
                        my: "auto",
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        fontWeight: "bolder",
                        ...badgeSx,
                    }}
                />
            </FlexBetween>
            <Divider />
        </>
    );
};

CardHeader.propTypes = {
    FieldIcon: PropTypes.element,
    badgeSx: PropTypes.object,
    fieldValue: PropTypes.string.isRequired,
    image: PropTypes.string,
    badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.element]).isRequired,
    enabled: PropTypes.bool,
};
export default CardHeader;
