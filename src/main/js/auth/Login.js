import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import { compose } from 'recompose';
import reformed from 'react-reformed';
import { Input, Button, Container, Row, Col } from 'reactstrap';

import './login.less';

const update = setProperty => e => {
  setProperty(e.target.name, e.target.value);
}

const submit = (onSubmit, model) => e => {
  e.preventDefault();
  onSubmit(model);
}

const Login = ({model, setProperty, onSubmit}) => (
  <div className="fill middle">
    <Container>
      <Row className="center">
        <Col xs="12" sm={{ size: 4, push: 2, pull: 2, offset: 1 }}>
          <form onSubmit={submit(onSubmit, model)}>
            <Input name='username' placeholder='username' value={model.firstName} onChange={update(setProperty)} />
            <Input name='password' placeholder='password' type='password' value={model.lastName} onChange={update(setProperty)} />
            <Button type='submit' block>Submit</Button>
          </form>
        </Col>
      </Row>
    </Container>
  </div>
);

export default compose(
  connect(
    state => ({}),
    d => ({dispatch: d})
  ),
  reformed()
)(Login);
