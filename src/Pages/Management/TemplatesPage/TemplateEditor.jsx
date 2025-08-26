import { Box, MenuItem, Popper, Paper, TextField } from "@mui/material";
import { useState, useRef } from "react";
import PropTypes from "prop-types";

const data = {
  instructor: {
    name: "instructor_name",
    email: "instructor_email",
    phone: "instructor_phone",
    dob: "instructor_dob",
    address: "instructor_address",
    emergencyContactNumber: "instructor_emergencyContactNumber",
    activityName: "instructor_activityName",
    assignedDate: "instructor_assignedDate",
    startDate: "instructor_startDate",
    endDate: "instructor_endDate",
  },
  student: {
    name: "student_name",
    email: "student_email",
    phone: "student_phone",
    dob: "student_dob",
    address: "student_address",
    emergencyContactNumber: "student_emergencyContactNumber",
    activityName: "student_activityName",
    registrationDate: "student_registrationDate",
    membershipStartDate: "student_membershipStartDate",
    membershipEndDate: "student_membershipEndDate",
    membershipType: "student_membershipType",
    activityAmount: "student_activityAmount",
    daysPerWeek: "student_daysPerWeek",
    batchName: "student_batchName",
    batchTime: "student_batchTime",
  },
  branch: {
    name: "branch_name",
    address: "branch_address",
    city: "branch_city",
    state: "branch_state",
    pincode: "branch_pincode",
    phone: "branch_phone",
  },
  studio: {
    studioName: "studio_name",
    location: "studio_location",
    email: "studio_email",
    contactDetails: "studio_contactDetails",
  },
};

// flatten nested object keys like instructor.name, student.email
const flattenVariables = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([key, value]) =>
    typeof value === "object"
      ? flattenVariables(value, `${prefix}${key}_`)
      : `${prefix}${key}`
  );

const allVariables = flattenVariables(data);

const TemplateEditor = ({ value, onChange }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filter, setFilter] = useState("");
  const textRef = useRef(null);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    const cursorPos = e.target.selectionStart;
    const beforeCursor = newValue.slice(0, cursorPos);

    // Match `{{` or `{{some.text`
    const match = beforeCursor.match(/{{([\w.]*)?$/);

    if (match) {
      setFilter(match[1] || "");
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setFilter("");
    }
  };

  const insertVariable = (variable) => {
    const input = textRef.current;
    if (!input) return;

    const cursorPos = input.selectionStart;
    const before = value.slice(0, cursorPos);
    const after = value.slice(cursorPos);

    // Replace "{{xxx" with full variable
    const newBefore = before.replace(/{{[\w.]*$/, `{{${variable}}}`);
    const newValue = newBefore + after;

    onChange(newValue);

    // Move cursor after inserted variable
    setTimeout(() => {
      const newPos = newBefore.length;
      input.selectionStart = input.selectionEnd = newPos;
      input.focus();
    }, 0);

    setShowSuggestions(false);
    setFilter("");
  };

  const filteredVariables = allVariables.filter((v) =>
    v.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Box>
      <TextField
        inputRef={textRef}
        label="Content"
        placeholder="Type your template here... use {{variable}} to insert variables"
        multiline
        rows={8}
        value={value}
        onChange={handleChange}
        fullWidth
      />

      <Popper
        open={showSuggestions && filteredVariables.length > 0}
        anchorEl={textRef.current}
        placement="bottom-start"
        style={{ zIndex: 1300 }}
      >
        <Paper
          sx={{
            maxHeight: 200,
            overflow: "auto",
            width: 250,
          }}
        >
          {filteredVariables.map((v) => (
            <MenuItem key={v} onClick={() => insertVariable(v)}>
              {v}
            </MenuItem>
          ))}
        </Paper>
      </Popper>
    </Box>
  );
};
TemplateEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TemplateEditor;
