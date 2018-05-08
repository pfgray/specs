import React from 'react';
import { withPromise, fromRenderProp } from 'chainable-components';
import axios from 'axios';
import { List, Icon, Row, Col, Button, Input } from 'antd';
import { Link, Route } from 'react-router-dom';
import withAuth from '../util/AuthContext';
import withLoading from '../util/Loadable';
import entityForm from '../entityForm/EntityForm';

const withRoute = fromRenderProp(Route);

const OrganizationForm = () =>
  withAuth
    .chain(token =>
      withRoute({}).chain(route =>
        entityForm({
          auth: token,
          edit: route.location.pathname.indexOf('edit') !== -1,
          baseUrl: '/api/organizations',
          values: {
            name: ''
          },
          afterSuccess: () => {
            route.history.push('/');
          },
          id: route.match.params.id,
          ignore: ['id', 'clientId']
        })
      )
    )
    .ap((props) => (
      <form onSubmit={props.handleSubmit}>
        <Row gutter={16}>
          <Col className='gutter-row' span={14} offset={5}>
            {Object.keys(props.values).map(key => (
              <Input key={key} name={key} placeholder={key} value={props.values[key]} onChange={props.handleChange} />
            ))}
          </Col>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Row>

        <Row gutter={16}>
          <Col className='gutter-row' span={14} offset={5}>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Col>
        </Row>
      </form>
    ));

export default OrganizationForm;