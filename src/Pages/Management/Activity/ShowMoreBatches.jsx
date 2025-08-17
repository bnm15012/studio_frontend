import PropTypes from "prop-types";
import ActivityBatchCard from "./ActivityBatchCard";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";

const ShowMoreBatches = ({ batchEntries, onClose }) => {
    return <Dialog open={true} fullWidth>
        <DialogTitle>
            <Typography variant="h6">All Batches</Typography>
        </DialogTitle>
        <DialogContent>
            <FlexBetween gap={2} my={2} flexDirection="column">
                {batchEntries && batchEntries.map((batch) => (
                    <ActivityBatchCard key={batch.batchId} batch={batch} />
                ))}
            </FlexBetween>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </DialogContent>
    </Dialog>
}


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
        },
        ),
    ).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ShowMoreBatches