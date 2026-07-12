import { Box } from "@mui/material";
import { Circle, Business } from "@mui/icons-material";
import ContactSection from "@/core/components/cards/ContactSection";
import CardHeader from "@/core/components/cards/CardHeader";
import CardLocation from "@/core/components/cards/CardLocation";

const BranchCardView = ({ row }: { row: Record<string, unknown> }) => {
    const name = row.name as string | undefined;
    const address = row.address as string | undefined;
    const city = row.city as string | undefined;
    const state = row.state as string | undefined;
    const pincode = row.pincode as string | number | undefined;
    const phone = row.phone as string | undefined;
    const isActive = row.isActive as boolean | undefined;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <CardHeader
                fieldValue={name}
                FieldIcon={Business}
                enabled={isActive}
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
                {phone && <ContactSection contact={phone} />}
                <CardLocation
                    address={address ?? ""}
                    city={city ?? ""}
                    state={state ?? ""}
                    pincode={pincode}
                />
            </Box>
        </Box>
    );
};

export default BranchCardView;
