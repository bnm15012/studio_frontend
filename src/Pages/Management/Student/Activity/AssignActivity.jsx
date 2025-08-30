import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import EnrolledActivitiesTableStudent from "./EnrolledActivitiesTable";

const AssignActivity = ({ studentData, studentId }) => {
  return (
    <>
      <Typography variant="h6" fontWeight={"bold"}>
        EnrolledActivities
      </Typography>
      <EnrolledActivitiesTableStudent
        studentId={studentId}
        studentData={{
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
        }}
        data={studentData.enrolledActivities}
      />
    </>
  );
};

AssignActivity.propTypes = {
  studentData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    enrolledActivities: PropTypes.array.isRequired,
  }).isRequired,
  studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default AssignActivity;
