import * as React from 'react';
import { withPromise, fromRenderProp } from 'chainable-components';
import axios from 'axios';
import { Row, Col, Button, Input, Card } from 'antd';
import { Route } from 'react-router-dom';
import withAuth from '../util/AuthContext';
import entityForm, { GenericForm } from '../entityForm/EntityForm';
import { getApps } from '../resources';
import { withLoadablePromise } from '../util/Loadable';
import AppLogo from '../apps/AppLogo';

const withRoute = fromRenderProp(Route);

import './app-picker.less';

const ActivityFromApp = () =>
  withAuth
    .chain(token =>
      withRoute({}).chain(route =>
        withLoadablePromise(() => getApps(token)).map(apps => apps.apps)
      )
    )
    .ap(apps =>
      <Row>
        <Col span={20} offset={2} className='app-picker'>
          {apps.map(app => (
            <Card key={app.id} title={app.name} style={{ width: 300 }}>
              <AppLogo app={app} />
              <p>Card content</p>
            </Card>
          ))}
        </Col>
      </Row>
    );

export default ActivityFromApp;