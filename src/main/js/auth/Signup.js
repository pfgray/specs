import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import { compose, withState } from 'recompose';
import reformed from 'react-reformed';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;
import { Row, Col } from 'antd';
import axios from 'axios';

const update = setProperty => e => {
  setProperty(e.target.name, e.target.value);
}

const submit = (model, setSubmitting) => e => {
  e.preventDefault();
  setSubmitting(true);
  console.log('submitting: ', model);
  axios.post('/api/login')
    .then(resp => {
      // store it up!
      console.log('got:', resp)
      // lscache.set('auth_token', )
      setSubmitting(false);
    });
}

const Login = ({model, setProperty, onSubmit, submitting, setSubmitting}) => (
  <div className="login-page">
    <Row>
      <Col sm={{span: 8, offset: 8}} xs={{span: 22, offset: 1}}>
        <h1>Specs.</h1>
        <Form onSubmit={submit(model, setSubmitting)}>
          <FormItem>
            <Input name='username' placeholder='Username' value={model.username} onChange={update(setProperty)} disabled={submitting} />
          </FormItem>
          <FormItem>
            <Input type="password" placeholder="Password" name='password' value={model.password} onChange={update(setProperty)} disabled={submitting} />
          </FormItem>
          <FormItem>
            <Input type="password" placeholder="Confirm Password" name='confirmPassword' value={model.confirmPassword} onChange={update(setProperty)} disabled={submitting} />
          </FormItem>
          <Button type="default" htmlType="submit" className="login-form-button" loading={submitting}>
            Sign Up
          </Button>
        </Form>
      </Col>
      </Row>
  </div>
);

export default compose(
  connect(
    state => ({}),
    d => ({dispatch: d})
  ),
  reformed(),
  withState('submitting', 'setSubmitting', false)
)(Login);
