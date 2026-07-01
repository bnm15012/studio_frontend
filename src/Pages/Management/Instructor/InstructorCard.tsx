import React from "react";
import CardHeader from "../../../core/components/cards/CardHeader";
import ContactSection from "../../../core/components/cards/ContactSection";
import CardLocation from "../../../core/components/cards/CardLocation";
import { Box } from "@mui/material";

interface InstructorCardProps {
    row: {
        name: string;
        imageUrl?: string | null;
        email?: string | null;
        phone?: string | number | null;
        dob?: string | null;
        instructorStatus?: string | null;
        address?: string | null;
        emergencyContactNumber?: string | number | null;
    };
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
                {phone && <ContactSection contact={phone} />}
                {address && <CardLocation address={address} />}
            </Box>
        </Box>
    );
};

export default InstructorCard;
