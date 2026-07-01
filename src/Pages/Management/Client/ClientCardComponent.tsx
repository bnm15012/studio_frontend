import React from "react";
import { User2, FileText } from "lucide-react";
import ContactSection from "@/core/components/cards/ContactSection";
import CardHeader from "@/core/components/cards/CardHeader";
import CardChip from "@/core/components/cards/CardChip";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import { Box } from "@mui/material";

interface ClientCardProps {
    row: {
        groupName: string;
        pocName: string;
        pocPhone: string;
        pocEmail: string;
        clientType: string;
        notes?: string;
    };
}

const ClientCardComponent: React.FC<ClientCardProps> = ({ row }) => {
    const { groupName, pocName, pocPhone, pocEmail, clientType, notes } = row;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                badge={clientType}
                FieldIcon={PermContactCalendarIcon}
                fieldValue={groupName}
                enabled={true}
            />
            {pocName && (
                <CardChip value={pocName} ChipIcon={User2} />
            )}
            {pocEmail && <ContactSection contact={pocEmail} />}
            <Box display="flex" alignItems="center" gap={1.5}>
                {pocPhone && <ContactSection contact={pocPhone} />}
                {notes && <CardChip value={notes} ChipIcon={FileText} />}
            </Box>
        </Box>
    );
};

export default ClientCardComponent;
