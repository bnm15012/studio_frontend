import { useState, useEffect } from "react";
import { Switch, Box, Button, Typography } from "@mui/material";
import { updateStudio } from "../Auth/auth.api";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "../../utils/Alert";
import { setSettings } from "../../state/authSlice";
import FlexBetween from "../../Components/FlexBetween";

const SettingsTab = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const studio = useSelector((state) => state.auth.studio);
  const showAlert = useAlert();

  const initialConfigurations = useSelector((state) => state.auth.settings);

  const [configurations, setConfigurations] = useState(initialConfigurations);
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (key) => {
    setConfigurations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    const hasChanges = JSON.stringify(configurations) !== JSON.stringify(initialConfigurations);
    setIsChanged(hasChanges);
  }, [configurations, initialConfigurations]);

  const updateSettings = async () => {
    setIsLoading(true);
    try {
      const { success, data, message } = await updateStudio({
        values: {
          studioId: studio.studioId,
          configuration: { configrationEntryList: configurations }, // now send map directly
        },
        dispatch,
        token,
      });

      if (success) {
        dispatch(setSettings({ settings: data.configuration.configrationEntryList }));
        showAlert("Setting updated!", "success");
      } else {
        showAlert(message, "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Internal server error", "error");
    }
    setIsLoading(false);
  };

  return (
    <Box p={3}>
      <FlexBetween gap={2} flexWrap={"wrap"}>
        {Object.keys(configurations).map((key) => (
          <FlexBetween width={"43%"} key={key}>
            <Box my={"auto"}>{key}</Box>
            <Box my={"auto"}>
              <Switch
                checked={configurations[key]}
                onChange={() => handleToggle(key)}
                color="primary"
              />
            </Box>
          </FlexBetween>
        ))}
      </FlexBetween>

      <Box mt={4}>
        <Button
          fullWidth
          variant="contained"
          onClick={updateSettings}
          disabled={!isChanged || isLoading}
        >
          <Typography variant="button" fontWeight={"bold"} color="white">
            {isLoading ? "Saving..." : "Save Settings"}
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsTab;
