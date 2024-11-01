import { Modal} from 'react-bootstrap';

const ClientModal = ({ show, handleClose, title, children }) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            dialogClassName="modal-dialog-centered" // Center the modal
            aria-labelledby="modal-title"
            style={{ paddingBottom: '1px'}}
        >
            <Modal.Header closeButton>
                <Modal.Title id="modal-title"  style={{ fontSize: '15px', fontWeight: 'bold' }}>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ paddingBottom: '0'}}>
                {children} {/* Render children here */}
            </Modal.Body>
        </Modal>
    );
};

export default ClientModal;