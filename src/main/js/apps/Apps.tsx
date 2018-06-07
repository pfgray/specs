import * as React from 'react';
import { withPromise, fromRenderProp } from 'chainable-components';
import * as axios from 'axios';
import { List, Icon, Row, Col, Card } from 'antd';
import { Route, Link } from 'react-router-dom';
import ItemListLayout from '../layout/ItemListLayout';
import IconText from '../components/IconText';
import withAuth from '../util/AuthContext';
import withLoading from '../util/Loadable';
import { getApps, App } from '../resources';
import { withLoadablePromise } from '../util/Loadable';
import AppLogo from './AppLogo';

const withRoute = fromRenderProp(Route);

const Apps = () =>
  withAuth.chain(token =>
    withRoute({}).chain(route =>
      withLoadablePromise(() => getApps(token))
        .map(apps => [apps.apps, route, token])
    )
  ).ap(([apps, route, orgId, courseId, token]) => (
    <ItemListLayout title={'Activities'} add={{ href: `/apps/register`, title: 'Add App' }} orgName={'Your Apps'}>
      <div className='gutter-box'>
        <List
          itemLayout="vertical"
          dataSource={apps}
          renderItem={(app) => (
            <Card style={{marginBottom: '1rem'}}>
              <AppLogo app={app}/><h3>{app.name}</h3>
              <Link to={`/apps/${app.id}/manage`}>manage</Link>
            </Card>
          )} />
      </div>
    </ItemListLayout>
  ));

export default Apps;