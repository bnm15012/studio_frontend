import ActivityBatchCard from "./ActivityBatchCard";
import { DialogContent } from "@mui/material";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import StyledDialog from "@/core/components/dialogs/StyledDialog"; // adjust path as needed

interface ShowMoreBatchesProps {
    batchEntries: {
        batchId: string | number;
        name: string;
        planType: string;
        startTime: string;
        endTime: string;
        price: string | number;
        daysPerWeek: string | number;
    }[];
    onClose: () => void;
}

const ShowMoreBatches: React.FC<ShowMoreBatchesProps> = ({ batchEntries, onClose }) => (
    <StyledDialog
        cancelText="Close"
        open={true}
        maxWidth="md"
        onClose={onClose}
        sx={{ maxHeight: "80vh", m: "auto" }}
        title={"All Batches"}
        closeIcon={true}
    >
        <DialogContent>
            <FlexBetween gap={2} my={2} flexDirection="column">
                {batchEntries &&
                    batchEntries.map((batch: ShowMoreBatchesProps["batchEntries"][0]) => (
                        <ActivityBatchCard key={batch.batchId} batch={batch} />
                    ))}
            </FlexBetween>
        </DialogContent>
    </StyledDialog>
);

export default ShowMoreBatches;
