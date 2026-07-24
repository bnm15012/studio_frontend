/** Dialog for viewing/uploading an image with an ImageComponent and edit/upload button. */
import React, { useState } from "react";
import { DialogContent, Button, IconButton } from "@mui/material";
import StyledDialog from "../components/dialogs/StyledDialog";
import ImageComponent from "../components/fields/ImageComponent";
import { Upload } from "lucide-react";
import { FlexEvenly } from "../components/layout/FlexBox";

export interface ImageDialogProps {
    image?: string | null;
    isEdit?: boolean;
    defaultImage?: string;
    setImage: (val: string | null) => void;
}

const ImageDialog: React.FC<ImageDialogProps> = ({
    image,
    isEdit = false,
    setImage,
    defaultImage,
}) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <FlexEvenly>
                {isEdit && (
                    <IconButton onClick={handleOpen}>
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
                        value={image || defaultImage || ""}
                        isCircular={false}
                        allowEdit={isEdit}
                    />
                </DialogContent>
            </StyledDialog>
        </>
    );
};

export default ImageDialog;
