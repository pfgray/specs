import { Card, Col, Row } from 'antd';
import { fromRenderProp } from 'chainable-components';
import * as React from 'react';
import { Route } from 'react-router-dom';
import AppLogo from '../apps/AppLogo';
import { getApps } from '../resources';
import withAuth from '../util/AuthContext';
import { withLoadablePromise } from '../util/Loadable';
import './app-picker.less';

const withRoute = fromRenderProp(Route);


const ActivityFromApp = () =>
  withAuth
    .chain(token =>
      withRoute.chain(route =>
        withLoadablePromise(() => getApps(token)).map(apps => apps.apps)
      )
    )
    .render(apps =>
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