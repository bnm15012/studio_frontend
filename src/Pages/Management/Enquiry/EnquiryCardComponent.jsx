import { Box, Typography, Avatar, Divider, useTheme } from "@mui/material";
import { Calendar, FileText } from "lucide-react";
import PropTypes from "prop-types";
import { convertUTCToLocal } from "../../../utils/DateUtil";
import ContactSection from "./ContactSection";
import { StyledCardContent } from "../../../Components/New/StyledCard";

const EnquiryCard = ({ row }) => {
    const theme = useTheme();
    const { enquiryDate, name, contact, enquiryPurpose } = row;

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
                            {name.charAt(0).toUpperCase()}
                        </Avatar>

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {name}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <Calendar size={14} color={theme.palette.text.secondary} />
                                <Typography variant="caption" color="text.secondary">
                                    {convertUTCToLocal(enquiryDate)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

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
                        <FileText size={18} color={theme.palette.primary.main} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                            Purpose
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                            {enquiryPurpose}
                        </Typography>
                    </Box>
                </Box>

                <ContactSection contact={contact} />
            </StyledCardContent>
        </>
    );
};

EnquiryCard.propTypes = {
    row: PropTypes.shape({
        enquiryDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
        name: PropTypes.string.isRequired,
        contact: PropTypes.string.isRequired,
        enquiryPurpose: PropTypes.string.isRequired,
    }).isRequired,
};

export default EnquiryCard;
