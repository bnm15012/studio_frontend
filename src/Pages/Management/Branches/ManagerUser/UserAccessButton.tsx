import { Button } from "@mui/material";
import { useState } from "react";
import UserAccessDialog from "@/Pages/Management/Branches/ManagerUser/UserAccessDialog";

import { FlexEvenly } from "@/core/components/layout/FlexBox";
import { userRights } from "@/api/types";
import { FieldValue } from "@/core/types";

interface UserAccessButtonProps {
    value?: FieldValue;
    setValue?: (access: FieldValue) => void;
    isEdit?: boolean;
}

const UserAccessButton = (props: UserAccessButtonProps) => {
    const { value, setValue, isEdit = false } = props;

    const [accessDialogOpen, setAccessDialogOpen] = useState(false);

    const access = (value ?? {}) as Record<string, userRights>;
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
                    userAccessEntry={access}
                    isEdit={isEdit}
                    onSave={(saved) => setValue?.(saved)}
                />
            )}
        </>
    );
};

export default UserAccessButton;
