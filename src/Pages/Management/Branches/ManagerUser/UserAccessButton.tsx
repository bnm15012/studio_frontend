import { Button } from "@mui/material";
import { useState } from "react";
import UserAccessDialog from "./UserAccessDialog";

import { FlexEvenly } from "@/core/components/layout/FlexBox";

interface UserAccessButtonProps {
    value: Record<string, "NONE" | "FULL">;
    setValue: (access: Record<string, "NONE" | "FULL">) => void;
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
                    userAccessEntry={value}
                    isEdit={isEdit}
                    onSave={setValue}
                />
            )}
        </>
    );
};

export default UserAccessButton;
