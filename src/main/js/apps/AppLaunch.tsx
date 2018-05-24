import * as React from 'react';
import { withPromise, fromRenderProp } from 'chainable-components';
import * as axios from 'axios';
import { List, Icon, Row, Col, Button, Card } from 'antd';
import { Route, Link } from 'react-router-dom';
import ItemListLayout from '../layout/ItemListLayout';
import IconText from '../components/IconText';
import withAuth from '../util/AuthContext';
import withLoading from '../util/Loadable';
import { getApp, getLaunchToken, App } from '../resources';
import { withLoadablePromise } from '../util/Loadable';

const withRoute = fromRenderProp(Route);

const AppLaunch = () =>
  withAuth.chain(token =>
    withRoute({}).chain(route =>
      withLoadablePromise(() =>
        Promise.all([
          getLaunchToken(token, route.match.params.appId),
          getApp(token, route.match.params.appId)
        ])
      ).map(([launchToken, app]) => [app, launchToken, route, token])
    )
  ).ap(([app, launchToken, route, token]) => (
    <Row>
      <Col sm={{ span: 16, offset: 4 }} xs={{ span: 22, offset: 1 }}>
        <h4>Launch Token</h4>
        <Card>
          <div style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{launchToken.idToken}</div>
        </Card>
        <h4>Private Key</h4>
        <form method="POST" action="https://d93e5bcb.ngrok.io/lti13/launch.php">
          <input type="hidden" value={launchToken.idToken} name="id_token" />
          <input type="submit" value="Launch it"></input>
        </form>
      </Col>
    </Row>
  ));

export default AppLaunch;