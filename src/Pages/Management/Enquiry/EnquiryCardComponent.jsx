import { Box, Typography, Avatar, useTheme } from "@mui/material";
import { Calendar, User, FileText } from "lucide-react";
import PropTypes from "prop-types";
import { convertUTCToLocal } from "../../../utils/DateUtil";
import ContactSection from "./ContactSection";

const EnquiryCard = ({ row }) => {
    const { enquiryDate, name, contact, enquiryPurpose } = row;
    const theme = useTheme();

    return (
        <Box px={3}>
            <Box px={1} py={2} display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.2} color="text.secondary">
                    <Calendar size={16} />
                    <Typography variant="body2" fontWeight={500}>
                        {convertUTCToLocal(enquiryDate)}
                    </Typography>
                </Box>
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                        sx={{
                            bgcolor: theme.palette.primary.main + "20",
                            color: theme.palette.primary.main,
                            height: 40,
                            width: 40,
                        }}
                    >
                        <User size={18} />
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                            {name}
                        </Typography>
                    </Box>
                </Box>

                <ContactSection contact={contact} />

                <Box display="flex" alignItems="flex-start" gap={2}>
                    <Avatar
                        sx={{
                            bgcolor: theme.palette.info.main + "20",
                            color: theme.palette.info.main,
                            height: 40,
                            width: 40,
                        }}
                    >
                        <FileText size={18} />
                    </Avatar>
                    <Box flex={1}>
                        <Typography
                            variant="body2"
                            fontWeight={500}
                            sx={{
                                color: "text.primary",
                                lineHeight: 1.6,
                            }}
                        >
                            {enquiryPurpose}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
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
