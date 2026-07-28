import { Button } from "@mui/material";
import { useState } from "react";
import UserAccessDialog from "@/Pages/Management/Branches/ManagerUser/UserAccessDialog";

import { FlexEvenly } from "@/core/components/layout/FlexBox";
import { userRights } from "@/api/types";

interface UserAccessButtonProps {
    value?: Record<string, userRights>;
    setValue?: (access: Record<string, userRights>) => void;
    isEdit?: boolean;
}

const UserAccessButton = (props: UserAccessButtonProps) => {
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
                    userAccessEntry={value ?? {}}
                    isEdit={isEdit}
                    onSave={setValue ?? (() => {})}
                />
            )}
        </>
    );
};

export default UserAccessButton;
