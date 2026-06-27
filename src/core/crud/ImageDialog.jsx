import { useState } from "react";
import { DialogContent, Button, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import StyledDialog from "../components/dialogs/StyledDialog";
import ImageComponent from "../components/fields/ImageComponent";
import { Upload } from "lucide-react";
import { FlexEvenly } from "../components/layout/FlexBox";

const ImageDialog = ({ image, isEdit, setImage, defaultImage }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <FlexEvenly>
                {isEdit && (
                    <IconButton variant="contained" onClick={handleOpen}>
                        <Upload />
                    </IconButton>
                )}
                <Button disabled={!image} variant="outlined" onClick={handleOpen}>
                    View
                </Button>
            </FlexEvenly>
            <StyledDialog
                closeIcon={true}
                title={"Image"}
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    <ImageComponent
                        dirName="instructor_contract"
                        size="30rem 100%"
                        setValue={setImage}
                        value={image || defaultImage}
                        isCircular={false}
                        allowEdit={isEdit}
                    />
                </DialogContent>
            </StyledDialog>
        </>
    );
};

ImageDialog.propTypes = {
    image: PropTypes.string,
    isEdit: PropTypes.bool,
    defaultImage: PropTypes.string,
    setImage: PropTypes.func.isRequired,
};

export default ImageDialog;
