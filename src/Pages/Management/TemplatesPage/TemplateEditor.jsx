import { Box, MenuItem, Popper, Paper, TextField } from "@mui/material";
import { useState, useRef } from "react";
import PropTypes from "prop-types";

const data = {
    instructor: {
        name: "Instructor Name",
        email: "Instructor Email",
        phone: "Instructor Phone",
        dob: "Instructor Date of Birth",
        address: "Instructor Address",
        emergencyContactNumber: "Instructor Emergency Contact Number",
    },
    instructorActivity: {
        activityName: "Activity Name (Instructor)",
        assignedDate: "Date Assigned",
        startDate: "Activity Start Date",
        endDate: "Activity End Date",
    },
    student: {
        name: "Student Name",
        email: "Student Email",
        phone: "Student Phone",
        dob: "Student Date of Birth",
        address: "Student Address",
        emergencyContactNumber: "Student Emergency Contact Number",
    },
    studentActivity: {
        activityName: "Activity Name (Student)",
        registrationDate: "Registration Date",
        membershipStartDate: "Membership Start Date",
        membershipEndDate: "Membership End Date",
        membershipType: "Membership Type",
        activityAmount: "Activity Fee Amount",
        daysPerWeek: "Days per Week",
        batchName: "Batch Name",
        batchTime: "Batch Time",
    },
    branch: {
        name: "Branch Name",
        address: "Branch Address",
        city: "Branch City",
        state: "Branch State",
        pincode: "Branch Pincode",
        phone: "Branch Phone",
    },
    studio: {
        studioName: "Studio Name",
        location: "Studio Location",
        email: "Studio Email",
        contactDetails: "Studio Contact Details",
    },
};

// flatten nested object keys like instructor.name, student.email
const flattenVariables = (obj, prefix = "") =>
    Object.entries(obj).flatMap(([key, value]) =>
        typeof value === "object" ? flattenVariables(value, `${prefix}${key}_`) : `${prefix}${key}`,
    );

const allVariables = flattenVariables(data);

const TemplateEditor = ({
    value,
    setValue,
    rows = 1,
    label = "Enter Text",
    disableVars = false,
}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filter, setFilter] = useState("");
    const textRef = useRef(null);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);

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

        setValue(newValue);

        // Move cursor after inserted variable
        setTimeout(() => {
            const newPos = newBefore.length;
            input.selectionStart = input.selectionEnd = newPos;
            input.focus();
        }, 0);

        setShowSuggestions(false);
        setFilter("");
    };

    const filteredVariables = allVariables
        .filter((v) => (disableVars ? !v.includes("Activity_") : true))
        .filter((v) => v.toLowerCase().includes(filter.toLowerCase()));

    return (
        <Box width={"100%"}>
            <TextField
                inputRef={textRef}
                label={label}
                placeholder={`Type your ${label} here... use {{variable}} to insert variables`}
                multiline
                rows={rows}
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
    setValue: PropTypes.func.isRequired,
    rows: PropTypes.number,
    label: PropTypes.string,
    disableVars: PropTypes.bool,
};

export default TemplateEditor;
