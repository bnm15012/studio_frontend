import { Button, Avatar, useTheme } from "@mui/material";
import { Send } from "lucide-react";
import { Email, Group, WhatsApp } from "@mui/icons-material";
import {
    StyledCardActions,
    StyledCardContainer,
    StyledCardContent,
    StyledMotionCard,
} from "@/core/components/cards/StyledCard";
import PropTypes from "prop-types";
import CardHeader from "@/core/components/cards/CardHeader";
import CardChip from "@/core/components/cards/CardChip";

const MessageHistoryCard = ({ history, onViewRecipients }) => {
    const theme = useTheme();
    return (
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
                            <CardHeader
                                FieldIcon={Send}
                                fieldValue={row?.memberType ? "All Recipients" : "Few"}
                                badgeSx={{ backgroundColor: "" }}
                                badge={
                                    <Avatar
                                        sx={{
                                            p: 2,
                                            backgroundColor:
                                                row?.notificationType === "EMAIL"
                                                    ? theme.palette.info.main
                                                    : theme.palette.success.main,
                                        }}
                                    >
                                        {row?.notificationType === "EMAIL" ? <Email /> : <WhatsApp />}
                                    </Avatar>
                                }
                            />
                            <CardChip label={"Sent Date"} value={row?.sentDate} type="DATETIME" />
                        </StyledCardContent>
                        <StyledCardActions>
                            <Button
                                variant="outlined"
                                size="small"
                                fullWidth
                                onClick={() => onViewRecipients(row.id)}
                                disabled={row.memberType}
                                startIcon={<Group />}
                                sx={{ mt: 1 }}
                            >
                                Recipients
                            </Button>
                        </StyledCardActions>
                    </StyledMotionCard>
                ))}
        </StyledCardContainer>
    );
};

MessageHistoryCard.propTypes = {
    history: PropTypes.arrayOf(PropTypes.object),
    onViewRecipients: PropTypes.func,
};

export default MessageHistoryCard;
