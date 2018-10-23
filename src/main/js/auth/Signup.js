import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import { compose, withState } from 'recompose';
import reformed from 'react-reformed';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;
import { Row, Col } from 'antd';
import axios from 'axios';
import lscache from 'lscache';
import { withRouter } from "react-router-dom";

const update = setProperty => e => {
  setProperty(e.target.name, e.target.value);
}

const submit = (model, setSubmitting, history) => e => {
  e.preventDefault();
  setSubmitting(true);
  axios.post('/api/signup', model)
    .then(resp => {
      // store it up!
      lscache.set('auth_token', resp.data.token);
      setSubmitting(false);
      history.push('/');
    });
}

const Login = ({model, setProperty, onSubmit, submitting, setSubmitting, history}) => (
  <div className="login-page">
    <Row>
      <Col sm={{span: 8, offset: 8}} xs={{span: 22, offset: 1}}>
        <h1>Specs.</h1>
        <Form onSubmit={submit(model, setSubmitting, history)}>
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
  withState('submitting', 'setSubmitting', false),
  withRouter
)(Login);
