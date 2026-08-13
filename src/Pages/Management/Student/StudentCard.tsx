import React from "react";
import { Box } from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import CardHeader from "@/core/components/cards/CardHeader";
import { Student } from "@/api/types";
import ContactSection from "@/core/components/cards/ContactSection";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import CardChip from "@/core/components/cards/CardChip";

interface StudentCardProps {
    row: Student;
}

const StudentCard: React.FC<StudentCardProps> = ({ row }) => {
    const { name, email, phone, membershipStatus, imageUrl, address } = row;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                badge={String(membershipStatus ?? "")}
                enabled={membershipStatus === "ACTIVE"}
                fieldValue={String(name)}
                image={String(imageUrl ?? "")}
            />
            {!!email && <ContactSection contact={email} />}
            {(!!phone || !!address) && (
                <FlexBetween>
                    {!!phone && <ContactSection contact={String(phone)} />}
                    {!!address && <CardChip ChipIcon={LocationOn} value={String(address)} />}
                </FlexBetween>
            )}
        </Box>
    );
};

export default StudentCard;
