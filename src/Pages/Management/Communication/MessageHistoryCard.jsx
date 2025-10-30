import { Typography, Button, Box, Avatar } from "@mui/material";
import { Calendar, Send } from "lucide-react";
import { getLocalDateTime } from "../../../utils/DateUtil";
import { Email, Group, WhatsApp } from "@mui/icons-material";
import {
    StyledCardActions,
    StyledCardContainer,
    StyledCardContent,
    StyledMotionCard,
} from "../../../Components/New/StyledCard";
import PropTypes from "prop-types";

const MessageHistoryCard = ({ history, onViewRecipients }) => (
    <StyledCardContainer>
        {history &&
            history.map((row) => (
                <StyledMotionCard
                    key={row.id}
                    sx={{
                        transition: "box-shadow 0.2s ease-in-out",
                        "&:hover": { boxShadow: 4 },
                    }}
                >
                    <StyledCardContent
                        sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        {/* Header Section */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                fontWeight="600"
                                sx={{
                                    flex: 1,
                                    overflow: "hidden",
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 2,
                                }}
                            >
                                {row?.Calendartitle}
                            </Typography>

                            <Avatar
                                size="small"
                                sx={{
                                    p: 2,
                                    backgroundColor:
                                        row?.notificationType === "EMAIL" ? "blue" : "green",
                                }}
                            >
                                {row?.notificationType === "EMAIL" ? <Email /> : <WhatsApp />}
                            </Avatar>
                        </Box>

                        {/* Details Section */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Calendar size={16} />
                                <Typography variant="body1">
                                    {getLocalDateTime(row?.sentDate, "DATETIME")}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Send size={16} />
                                <Typography variant="body1">
                                    {row?.memberType ? "All Recipients" : "Few"}
                                </Typography>
                            </Box>
                        </Box>
                    </StyledCardContent>
                    <StyledCardActions>
                        <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={() => onViewRecipients(row.id)}
                            disabled={row.memberType}
                            startIcon={<Group size={16} />}
                            sx={{ mt: 1 }}
                        >
                            Recipients
                        </Button>
                    </StyledCardActions>
                </StyledMotionCard>
            ))}
    </StyledCardContainer>
);

MessageHistoryCard.propTypes = {
    history: PropTypes.arrayOf(PropTypes.object),
    onViewRecipients: PropTypes.func,
};

export default MessageHistoryCard;
