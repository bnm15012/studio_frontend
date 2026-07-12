import Field from "@/core/components/fields/Field";
import ContactSection from "@/core/components/cards/ContactSection";
import UserAccessButton from "./UserAccessButton";

import CardHeader from "@/core/components/cards/CardHeader";
import { Box } from "@mui/material";
import React from "react";

const UserCard = ({ row }: { row: Record<string, unknown> }) => {
    const { userName, email, role, enabled, phone, userAccessEntry, imageUrl } = row;
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                badge={String(role)}
                fieldValue={String(userName)}
                image={String(imageUrl ?? "")}
                enabled={Boolean(enabled)}
            />
            {!!email && <ContactSection contact={String(email)} />}
            <Box display="flex" alignItems="center" gap={1.5}>
                {!!phone && <ContactSection contact={String(phone)} />}
                <Field
                    value={userAccessEntry}
                    type="CUSTOM"
                    isEdit={false}
                    extraProp={{
                        CustomComponent: UserAccessButton as unknown as React.ComponentType<
                            Record<string, unknown>
                        >,
                    }}
                />
            </Box>
        </Box>
    );
};

export default UserCard;
