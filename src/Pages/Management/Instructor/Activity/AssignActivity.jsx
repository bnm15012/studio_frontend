import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import EnrolledActivitiesTableInstructor from "./EnrolledActivitiesTable";

const AssignActivity = ({ instructorData, instructorId }) => (
    <>
        <Typography variant="h6" fontWeight={"bold"}>
            Contract
        </Typography>
        <EnrolledActivitiesTableInstructor instructorId={instructorId} data={instructorData} />
    </>
);

AssignActivity.propTypes = {
    instructorData: PropTypes.shape({
        assignments: PropTypes.array.isRequired,
    }).isRequired,
    instructorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default AssignActivity;
