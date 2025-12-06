import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
import {
    StyledCardContainer,
    StyledCardContent,
    StyledMotionCard,
} from "../../../Components/New/StyledCard";
import PaymentCard from "../Payments/PaymentCardView";

const PaymentList = ({ data, field }) => {
    const value = Array.isArray(data?.[field?.name]) ? data[field.name] : [];
    const title = field?.label || "Payments";

    if (!value.length) {
        return (
            <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.6 }}>
                    No Payments Found
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {title}
            </Typography>

            <StyledCardContainer>
                {value.map((m) => (
                    <StyledMotionCard key={m.id}>
                        <StyledCardContent>
                            <PaymentCard row={m} />
                        </StyledCardContent>
                    </StyledMotionCard>
                ))}
            </StyledCardContainer>
        </Box>
    );
};

PaymentList.propTypes = {
    data: PropTypes.object.isRequired,
    field: PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
    }).isRequired,
};

export default PaymentList;
