import * as React from 'react';

import { List, Icon, Row, Col, Button, Card, Select } from 'antd';
import { Users } from '../entities';
import { Entry, MessageTypes } from '../AppLaunch';

import './launch-form.less';


const updateContextType = (formState) => (mt) => {
  formState.update({
    ...formState.data,
    context_type: mt
  });
}

const handleChange = (hmm) => {
  console.log('Handling change:', hmm);
}

const LaunchContextForm = ({ updateField, formState, contextTypes }) => (
  <Card>
    <h4>Context</h4>

    <Entry attr="context_id" formState={formState} />
    <Entry attr="context_label" formState={formState} />
    <Entry attr="context_title" formState={formState} />

    <div className="ant-row ant-form-item">
      <Col sm={{ span: 7, offset: 1 }} className="ant-form-item-label">
        <label htmlFor={name}>context_type</label>
      </Col>
      <Col sm={{ span: 16 }} className="ant-form-item-label">
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          defaultValue={formState.data.context_type}
          onChange={updateContextType(formState)}
        >
          {contextTypes.map(ct => <Select.Option value={ct} key={ct}>{ct}</Select.Option>)}
        </Select>
      </Col>

    </div>

    {/* CourseTemplate
CourseOffering
CourseSection
Group */}

  </Card>
);

export default LaunchContextForm;