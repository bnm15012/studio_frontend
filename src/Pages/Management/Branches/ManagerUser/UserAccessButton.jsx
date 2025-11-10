import { Button } from "@mui/material";
import { useState } from "react";
import UserAccessDialog from "./UserAccessDialog";
import PropTypes from "prop-types";

const UserAccessButton = (props) => {
    const { value, setValue, isEdit = false } = props;

    const [accessDialogOpen, setAccessDialogOpen] = useState(false);
    return (
        <>
            <Button variant="outlined" size="small" onClick={() => setAccessDialogOpen(true)}>
                Access
            </Button>{" "}
            {accessDialogOpen && (
                <UserAccessDialog
                    open={true}
                    onClose={() => setAccessDialogOpen(false)}
                    userAccessEntry={value}
                    isEdit={isEdit}
                    onSave={setValue}
                />
            )}
        </>
    );
};

UserAccessButton.propTypes = {
    value: PropTypes.any,
    setValue: PropTypes.func.isRequired,
    isEdit: PropTypes.bool,
};

export default UserAccessButton;
