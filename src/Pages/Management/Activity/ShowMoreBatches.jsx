import PropTypes from "prop-types";
import ActivityBatchCard from "./ActivityBatchCard";
import { DialogContent } from "@mui/material";
import { FlexBetween } from "../../../Components/FlexBox";
import StyledDialog from "../../../core/components/StyledDialog"; // adjust path as needed

const ShowMoreBatches = ({ batchEntries, onClose }) => (
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
                    batchEntries.map((batch) => (
                        <ActivityBatchCard key={batch.batchId} batch={batch} />
                    ))}
            </FlexBetween>
        </DialogContent>
    </StyledDialog>
);

ShowMoreBatches.propTypes = {
    batchEntries: PropTypes.arrayOf(
        PropTypes.shape({
            batchId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            planType: PropTypes.string.isRequired,
            startTime: PropTypes.string.isRequired,
            endTime: PropTypes.string.isRequired,
            price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            daysPerWeek: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        }),
    ).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ShowMoreBatches;
