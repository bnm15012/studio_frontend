import { useAppSelector } from "@/state";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import Field from "@/core/components/fields/Field";

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
    userAccessEntry: any;
    onSave: (access: any) => void;
    isEdit?: boolean;
}

const UserAccessDialog: React.FC<UserAccessDialogProps> = ({ open, onClose, userAccessEntry, onSave, isEdit = false }) => {
    const settings = useAppSelector((state) => state.auth.settings);
    const [accessState, setAccessState] = useState<Record<string, unknown>>({});

    const studioLevelAccess = Object.keys(settings)
        .filter((k) => settings[k])
        .map((key) => key.replace(/_/g, ""));

    useEffect(() => {
        if (userAccessEntry) {
            setAccessState({ ...userAccessEntry });
        } else {
            const initialState = {};
            Object.keys(ACCESS_BUTTONS).forEach((key) => {
                initialState[key] = "NONE";
            });
            setAccessState(initialState);
        }
    }, [userAccessEntry]);

    const handleChange = (key, value) => {
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
                                {ACCESS_BUTTONS[key]}
                            </Typography>
                            <Field
                                isEdit={isEdit}
                                value={accessState[key] === "FULL"}
                                type="BOOL"
                                setValue={(v) => handleChange(key, ACCESS_RIGHTS[Number(v)])}
                            />
                        </Box>
                    ))}
            </Box>
        </StyledDialog>
    );
};

UserAccessDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    userAccessEntry: PropTypes.object,
    isEdit: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
};

export default UserAccessDialog;
