import { Modal, Button } from 'react-bootstrap';

export function ConfirmModal({ 
  show, 
  onHide, 
  onConfirm, 
  title = 'Подтверждение', 
  message = 'Вы уверены?', 
  confirmText = 'Подтвердить', 
  cancelText = 'Отмена' 
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {cancelText}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}