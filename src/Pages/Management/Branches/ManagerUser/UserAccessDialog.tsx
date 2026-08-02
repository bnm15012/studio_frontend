import { useAppSelector } from "@/state";
import { Box, Typography } from "@mui/material";

import { useState, useEffect } from "react";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import Field from "@/core/components/fields/Field";
import { userRights } from "@/api/types";

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

interface UserAccessDialogProps {
    open: boolean;
    onClose: () => void;
    userAccessEntry: Record<string, userRights>;
    onSave: (access: Record<string, userRights>) => void;
    isEdit?: boolean;
}

const UserAccessDialog: React.FC<UserAccessDialogProps> = ({
    open,
    onClose,
    userAccessEntry,
    onSave,
    isEdit = false,
}) => {
    const settings = useAppSelector((state) => state.auth.settings);
    const [accessState, setAccessState] = useState<Record<string, userRights>>({});

    const studioLevelAccess = Object.keys(settings)
        .filter((k) => settings[k])
        .map((key) => key.replace(/_/g, ""));

    useEffect(() => {
        if (userAccessEntry) {
            setAccessState({ ...userAccessEntry });
        } else {
            const initialState: Record<string, userRights> = {};
            Object.keys(ACCESS_BUTTONS).forEach((key: string) => {
                initialState[key] = "NONE";
            });
            setAccessState(initialState);
        }
    }, [userAccessEntry]);

    const handleChange = (key: string, value: userRights) => {
        setAccessState((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onSave(accessState);
        onClose();
    };

    if (!userAccessEntry) return null;

    return (
        <StyledDialog
            title="User Access Settings"
            cancelText={isEdit ? "Cancel" : "Close"}
            confirmText="Save"
            onConfirm={isEdit ? handleSave : undefined}
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <Box
                display="grid"
                gridTemplateColumns="1fr auto"
                gap={1.5}
                sx={{ alignItems: "center" }}
            >
                {Object.keys(ACCESS_BUTTONS)
                    .filter((ab) => studioLevelAccess.includes(ab.toUpperCase()))
                    .map((key) => (
                        <Box key={key} display="contents">
                            <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                                {ACCESS_BUTTONS[key as keyof typeof ACCESS_BUTTONS]}
                            </Typography>
                            <Field
                                isEdit={isEdit}
                                value={accessState[key] === "FULL"}
                                type="BOOL"
                                setValue={(v: boolean | FieldValue) =>
                                    handleChange(key, ACCESS_RIGHTS[v ? 1 : 0] as userRights)
                                }
                            />
                        </Box>
                    ))}
            </Box>
        </StyledDialog>
    );
};

export default UserAccessDialog;
