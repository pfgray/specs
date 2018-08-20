import * as React from 'react';

import { List, Icon, Row, Col, Button, Card, Select } from 'antd';
import { Contexts } from '../entities';
import { Entry, MessageTypes } from '../AppLaunch';

import './launch-form.less';

const changeContext = (formState: any, updateField: any) => label => {
  const newContext = Contexts.find(c => c.label === label);
  if (newContext) {
    formState.update({
      ...formState.value,
      ...newContext
    });
    updateField(formState, 'context_id')(newContext.context_id);
  }
}

const LaunchContextForm = ({ updateField, formState, contextTypes, refreshToken }) => (
  <Card>
    <div className="form-card-header">
      <h4>Context</h4>
      <Select defaultValue={Contexts[0].label} style={{ width: 200 }} onChange={changeContext(formState, updateField)}>
        {Contexts.map(context => (
          <Select.Option value={context.label} key={context.label}>
            {context.label}
          </Select.Option>
        ))}
      </Select>
    </div>

    <Entry attr="context_id" formState={formState} updateField={updateField} />
    <Entry attr="context_label" formState={formState} updateField={updateField} />
    <Entry attr="context_title" formState={formState} updateField={updateField} />

    <div className="ant-row ant-form-item">
      <Col sm={{ span: 7, offset: 1 }} className="ant-form-item-label">
        <label htmlFor={name}>context_type</label>
      </Col>
      <Col sm={{ span: 16 }} className="ant-form-item-label">
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          defaultValue={formState.value.context_type}
          onChange={updateField(formState, 'context_type')}
        >
          {contextTypes.map(ct => <Select.Option value={ct} key={ct}>{ct}</Select.Option>)}
        </Select>
      </Col>

    </div>

    <Entry attr="resource_link_id" formState={formState} updateField={updateField}/>
    <Entry attr="resource_link_title" formState={formState} updateField={updateField} />
    <Entry attr="resource_link_description" formState={formState} updateField={updateField} />

    {/* CourseTemplate
CourseOffering
CourseSection
Group */}

  </Card>
);

export default LaunchContextForm;