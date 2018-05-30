import * as React from 'react';

import { List, Icon, Row, Col, Button, Card, Select } from 'antd';
import { Users } from '../entities';
import { Entry } from '../AppLaunch';

const changeUser = (formState: any) => guid => {
  const newUser = Users.find(u => u.guid === guid);
  console.log('found:', newUser);
  if (newUser) {
    formState.update({
      ...formState.data,
      given_name: newUser.given_name,
      family_name: newUser.family_name,
      middle_name: "",
      picture: newUser.picture,
      email: newUser.email,
      full_name: newUser.label,
      roles: newUser.roles
    })
  }
}

const LaunchUserForm = ({ updateField, formState }) => (
  <Card style={{ padding: '.5rem' }}>
    <div className="form-card-header">
      <h4>User</h4>
      <Select defaultValue={Users[0].guid} style={{ width: 200 }} onChange={changeUser(formState)}>
        {Users.map(user => (
          <Select.Option value={user.guid} key={user.guid}>
            {user.label}
          </Select.Option>
        ))}
      </Select>
    </div>
    <Entry attr="given_name" formState={formState} />
    <Entry attr="family_name" formState={formState} />
    <Entry attr="middle_name" formState={formState} />
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
    <Entry attr="email" formState={formState} />
    <Entry attr="full_name" formState={formState} />
    <Entry attr="roles" formState={formState} />
  </Card>
);

export default LaunchUserForm;