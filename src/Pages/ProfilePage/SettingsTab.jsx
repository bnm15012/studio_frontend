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

  const handleToggle = (index) => {
    const updatedConfigurations = configurations.map((config, idx) =>
      idx === index ? { ...config, enabled: !config.enabled } : config
    );
    setConfigurations(updatedConfigurations);
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
          configuration: {
            configrationEntryList: configurations
          }
        },
        dispatch,
        token,
      });

      if (success) {
        dispatch(setSettings({ settings: data.configuration.configrationEntryList }));
        showAlert("Setting updated !", "success");
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
        {configurations.map((config, index) => (
          <FlexBetween width={"43%"} key={index}>
            <Box my={"auto"}>
              {config.navBarName}
            </Box>
            <Box my={"auto"}>
              <Switch
                checked={config.enabled}
                onChange={() => handleToggle(index)}
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
