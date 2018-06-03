import * as React from 'react';

import { List, Icon, Row, Col, Button, Card, Select } from 'antd';
import { Users } from '../entities';
import { Entry } from '../AppLaunch';

const changeUser = (formState: any, updateField: any, refreshToken: any) => guid => {
  const newUser = Users.find(u => u.guid === guid);
  if (newUser) {
    const newFormState = {
      ...formState.data,
      ...newUser
    };
    formState.update(newFormState);
    refreshToken(newFormState);
  }
}

const LaunchUserForm = ({ updateField, formState, refreshToken }) => (
  <Card style={{ padding: '.5rem' }}>
    <div className="form-card-header">
      <h4>User</h4>
      <Select defaultValue={Users[0].guid} style={{ width: 200 }} onChange={changeUser(formState, updateField, refreshToken)}>
        {Users.map(user => (
          <Select.Option value={user.guid} key={user.guid}>
            {user.full_name}
          </Select.Option>
        ))}
      </Select>
    </div>
    <Entry attr="given_name" formState={formState} updateField={updateField} />
    <Entry attr="family_name" formState={formState} updateField={updateField} />
    <Entry attr="middle_name" formState={formState} updateField={updateField} />
    <div className="ant-row">
      <div className="ant-form-item">
        <Col sm={{ span: 8 }} className="ant-form-item-label">
          <label htmlFor={'picture'}>
            {'picture'}
          </label>
        </Col>
        <Col sm={{ span: 16 }}>
          <img className='user-picture' src={formState.data.picture} />
          <input id={'picture'} name={'picture'} className="ant-input" value={formState.data.picture} onChange={updateField(formState, 'picture')} />
        </Col>
      </div>
    </div>
    <Entry attr="email" formState={formState} updateField={updateField}/>
    <Entry attr="full_name" formState={formState} updateField={updateField}/>
    <Entry attr="roles" formState={formState} updateField={updateField}/>
  </Card>
);

export default LaunchUserForm;