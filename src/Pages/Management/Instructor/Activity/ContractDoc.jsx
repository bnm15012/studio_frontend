import ImageComponent from '../../../../Components/ImageComponent'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import PropTypes from 'prop-types'

const ContractDoc = ({ open, onClose, image, isEdit, setImage }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle> Contract</DialogTitle>
            <DialogContent>
                <ImageComponent
                    size='30rem 100%'
                    setImage={setImage}
                    image={image}
                    isCircular={false}
                    allowEdit={isEdit}
                />
            </DialogContent>
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