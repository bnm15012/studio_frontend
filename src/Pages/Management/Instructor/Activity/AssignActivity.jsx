import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import EnrolledActivitiesTableInstructor from "./EnrolledActivitiesTable";

const AssignActivity = ({ instructorData, instructorId }) => {
  return (
    <>
      <Typography variant="h6" fontWeight={"bold"}>
        EnrolledActivities
      </Typography>
      <EnrolledActivitiesTableInstructor
        instructorId={instructorId}
        data={instructorData.assignments}
      />
    </>
  );
};

AssignActivity.propTypes = {
  instructorData: PropTypes.shape({
    assignments: PropTypes.array.isRequired,
  }).isRequired,
  instructorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default AssignActivity;
