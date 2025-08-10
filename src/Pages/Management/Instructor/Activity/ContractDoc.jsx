import ImageComponent from '../../../../Components/ImageComponent'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import PropTypes from 'prop-types'

const ContractDoc = ({ open, onClose, image, isEdit, setImage }) => {

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle> Contract</DialogTitle>
            <DialogContent>
                <ImageComponent
                    dirName='instructor_contract'
                    size='30rem 100%'
                    setImage={setImage}
                    image={image || "/assets/paper_2.jpg"}
                    isCircular={false}
                    allowEdit={isEdit}
                />
            </DialogContent>
            <DialogActions>
                <Button variant='contained' onClick={onClose}>Done</Button>
            </DialogActions>
        </Dialog>
    )
}

ContractDoc.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    image: PropTypes.string,
    isEdit: PropTypes.bool,
    setImage: PropTypes.func.isRequired,
}
export default ContractDoc
