import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import Delete from 'material-ui-icons/Delete';

// todo: would be cool to have each launch hash to an icon/color

const Header = ({launches, isOpen, onClose, removeLaunch}) => (
  <Modal isOpen={isOpen} onHide={alert} toggle={onClose} size="lg" className="previous-launches">
    <ModalHeader toggle={onClose}>
      Previous Launches
    </ModalHeader>
    <ModalBody>
      {launches.map(l => (
        <div key={JSON.stringify(l)}>
          <div><Delete /></div>
          <div>url: {l.url}</div>
          <div>key: {l.key}</div>
          <div>secret: {l.secret}</div>
        </div>
      ))}
    </ModalBody>
    <ModalFooter>
      <Button onClick={onClose}>Cancel</Button>
    </ModalFooter>
  </Modal>
);

export default Header;
