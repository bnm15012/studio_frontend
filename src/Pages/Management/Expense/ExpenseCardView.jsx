import { CardContent, Chip, Typography, Box } from "@mui/material";
import { CalendarMonth, Description } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { getLocalDateTime } from "../../../utils/DateUtil";
import PropTypes from "prop-types";

// Styled Components
const CategoryChip = styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main + "20",
    color: theme.palette.primary.main,
    fontWeight: 600,
    borderRadius: "8px",
    padding: "4px 8px",
    "&:hover": {
        backgroundColor: theme.palette.primary.main + "30",
    },
}));

const AmountText = styled(Typography)(({ theme }) => ({
    color: theme.palette.success.main,
    fontSize: "1.8rem",
    fontWeight: 700,
}));

const DescriptionBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(1),
}));

const DateBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`,
}));

// Main Component
const ExpenseCard = ({ row }) => (
    <CardContent>
        {/* Category */}
        <CategoryChip label={row.expenseCategory} />

        {/* Amount */}
        <Box mt={2}>
            <AmountText variant="h5">₹ {Number(row.amount).toLocaleString("en-IN")}</AmountText>
        </Box>

        {/* Description */}
        <DescriptionBox>
            <Description sx={{ color: "primary.main", fontSize: 22, mt: "2px" }} />
            <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary" }}>
                {row.description || "No description"}
            </Typography>
        </DescriptionBox>

        {/* Date */}
        <DateBox>
            <CalendarMonth color="info" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
                {getLocalDateTime(row.expenseDate)}
            </Typography>
        </DateBox>
    </CardContent>
);
ExpenseCard.propTypes = {
    row: PropTypes.shape({
        expenseCategory: PropTypes.string,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        description: PropTypes.string,
        expenseDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    }).isRequired,
};

export default ExpenseCard;
