import React, { useState } from "react";
import { Tabs, Tab, Box, Button } from "@mui/material";
import { FlexBetween } from "../components/layout/FlexBox";
import Views from "./Views";
import { Add } from "@mui/icons-material";

interface ViewFieldItem {
    label?: string;
    api?: React.RefObject<{
        addNewRow?: (editingId: any) => void;
    } | null> | {
        current?: {
            addNewRow?: (editingId: any) => void;
        } | null;
    };
    viewProps?: any;
}

interface ViewTabsProps {
    viewFields: ViewFieldItem[];
    editingId?: string | number | null;
    formKey?: string | number | null;
    currentView?: string;
}

const ViewTabs: React.FC<ViewTabsProps> = ({ viewFields, editingId, formKey, currentView }) => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const currentViewField = viewFields[tabIndex];
    const hasAddNewRow = typeof (currentViewField?.api as any)?.current?.addNewRow === "function";

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

                {editingId !== "NEW" && hasAddNewRow && (
                    <Button
                        variant="contained"
                        onClick={() => (currentViewField?.api as any)?.current?.addNewRow(editingId)}
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

export default ViewTabs;
