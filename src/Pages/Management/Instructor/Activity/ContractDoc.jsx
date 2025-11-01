import ImageComponent from "../../../../Components/ImageComponent";
import { DialogContent } from "@mui/material";
import PropTypes from "prop-types";
import StyledDialog from "../../../../Components/New/StyledDialog";

const ContractDoc = ({ open, onClose, image, isEdit, setImage }) => (
    <StyledDialog
        closeIcon={true}
        title={"Contract Document"}
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
    >
        <DialogContent>
            <ImageComponent
                dirName="instructor_contract"
                size="30rem 100%"
                setValue={setImage}
                value={image || "/assets/paper_2.jpg"}
                isCircular={false}
                allowEdit={isEdit}
            />
        </DialogContent>
    </StyledDialog>
);

ContractDoc.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    image: PropTypes.string,
    isEdit: PropTypes.bool,
    setImage: PropTypes.func.isRequired,
};
export default ContractDoc;
