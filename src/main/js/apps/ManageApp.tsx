import * as React from 'react';
import { withPromise, fromRenderProp, withState } from 'chainable-components';
import axios from 'axios';
import { Card, Row, Col, Input } from 'antd';
import { Route } from 'react-router-dom';
import withAuth from '../util/AuthContext';
import entityForm, { GenericForm } from '../entityForm/EntityForm';
import { withLoadablePromise } from '../util/Loadable';
import { getApp } from '../resources';
import AppLogo from './AppLogo';

import './manage-app.less';

const withRoute = fromRenderProp(Route);

const ManageApp = () =>
  withAuth
    .chain(token =>
      withRoute({}).chain(route =>
        withLoadablePromise(() => getApp(token, route.match.params.appId)).chain(initialApp => (
          withState({initial:initialApp}).map(app => [initialApp, app])
        ))
      )
    )
    .ap(([initialApp, app]) => {
      return (
        <Row style={{ marginTop: '2rem' }}>
          <Col sm={{ span: 16, offset: 4 }} xs={{ span: 22, offset: 1 }}>
            <div className='app-metadata'>
              <AppLogo app={app} style={{height:'72px', width: '72px'}} />
              <div className='metadata-form'>
                <Input name='name' value={app.name} style={{ marginBottom: '0.5rem' }} />
                <Input name='description' value={app.description} />
              </div>
            </div>
            <h4>Placements</h4>
              
          </Col>
        </Row>
      );
    });

export default ManageApp;