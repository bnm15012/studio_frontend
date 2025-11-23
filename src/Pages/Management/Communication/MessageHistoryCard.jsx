import { Button, Avatar } from "@mui/material";
import { Send } from "lucide-react";
import { Email, Group, WhatsApp } from "@mui/icons-material";
import {
    StyledCardActions,
    StyledCardContainer,
    StyledCardContent,
    StyledMotionCard,
} from "../../../Components/New/StyledCard";
import PropTypes from "prop-types";
import CardHeader from "../../../Components/New/StyledCardComponents/CardHeader";
import CardChip from "../../../Components/New/StyledCardComponents/CardChip";

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
                        <CardHeader
                            FieldIcon={Send}
                            fieldValue={row?.memberType ? "All Recipients" : "Few"}
                            badgeSx={{ backgroundColor: "" }}
                            badge={
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
