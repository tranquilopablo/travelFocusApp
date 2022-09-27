import React from 'react';
import Button from './Button';
import Modal from './Modal';

const ErrorModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header="Coś poszło nie tak!"
      show={!!props.error}
      footer={<Button onClick={props.onClear}>Okej</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
