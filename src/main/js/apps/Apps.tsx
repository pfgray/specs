import { Card, List } from 'antd';
import { ChainableComponent, fromRenderProp } from 'chainable-components';
import * as React from 'react';
import { Link, Route } from 'react-router-dom';
import ItemListLayout from '../layout/ItemListLayout';
import { App, getApps } from '../resources';
import withAuth from '../util/AuthContext';
import { withLoadablePromise } from '../util/Loadable';
import AppLogo from './AppLogo';

const withRoute = fromRenderProp(Route);

const Apps = () =>
  ChainableComponent.Do(
    withAuth,
    () => withRoute,
    (_, token) => withLoadablePromise(() => getApps(token)),
    (apps, route, token) => ({
      apps: apps.apps,
      route,
      token
    })
  ).render(({apps}) => (
    <ItemListLayout title={'Activities'} add={{ href: `/apps/register`, title: 'Add App' }} orgName={'Apps'}>
      <div className='gutter-box'>
        <List
          itemLayout="vertical"
          dataSource={apps}
          renderItem={(app: App) => (
            <Card style={{marginBottom: '1rem'}}>
              <AppLogo app={app}/><h3>{app.name}</h3>
              <Link to={`/apps/${app.id}/manage`}>manage</Link>
            </Card>
          )} />
      </div>
    </ItemListLayout>
  ));

export default Apps;