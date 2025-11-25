import { Tabs, Tab, Box, Button } from "@mui/material";
import { useState } from "react";
import FlexBetween from "../FlexBetween";
import Views from "./Views";
import { Add } from "@mui/icons-material";
import PropTypes from "prop-types";

const ViewTabs = ({ viewFields, editingId, formKey, currentView }) => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Box>
            <FlexBetween>
                <Tabs
                    value={tabIndex}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ flexGrow: 1 }}
                >
                    {viewFields.map((view) => (
                        <Tab sx={{ fontWeight: "bolder" }} key={view.label} label={view.label} />
                    ))}
                </Tabs>

                {editingId !== "NEW" && viewFields[tabIndex]?.api?.current?.addNewRow && (
                    <Button
                        variant="contained"
                        onClick={() => viewFields[tabIndex]?.api?.current?.addNewRow(editingId)}
                        sx={{ ml: 1 }}
                    >
                        <Add style={{ color: "whitesmoke" }} />
                    </Button>
                )}
            </FlexBetween>

            {viewFields.map((view, index) => (
                <Box
                    key={view.label}
                    sx={{ mt: 2, display: tabIndex === index ? "block" : "none" }}
                >
                    <Views {...view.viewProps} rootId={formKey} currentView={currentView} />
                </Box>
            ))}
        </Box>
    );
};

ViewTabs.propTypes = {
    formKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currentView: PropTypes.string,
    viewFields: PropTypes.array.isRequired,
    editingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
export default ViewTabs;
