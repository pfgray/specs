import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import Delete from 'material-ui-icons/Delete';
import CallMade from 'material-ui-icons/CallMade';
import Send from 'material-ui-icons/Send';

// todo: would be cool to have each launch hash to an icon/color

const Header = ({launches, isOpen, onClose, removeLaunch, loadLaunch}) => (
  <Modal isOpen={isOpen} onHide={alert} toggle={onClose} size="lg" className="previous-launches">
    <ModalHeader toggle={onClose}>
      Previous Launches
    </ModalHeader>
    <ModalBody>
      {launches.map((l,i) => (
        <div key={JSON.stringify(l)} className='previous-launch'>
          <div className='launch-option' onClick={() => removeLaunch(i)}><Delete /></div>
          <div className='launch-info'>
            <div><span>url:</span><span>{l.url}</span></div>
            <div><span>key:</span><span>{l.key}</span></div>
            <div><span>secret:</span><span>{l.secret}</span></div>
          </div>
          <div className='launch-option' onClick={() => loadLaunch(l)}><span>Load</span><CallMade /></div>
        </div>
      ))}
    </ModalBody>
    <ModalFooter>
      <Button onClick={onClose}>Done</Button>
    </ModalFooter>
  </Modal>
);

export default Header;
