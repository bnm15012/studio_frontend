import { Box, Typography, Avatar, Divider, useTheme } from "@mui/material";
import { User2, FileText } from "lucide-react";
import PropTypes from "prop-types";
import { StyledCardContent } from "../../../Components/New/StyledCard";
import ContactSection from "../Enquiry/ContactSection";

const ClientCardComponent = ({ row }) => {
    const theme = useTheme();
    const { groupName, pocName, pocPhone, pocEmail, clientType, notes } = row;

    return (
        <>
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 5,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.info.light})`,
                }}
            />

            <StyledCardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            sx={{
                                bgcolor: theme.palette.primary.main,
                                color: "white",
                                width: 48,
                                height: 48,
                                fontWeight: 600,
                                fontSize: "1.1rem",
                            }}
                        >
                            {groupName?.charAt(0)?.toUpperCase() || "C"}
                        </Avatar>

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {groupName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {clientType}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* POC section */}
                <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: theme.palette.action.hover,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <User2 size={18} color={theme.palette.primary.main} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                            Contact Person
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                            {pocName}
                        </Typography>
                    </Box>
                </Box>
                <ContactSection contact={pocPhone} />
                <ContactSection contact={pocEmail} />
                {/* Notes section */}
                {notes && (
                    <Box display="flex" mt={2} alignItems="flex-start" gap={2}>
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: 1,
                                backgroundColor: theme.palette.action.hover,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FileText size={18} color={theme.palette.primary.main} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                                Notes
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                                {notes}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </StyledCardContent>
        </>
    );
};

ClientCardComponent.propTypes = {
    row: PropTypes.shape({
        groupName: PropTypes.string.isRequired,
        pocName: PropTypes.string.isRequired,
        pocPhone: PropTypes.string.isRequired,
        pocEmail: PropTypes.string.isRequired,
        clientType: PropTypes.string.isRequired,
        notes: PropTypes.string,
    }).isRequired,
};

export default ClientCardComponent;
