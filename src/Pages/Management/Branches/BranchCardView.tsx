import type { Branch } from "@/api/types";
import { Box } from "@mui/material";
import { Circle, Business } from "@mui/icons-material";
import ContactSection from "@/core/components/cards/ContactSection";
import CardHeader from "@/core/components/cards/CardHeader";
import CardLocation from "@/core/components/cards/CardLocation";

const BranchCardView = ({ row }: { row: Branch }) => {
    const isActive = row.isActive;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                fieldValue={row.name}
                FieldIcon={Business}
                enabled={isActive === true}
                badge={
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <Circle
                            sx={{
                                fontSize: 8,
                                color: isActive ? "success.main" : "text.disabled",
                                animation: isActive ? "pulse 1.5s infinite" : "none",
                            }}
                        />
                        {isActive ? "Active" : "Inactive"}
                    </Box>
                }
            />
            <Box display="flex" alignItems="center" gap={1.5}>
                {row.phone && <ContactSection contact={row.phone} />}
                <CardLocation
                    address={row.address ?? ""}
                    city={row.city ?? ""}
                    state={row.state ?? ""}
                    pincode={row.pincode ?? ""}
                />
            </Box>
        </Box>
    );
};

export default BranchCardView;
