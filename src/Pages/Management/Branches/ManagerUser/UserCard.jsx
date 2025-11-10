import { Box, Chip, Typography, useTheme } from "@mui/material";
import FlexBetween from "../../../../Components/FlexBetween";
import Field from "../../../../Components/Fields/Field";
import ContactSection from "../../Enquiry/ContactSection";
import UserAccessButton from "./UserAccessButton";
import PropTypes from "prop-types";

const UserCard = ({ row }) => {
    const theme = useTheme();
    const { userName, email, role, enabled, phone, userAccessEntry, imageUrl } = row;
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
            <FlexBetween>
                <Chip
                    label={role}
                    sx={{
                        backgroundColor: theme.palette.secondary.main,
                        color: "white",
                        fontWeight: "bolder",
                    }}
                />
            </FlexBetween>
            <FlexBetween mt={2}>
                <Field value={imageUrl} type="IMAGE" isEdit={false} extraProp={{ size: "35px" }} />
                <Typography m={"auto"} ml={2}>
                    {userName}
                </Typography>
            </FlexBetween>
            <ContactSection contact={email} />
            <ContactSection contact={phone} />
            <Field
                value={userAccessEntry}
                type="CUSTOME"
                isEdit={false}
                extraProp={{ CustomComponent: UserAccessButton }}
            />
        </>
    );
};

UserCard.propTypes = {
    row: PropTypes.shape({
        userName: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
        enabled: PropTypes.bool,
        phone: PropTypes.string,
        userAccessEntry: PropTypes.any,
        imageUrl: PropTypes.string,
    }).isRequired,
};

export default UserCard;
