import * as React from 'react';

import { List, Icon, Row, Col, Button, Card, Select } from 'antd';
import { Users } from '../entities';
import { Entry, MessageTypes } from '../AppLaunch';

const updateMessageType = (formState) => (mt) => {
  formState.update({
    ...formState.data,
    messageType: mt
  });
}

const LaunchToolForm = ({ updateField, formState, messageTypes }) => (
  <Card>
    <h4>Launch</h4>
    <Entry attr="url" formState={formState} />
    <div className="ant-row ant-form-item">
      <Col sm={{ span: 7, offset: 1 }} className="ant-form-item-label">
        <label htmlFor={name}>Message type</label>
      </Col>
      <Col sm={{ span: 16 }} className="ant-form-item-label">
        <Select defaultValue={formState.data.messageType} onChange={updateMessageType(formState)}>
          {MessageTypes.map(mt => (
            <Select.Option value={mt} key={mt}>
              {mt}
            </Select.Option>
          ))}
        </Select>
      </Col>
    </div>
    <Entry attr="deploymentId" formState={formState} />
  </Card>
);

export default LaunchToolForm;