import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";

const MembershipTable = ({ plans, index }) => {
  const theme = useTheme();
  return (
    <TableContainer sx={{ maxHeight: 160 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                background: theme.palette.background.paper,
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Type
              </Typography>
            </TableCell>

            <TableCell
              sx={{
                background: theme.palette.background.paper,
                whiteSpace: "normal",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Days/Week
              </Typography>
            </TableCell>

            <TableCell
              sx={{
                background: theme.palette.background.paper,
                whiteSpace: "normal",
              }}

            >
              <Typography variant="subtitle1" textAlign={"right"} fontWeight="bold">
                Amount
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>


        <TableBody>
          {plans.map((plan, idx) => (
            <TableRow
              key={idx}
            >
              <TableCell>
                <Typography variant="body2">{plan.membershipType}</Typography>
              </TableCell>
              <TableCell>
                <Typography textAlign={"center"} variant="body2">{plan.daysPerWeek}</Typography>
              </TableCell>
              <TableCell>
                <Typography textAlign={"right"} variant="body2">
                  {plan.amount}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

MembershipTable.propTypes = {
  index: PropTypes.number,
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.string.isRequired,
      membershipType: PropTypes.string.isRequired,
      daysPerWeek: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default MembershipTable;
