/** Tabbed view component allowing switching between multiple Views instances (e.g., different sub-tables) with an "Add" button. */
import React, { useState } from "react";
import { Tabs, Tab, Box, Button } from "@mui/material";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import Views, { type ViewsProps } from "@/core/crud/Views";
import { Add } from "@mui/icons-material";
import type { ViewMode, CrudRecord } from "@/core/types";

interface ViewFieldApi {
    current?: {
        addNewRow?: (...args: unknown[]) => void;
    } | null;
}

interface ViewFieldItem {
    label?: string;
    api?: ViewFieldApi;
    viewProps?: Partial<ViewsProps<CrudRecord>>;
}

interface ViewTabsProps {
    viewFields: ViewFieldItem[];
    /** -1 = not editing, 0 = new row, positive = editing existing */
    editingId: number;
    /** 0 = new record, positive = existing id */
    formKey?: number | undefined;
    currentView?: ViewMode | undefined;
}

const ViewTabs: React.FC<ViewTabsProps> = ({ viewFields, editingId, formKey, currentView }) => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const currentViewField = viewFields[tabIndex];
    const hasAddNewRow = typeof currentViewField?.api?.current?.addNewRow === "function";

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

                {hasAddNewRow && (
                    <Button
                        disabled={editingId > 0}
                        variant="contained"
                        onClick={() => currentViewField?.api?.current?.addNewRow?.()}
                        sx={{ ml: 1 }}
                    >
                        <Add sx={{ color: "white" }} />
                    </Button>
                )}
            </FlexBetween>

            {viewFields.map((view, index) => (
                <Box
                    key={view.label}
                    sx={{ mt: 2, display: tabIndex === index ? "block" : "none" }}
                >
                    <Views
                        {...(view.viewProps as ViewsProps<CrudRecord>)}
                        rootId={formKey ?? 0}
                        {...(currentView && { currentView })}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default ViewTabs;
