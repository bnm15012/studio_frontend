import React from "react";
import CardHeader from "@/core/components/cards/CardHeader";
import ContactSection from "@/core/components/cards/ContactSection";
import CardLocation from "@/core/components/cards/CardLocation";
import { Box } from "@mui/material";

interface InstructorCardProps {
    row: Record<string, any>;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ row }) => {
    const { name, email, phone, instructorStatus, imageUrl, address } = row;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                badge={instructorStatus || ""}
                enabled={instructorStatus === "ACTIVE"}
                fieldValue={name}
                image={imageUrl || ""}
            />
            {email && <ContactSection contact={email} />}
            <Box display="flex" alignItems="center" gap={1.5}>
                {phone && <ContactSection contact={phone.toLocaleString()} />}
                {address && <CardLocation address={address} />}
            </Box>
        </Box>
    );
};

export default InstructorCard;
