import { Button } from "@mui/material";
import { useState } from "react";
import UserAccessDialog from "./UserAccessDialog";
import PropTypes from "prop-types";
import { FlexEvenly } from "@/core/components/layout/FlexBox";

const UserAccessButton = (props) => {
    const { value, setValue, isEdit = false } = props;

    const [accessDialogOpen, setAccessDialogOpen] = useState(false);
    return (
        <>
            <FlexEvenly width={"100%"}>
                <Button
                    variant="outlined"
                    size="small"
                    sx={{ px: 1, py: 0 }}
                    onClick={() => setAccessDialogOpen(true)}
                >
                    Access
                </Button>{" "}
            </FlexEvenly>
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
