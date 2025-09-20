import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const ACCESS_BUTTONS = {
  activity: "Activity",
  communication: "Communication",
  payments: "Payments",
  expense: "Expense",
  analysis: "Analysis",
  reports: "Reports",
  enquiry: "Enquiry",
};

const ACCESS_RIGHTS = ["NONE", "FULL"];

const UserAccessDialog = ({ open, onClose, user, onSave, isEdit = false }) => {
  const settings = useSelector((state) => state.auth.settings);
  const [accessState, setAccessState] = useState({});
  const studioLevelAccess = Object.keys(settings).filter((k) => settings[k]).map((key) => key.replaceAll("_", ""));

  useEffect(() => {
    if (user?.userAccessEntry) {
      setAccessState({ ...user.userAccessEntry });
    } else {
      const initialState = {};
      Object.keys(ACCESS_BUTTONS).forEach((key) => {
        initialState[key] = "NONE";
      });
      setAccessState(initialState);
    }
  }, [user]);

  const handleChange = (key, value) => {
    setAccessState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(accessState);
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>User Access Settings</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {Object.keys(ACCESS_BUTTONS).filter(ab => studioLevelAccess.includes(ab.toUpperCase())).map((key) => (
            <Grid item xs={12} sm={6} key={key}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">{ACCESS_BUTTONS[key]}</FormLabel>
                <RadioGroup
                  row
                  value={accessState[key] || "NONE"}
                  onChange={(e) => handleChange(key, e.target.value)}
                >
                  {ACCESS_RIGHTS.map((right) => (
                    <FormControlLabel
                      disabled={!isEdit}
                      key={right}
                      value={right}
                      control={<Radio />}
                      label={right}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        {
          isEdit ? <>
            <Button Button onClick={onClose} color="error">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </> : <Button onClick={onClose} color="primary">
            Close
          </Button>
        }
      </DialogActions>
    </Dialog >
  );
};

UserAccessDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object,
  isEdit: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
};

export default UserAccessDialog;
