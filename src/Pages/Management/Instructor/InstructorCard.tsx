import React from "react";
import CardHeader from "@/core/components/cards/CardHeader";
import ContactSection from "@/core/components/cards/ContactSection";
import CardLocation from "@/core/components/cards/CardLocation";
import { Box } from "@mui/material";
import { Instructor } from "@/api/types";

interface InstructorCardProps {
    row: Instructor;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ row }) => {
    const { name, email, phone, instructorStatus, imageUrl, address } = row;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                badge={String(instructorStatus ?? "")}
                enabled={instructorStatus === "ACTIVE"}
                fieldValue={String(name)}
                image={String(imageUrl ?? "")}
            />
            {!!email && <ContactSection contact={String(email)} />}
            <Box display="flex" alignItems="center" gap={1.5}>
                {!!phone && <ContactSection contact={String(phone)} />}
                {!!address && <CardLocation address={String(address)} />}
            </Box>
        </Box>
    );
};

export default InstructorCard;
